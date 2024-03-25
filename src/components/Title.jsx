import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "./ui/card";

import ReactPlayer from "react-player";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import "ldrs/grid";

import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

const Title = () => {
  const param = useParams();
  const nav = useNavigate();
  const [episodes1080, setEpisodes1080] = useState([]);
  const [episodes720, setEpisodes720] = useState([]);
  const [episodes480, setEpisodes480] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [episode, setEpisode] = useState(0);
  const [isOpening, setIsOpening] = useState(false);

  const check = useRef(null);

  const player = useRef(null);

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
      return axios(`https://api.anilibria.tv/v3/title?code=${param.code}`);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data && data.data.code != param.code) {
      window.scrollTo(0, 0);
      refetch();
    }
  }, [param]);

  useEffect(() => {
    if (isLoading || window.location.pathname == "/random") return;

    if (localStorage.getItem(`${data.data.id}`) == null) {
      localStorage.setItem(`${data.data.id}`, 0);
    }

    setEpisode(+localStorage.getItem(`${data.data.id}`));

    setEpisodes1080(
      Object.keys(data.data.player.list).map((i) => {
        return (
          "https://" + data.data.player.host + data.data.player.list[i].hls.fhd
        );
      })
    );

    setEpisodes720(
      Object.keys(data.data.player.list).map((i) => {
        return (
          "https://" + data.data.player.host + data.data.player.list[i].hls.hd
        );
      })
    );

    setEpisodes(episodes720);

    setEpisodes480(
      Object.keys(data.data.player.list).map((i) => {
        return (
          "https://" + data.data.player.host + data.data.player.list[i].hls.sd
        );
      })
    );

    // let array = [];
    // for (
    //   let i = data.data.player.episodes.first;
    //   i <= data.data.player.episodes.last;
    //   i++
    // ) {
    //   console.log(i);
    //   array.push(
    //     "https://" + data.data.player.host + data.data.player.list[i].hls.fhd
    //   );
    // }

    // setEpisodes1080(array);

    // array = [];
    // for (
    //   let i = data.data.player.episodes.first;
    //   i <= data.data.player.episodes.last;
    //   i++
    // ) {
    //   array.push(
    //     "https://" + data.data.player.host + data.data.player.list[i].hls.hd
    //   );
    // }

    // setEpisodes(array);
    // setEpisodes720(array);

    // array = [];
    // for (
    //   let i = data.data.player.episodes.first;
    //   i <= data.data.player.episodes.last;
    //   i++
    // ) {
    //   array.push(
    //     "https://" + data.data.player.host + data.data.player.list[i].hls.sd
    //   );
    // }

    // setEpisodes480(array);
  }, [data]);

  useEffect(() => {
    if (player.current == null) return;

    player.current.seekTo(
      parseFloat(localStorage.getItem(`${data.data.id}played`))
    );
  }, [player]);

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
              }`}
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
        {data && episodes.length > 0 && (
          <CardContent className={"w-full relative"}>
            <div className="flex items-center gap-2">
              Серия:
              <Select
                defaultValue={localStorage.getItem(`${data.data.id}`)}
                onValueChange={(e) => {
                  localStorage.setItem(`${data.data.id}`, +e);
                  localStorage.setItem(`${data.data.id}played`, 0);
                  setEpisode(+e);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Серия" />
                </SelectTrigger>
                <SelectContent>
                  {[...new Array(data.data.player.episodes.last)].map(
                    (_, i) => {
                      return (
                        <SelectItem value={`${i}`} key={i}>
                          Серия {i + 1}
                        </SelectItem>
                      );
                    }
                  )}
                </SelectContent>
              </Select>
              <span></span>
              Качество:
              <Select
                defaultValue="720"
                onValueChange={(e) => {
                  if (e == 1080) {
                    setEpisodes(episodes1080);
                  } else if (e == 720) {
                    setEpisodes(episodes720);
                  } else {
                    setEpisodes(episodes480);
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Качество" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1080">1080p</SelectItem>
                  <SelectItem value="720">720p</SelectItem>
                  <SelectItem value="480">480p</SelectItem>
                </SelectContent>
              </Select>
              <span></span>
              <Switch
                id={"autoskip"}
                ref={check}
                defaultChecked={
                  localStorage.getItem("autoskip") == "false" ? 0 : 1
                }
                onCheckedChange={(e) => {
                  localStorage.setItem("autoskip", e);
                }}
              />
              <label htmlFor="autoskip">Автопропуск опенинга</label>
            </div>
            <br />
            <h1 className="text-xl">
              Серия {episode + 1}:{" "}
              <b>{data.data.player.list[episode + 1].name}</b>
            </h1>
            <ReactPlayer
              url={episodes[episode]}
              controls
              width={"100%"}
              height={"100%"}
              ref={player}
              className={"rounded-md overflow-hidden border border-accent mt-2"}
              onEnded={() => {
                if (episode + 1 < data.data.player.episodes.last) {
                  localStorage.setItem(`${data.data.id}`, episode + 1);
                  setEpisode(episode + 1);
                }
              }}
              onReady={() => {
                player.current.seekTo(
                  parseFloat(localStorage.getItem(`${data.data.id}played`))
                );
              }}
              onProgress={(e) => {
                localStorage.setItem(`${data.data.id}played`, e.playedSeconds);
                if (
                  parseInt(localStorage.getItem(`${data.data.id}played`)) >
                    data.data.player.list[episode + 1].skips.opening[0] &&
                  parseInt(localStorage.getItem(`${data.data.id}played`)) <
                    data.data.player.list[episode + 1].skips.opening[1]
                ) {
                  if (
                    localStorage.getItem("autoskip") == "true" &&
                    parseInt(localStorage.getItem(`${data.data.id}played`)) <
                      data.data.player.list[episode + 1].skips.opening[1] + 1
                  ) {
                    player.current.seekTo(
                      data.data.player.list[episode + 1].skips.opening[1] + 2
                    );
                  } else {
                    setIsOpening(true);
                  }
                } else {
                  setIsOpening(false);
                }
              }}
            />
            <Button
              className={`${
                isOpening ? "" : "hidden"
              } absolute bottom-24 right-10 z-[99999]`}
              onClick={() => {
                player.current.seekTo(
                  data.data.player.list[episode + 1].skips.opening[1]
                );
              }}
            >
              Пропустить
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Title;
