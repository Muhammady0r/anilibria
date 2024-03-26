import React, { useEffect, useState } from "react";

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
import { buttonVariants } from "./ui/button";

import "ldrs/grid";

const UpdatesList = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching } = useQuery(
    "updates",
    () => {
      return axios(
        "https://api.anilibria.tv/v3/title/updates?items_per_page=10"
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
        <Card className={"w-full flex items-center justify-center"}>
          <l-helix size="45" speed="2.5" color="red"></l-helix>
        </Card>
      </div>
    );

  return (
    <div className="h-auto min-w-[300px]">
      <Card>
        <CardContent className="flex flex-col p-2 gap-2 relative overflow-auto">
          <Input
            placeholder={"Найти аниме по названию"}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <div
            className={`flex flex-col absolute top-12 z-10 bg-primary-foreground w-[95%] left-[2.5%] p-1 rounded ${
              search == "" ? "hidden" : ""
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
                    >
                      {title.names.ru}
                    </Link>
                    <DropdownMenuSeparator />
                  </div>
                );
              })}
          </div>
          {data.data.list.map((title, i) => {
            return <UpdCard data={title} torrentsUrl key={i} />;
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatesList;
