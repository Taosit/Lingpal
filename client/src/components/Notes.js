import React from "react";

const Notes = ({ word, notes, setDisplay, setInputText }) => {
	const capitalize = word => {
		return word.replace(word[0], word[0].toUpperCase());
	};

	const chooseNote = index => {
		setDisplay("chatbox");
		console.log(notes[index]);
		setInputText(notes[index]);
	};

	return (
		<div className="w-full lg:w-1/4 h-full px-2 py-4 bg-transparent-20 rounded flex flex-col items-center">
			<div className="text-center">
				<h2 className="font-bold uppercase text-sm drop-shadow-md text-gray-600">
					Notes
				</h2>
				<h1 className="font-bold text-xl sm:text-2xl mb-4">
					{capitalize(word)}
				</h1>
			</div>
			<div className="w-full grid grid-cols-1 md:grid-cols-2 p-2 bg-transparent-20 lg:grid-cols-1 gap-4 overflow-auto justify-center">
				{notes.map((note, i) => (
					<div key={i} className="w-full max-w-xs mx-auto p-2 bg-yellow-200">
						<p>{note.length < 125 ? note : `${note.slice(0, 120)}...`}</p>
						<div className="w-full flex justify-center">
							<button
								className="mt-2 px-6 py-1 rounded-full bg-yellow-500 text-white"
								onClick={() => chooseNote(i)}
							>
								Choose
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Notes;
