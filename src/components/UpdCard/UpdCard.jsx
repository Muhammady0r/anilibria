import React from "react";
import "./UpdCard.css";
import { Link, useNavigate } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";

const UpdCard = ({ data, torrentsUrl }) => {
  const nav = useNavigate();

  function truncateString(str) {
    if (str.length > 100) {
      return str.substring(0, 100) + "...";
    } else {
      return str;
    }
  }

  return (
    <div
      className="upd-card cursor-pointer w-full rounded overflow-hidden transition-all"
      onClick={() => {
        nav(`/release/${data.code}`);
      }}
    >
      <img
        src={`https://www.anilibria.tv/${data.posters.original.url}`}
        alt=""
        className="w-full"
      />
      <div className="upd-overlay flex flex-col items-center text-center p-4 transition-all">
        <h1 className="text-xs">{data.names.ru}</h1>
        <h2>Серия: {data.player.episodes.string}</h2>
        {torrentsUrl && (
          <>
            <p className="mt-4 text-sm">{truncateString(data.description)}</p>
            <Link
              className={`${buttonVariants({ variant: "" })}`}
              to={`https://www.anilibria.tv${data.torrents.list[0].url}`}
            >
              Скачать
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdCard;
