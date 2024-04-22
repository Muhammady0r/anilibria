import React from "react";
import "./UpdCard/UpdCard.css";
import { Link, useNavigate } from "react-router-dom";

const TitleCard = ({ data, isHistory, className }) => {
  function timeConvert(sec) {
    return new Date(sec * 1000).toISOString().substring(14, 19);
  }

  return (
    <div
      className={`w-full rounded overflow-hidden transition-all relative ${className}`}
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
        className="title-card p-2 flex flex-col items-center absolute bottom-0 left-0 w-full"
      >
        <h1 className="text-center max-lg:text-sm max-[888px]:text-xs">
          {data.names.ru}
        </h1>
        <h2
          className={`${
            isHistory
              ? "text-sm flex justify-center items-center gap-1"
              : "text-[10px]"
          }`}
        >
          Серия:
          {isHistory ? (
            <>
              <span className="text-red-400 font-bold">
                {+localStorage.getItem(`${data.id}`) + 1}
              </span>
            </>
          ) : (
            data.player.episodes.string
          )}
          {isHistory && (
            <>
              <span className="font-bold">
                {timeConvert(+localStorage.getItem(`${data.id}played`))}
              </span>
            </>
          )}
        </h2>
      </Link>
    </div>
  );
};

export default TitleCard;
