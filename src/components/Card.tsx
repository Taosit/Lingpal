import React, { PropsWithChildren } from "react";

type Props = {
  className?: string;
};

export const Card = ({ className, children }: PropsWithChildren<Props>) => {
  return (
    <article
      className={`${className} shadow-inner-light bg-white rounded-[1.5em]`}
    >
      {children}
    </article>
  );
};

export const CardHeader = ({
  className,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={`${className} relative text-white font-semibold w-full shadow-inner-light rounded-t-[1.5em] bg-color1`}
    >
      {children}
    </div>
  );
};

export const CardBody = ({ className, children }: PropsWithChildren<Props>) => {
  return (
    <div className={`${className} w-full rounded-b-[1.5em] bg-white`}>
      {children}
    </div>
  );
};
