import React, { useEffect, useRef, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "react-query";
import axios from "axios";

import "ldrs/helix";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";

import UpdCard from "./UpdCard/UpdCard";

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const UpdatesList = () => {
  const [search, setSearch] = useState("");

  const searchInput = useRef(null);

  const { data, isLoading, isFetching } = useQuery(
    "updates",
    () => {
      return axios(
        "https://api.anilibria.tv/v3/title/updates?items_per_page=14"
      );
    },
    {
      refetchInterval: 30000,
    }
  );

  const {
    data: searchData,
    // isLoading: searchLoading,
    isFetching: searchFetching,
    refetch: research,
  } = useQuery("search", () => {
    return axios(
      `https://api.anilibria.tv/v3/title/search?search=${search}&items_per_page=10`
    );
  });

  useEffect(() => {
    research();
  }, [search]);

  if (isLoading)
    return (
      <div className="flex w-full">
        <Card className={"w-full flex items-center justify-center py-2"}>
          <div className="spinner"></div>
        </Card>
      </div>
    );

  return (
    <div className="min-w-[300px] top-0 max-md:min-w-0">
      <Card>
        <CardContent className="flex flex-col p-2 gap-2 relative">
          <Input
            placeholder={"Найти аниме по названию"}
            ref={searchInput}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <div
            className={`transition-all flex flex-col absolute top-10 z-10 bg-primary-foreground w-[95%] left-[2.5%] p-1 rounded ${
              search == "" ? "blur-3xl pointer-events-none opacity-30" : ""
            }`}
          >
            {searchFetching && (
              <div className="w-full flex items-center justify-center p-2">
                <l-grid size="60" speed="1.5" color="red"></l-grid>
              </div>
            )}
            {!searchFetching &&
              searchData.data.list.map((title, i) => {
                return (
                  <div className="flex flex-col" key={i}>
                    <Link
                      className="p-1 hover:bg-accent hover:rounded-md transition-all"
                      to={`/release/${title.code}`}
                      onClick={() => {
                        searchInput.current.value = "";
                        setSearch("");
                        research();
                      }}
                    >
                      {title.names.ru}
                    </Link>
                    <DropdownMenuSeparator />
                  </div>
                );
              })}
          </div>
          <div className="max-[1220px]:flex gap-2 overflow-auto">
            {data.data.list.map((title, i) => {
              return (
                <UpdCard
                  data={title}
                  torrentsUrl
                  key={i}
                  className={`mb-2 ${i > 5 ? "md:hidden" : ""}`}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatesList;
