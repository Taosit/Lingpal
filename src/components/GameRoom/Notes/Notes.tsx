import { useGameStore } from "@/stores/GameStore";
import { useInputTextContext } from "../InputTextContext";

type Props = {
  setDisplay: (display: "notes" | "chatbox") => void;
};
const Notes = ({ setDisplay }: Props) => {
  const { setInputText } = useInputTextContext();

  const { players, round, describerIndex } = useGameStore();

  const playerArray = Object.values(players).sort(
    (player1, player2) => player1.order - player2.order
  );

  const describer = playerArray.find((p) => p.order === describerIndex);
  if (!describer) throw new Error("describer not found");
  const { words, notes } = players[describer.id];

  const chooseNote = (index: number) => {
    if (!notes) throw new Error("notes not found");
    setDisplay("chatbox");
    setInputText(notes[index]);
  };

  return (
    <div className="w-full lg:w-1/4 h-full px-2 py-4 bg-transparent-20 rounded flex flex-col items-center">
      <div className="text-center">
        <h2 className="font-bold uppercase text-sm drop-shadow-md text-gray-600">
          Notes
        </h2>
        <h1 className="font-bold capitalize text-xl sm:text-2xl mb-4">
          {words?.[round] || ""}
        </h1>
      </div>
      {notes && notes.length > 0 ? (
        <div className="scrollbar w-full grid grid-cols-1 md:grid-cols-2 p-2 bg-transparent-20 lg:grid-cols-1 gap-4 overflow-auto justify-center">
          {notes &&
            notes.map((note, i) => (
              <div
                key={i}
                className="w-full max-w-xs mx-auto p-2 bg-yellow-200"
              >
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
      ) : (
        <div className="w-full text-center flex flex-col items-center">
          <p className="text-gray-800">No notes to display</p>
          <button
            onClick={() => setDisplay("chatbox")}
            className="font-semibold text-orange-700 lg:hidden"
          >
            Back to Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Notes;
