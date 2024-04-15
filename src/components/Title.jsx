import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import "ldrs/grid";

import Player from "./Player";

const Title = () => {
  const param = useParams();
  const nav = useNavigate();

  const weekdays = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

  const { data, isLoading, isFetching, refetch } = useQuery(
    "title-full",
    () => {
      const req = axios(`https://api.anilibria.tv/v3/title?code=${param.code}`);
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
        <div className="spinner"></div>
      </div>
    );

  return (
    <div>
      <Card className="relative overflow-clip p-0">
        <img
          src={`https://www.anilibria.tv/${data.data.posters.original.url}`}
          alt=""
          className="top-0 right-0 absolute z-[0] blur-sm object-cover w-1/2 h-[49%] opacity-50 max-md:w-full max-md:h-[34%]"
        />
        <div className="top-0 right-0 absolute z-[0] w-[55%] h-[50%] poster max-md:w-full max-md:h-[35%]"></div>
        <CardHeader
          className={"relative z-[1] grid gap-4 max-md:flex max-md:py-0"}
          style={{ gridTemplateColumns: "2fr 1.25fr" }}
        >
          <div className="max-md:order-1 max-md:mt-4">
            <h1 className="text-center text-xs text-muted">
              ID: {data.data.id}
            </h1>
            <h1 className="text-center text-xl font-bold">
              {data.data.names.ru}
            </h1>
            <h1 className="text-center text-gray-400 text-sm">
              {data.data.names.en}
            </h1>
            <div className="border w-full mt-2 mb-2"></div>
            <ul>
              <li>
                <b>Сезон:</b>{" "}
                <Link
                  className="hover:underline"
                  to={`/titles?year=${data.data.season.year}&season=${data.data.season.code}`}
                >
                  {data.data.season.year} {data.data.season.string}
                </Link>
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
            {data.data.franchises.length > 0 && (
              <div className={"bg-muted/50 rounded mt-2 p-4"}>
                <p className="text-xs">Порядок просмотра</p>
                <h1 className="text-lg font-bold">
                  {data.data.franchises[0].franchise.name}
                </h1>
                <div className="flex flex-col gap-1 mt-2">
                  {data.data.franchises[0].releases.map((item, i) => {
                    if (param.code == item.code)
                      return (
                        <h1
                          to={"/release/" + item.code}
                          key={i}
                          className="text-secondary"
                        >
                          #{item.ordinal} {item.names.ru}
                        </h1>
                      );
                    return (
                      <Link
                        to={"/release/" + item.code}
                        key={i}
                        className="hover:underline"
                      >
                        <span className="text-muted-foreground">
                          #{item.ordinal}
                        </span>{" "}
                        {item.names.ru}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="relative rounded overflow-hidden max-md:h-[400px] max-md:overflow-visible">
            <div
              className={`absolute m-[2%] w-[96%] backdrop-blur-lg p-1 text-center rounded max-md:w-full max-md:m-0 max-md:mt-[1px] max-md:left-1/2 max-md:-translate-x-1/2 ${
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
              className="w-full rounded max-md:h-full max-md:w-auto max-md:m-auto"
            />
          </div>
        </CardHeader>
        <CardContent className={"relative z-[1]"}>
          <Player data={data.data} />
        </CardContent>
        <CardFooter className={`relative z-[1] `}>
          <div
            className={`flex flex-col bg-muted w-full rounded overflow-hidden text-sm text-left`}
          >
            {data.data?.torrents?.list.map((torrent, i, a) => {
              return (
                <div
                  className={`flex justify-between items-stretch max-md:grid max-md:grid-cols-2 max-md:p-2 ${
                    a.length - 1 == i ? "" : "border-b-[1px]"
                  } border-accent px-2`}
                  key={i}
                >
                  <h1 className="py-1 pr-2 font-bold">
                    Серия {torrent.episodes.string}{" "}
                    {`[${torrent.quality.string}]`}
                  </h1>
                  <div className="border-l-[1px] border-accent flex gap-3 py-1 pl-2">
                    <h1 className="max-md:flex max-md:flex-col">
                      <i className="fa-solid fa-download text-gray-500"></i>{" "}
                      {torrent.size_string}
                    </h1>
                    <h1 className="">
                      <i className="fa-solid fa-up-long text-green-500"></i>{" "}
                      {torrent.seeders}
                    </h1>
                    <h1 className="">
                      <i className="fa-solid fa-down-long text-red-500"></i>{" "}
                      {torrent.leechers}
                    </h1>
                    <h1 className="">
                      <i className="fa-solid fa-check text-cyan-500"></i>{" "}
                      {torrent.downloads}
                    </h1>
                  </div>
                  <h1 className="border-l-[1px] border-accent flex gap-2 justify-center items-center px-2 max-md:border-none">
                    <span>Добавлен</span>
                    {new Date(torrent.uploaded_timestamp * 1000).getMonth() + 1}
                    /{new Date(torrent.uploaded_timestamp * 1000).getDate()}/
                    {new Date(torrent.uploaded_timestamp * 1000).getFullYear()}
                    {/* {new Date(torrent.uploaded_timestamp * 1000).getHours()}:
                    {String(
                      new Date(torrent.uploaded_timestamp * 1000).getMinutes()
                    ).padStart(2, "0")} */}
                  </h1>
                  <div className="border-l-[1px] border-accent pl-2 flex justify-center items-center">
                    <Link to={"https://www.anilibria.tv/" + torrent.url}>
                      <i className="fa-solid fa-file-arrow-down"></i> Скачать
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </CardFooter>
      </Card>
      <div className="grid grid-cols-3 gap-2 py-2">
        <Link
          className="rounded overflow-hidden"
          to={"https://vk.com/anilibria"}
          target="_blank"
        >
          <img
            src="https://www.anilibria.tv/img/other/a1.jpg"
            className="w-full"
            alt=""
          />
        </Link>
        <Link
          className="rounded overflow-hidden"
          to={"tg://resolve?domain=anilibria_tv"}
          // target="_blank"
        >
          <img
            src="https://www.anilibria.tv/img/other/a2.jpg"
            className="w-full"
            alt=""
          />
        </Link>
        <Link
          className="rounded overflow-hidden"
          to={"https://discord.gg/M6yCGeGN9B"}
          target="_blank"
        >
          <img
            src="https://www.anilibria.tv/img/other/a3.jpg"
            className="w-full"
            alt=""
          />
        </Link>
      </div>
    </div>
  );
};

export default Title;
