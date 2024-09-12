const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { Types } = require('mongoose');

/**
 * Handles socket disconnection by verifying JWT tokens on each 'ping' packet and closing the MongoDB change stream.
 * 
 * @param {object} socket - The Socket.IO connection instance for the connected client.
 * @param {object} changeStream - The MongoDB change stream that is being streamed.
 */
const handleDisconnect = (socket, changeStream) => {
	socket.conn.on('packetCreate', (packet) => {
		if (packet.type === 'ping') {
			jwt.verify(
				socket.token,
				process.env.ACCESS_TOKEN_SECRET,
				(error, _) => {
					if (error) {
						console.log('List stream: Disconnected -', socket.id);
						changeStream.close();
						socket.disconnect();
					}
				}
			);
		}
	});

	socket.on('disconnect', () => {
		changeStream.close();
		socket.disconnect();
	});
}


/**
 * Starts a change stream on the 'List' model to listen for changes
 * related to the specified owner and emits the changes to the socket.
 * Also handles closing the stream when the socket disconnects.
 * 
 * @param {Object} socket - The Socket.IO socket instance used for emitting events.
 * @param {Object} mongoose - The Mongoose instance used to interact with the database.
 * @param {string} owner - The ID of the owner whose lists are being watched.
 * @param {string} accesor - An additional identifier used in the emitted event name.
 * @param {string} randomId - A random ID used in the emitted event name.
 * 
 * @returns {void} No return value.
 */
const startListStream = (socket, mongoose, owner, randomId) => {
	console.log('test')
	const changeStream = mongoose.model('List').watch(
		[
			{
				$match: {
					$or: [{ 'fullDocument.owner': owner },
					{ 'operationType': 'delete' },
					{ 'operationType': 'update' }]
				},
			},
		]
	);

	changeStream.on('change', (change) => {
		const type = change.operationType;
		const changeData = type === 'delete' ? change.documentKey._id : type === 'insert' ? change.fullDocument : change.updateDescription.updatedFields.list;

		socket.emit(`stream/list/${owner}/${socket.id}/${randomId}`, {
			type: type,
			list: changeData
		});
	});

	handleDisconnect(socket, changeStream);
};

/**
 * Starts a real-time stream to monitor changes to a user document and emits updates via the socket.
 * 
 * @param {object} socket - The Socket.IO connection instance for the connected client.
 * @param {object} mongoose - The Mongoose instance used for database interactions.
 * @param {string} randomId - A random identifier used for the socket event namespace.
 */
const startUserStream = (socket, mongoose, randomId) => {
	const { id } = socket;

	const changeStream = mongoose.model('User').watch(
		[
			{
				$match: {
					$and: [
						{ 'documentKey._id': new Types.ObjectId(id) },
						{ 'operationType': 'update' }
					]
				},
			},
		]
	);

	changeStream.on('change', (change) => {
		const type = change.operationType;

		socket.emit(`stream/user/${id}/${randomId}`, {
			affectedFields: change.updateDescription.updatedFields,
			type: type,
		});
	});

	handleDisconnect(socket, changeStream);
}

module.exports = {
	startListStream,
	startUserStream
};
