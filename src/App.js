import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

function App() {
	const [audioUrl, setAudioUrl] = useState(null);
	const [audioChunks, setAudioChunks] = useState([]);
	const [infoTrack, setInfoTrack] = useState('');

	useEffect(() => {
		const socket = new io('ws://localhost:3000/track');
		socket.emit('play', { trackId: '6411add9f7a8fc311762d5db' });
		socket.on('message', (data) => {
			setAudioChunks((chunks) => [...chunks, data.data]);
		});

		return () => {
			socket.close();
		};
	}, []);
	useEffect(() => {
		const socket = new io('ws://localhost:3000/track');
		socket.emit('info', { trackId: '6411add9f7a8fc311762d5db' });
		socket.on('message', (data) => {
			setInfoTrack(data);
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
			{infoTrack && <h4>{infoTrack}</h4>}
			{audioUrl && (
				<audio
					controls
					autoPlay="true"
					src={audioUrl}
				></audio>
			)}
		</div>
	);
}
export default App;
