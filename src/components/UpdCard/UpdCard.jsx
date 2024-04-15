import React from "react";
import "./UpdCard.css";
import { Link, useNavigate } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";

const UpdCard = ({ data, torrentsUrl, className }) => {
  const nav = useNavigate();
  const date = new Date(data.updated * 1000);

  function truncateString(str) {
    if (str.length > 100) {
      return str.substring(0, 200) + "...";
    } else {
      return str;
    }
  }

  return (
    <div
      className={`upd-card max-h-[80vh] w-full rounded overflow-hidden transition-all ${
        window.location.pathname == `/release/${data.code}`
          ? "border-4 border-accent"
          : "opacity-70 hover:opacity-100 md:"
      } ${className}`}
    >
      <Link to={`/release/${data.code}`}>
        <img
          src={`https://www.anilibria.tv/${data.posters.original.url}`}
          alt=""
          className="w-full"
        />
      </Link>
      <span className="upd-overlay flex flex-col items-center text-center p-4 transition-all">
        <Link
          to={`/release/${data.code}`}
          className="top-0 left-0 w-full h-full p-4 max-[1220px]:flex flex-col justify-center items-center"
        >
          <h1 className="text-xs">{data.names.ru}</h1>
          <h2>Серия: {data.player.episodes.string}</h2>
          <h2 className="text-xs">
            {date.getDate() + 1}/{`${date.getMonth() + 1}`.padStart(2, "0")}{" "}
            <span className="text-accent">
              {`${date.getHours()}`.padStart(2, "0")}:
              {`${date.getMinutes()}`.padStart(2, "0")}:
              {`${date.getSeconds()}`.padStart(2, "0")}
            </span>
          </h2>
          <p className="mt-4 text-sm">{truncateString(data.description)}</p>
        </Link>
        {torrentsUrl && data.torrents.list.length > 0 && (
          <>
            <Link
              className={`${buttonVariants({
                variant: "",
              })} max-[1220px]:hidden`}
              to={`https://www.anilibria.tv${data.torrents.list[0].url}`}
            >
              Скачать
            </Link>
          </>
        )}
      </span>
    </div>
  );
};

export default UpdCard;
