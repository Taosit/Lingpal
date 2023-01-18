import Head from 'next/head';
import "../styles/global.css";
import { SettingContextProvider } from "../utils/contexts/SettingContext";
import { GameContextProvider } from "../utils/contexts/GameContext";
import { AuthContextProvider } from "../utils/contexts/AuthContext";
import { SocketContextProvider } from "../utils/contexts/SocketContext";
import Layout from '../components/Layout';
import PrivateRoute from '../components/PrivateRoute.js';

export default function App({ Component, pageProps }) {
  return (
  <AuthContextProvider>
		<SettingContextProvider>
			<GameContextProvider>
				<SocketContextProvider>
					<Layout>
						{Component.requireAuth ? (
							<PrivateRoute>
								<Component {...pageProps} />
							</PrivateRoute>
						) : (
							// public page
							<Component {...pageProps} />
						)}
					</Layout>
				</SocketContextProvider>
			</GameContextProvider>
		</SettingContextProvider>
	</AuthContextProvider>	
  );
}