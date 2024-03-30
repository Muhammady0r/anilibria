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

import { Button, buttonVariants } from "./ui/button";

import { VideoSeekSlider } from "react-video-seek-slider";
import "react-video-seek-slider/styles.css";

import { FullScreen, useFullScreenHandle } from "react-full-screen";

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
import { Slider } from "./ui/slider";

const Player = ({ data }) => {
  const [vidQuality, setVidQuality] = useState("hd");
  const [episodes, setEpisodes] = useState([]);
  const [episode, setEpisode] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [maxTime, setMaxTime] = useState(0);

  const [controls, setControls] = useState(false);

  const [speed, setSpeed] = useState(
    localStorage.getItem("playSpeed") == null
      ? "1"
      : localStorage.getItem("playSpeed")
  );

  const [vol, setVol] = useState(1);

  const [muted, setMuted] = useState(false);

  const [fullscreen, setFullscreen] = useState(false);

  const [buffering, setBuffering] = useState(false);

  const [pipMode, setPipMode] = useState(false);

  const [skippedSkip, setSkippedSkip] = useState(false);

  const check = useRef(null);

  const player = useRef(null);

  const handleFS = useFullScreenHandle();

  useEffect(() => {
    setEpisodes(Object.values(data.player.list));

    if (localStorage.getItem(`${data.id}`) == null) {
      localStorage.setItem(`${data.id}`, 0);
    }

    setEpisode(+localStorage.getItem(`${data.id}`));
  }, []);

  useEffect(() => {
    if (episodes.length < 1) return;

    setCurrentTime(parseFloat(localStorage.getItem(`${data.id}played`)));
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

  if (episodes.length < 1)
    return <l-helix size="45" speed="2.5" color="red"></l-helix>;

  return (
    <>
      <div className={`w-full relative`}>
        <FullScreen
          handle={handleFS}
          onChange={(e) => {
            setFullscreen(e);
          }}
        >
          <div
            className={`relative rounded-md overflow-hidden border border-accent mt-2 ${
              fullscreen
                ? "m-0 rounded-none h-full border-none bg-black/80 backdrop-blur-xl"
                : ""
            }`}
          >
            <ReactPlayer
              url={`https://${data.player.host}${episodes[episode]?.hls[vidQuality]}`}
              width={"100%"}
              height={"100%"}
              ref={player}
              playing={playing}
              playbackRate={+speed}
              volume={vol}
              muted={muted}
              pip={pipMode}
              onEnded={() => {
                if (episode + 1 < data.player.episodes.last) {
                  localStorage.setItem(`${data.id}`, episode + 1);
                  setEpisode(episode + 1);
                  setCurrentTime(0);
                }
              }}
              onReady={() => {
                player.current.seekTo(currentTime);
              }}
              onDuration={(e) => {
                setMaxTime(e);
              }}
              onProgress={(e) => {
                setProgress(e.loadedSeconds);

                localStorage.setItem(`${data.id}played`, e.playedSeconds);
                setCurrentTime(e.playedSeconds);

                if (
                  !skippedSkip &&
                  currentTime >
                    data.player.list[episode + 1].skips.opening[0] + 2 &&
                  currentTime <
                    data.player.list[episode + 1].skips.opening[1] - 3
                ) {
                  if (
                    localStorage.getItem("autoskip") == "true" &&
                    currentTime <
                      data.player.list[episode + 1].skips.opening[1] - 10
                  ) {
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

                if (
                  currentTime >
                  data.player.list[episode + 1].skips.opening[1] + 1
                ) {
                  setSkippedSkip(false);
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
              delay={2000}
              defaultTransition
              showOnlyOnContainerHover
            >
              <div
                className={`absolute top-0 left-0 w-full h-full transition-all ${
                  controls ? "hide-a opacity-10" : ""
                }`}
              >
                <Dialog>
                  <DialogTrigger
                    className={`${buttonVariants({
                      variant: "outline",
                    })} absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 transition-all ${
                      fullscreen ? "hide-a" : ""
                    }`}
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
                            setCurrentTime(0);
                            setEpisode(i);
                          }}
                        >
                          Серия {i + 1}
                        </Button>
                      );
                    })}
                  </DialogContent>
                </Dialog>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-6">
                  <Button
                    className={`w-10 h-10 scale-[1.125] bg-accent/40 backdrop-blur-sm transition-all flex flex-col pt-5 gap-2 ${
                      buffering ? "hide-a" : ""
                    }`}
                    onClick={() => {
                      player.current.seekTo(currentTime - 10);
                      setCurrentTime(currentTime - 10);
                    }}
                  >
                    <i className="fa-solid fa-rotate-left fa-lg"></i>
                    <h1 className="text-xs">10 сек</h1>
                  </Button>
                  <Button
                    className={`w-10 h-10 scale-[1.25] bg-accent/40 backdrop-blur-sm transition-all ${
                      buffering || episode == 0 ? "hide-a" : ""
                    }`}
                    onClick={() => {
                      localStorage.setItem(`${data.id}`, episode - 1);
                      setEpisode(episode - 1);
                      setCurrentTime(0);
                    }}
                  >
                    <i className="fa-solid fa-backward"></i>
                  </Button>
                  <Button
                    className={`w-10 h-10 scale-[1.5] bg-accent/40 backdrop-blur-sm transition-all ${
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
                    className={`w-10 h-10 scale-[1.25] bg-accent/40 backdrop-blur-sm transition-all ${
                      buffering ||
                      episodes[episode].episode == data.player.episodes.last
                        ? "hide-a"
                        : ""
                    }`}
                    onClick={() => {
                      localStorage.setItem(`${data.id}`, episode + 1);
                      setEpisode(episode + 1);
                      setCurrentTime(0);
                    }}
                  >
                    <i className="fa-solid fa-forward"></i>
                  </Button>
                  <Button
                    className={`w-10 h-10 scale-[1.125] bg-accent/40 backdrop-blur-sm transition-all flex flex-col pt-5 gap-2 ${
                      buffering ? "hide-a" : ""
                    }`}
                    onClick={() => {
                      player.current.seekTo(currentTime + 10);
                      setCurrentTime(currentTime + 10);
                    }}
                  >
                    <i className="fa-solid fa-rotate-right fa-lg"></i>
                    <h1 className="text-xs">10 сек</h1>
                  </Button>
                </div>

                <Button
                  className={
                    "absolute top-1 right-1 w-8 h-8 scale-90 pointer-events-auto z-10"
                  }
                  onClick={() => {
                    if (fullscreen) handleFS.exit();
                    else handleFS.enter();
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
                  : <b>{episodes[episode].name}</b>
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
                    <h1 className="absolute bottom-[1.5px]">
                      {currentTime == 0 || isNaN(currentTime)
                        ? "00:00"
                        : timeConvert(currentTime)}{" "}
                      / {timeConvert(maxTime)}
                    </h1>

                    <div
                      className={
                        "absolute bottom-[1px] right-20 flex gap-2 justify-center items-center"
                      }
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setMuted((prev) => !prev);
                        }}
                      >
                        {!muted ? (
                          <i className="fa-solid fa-volume-high"></i>
                        ) : (
                          <i className="fa-solid fa-volume-xmark"></i>
                        )}
                      </div>
                      <Slider
                        className={"w-32 -translate-y-[1.5px]"}
                        defaultValue={[1]}
                        max={1}
                        step={0.01}
                        onValueChange={(e) => {
                          setVol(e[0]);
                        }}
                      />
                    </div>

                    <div
                      className="absolute bottom-[1.5px] right-12 cursor-pointer"
                      onClick={() => {
                        setPipMode((prev) => !prev);
                      }}
                    >
                      <i className="fa-solid fa-minimize"></i>
                    </div>

                    <Menubar className={"bg-none bottom-0 p-0 border-none"}>
                      <MenubarMenu>
                        <MenubarTrigger
                          className={
                            "absolute bg-none bottom-[15px] border-none cursor-pointer right-3 p-0"
                          }
                        >
                          <i className="fa-solid fa-gear fa-lg"></i>
                        </MenubarTrigger>
                        <MenubarContent>
                          <div
                            className={
                              "flex gap-2 justify-center items-center p-2"
                            }
                          >
                            <Switch
                              id={"autoskip"}
                              ref={check}
                              defaultChecked={
                                localStorage.getItem("autoskip") == "false" ||
                                localStorage.getItem("autoskip") == null
                                  ? 0
                                  : 1
                              }
                              onCheckedChange={(e) => {
                                localStorage.setItem("autoskip", e);
                              }}
                            />
                            <label htmlFor="autoskip">
                              Автопропуск опенинга
                            </label>
                          </div>
                          <MenubarSub>
                            <MenubarSubTrigger>
                              Скорость{" "}
                              <h1 className="text-accent ml-8">{speed}</h1>
                            </MenubarSubTrigger>
                            <MenubarSubContent>
                              {[
                                "0.75",
                                "1",
                                "1.25",
                                "1.5",
                                "1.75",
                                "2",
                                "3",
                              ].map((q, i) => {
                                return (
                                  <MenubarItem
                                    key={i}
                                    onClick={() => {
                                      localStorage.setItem("playSpeed", q);
                                      setSpeed(q);
                                    }}
                                    className={"flex justify-between"}
                                  >
                                    {q}
                                    {speed == q && (
                                      <i className="fa-solid fa-circle scale-50 text-accent"></i>
                                    )}
                                  </MenubarItem>
                                );
                              })}
                            </MenubarSubContent>
                          </MenubarSub>
                          <MenubarSub>
                            <MenubarSubTrigger>
                              <h1>Качество</h1>
                              <h1 className="text-accent ml-8">
                                {vidQuality == "fhd"
                                  ? "1080p"
                                  : vidQuality == "hd"
                                  ? "720p"
                                  : "480p"}
                              </h1>
                            </MenubarSubTrigger>
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
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  </div>
                </div>
              </div>
              <div
                className={`absolute top-0 left-0 w-full h-[10%] transition-all`}
              >
                <Button
                  variant={"outline"}
                  className={
                    "absolute top-1 left-1/2 -translate-x-1/2 w-10 h-10 pointer-events-auto"
                  }
                  onClick={() => {
                    setControls((prev) => !prev);
                  }}
                >
                  {controls ? (
                    <i className="fa-solid fa-lock fa-lg"></i>
                  ) : (
                    <i className="fa-solid fa-lock-open fa-lg"></i>
                  )}
                </Button>
              </div>
            </HideOnMouseStop>

            <div
              className={`${
                isOpening ? "" : "hide-a"
              } absolute bottom-20 -right-6 transition-all flex gap-2 scale-75`}
            >
              <Button
                className={"text-2xl p-6 font-bold"}
                onClick={() => {
                  player.current.seekTo(
                    data.player.list[episode + 1].skips.opening[1]
                  );
                }}
                variant="outline"
              >
                Пропустить
              </Button>
              <Button
                className={"text-2xl p-6 font-bold"}
                onClick={() => {
                  setSkippedSkip(true);
                  setIsOpening(false);
                }}
                variant="outline"
              >
                Смотреть
              </Button>
            </div>

            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
                buffering ? "" : "hide-a"
              }`}
            >
              <l-quantum size="65" speed="2" color="red"></l-quantum>
            </div>
          </div>
        </FullScreen>
      </div>
    </>
  );
};

export default Player;
