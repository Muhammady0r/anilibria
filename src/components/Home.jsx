import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

import "ldrs/grid";

import { Link } from "react-router-dom";

const Home = () => {
  const { data, isLoading, isFetching } = useQuery(
    "youtube",
    () => {
      return axios("https://api.anilibria.tv/v3/youtube");
    },
    { refetchInterval: 1000 }
  );

  if (isLoading)
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        <l-grid size="100" speed="1.5" color="red"></l-grid>
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-2 p-2 transition-all">
      {data.data.list.map((video, i) => {
        return (
          <Link
            to={`https://www.youtube.com/watch?v=${video.youtube_id}`}
            key={i}
            className="opacity-60 transition-all hover:opacity-100 rounded overflow-hidden"
            target="_blank"
          >
            <img
              src={`https://www.anilibria.tv/${video.preview.src}`}
              alt=""
              className="w-full"
            />
          </Link>
        );
      })}
    </div>
  );
};

export default Home;
