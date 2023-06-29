import { SettingButton } from "../SettingButton/SettingButton";
import { useSettingStore } from "@/stores/SettingStore";
import { motionVariant, staticVariant } from "@/utils/constants";

type Props = {
  animateVoiceDescriber: () => void;
  animateTextDescriber: () => void;
};

export const SettingButtons = ({
  animateTextDescriber,
  animateVoiceDescriber,
}: Props) => {
  const {
    settings: { mode, level, describer },
    setMode,
    setLevel,
    setDescriber,
  } = useSettingStore();

  return (
    <div className="grid grid-cols-2 gap-4">
      <SettingButton
        text="Standard"
        isSelected={mode === "standard"}
        onClick={() => setMode("standard")}
        variant={staticVariant}
      />
      <SettingButton
        text="Relaxed"
        isSelected={mode === "relaxed"}
        onClick={() => setMode("relaxed")}
        variant={staticVariant}
      />
      {mode ? (
        <>
          <SettingButton
            text="Easy"
            isSelected={level === "easy"}
            onClick={() => setLevel("easy")}
            variant={motionVariant}
          />
          <SettingButton
            text="Hard"
            isSelected={level === "hard"}
            onClick={() => setLevel("hard")}
            variant={motionVariant}
          />
        </>
      ) : (
        <>
          <div className="w-16 h-6 md:h-8"></div>
          <div className="w-16 h-6 md:h-8"></div>
        </>
      )}
      {level ? (
        <>
          <SettingButton
            text="Text"
            isSelected={describer === "text"}
            onClick={() => {
              setDescriber("text");
              animateTextDescriber();
            }}
            variant={motionVariant}
          />
          <SettingButton
            text="Voice"
            isSelected={describer === "voice"}
            onClick={() => {
              setDescriber("voice");
              animateVoiceDescriber();
            }}
            variant={motionVariant}
          />
        </>
      ) : (
        <>
          <div className="w-16 h-6 md:h-8"></div>
          <div className="w-16 h-6 md:h-8"></div>
        </>
      )}
    </div>
  );
};
