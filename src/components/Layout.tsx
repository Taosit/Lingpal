import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <div className="h-screen w-screen overflow-x-hidden">{children}</div>;
}
