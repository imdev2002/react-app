import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import io from 'socket.io-client';

function App() {
	const [socket, setSocket] = useState(null);
	const [audioData, setAudioData] = useState([]);
	const [bufferPositions, setBufferPositions] = useState([]);
	const [currentPosition, setCurrentPosition] = useState(0);
	const [sound, setSound] = useState(null);

	useEffect(() => {
		const socket = io('http://localhost:3000/track');
		setSocket(socket);
		socket.emit('play', { trackId: '6411add8403a31b106d404a9' });
		socket.on('message', ({ data, position }) => {
			setAudioData((audioData) => [...audioData, data]);
			setBufferPositions((bufferPositions) => [
				...bufferPositions,
				position,
			]);
		});

		socket.on('end', () => {
			socket.close();
			setCurrentPosition(0);
		});

		return () => {
			if (socket) {
				socket.close();
			}
		};
	}, []);

	useEffect(() => {
		if (audioData.length > 0) {
			setSound(
				new Howl({
					src: [],
					format: ['mp3'],
					onload: () => {
						setSound((sound) => {
							if (sound) {
								sound.play();
							}
							return sound;
						});
					},
				}),
			);
		}
	}, [audioData]);

	useEffect(() => {
		if (sound && bufferPositions.length > 0) {
			const position =
				bufferPositions.find((pos) => pos > currentPosition) ||
				bufferPositions[0];
			const index = bufferPositions.indexOf(position);
			const buffer = audioData[index];
			const blob = new Blob([buffer], { type: 'audio/mp3' });

			setSound((sound) => {
				sound.unload();
				sound._src = URL.createObjectURL(blob);
				sound.load();
				sound.seek(position - currentPosition);
				sound.play();
				return sound;
			});

			setCurrentPosition(position);
		}
	}, [sound, bufferPositions, currentPosition, audioData]);

	const handlePlay = () => {
		if (sound) {
			sound.play();
		}
	};

	const handlePause = () => {
		if (sound) {
			sound.pause();
		}
	};

	const handleStop = () => {
		if (sound) {
			sound.stop();
			setCurrentPosition(0);
		}
	};

	return (
		<div>
			<button onClick={handlePlay}>Play</button>
			<button onClick={handlePause}>Pause</button>
			<button onClick={handleStop}>Stop</button>
		</div>
	);
}

export default App;
// import './App.css';
// import io from 'socket.io-client';
// import { useEffect, useState } from 'react';

// function App() {
// 	const [audioUrl, setAudioUrl] = useState(null);
// 	const [audioChunks, setAudioChunks] = useState([]);

// 	useEffect(() => {
// 		const socket = new io('ws://localhost:3000/track');
// 		socket.emit('play', { trackId: '6411add8403a31b106d404a9' });
// 		socket.on('message', (data) => {
// 			setAudioChunks((chunks) => [...chunks, data]);
// 		});

// 		return () => {
// 			socket.close();
// 		};
// 	}, []);

// 	useEffect(() => {
// 		if (audioChunks.length > 0) {
// 			const blob = new Blob(audioChunks, { type: 'audio/mpeg' });
// 			const audioUrl = URL.createObjectURL(blob);
// 			setAudioUrl(audioUrl);
// 		}
// 	}, [audioChunks]);

// 	return (
// 		<div>
// 			{audioUrl && (
// 				<audio controls>
// 					<source
// 						src={audioUrl}
// 						type="audio/mpeg"
// 					/>
// 				</audio>
// 			)}
// 		</div>
// 	);
// }

// export default App;
