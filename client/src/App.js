import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	Link,
} from "react-router-dom";
import AuthTemplate from "./components/AuthTemplate";
import PersistLogin from "./components/PersistLogin";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import GameRoom from "./pages/GameRoom";
import GameSettings from "./pages/GameSettings";
import Landing from "./pages/Landing";
import NotesRoom from "./pages/NotesRoom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import WaitRoom from "./pages/WaitRoom";

function App() {
	return (
		<Router>
			<div className="h-screen w-screen overflow-x-hidden">
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route element={<PersistLogin />}>
						<Route element={<PrivateRoute />}>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/game-settings" element={<GameSettings />} />
							<Route path="/wait-room" element={<WaitRoom />} />
							<Route path="/notes-room" element={<NotesRoom />} />
							<Route path="/game-room" element={<GameRoom />} />
						</Route>
					</Route>
				</Routes>
			</div>
		</Router>
	);
}
export default App;
