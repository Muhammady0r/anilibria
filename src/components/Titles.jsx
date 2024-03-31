import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "./ui/card";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Titles = () => {
  const props = useSearchParams()[0];

  const year = props.get("year");
  const season = props.get("season");
  const page = props.get("page") ? props.get("page") : "1";

  const nav = useNavigate();

  const [pages, setPages] = useState(0);

  const { data, isLoading, isFetching, refetch } = useQuery(
    "year-titles",
    () => {
      const fetch = axios.get(
        `https://api.anilibria.tv/v3/title/search?year=${year}&season_code=${season}${
          page > 1 ? `&page=${page}` : ""
        }`
      );
      fetch.then((res) => {
        if (pages <= 0) {
          axios
            .get(
              `https://api.anilibria.tv/v3/title/search?year=${year}&season_code=${season}`
            )
            .then((res) => {
              console.log(res.data.pagination);
              setPages(res.data.pagination.pages);
            });
        }
      });
      return fetch;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    window.scrollTo(0, 200);
    refetch();
  }, [page]);

  function getPagination() {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                nav(
                  `${window.location.pathname.replaceAll(
                    "#",
                    ""
                  )}?year=${year}&season=${season}&page=${+page - 1}`
                );
              }}
              className={`${page <= 1 ? "hidden" : ""}`}
            />
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
            <PaginationLink className={"text-accent font-bold text-xl"}>
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
            <PaginationNext
              onClick={() => {
                nav(
                  `${window.location.pathname.replaceAll(
                    "#",
                    ""
                  )}?year=${year}&season=${season}&page=${+page + 1}`
                );
              }}
              className={`${page == pages ? "hidden" : ""}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  if (isLoading || isFetching)
    return (
      <>
        <div className="w-full h-[50vh] flex justify-center items-center">
          <l-grid size="100" speed="1.5" color="red"></l-grid>
        </div>
      </>
    );

  return (
    <>
      <Card className="flex flex-col gap-4 p-4">
        {getPagination()}
        {data.data.list.map((title, i) => {
          return (
            <Card
              className={
                "p-4 flex gap-4 justify-between items-center overflow-hidden"
              }
              key={i}
            >
              <div className="p-4 self-start">
                <h1 className="text-center text-lg font-bold">
                  {title.names.ru}
                </h1>
                <h1 className="text-center text-muted-foreground text-sm">
                  {title.names.en}
                </h1>
                <ul className="my-2">
                  <li>
                    <b>Жанр: {title.genres.join(", ")}</b>
                  </li>
                  <li>
                    <b>Сезон: {title.season.string}</b>
                  </li>
                </ul>
                <p className="text-base">
                  <b>Описание:</b> {title.description}
                </p>
              </div>

              <img
                src={`https://www.anilibria.tv/${title.posters.original.url}`}
                className="opacity-70 transition-all cursor-pointer hover:opacity-100 rounded"
                onClick={() => {
                  nav(`/release/${title.code}`);
                }}
                alt=""
              />
            </Card>
          );
        })}
        {getPagination()}
      </Card>
    </>
  );
};

export default Titles;
