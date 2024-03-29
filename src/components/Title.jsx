import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "./ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import "ldrs/grid";

import { Button, buttonVariants } from "./ui/button";

import Player from "./Player";

const Title = () => {
  const param = useParams();
  const nav = useNavigate();
  // const [episodes1080, setEpisodes1080] = useState([]);
  // const [episodes720, setEpisodes720] = useState([]);
  // const [episodes480, setEpisodes480] = useState([]);

  const weekdays = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятницв",
    "Суббота",
    "Воскресенье",
  ];

  const { data, isLoading, isFetching, refetch } = useQuery(
    "title-full",
    () => {
      const req = axios(`https://api.anilibria.tv/v3/title?code=${param.code}`);
      req.then((res) => {});
      return req;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data && data.data.code != param.code) {
      refetch();
    }
  }, [param]);

  function getSubWorkers() {
    if (data == undefined) return;

    const d1 = data.data.team.translator.join(", ");
    const d2 = data.data.team.editing.join(", ");
    const d3 = data.data.team.decor.join(", ");

    let dtl = [];

    d1 != "" ? dtl.push(d1) : "";
    d2 != "" ? dtl.push(d2) : "";
    d3 != "" ? dtl.push(d3) : "";

    dtl = dtl.join(", ");

    return dtl;
  }

  if (isLoading || isFetching)
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        <l-grid size="100" speed="1.5" color="red"></l-grid>
      </div>
    );

  return (
    <div>
      <Card>
        <CardHeader
          className={"grid gap-4"}
          style={{ gridTemplateColumns: "2fr 1.25fr" }}
        >
          <div>
            <h1 className="text-center text-xl font-bold">
              {data.data.names.ru}
            </h1>
            <h1 className="text-center text-gray-400 text-sm">
              {data.data.names.en}
            </h1>
            <div className="border w-full mt-2 mb-2"></div>
            <ul>
              <li>
                <b>Сезон:</b> {data.data.season.year} {data.data.season.string}
              </li>
              <li>
                <b>Тип:</b> {data.data.type.full_string}
              </li>
              <li>
                <b>Жанры:</b> {data.data.genres.join(", ")}
              </li>
              <li>
                <b>Озвучка:</b> {data.data.team.voice.join(", ")}
              </li>
              <li>
                <b>Тайминг:</b> {data.data.team.timing.join(", ")}
              </li>
              <li className={`${getSubWorkers() == "" ? "hidden" : ""}`}>
                <Popover>
                  <PopoverTrigger className="flex gap-1">
                    <b className="hover:underline">Работа над субтитрами:</b>{" "}
                    <p>{getSubWorkers()}</p>
                  </PopoverTrigger>
                  <PopoverContent
                    className={
                      "p-2 border-accent bg-transparent backdrop-blur-sm"
                    }
                  >
                    <ul>
                      <li>
                        <b>Перевод:</b> {data.data.team.translator.join(", ")}
                      </li>
                      <li>
                        <b>Редактура:</b> {data.data.team.editing.join(", ")}
                      </li>
                      <li>
                        <b>Оформление:</b> {data.data.team.decor.join(", ")}
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </li>
            </ul>
            <div className="border w-full mt-2 mb-2"></div>
            <p>{data.data.description}</p>
          </div>
          <div className="relative rounded overflow-hidden">
            <div
              className={`absolute w-full backdrop-blur-sm p-1 text-center ${
                data.data.announce == null ? "cursor-pointer" : ""
              } ${data.data.status.code == 2 ? "hidden" : ""}`}
              style={{ background: "#12121299" }}
              onClick={() => {
                if (data.data.announce == null)
                  nav(`/schedule?toDay=${data.data.season.week_day}`);
              }}
            >
              {(data.data.announce != null && (
                <>
                  <p>{data.data.announce}</p>
                </>
              )) || (
                <>
                  <p>
                    Новая серия каждое {weekdays[data.data.season.week_day]}
                  </p>
                </>
              )}
            </div>
            <img
              src={`https://www.anilibria.tv/${data.data.posters.original.url}`}
              alt=""
              className="w-full rounded shadow shadow-accent"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Player data={data.data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Title;
