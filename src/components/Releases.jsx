import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

import "ldrs/grid";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { RocketIcon } from "@radix-ui/react-icons";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";

import Select from "react-select";

import { Switch } from "@/components/ui/switch";

const Releases = () => {
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const seasons = [
    { value: 1, label: "Зима" },
    { value: 2, label: "Весна" },
    { value: 3, label: "Лето" },
    { value: 4, label: "Осень" },
  ];

  const [sortByFav, setSort] = useState(true);

  const { data, isLoading } = useQuery("releases", () => {
    return axios(
      `https://api.anilibria.tv/v3/title/search/advanced?query={season.year}%3E=1996&order_by=${
        sortByFav ? "in_favorites" : "updated"
      }&sort_direction=1&items_per_page=12`
    );
  });

  const { data: yearsData, isLoading: yearsLoading } = useQuery("years", () => {
    return axios("https://api.anilibria.tv/v3/years");
  });

  const { data: genresData, isLoading: genresLoading } = useQuery(
    "genres",
    () => {
      return axios("https://api.anilibria.tv/v3/genres");
    }
  );

  useEffect(() => {
    if (yearsData != undefined) {
      setYears(
        yearsData.data
          .reverse()
          .filter((res) => {
            return res <= +new Date().getFullYear();
          })
          .map((res) => {
            return {
              value: res,
              label: res,
            };
          })
      );

      console.log(years);
    }

    if (genresData == undefined) return;

    setGenres(
      genresData.data.map((res) => {
        return {
          value: res,
          label: res,
        };
      })
    );
  }, [yearsData, genresData]);

  const colorStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#121212",
      borderColor: "red",
      color: "#fff",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        color: "#fff",
        backgroundColor: "#121212",
        // margin: "1px 0",
        ":hover": { backgroundColor: "red" },
      };
    },
    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: "red",
        color: "#000",
      };
    },
    multiValueLabel: (styles) => {
      return {
        ...styles,
        color: "#fff",
        fontWeight: "600",
      };
    },
  };

  if (isLoading && genresLoading && yearsLoading)
    return (
      <div className="upd-list flex w-full">
        <l-helix size="45" speed="2.5" color="red"></l-helix>
      </div>
    );

  return (
    <div className="">
      <Alert className={"my-2"}>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Страница ещё в разработке!</AlertTitle>
      </Alert>
      <Card className={""}>
        <CardHeader className="flex flex-row w-full gap-6 justify-between items-end">
          <Select
            options={genres}
            onChange={(e) => {
              console.log(e);
            }}
            styles={colorStyles}
            isMulti
            placeholder="Выбрать жанры"
            className="w-[50%]"
          />
          <Select
            options={years}
            onChange={(e) => {
              console.log(e);
            }}
            styles={colorStyles}
            isMulti
            placeholder="Год"
            className="w-[30%]"
          />
          <Select
            options={seasons}
            onChange={(e) => {
              console.log(e);
            }}
            styles={colorStyles}
            isMulti
            placeholder="Сезон"
            className="w-[20%]"
          />
        </CardHeader>
        <CardContent className="flex gap-6">
          <div
            className="relative bg-black p-2 text-center overflow-hidden rounded border border-accent cursor-pointer select-none"
            onClick={() => {
              setSort((prev) => !prev);
            }}
          >
            <h1
              className={`absolute bg-black h-full w-full top-0 left-0 transition-all flex justify-center items-center ${
                sortByFav ? "translate-x-full" : ""
              }`}
            >
              Новые
            </h1>
            <h1>Популярные</h1>
          </div>
          <label
            className={`bg-black p-2 text-center overflow-hidden rounded border border-accent cursor-pointer select-none flex justify-center items-center gap-2`}
            htmlFor="finished"
          >
            <Checkbox id="finished" />
            Релиз завершён
          </label>
        </CardContent>
      </Card>
    </div>
  );
};

export default Releases;
