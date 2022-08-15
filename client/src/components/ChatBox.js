import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import useWindowSize from "../hooks/useWindowSize";

const ChatBox = ({
	inputText,
	setInputText,
	messages,
	word,
	userIsDescriber,
	setDisplay,
}) => {
	const { socket } = useSocketContext();
	const { roomId } = useGameContext();
	const { user } = useAuthContext();

	const windowSize = useWindowSize();
	const lastMessageRef = useRef();

	const sendMessage = () => {
		if (!inputText) return;
		const message = {
			sender: user,
			isBot: null,
			isDescriber: userIsDescriber(),
			text: inputText,
		};
		socket.emit("send-message", { message, word, roomId });
		setInputText("");
	};

	const isSameSender = index => {
		return index > 0 && messages[index].sender === messages[index - 1]?.sender;
	};

	// const userIsDescriber = () => {
	// 	return describerId === user._id;
	// };

	useEffect(() => {
		if (!lastMessageRef.current) return;
		lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div
			className={`w-full h-full ${
				userIsDescriber() ? "lg:w-3/4 lg:mr-4" : ""
			} bg-transparent-50 rounded p-2 flex flex-col relative z-10`}
		>
			<div
				className={`scrollbar w-full ${
					userIsDescriber() ? "h-2/3" : "h-full"
				} my-2 p-2 bg-white overflow-y-auto flex flex-col`}
			>
				{messages.map((message, i) => (
					<div
						key={i}
						className={`${isSameSender(i) ? "mb-1" : "my-1"} flex flex-col ${
							message.isBot
								? "self-center"
								: message.isDescriber
								? "items-start self-start"
								: "items-end self-end"
						}`}
					>
						{!message.isBot && !isSameSender(i) && (
							<p className={message.isDescriber ? "ml-1" : "mr-1"}>
								{message.sender._id === user._id
									? "You"
									: message.sender.username}
							</p>
						)}

						{i === messages.length - 1 ? (
							<div
								ref={lastMessageRef}
								className={`p-2 rounded-xl  ${
									message.isBot
										? "bg-slate-100 border-2 border-yellow-200"
										: message.isDescriber
										? "bg-orange-600 text-white"
										: "bg-green-600 text-white"
								}`}
							>
								{message.text}
							</div>
						) : (
							<div
								className={`p-2 rounded-xl  ${
									message.isBot
										? "bg-slate-100 border-2 border-yellow-200"
										: message.isDescriber
										? "bg-orange-600 text-white"
										: "bg-green-600 text-white"
								}`}
							>
								{message.text}
							</div>
						)}
					</div>
				))}
			</div>
			<textarea
				value={inputText}
				onChange={e => {
					!(e.target.value === "\n" && !inputText) &&
						setInputText(e.target.value);
				}}
				onKeyDown={e => e.key === "Enter" && sendMessage()}
				className="scrollbar w-full h-1/3 my-2 p-2 bg-white overflow-y-auto focus:outline-yellow-300 resize-none"
			/>
			<div className="w-full flex justify-around items-center">
				{userIsDescriber() && windowSize.width < 1024 && (
					<button
						className="mb-2 px-6 py-1 rounded-xl bg-yellow-500 text-white sm:text-xl"
						onClick={() => setDisplay("notes")}
					>
						Choose Notes
					</button>
				)}
				<button
					className="mb-2 px-6 py-1 rounded-xl bg-blue-500 text-white sm:text-xl disabled:bg-blue-200"
					onClick={() => sendMessage()}
				>
					Send
				</button>
			</div>
		</div>
	);
};

export default ChatBox;
