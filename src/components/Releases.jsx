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
import UpdCard from "./UpdCard/UpdCard";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Releases = () => {
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const seasons = [
    { value: 1, label: "Зима" },
    { value: 2, label: "Весна" },
    { value: 3, label: "Лето" },
    { value: 4, label: "Осень" },
  ];

  const [selectedGenres, setSelGenres] = useState([]);
  const [selectedYears, setSelYears] = useState([]);
  const [selectedSeasons, setSelSeasons] = useState([]);

  const nav = useNavigate();

  const props = useSearchParams()[0];

  const [sortByFav, setSort] = useState(true);

  const page = props.get("page") ? props.get("page") : "1";

  const [pages, setPages] = useState(0);

  const { data, isLoading, isFetching, refetch } = useQuery(
    "releases",
    () => {
      navigator.clipboard
        .writeText(`https://api.anilibria.tv/v3/title/search/advanced?query=${
        selectedYears.length < 1
          ? "{season.year}>=1996"
          : `${selectedYears
              .map(
                (year, i) =>
                  `${i == 0 ? "" : "%20or%20"}{season.year} == ${year}`
              )
              .join("")}`
      }${
        selectedGenres.length > 0
          ? selectedGenres
              .map(
                (genre, i) =>
                  `${i == 0 ? " and " : " or "} "${genre}" in {genres}`
              )
              .join("")
          : ""
      }${
        selectedSeasons.length > 0
          ? selectedSeasons
              .map(
                (season, i) =>
                  `${i == 0 ? " and " : " or "} {season.code}==${season}`
              )
              .join("")
          : ""
      }
        &order_by=${
          sortByFav ? "in_favorites" : "updated"
        }&sort_direction=1&items_per_page=12${
        page > 1 ? `&page=${page}` : ""
      }`);
      const fetch = axios(
        `https://api.anilibria.tv/v3/title/search/advanced?query=${
          selectedYears.length < 1
            ? "{season.year}>=1996"
            : `${selectedYears
                .map(
                  (year, i) =>
                    `${i == 0 ? "" : "%20or%20"}{season.year} == ${year}`
                )
                .join("")}`
        }${
          selectedGenres.length > 0
            ? selectedGenres
                .map(
                  (genre, i) =>
                    `${i == 0 ? " and " : " or "} "${genre}" in {genres}`
                )
                .join("")
            : ""
        }${
          selectedSeasons.length > 0
            ? selectedSeasons
                .map(
                  (season, i) =>
                    `${i == 0 ? " and " : " or "} {season.code}==${season}`
                )
                .join("")
            : ""
        }
          &order_by=${
            sortByFav ? "in_favorites" : "updated"
          }&sort_direction=1&items_per_page=12${
          page > 1 ? `&page=${page}` : ""
        }`
      );

      fetch.then((res) => {
        setPages(res.data.pagination.pages);
      });

      return fetch;
    },
    {
      refetchOnWindowFocus: false,
      cacheTime: 30000,
    }
  );

  useEffect(() => {
    refetch();
  }, [page]);

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

  function getPagination() {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                nav(
                  `${window.location.pathname.replaceAll("#", "")}?page=${
                    +page - 1
                  }`
                );
              }}
              className={`${page <= 1 ? "hidden" : ""} cursor-pointer`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => {
                nav(`${window.location.pathname.replaceAll("#", "")}`);
              }}
              className={`${page <= 2 ? "hidden" : ""} cursor-pointer`}
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem className={`${page <= 1 ? "hidden" : ""}`}>
            {+page <= 1 ? (
              <PaginationEllipsis />
            ) : (
              <>
                <h1 className="text-xs">{+page - 1}</h1>
              </>
            )}
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className={
                "text-foreground mx-2 font-bold text-xl bg-accent cursor-not-allowed"
              }
            >
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem className={`${page == pages ? "hidden" : ""}`}>
            {+page == pages ? (
              <PaginationEllipsis />
            ) : (
              <>
                <h1 className="text-xs">{+page + 1}</h1>
              </>
            )}
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => {
                nav(
                  `${window.location.pathname.replaceAll(
                    "#",
                    ""
                  )}?page=${pages}`
                );
              }}
              className={`${page < pages - 1 ? "" : "hidden"} cursor-pointer`}
            >
              {pages}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                nav(
                  `${window.location.pathname.replaceAll("#", "")}?page=${
                    +page + 1
                  }`
                );
              }}
              className={`${page == pages ? "hidden" : ""} cursor-pointer`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  return (
    <div className="">
      <Alert className={"my-2"}>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Страница ещё в разработке!</AlertTitle>
      </Alert>
      <Card className={""}>
        <CardHeader className="flex flex-row w-full gap-2 justify-between items-end">
          <Select
            options={genres}
            onChange={(e) => {
              setSelGenres(e.map((res) => res.value));
            }}
            styles={colorStyles}
            isMulti
            placeholder="Выбрать жанры"
            className="w-[50%]"
          />
          <Select
            options={years}
            onChange={(e) => {
              setSelYears(e.map((res) => res.value));
            }}
            styles={colorStyles}
            isMulti
            placeholder="Год"
            className="w-[27.5%]"
          />
          <Select
            options={seasons}
            onChange={(e) => {
              setSelSeasons(e.map((res) => res.value));
            }}
            styles={colorStyles}
            isMulti
            placeholder="Сезон"
            className="w-[22.5%]"
          />
        </CardHeader>
        <CardContent className="flex gap-6">
          <div
            className="relative bg-background p-2 pt-2.5 text-center overflow-hidden rounded border border-accent cursor-pointer select-none hover:bg-accent"
            onClick={() => {
              setSort((prev) => !prev);
            }}
          >
            <h1
              className={`absolute bg-black h-full w-full top-0 left-0 transition-all flex justify-center items-center ${
                sortByFav ? "translate-x-full" : ""
              } hover:bg-accent`}
            >
              Новые
            </h1>
            <h1>Популярные</h1>
          </div>
          <Button
            variant={"outline"}
            className={
              "h-full p-2.5 border-accent rounded flex justify-center items-center gap-2 text-base"
            }
            onClick={refetch}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <l-grid size="30" speed="1.5" color={"red"}></l-grid>
              </>
            ) : (
              <>
                <i className="fa-solid fa-magnifying-glass"></i> Показать
              </>
            )}
          </Button>
          <label
            className={`bg-background p-2 text-center overflow-hidden rounded border border-accent cursor-pointer select-none flex justify-center items-center gap-2 hover:bg-red-600`}
            htmlFor="finished"
          >
            <Checkbox id="finished" />
            Релиз завершён
          </label>
        </CardContent>
      </Card>
      <br />
      {getPagination()}
      <div
        className={`grid grid-cols-3 py-2 gap-2 transition-all ${
          isFetching ? "blur-xl pointer-events-none" : ""
        }`}
      >
        {data?.data?.list?.map((title, i) => {
          return <UpdCard data={title} key={i} />;
        })}
      </div>
      {getPagination()}
    </div>
  );
};

export default Releases;
