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
    "Пятницв",
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
      dayRefs[params.get("toDay")].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isLoading]);

  if (isLoading)
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        <l-grid size="100" speed="1.5" color="red"></l-grid>
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
              <div className="grid grid-cols-4 gap-3">
                {res.list.map((title, i) => {
                  return <UpdCard data={title} torrentsUrl key={i} />;
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
