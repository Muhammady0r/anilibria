import React from "react";
import "./UpdCard/UpdCard.css";
import { Link, useNavigate } from "react-router-dom";

const TitleCard = ({ data, isHistory, className }) => {
  function timeConvert(sec) {
    return new Date(sec * 1000).toISOString().substring(14, 19);
  }

  return (
    <div
      className={`w-full rounded overflow-hidden transition-all ${className}`}
    >
      <Link to={`/release/${data.code}`}>
        <img
          src={`https://www.anilibria.tv/${data.posters.original.url}`}
          alt=""
          className="max-h-[80vh] w-full object-cover"
        />
      </Link>
      <Link
        to={`/release/${data.code}`}
        className="bg-muted p-2 flex flex-col items-center rounded-b"
      >
        <h1 className="text-center">{data.names.ru}</h1>
        <h2
          className={`${
            isHistory
              ? "text-sm flex justify-center items-center gap-1"
              : "text-xs"
          }`}
        >
          Серия:
          {isHistory ? (
            <>
              <span className="text-accent text-base font-bold">
                {+localStorage.getItem(`${data.id}`) + 1}
              </span>
            </>
          ) : (
            data.player.episodes.string
          )}
        </h2>
        {isHistory && (
          <>
            <h2 className="text-sm text-accent font-bold">
              {timeConvert(+localStorage.getItem(`${data.id}played`))}
            </h2>
          </>
        )}
      </Link>
    </div>
  );
};

export default TitleCard;
