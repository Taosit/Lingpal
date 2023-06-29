import { useAuthStore } from "@/stores/AuthStore";
import { forwardRef } from "react";

type Props = {
  message: Message;
  isSameSender: boolean;
};

export const Message = forwardRef<HTMLDivElement | null, Props>(
  function Message({ message, isSameSender }, ref) {
    const user = useAuthStore((state) => state.user);
    return (
      <div
        ref={ref}
        className={`${isSameSender ? "mb-1" : "my-1"} flex flex-col ${
          message.isBot
            ? "self-center"
            : message.isDescriber
            ? "items-start self-start"
            : "items-end self-end"
        }`}
      >
        {!message.isBot && !isSameSender && (
          <p className={message.isDescriber ? "ml-1" : "mr-1"}>
            {message.sender.id === user!.id ? "You" : message.sender.username}
          </p>
        )}

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
      </div>
    );
  }
);
