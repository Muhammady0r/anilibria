import React from "react";
import "./UpdCard.css";
import { Link, useNavigate } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";

const UpdCard = ({ data }) => {
  const nav = useNavigate();

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  }

  return (
    <div className="upd-card cursor-pointer w-full rounded overflow-hidden">
      <img
        src={`https://www.anilibria.tv/${data.posters.original.url}`}
        alt=""
        className="w-full"
      />
      <div className="upd-overlay flex flex-col items-center text-center p-4">
        <h1>{data.names.ru}</h1>
        <h2>Серия: {data.player.episodes.string}</h2>
        <p className="mt-4">{truncateString(data.description, 200)}</p>
        <Link
          className={`${buttonVariants({ variant: "" })}`}
          to={`https://www.anilibria.tv${data.torrents.list[0].url}`}
        >
          Скачать
        </Link>
      </div>
    </div>
  );
};

export default UpdCard;
