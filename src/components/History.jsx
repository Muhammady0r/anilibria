import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import TitleCard from "./TitleCard";

const History = () => {
  const history = localStorage.getItem("history");

  if (history == null || history == "")
    return (
      <>
        <div className={"flex items-center justify-center"}>
          <img src="https://anilibria.tv/img/404.png" alt="" />
        </div>
      </>
    );

  const { data, isLoading, isFetching } = useQuery(
    "history",
    () => {
      return axios.get(
        `https://api.anilibria.tv/v3/title/list?id_list=${history}`
      );
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if ((isLoading, isFetching))
    return (
      <>
        <div className="py-4 flex w-full justify-center items-center">
          <div className="spinner"></div>
        </div>
      </>
    );

  return (
    <>
      <div className="grid grid-cols-3 gap-2 max-md:grid-cols-2">
        {data.data.map((title, i) => {
          return <TitleCard data={title} key={i} isHistory />;
        })}
      </div>
    </>
  );
};

export default History;
