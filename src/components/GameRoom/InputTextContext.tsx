import { PropsWithChildren, createContext, useContext, useState } from "react";

type InputTextContextType = {
  inputText: string;
  setInputText: (text: string) => void;
};

const InputTextContext = createContext<InputTextContextType | null>(null);

export const useInputTextContext = () => {
  const currentInputTextContext = useContext(InputTextContext);
  if (!currentInputTextContext) {
    throw new Error(
      "useInputTextContext has to be used within <InputTextContextProvider>"
    );
  }
  return currentInputTextContext;
};

export const InputTextContextProvider = ({ children }: PropsWithChildren) => {
  const [inputText, setInputText] = useState("");

  return (
    <InputTextContext.Provider value={{ inputText, setInputText }}>
      {children}
    </InputTextContext.Provider>
  );
};
