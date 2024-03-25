import React, { useEffect } from "react";

import "ldrs/grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Title from "./Title";
import { useQuery } from "react-query";

const Random = () => {
  const nav = useNavigate();

  useEffect(() => {
    axios("https://api.anilibria.tv/v3/title/random").then((res) => {
      nav(`/release/${res.data.code}`);
    });
  }, []);

  //   const { data, isFetching } = useQuery("random", () => {
  //     return axios("https://api.anilibria.tv/v3/title/random");
  //   });

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <l-grid size="100" speed="1.5" color="red"></l-grid>
    </div>
  );
};

export default Random;
