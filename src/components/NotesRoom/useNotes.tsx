import { useState } from "react";

export const useNotes = () => {
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);
  const [notes, setNotes] = useState(["", "", "", ""]);

  const saveNote = (note: string) => {
    const newNotes = [...notes];
    newNotes[activeNoteIndex!] = note;
    setNotes(newNotes);
  };

  return {
    notes,
    activeNote: activeNoteIndex !== null ? notes[activeNoteIndex] : null,
    setActiveNoteIndex,
    saveNote,
  };
};
