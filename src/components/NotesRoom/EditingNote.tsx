import React from "react";

type Props = {
  activeNote: string;
  saveNote: (note: string) => void;
  setActiveNote: (note: null) => void;
};

export const EditingNote = ({ activeNote, saveNote, setActiveNote }: Props) => {
  return (
    <div className="w-full grid gap-2 grid-rows-layout3 h-full items-center">
      <textarea
        className="resize-none h-full bg-yellow-50 w-full focus:outline-yellow-400 rounded-lg px-4 py-2 lg:text-lg"
        value={activeNote}
        onChange={(e) => saveNote(e.target.value)}
      />
      <div className="flex flex-col">
        <button
          className="bg-yellow-300 rounded-xl px-8 py-1 text-semibold self-center"
          onClick={() => setActiveNote(null)}
        >
          OK
        </button>
      </div>
    </div>
  );
};
