import skc from 'socket.io-client';
const client = new skc('ws://localhost:3000/track');

client.on('connectFailed', function (error) {
	console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
	console.log('WebSocket Client Connected');
});

client.emit('play', { trackId: '6411add8403a31b106d404a9' });
let buffer = Buffer.from([]);
client.on('fileChunk', (data) => {
	buffer = Buffer.concat([buffer, data]);
});
export { buffer };
