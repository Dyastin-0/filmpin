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
const startListStream = (socket, mongoose, owner, accesor, randomId) => {
	const changeStream = mongoose.model('List').watch(
		[
			{
				$match: {
					$or: [{ 'fullDocument.owner': owner },
					{ 'operationType': 'delete' }]
				},
			},
		]
	);

	changeStream.on('change', (change) => {
		socket.emit(`listChange/${owner}/${accesor}/${randomId}`, {
			type: change.operationType,
			list: change.operationType === 'delete' ? change.documentKey._id : change.fullDocument
		});
	});
	
	socket.on('disconnect', () => {
		changeStream.close();
		socket.disconnect();
	});
};

module.exports = { startListStream };
