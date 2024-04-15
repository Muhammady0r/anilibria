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
              setPages(res.data.pagination.pages);
            });
          1;
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
              className={`${page <= 1 ? "hidden" : ""} cursor-pointer`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => {
                nav(
                  `${window.location.pathname.replaceAll(
                    "#",
                    ""
                  )}?year=${year}&season=${season}`
                );
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
                  )}?year=${year}&season=${season}&page=${pages}`
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
                  `${window.location.pathname.replaceAll(
                    "#",
                    ""
                  )}?year=${year}&season=${season}&page=${+page + 1}`
                );
              }}
              className={`${page == pages ? "hidden" : ""} cursor-pointer`}
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
          <div className="spinner"></div>
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
                "relative p-4 flex gap-4 justify-between items-center overflow-hidden max-md:flex-col"
              }
              key={i}
            >
              <div className="p-4 self-start max-md:order-1">
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

              <Link to={`/release/${title.code}`}>
                <img
                  src={`https://www.anilibria.tv/${title.posters.original.url}`}
                  className="rounded h-full"
                  alt=""
                />
              </Link>
              <img
                src={`https://www.anilibria.tv/${title.posters.original.url}`}
                className="rounded h-full max-md:hidden"
                // onClick={() => {
                //   nav(`/release/${title.code}`);
                // }}
                alt=""
              />
              <Link
                to={`/release/${title.code}`}
                className="absolute right-0 top-0 h-full w-[40%] max-md:hidden"
              ></Link>
            </Card>
          );
        })}
        {getPagination()}
      </Card>
    </>
  );
};

export default Titles;
