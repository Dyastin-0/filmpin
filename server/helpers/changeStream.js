const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

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

		socket.emit(`listChange/${owner}/${socket.id}/${randomId}`, {
			type: change.operationType,
			list: changeData
		});
	});

	socket.conn.on('packetCreate', (packet) => {
		if (packet.type === 'ping') {
			jwt.verify(
				socket.token,
				process.env.ACCESS_TOKEN_SECRET,
				(error, _) => {
					if (error) {
						console.log('Disconnected -', socket.id);
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
};

module.exports = { startListStream };
