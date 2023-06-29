import React from "react";

type Props = {
  index: number;
  note: string;
  key: number;
  setActiveNote: (index: number) => void;
};

export const Postit = ({ note, index, setActiveNote }: Props) => {
  if (!note) {
    return (
      <button
        className="w-full h-full max-h-24 sm:max-h-full border-2 border-dashed border-white flex justify-center items-center cursor-pointer"
        onClick={() => setActiveNote(index)}
      >
        <p className="text-2xl text-white">+</p>
      </button>
    );
  } else {
    return (
      <button
        className="w-full h-full max-h-24 sm:max-h-full px-4 py-2 bg-yellow-200 cursor-pointer drop-shadow-md text-sm md:text-base"
        onClick={() => setActiveNote(index)}
      >
        {note.length > 100 ? `${note.slice(0, 100)}...` : note}
      </button>
    );
  }
};
