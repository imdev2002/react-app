import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

function App() {
	const [audioUrl, setAudioUrl] = useState(null);
	const [audioChunks, setAudioChunks] = useState([]);

	useEffect(() => {
		const socket = new io('ws://localhost:3000/track');
		socket.emit('play', { trackId: '6411add8403a31b106d404a9' });
		socket.on('message', (data) => {
			setAudioChunks((chunks) => [...chunks, data]);
		});

		return () => {
			socket.close();
		};
	}, []);

	useEffect(() => {
		if (audioChunks.length > 0) {
			const blob = new Blob(audioChunks, { type: 'audio/mpeg' });
			const audioUrl = URL.createObjectURL(blob);
			setAudioUrl(audioUrl);
		}
	}, [audioChunks]);

	return (
		<div>
			{audioUrl && (
				<audio controls>
					<source
						src={audioUrl}
						type="audio/mpeg"
					/>
				</audio>
			)}
		</div>
	);
}

export default App;
