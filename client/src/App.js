import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	Link,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GameRoom from "./pages/GameRoom";
import GameSettings from "./pages/GameSettings";
import NotesRoom from "./pages/NotesRoom";
import WaitRoom from "./pages/WaitRoom";

function App() {
	return (
		<Router>
			<div className="h-screen w-screen overflow-hidden">
				<Routes>
					{/* <Route path="/" element={<Navigate to="/" />}/> */}
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/game-settings" element={<GameSettings />} />
					<Route path="/wait-room" element={<WaitRoom />} />
					<Route path="/notes-room" element={<NotesRoom />} />
					<Route path="/game-room" element={<GameRoom />} />
				</Routes>
			</div>
		</Router>
	);
}
export default App;
