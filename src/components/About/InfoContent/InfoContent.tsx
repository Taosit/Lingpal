import { ABOUT_TEXT } from "@/utils/constants";
import React from "react";

type Props = {
  page: number;
};

export const InfoContent = ({ page }: Props) => {
  const content = ABOUT_TEXT[page];

  return (
    <div key={`page${page}`} className="flex flex-col gap-2">
      {content.map((item, index) => (
        <div key={item.title}>
          <div className="my-2 grid grid-cols-1 lg:grid-cols-[1fr,_2fr] gap-1">
            <div>
              <h2 className="text-lg">{item.title}</h2>
              {page === 1 && (
                <h3 className="text-neutral-500">
                  {(item as (typeof ABOUT_TEXT)[1][number]).subtitle}
                </h3>
              )}
            </div>
            <div>
              <p>{item.text}</p>
            </div>
          </div>
          {index !== content.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};
