import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

import { Link } from "react-router-dom";

const Home = () => {
  const { data, isLoading, isFetching } = useQuery(
    "youtube",
    () => {
      return axios("https://api.anilibria.tv/v3/youtube?items_per_page=16");
    },
    { refetchInterval: 1000 }
  );

  if (isLoading)
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-2 p-2 transition-all max-[1220px]:p-0">
      {data.data.list.map((video, i) => {
        return (
          <div
            className="yt-vid relative opacity-60 transition-all hover:opacity-100 rounded overflow-hidden max-[1220px]:opacity-100"
            key={i}
          >
            <Link
              to={`https://www.youtube.com/watch?v=${video.youtube_id}`}
              className=""
              target="_blank"
            >
              <img
                src={`https://www.anilibria.tv/${video.preview.src}`}
                alt=""
                className="w-full"
              />
              <span className="absolute left-0 bottom-0 h-1/2 w-full yt-title flex items-end p-2 justify-center">
                <h1 className="text-sm text-center">{video.title}</h1>
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
