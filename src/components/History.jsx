import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import TitleCard from "./TitleCard";
import { Button, buttonVariants } from "./ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";

const History = () => {
  let history = localStorage.getItem("history");
  const loadedTitles = [];

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery(
    "history",
    () => {
      return axios.get(
        `https://api.anilibria.tv/v3/title/list?id_list=${history}`
      );
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const importInput = useRef(null);

  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const importedHistory = JSON.parse(e.target.result).history;
      let tempHistory = history == null ? [] : history.split(",");
      importedHistory.forEach((data) => {
        if (tempHistory.includes(`${data.rid}`)) {
          console.log(`Id = ${data.rid}`);
          tempHistory.splice(history.indexOf(`${data.rid}`), 1);
        }
        tempHistory.unshift(`${data.rid}`);
      });
      localStorage.setItem("history", tempHistory);
      history = localStorage.getItem("history");
      refetch();
    };
  };

  const importMenu = () => {
    return (
      <AlertDialog>
        <AlertDialogTrigger
          className={`${buttonVariants({ variant: "" })} w-full mb-2 text-xl`}
        >
          Импортировать историю
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Импортировать историю с{" "}
              <i className="font-thin text-cyan-400">.json</i> файла
            </AlertDialogTitle>
            <AlertDialogDescription>Выберите .json файл</AlertDialogDescription>

            <Input type="file" ref={importInput} />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleChange(importInput.current);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  if (history == null || history == "")
    return (
      <>
        {!isFetching && (
          <div className={"flex flex-col items-center justify-center"}>
            {importMenu()}
            <img src="https://anilibria.tv/img/404.png" alt="" />
          </div>
        )}
        {isFetching && (
          <>
            <div className="py-4 flex w-full justify-center items-center">
              <div className="spinner"></div>
            </div>
          </>
        )}
      </>
    );

  if (isLoading || isFetching)
    return (
      <>
        <div className="py-4 flex w-full justify-center items-center">
          <div className="spinner"></div>
        </div>
      </>
    );

  if (isError) {
    let error1 = error.response.data.error.message;

    if (error.response.status == "404") {
      if (
        error1.toLowerCase().includes("title") &&
        error1.toLowerCase().includes("not found")
      ) {
        let tempHistory = history.split(",");
        tempHistory.splice(tempHistory.indexOf(error1.split('"')[1]), 1);
        localStorage.setItem("history", tempHistory);
        history = localStorage.getItem("history");
      }
    }

    return (
      <>
        <div className="py-4 flex flex-col w-full justify-center items-center">
          <div>{error.message}</div>
          <div>{error1}</div>
          <Button
            variant={"outline"}
            onClick={refetch}
            className={"flex gap-2 justify-center items-center"}
          >
            Повторить <i className="fa-solid fa-arrows-rotate"></i>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {importMenu()}
      {!isLoading && (
        <div className="grid grid-cols-3 gap-2 max-md:grid-cols-2">
          {data.data.map((title, i) => {
            if (!loadedTitles.includes(title.id)) {
              loadedTitles.push(title.id);

              return <TitleCard data={title} key={i} isHistory />;
            }
          })}
        </div>
      )}
      {isLoading && (
        <>
          <div className="py-4 flex w-full justify-center items-center">
            <div className="spinner"></div>
          </div>
        </>
      )}
    </>
  );
};

export default History;
