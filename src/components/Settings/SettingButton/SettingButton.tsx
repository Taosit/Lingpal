import { motion } from "framer-motion";

type Props = {
  text: string;
  isSelected: boolean;
  onClick: () => void;
  variant: {
    hidden: {
      opacity: number;
      translateX?: number;
    };
    show: {
      opacity: number;
      translateX?: number;
    };
  };
};

export const SettingButton = ({
  text,
  isSelected,
  onClick,
  variant,
}: Props) => {
  return (
    <motion.button
      variants={variant}
      initial="hidden"
      animate="show"
      className="flex justify-center items-center hover:cursor-pointer"
      onClick={onClick}
    >
      <div className={`option-light ${isSelected ? "glow" : "glimmer"}`}></div>
      <p
        className={`text-white ml-4 sm:text-bg w-16 md:text-2xl md:w-24 ${
          isSelected ? "font-semibold" : ""
        }`}
      >
        {text}
      </p>
    </motion.button>
  );
};
