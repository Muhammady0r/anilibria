import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import { Switch } from "@/components/ui/switch";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button, buttonVariants } from "./ui/button";

import { VideoSeekSlider } from "react-video-seek-slider";
import "react-video-seek-slider/styles.css";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

import "ldrs/quantum";
import { HideOnMouseStop } from "react-hide-on-mouse-stop";

const Player = ({ data }) => {
  const [vidQuality, setVidQuality] = useState("hd");
  const [episodes, setEpisodes] = useState([]);
  const [episode, setEpisode] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [mouseIn, setMouseIn] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [maxTime, setMaxTime] = useState(0);

  const [fullscreen, setFullscreen] = useState(false);

  const [buffering, setBuffering] = useState(false);

  const check = useRef(null);

  const player = useRef(null);

  useEffect(() => {
    setEpisodes(Object.values(data.player.list));

    if (localStorage.getItem(`${data.id}`) == null) {
      localStorage.setItem(`${data.id}`, 0);
    }

    setEpisode(+localStorage.getItem(`${data.id}`));
  }, []);

  useEffect(() => {
    if (episodes.length < 1) return;

    setCurrentTime(
      parseFloat(
        localStorage.getItem(`${data.id}-${episodes[episode].episode}played`)
      )
    );
  }, [episodes]);

  useEffect(() => {
    document.body.style.overflow = fullscreen ? "hidden" : "";
  }, [fullscreen]);

  function timeConvert(sec) {
    return new Date(sec * 1000).toISOString().substring(14, 19);
  }

  const handleTimeChange = useCallback((time, offsetTime) => {
    setCurrentTime(time);
    player.current.seekTo(time);
  }, []);

  return (
    <>
      <div className={`w-full relative ${fullscreen ? "fullscreen" : ""}`}>
        <div
          className={`relative rounded-md overflow-hidden border border-accent mt-2 ${
            fullscreen
              ? "m-0 rounded-none h-full border-none bg-black/80 backdrop-blur-xl"
              : ""
          }`}
        >
          <ReactPlayer
            url={`https://${data.player.host}${episodes[episode]?.hls[vidQuality]}`}
            // controls
            width={"100%"}
            height={"100%"}
            ref={player}
            playing={playing}
            onEnded={() => {
              if (episode + 1 < data.player.episodes.last) {
                localStorage.setItem(`${data.id}`, episode + 1);
                setEpisode(episode + 1);
                setCurrentTime(0);
              }
            }}
            onReady={() => {
              player.current.seekTo(currentTime);
              //   console.log(player.current);
            }}
            onDuration={(e) => {
              setMaxTime(e);
            }}
            onProgress={(e) => {
              setProgress(e.loadedSeconds);

              localStorage.setItem(
                `${data.id}-${episodes[episode].episode}played`,
                e.playedSeconds
              );
              setCurrentTime(e.playedSeconds);

              if (
                currentTime >
                  data.player.list[episode + 1].skips.opening[0] + 3 &&
                currentTime < data.player.list[episode + 1].skips.opening[1] - 3
              ) {
                if (
                  localStorage.getItem("autoskip") == "true" &&
                  currentTime <
                    data.player.list[episode + 1].skips.opening[1] - 10
                ) {
                  console.log("skipped");
                  setCurrentTime(
                    data.player.list[episode + 1].skips.opening[1] + 3
                  );
                  player.current.seekTo(
                    data.player.list[episode + 1].skips.opening[1] + 3
                  );
                } else {
                  setIsOpening(true);
                }
              } else {
                setIsOpening(false);
              }
            }}
            onBuffer={() => {
              setBuffering(true);
            }}
            onBufferEnd={() => {
              setBuffering(false);
            }}
            onPlay={() => {
              setPlaying(true);
            }}
            onPause={() => {
              setPlaying(false);
            }}
          />

          <div
            onClick={() => {
              setPlaying((prev) => !prev);
            }}
            className="absolute top-0 left-0 w-full h-full"
          ></div>

          <HideOnMouseStop
            delay={1000}
            defaultTransition
            hideCursor={fullscreen ? true : false}
          >
            <Dialog>
              <DialogTrigger
                className={`${buttonVariants({
                  variant: "outline",
                })} absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 transition-all`}
              >
                <i className="fa-solid fa-bars fa-xl"></i>
              </DialogTrigger>
              <DialogContent
                className={
                  "max-h-[95vh] gap-2 p-2 pt-10 overflow-auto w-auto min-w-[200px]"
                }
              >
                {[...new Array(data.player.episodes.last)].map((_, i) => {
                  return (
                    <Button
                      variant={episode == i ? "" : "outline"}
                      key={i}
                      onClick={() => {
                        localStorage.setItem(`${data.id}`, i);
                        localStorage.setItem(
                          `${data.id}-${episodes[episode].episode}played`,
                          0
                        );
                        setEpisode(i);
                      }}
                    >
                      Серия {i + 1}
                    </Button>
                  );
                })}
              </DialogContent>
            </Dialog>

            <Button
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 scale-[1.5] bg-accent/40 backdrop-blur-sm transition-all ${
                buffering ? "hide-a" : ""
              }`}
              onClick={() => {
                setPlaying((prev) => !prev);
              }}
            >
              {playing ? (
                <i className="fa-solid fa-pause fa-xl"></i>
              ) : (
                <i className="fa-solid fa-play fa-lg"></i>
              )}
            </Button>

            <Button
              className={"absolute top-1 right-1 w-8 h-8 scale-90"}
              onClick={() => {
                setFullscreen((prev) => !prev);
              }}
            >
              {fullscreen ? (
                <i className="fa-solid fa-down-left-and-up-right-to-center"></i>
              ) : (
                <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
              )}
            </Button>

            <h1
              className={`absolute top-1 left-1 rounded px-1 text-xl transition-all bg-primary-foreground `}
            >
              Серия{" "}
              <span className="text-accent font-bold">
                {episodes[episode]?.episode}
              </span>
              : <b>{episodes[episode]?.name}</b>
            </h1>

            <div
              className={`absolute bottom-0 w-full h-16 bg-background/60 backdrop-blur-lg px-4 py-2 transition-all `}
            >
              <VideoSeekSlider
                max={maxTime}
                currentTime={currentTime}
                bufferTime={progress}
                onChange={handleTimeChange}
                limitTimeTooltipBySides={true}
              />
              <div className="relative mt-3 flex justify-between">
                <h1>
                  {timeConvert(currentTime)} : {timeConvert(maxTime)}
                </h1>
                <Menubar className={"bg-none border-none"}>
                  <MenubarMenu>
                    <MenubarTrigger
                      className={"bg-none border-none cursor-pointer right-0"}
                    >
                      <i className="fa-solid fa-gear  transition-all hover:rotate-180"></i>
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarSub>
                        <MenubarSubTrigger>Качество</MenubarSubTrigger>
                        <MenubarSubContent>
                          {["fhd", "hd", "sd"].map((q, i) => {
                            return (
                              <MenubarItem
                                key={i}
                                onClick={() => {
                                  setVidQuality(q);
                                }}
                                className={"flex justify-between"}
                              >
                                {q == "fhd"
                                  ? "1080p"
                                  : q == "hd"
                                  ? "720p"
                                  : "480p"}
                                {vidQuality == q && (
                                  <i className="fa-solid fa-circle scale-50 text-accent"></i>
                                )}
                              </MenubarItem>
                            );
                          })}
                        </MenubarSubContent>
                      </MenubarSub>
                      <MenubarItem className={"flex gap-2"}>
                        <Switch
                          id={"autoskip"}
                          ref={check}
                          defaultChecked={
                            localStorage.getItem("autoskip") == "false" ? 0 : 1
                          }
                          onCheckedChange={(e) => {
                            localStorage.setItem("autoskip", e);
                          }}
                        />
                        <label htmlFor="autoskip">Автопропуск опенинга</label>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            </div>
          </HideOnMouseStop>

          <Button
            className={`${
              isOpening ? "" : "hide-a"
            } absolute bottom-20 right-4 transition-all text-2xl p-6 font-bold`}
            onClick={() => {
              player.current.seekTo(
                data.player.list[episode + 1].skips.opening[1]
              );
            }}
            variant="outline"
          >
            Пропустить
          </Button>

          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
              buffering ? "" : "hide-a"
            }`}
          >
            <l-quantum size="65" speed="2" color="red"></l-quantum>
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;
