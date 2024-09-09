const startChangeStreamForUser = (socket, mongoose, owner, accesor, randomId) => {
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
		console.log(change.operationType)
		socket.emit(`listChange/${owner}/${accesor}/${randomId}`, {
			type: change.operationType,
			list: change.operationType === 'delete' ? change.documentKey._id : change.fullDocument
		});
	});

	socket.on('disconnect', () => {
		changeStream.close();
	});
};

module.exports = { startChangeStreamForUser };
