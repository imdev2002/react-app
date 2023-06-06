import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

function App() {
	const socket = new io('ws://localhost:3000/notification');
	socket.on("notification", (data) => {
		console.log(data);
	});
	return (
		<div>
			<audio
				controls
				autoPlay="true"
			// src="http://localhost:3000/file/d91bfcefa173b9df7a136c0d2fdda998"
			></audio>
		</div>
	);
}
export default App;
