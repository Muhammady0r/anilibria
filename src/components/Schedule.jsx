import React, { useEffect, useRef } from "react";
import { useQuery } from "react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import "ldrs/grid";
import axios from "axios";
import UpdCard from "./UpdCard/UpdCard";
import { useParams, useSearchParams } from "react-router-dom";
import TitleCard from "./TitleCard";

const Schedule = () => {
  const [params, setParams] = useSearchParams();
  const { data, isLoading, isFetching } = useQuery("schedule", () => {
    return axios("https://api.anilibria.tv/v3/title/schedule");
  });

  const weekdays = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

  const dayRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    if (params.get("toDay") != undefined && isLoading == false) {
      // console.log();
      scrollBy(
        0,
        dayRefs[params.get("toDay")].current.getBoundingClientRect().y
      );
      // dayRefs[params.get("toDay")].current.scrollIntoView({
      //   // behavior: "smooth",
      //   block: "start",
      // });
    }
  }, [isLoading]);

  if (isLoading)
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div>
      <Card className={"p-4 text-center"}>
        <h1 className="text-lg">
          РАСПИСАНИЕ ВЫХОДА СЕРИЙ В ОЗВУЧКЕ АНИЛИБРИИ*
        </h1>
        <p className="text-xs">
          *новые серии выходят в этот день недели +-1 день. В начале сезона
          расписание может не соответствовать действительности. Если серии
          задерживаются — это будет указано в статусе релиза (над постером).
        </p>
        {data.data.map((res, i) => {
          return (
            <div className="mt-2 flex flex-col gap-2" key={i}>
              <br />
              <div className="bg-accent rounded" ref={dayRefs[i]}>
                <h1 className="text-xl">{weekdays[res.day]}</h1>
              </div>
              <div className="grid grid-cols-4 gap-3 max-md:grid-cols-3 max-sm:grid-cols-2">
                {res.list.map((title, i) => {
                  return <TitleCard data={title} key={i} />;
                })}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default Schedule;
