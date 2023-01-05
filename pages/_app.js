import Head from 'next/head';
import "../styles/global.css";
import { SettingContextProvider } from "../utils/contexts/SettingContext";
import { GameContextProvider } from "../utils/contexts/GameContext";
import { AuthContextProvider } from "../utils/contexts/AuthContext";
import { SocketContextProvider } from "../utils/contexts/SocketContext";
import Layout from '../components/Layout';
import PrivateRoute from '../components/PrivateRoute.js';
import PersistLogin from '../components/PersistLogin';

export default function App({ Component, pageProps }) {
  return (
  <AuthContextProvider>
		<SettingContextProvider>
			<GameContextProvider>
				<SocketContextProvider>
					<Layout>
						{Component.requireAuth ? (
							<PersistLogin>
								<PrivateRoute>
									<Component {...pageProps} />
								</PrivateRoute>
							</PersistLogin>
						) : (
							// public page
							<Component {...pageProps} />
						)}
					</Layout>
				</SocketContextProvider>
			</GameContextProvider>
		</SettingContextProvider>
	</AuthContextProvider>
	
	// <Layout>
	// 	{Component.requireAuth ? (
	// 	<AuthContextProvider>
	// 		<SettingContextProvider>
	// 			<GameContextProvider>
	// 				<SocketContextProvider>
	// 					<Component {...pageProps} />
	// 				</SocketContextProvider>
	// 			</GameContextProvider>
	// 		</SettingContextProvider>
	// 	</AuthContextProvider>
	// 	) : (
	// 		// public page
	// 		<Component {...pageProps} />
	// 	)}
	// </Layout>
				
  );
}