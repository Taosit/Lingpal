import React, { useId, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  checker: {
    isValid: null | boolean;
    message: string;
  };
  isPassword?: boolean;
};

export const InputGroup = ({
  label,
  value,
  onChange,
  checker,
  isPassword = false,
}: Props) => {
  const [showInputText, setShowInputText] = useState(!isPassword);
  const id = useId();

  return (
    <div className="py-1 flex flex-col items-start">
      <div className="relative w-full">
        <label className="mb-1" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          className="border border-color1-dark rounded-sm focus:outline-2 focus:outline-color1-dark p-1 w-full"
          type={showInputText ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {isPassword && (
          <span
            tabIndex={0}
            onClick={() => setShowInputText((prev) => !prev)}
            onKeyDown={(e) =>
              e.key === "Enter" && setShowInputText((prev) => !prev)
            }
            className=" absolute cursor-pointer top-7 right-2 text-color1-dark font-semibold"
          >
            {showInputText ? "hide" : "show"}
          </span>
        )}
        <div className="h-4 min-w-1 text-sm md:text-md font-semibold left-0 text-red-700">
          {checker.message || " "}
        </div>
      </div>
    </div>
  );
};
