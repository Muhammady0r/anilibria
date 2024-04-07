import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import { Switch } from "@/components/ui/switch";

import { Button, buttonVariants } from "./ui/button";

import { VideoSeekSlider } from "react-video-seek-slider";
import "react-video-seek-slider/styles.css";

import { FullScreen, useFullScreenHandle } from "react-full-screen";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "ldrs/quantum";

// import { HideOnMouseStop } from "react-hide-on-mouse-stop";

import { Slider } from "./ui/slider";

const Player = ({ data }) => {
  const [vidQuality, setVidQuality] = useState("hd");
  const [episodes, setEpisodes] = useState([]);
  const [episode, setEpisode] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [light, setLight] = useState(true);

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

  const [playlist, setPlaylist] = useState(false);

  // settings
  const [settings, setSettings] = useState(false);
  const [speedS, setSpeedS] = useState(false);
  const [qualityS, setQualityS] = useState(false);

  useEffect(() => {
    setEpisodes(
      Object.values(
        data.player.is_rutube ? data.player.rutube : data.player.list
      )
    );

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

  if (episodes == null)
    return (
      <>
        <div className="w-full mt-12 flex justify-center items-center">
          <i className="fa-solid fa-triangle-exclamation fa-2xl"></i>
        </div>
      </>
    );

  if (episodes.length < 1)
    return (
      <>
        <div className="w-full mt-12 flex justify-center items-center">
          <l-helix size="45" speed="2.5" color="red"></l-helix>
        </div>
      </>
    );

  if (data.player.is_rutube == false && !episodes[episode]?.hls[vidQuality])
    return (
      <>
        <b className="text-red-600">Error</b>
      </>
    );

  return (
    <>
      {data.player.is_rutube && (
        <>
          <Select
            onValueChange={(e) => {
              localStorage.setItem(`${data.id}`, e);
              setCurrentTime(0);
              setEpisode(e);
            }}
            defaultValue={episode}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Серия" />
            </SelectTrigger>
            <SelectContent>
              {[...new Array(data.player.episodes.last)].map((_, i) => {
                return (
                  <SelectItem
                    className={episode == i ? "pointer-events-none" : ""}
                    key={i}
                    disabled={episode == i ? true : false}
                    value={i}
                  >
                    Серия {i + 1}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <br />
          <iframe
            width="100%"
            height="600"
            className="rounded"
            src={`https://rutube.ru/play/embed/${episodes[episode].rutube_id}?skinColor=e53935`}
            frameBorder="0"
            allow="clipboard-write; autoplay"
            allowFullScreen
          ></iframe>
        </>
      )}
      {!data.player.is_rutube && (
        <>
          <div
            className={`w-full flex justify-center items-center relative rounded-md overflow-hidden border border-accent mt-2 ${
              fullscreen ? "m-0 rounded-none h-full border-none" : ""
            }`}
          >
            <FullScreen
              handle={handleFS}
              onChange={(e) => {
                setFullscreen(e);
              }}
              className={`${light ? "absolute" : ""} w-full h-full`}
            >
              <div className={`relative h-full`}>
                <span className={`${playing ? "" : "opacity-60 blur-[2.5px]"}`}>
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
                    light={light}
                    playIcon={
                      <div className="text-accent text-2xl transition-all hover:blur-[2.5px] hover:scale-125">
                        <i className="fa-solid fa-play fa-2xl "></i>
                      </div>
                    }
                    onEnded={() => {
                      if (episode + 1 < data.player.episodes.last) {
                        localStorage.setItem(`${data.id}`, episode + 1);
                        setEpisode(episode + 1);
                        setCurrentTime(0);
                      }
                    }}
                    onReady={() => {
                      setLight(false);
                      setPlaying(true);
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
                </span>

                <div className={`${light ? "hidden" : ""}`}>
                  <div
                    onClick={() => {
                      setPlaying((prev) => !prev);
                    }}
                    onDoubleClick={() => {
                      if (fullscreen) handleFS.exit();
                      else handleFS.enter();
                    }}
                    className="absolute flex justify-center items-center top-0 left-0 w-full h-full"
                  >
                    <div
                      className={`scale-[1.75] bg-black/30 backdrop-blur-sm blur-[1px] h-10 w-10 rounded-full flex justify-center items-center transition-all ${
                        playing ? "scale-[0.5] opacity-0" : ""
                      }`}
                    >
                      <i className="fa-solid fa-pause fa-xl text-accent"></i>
                    </div>
                  </div>

                  <div
                    className={`${
                      isOpening ? "" : "hide-a"
                    } absolute bottom-20 -right-6 transition-all flex gap-2 scale-75 z-10`}
                  >
                    <Button
                      className={"text-2xl p-6 font-bold "}
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

                  {/* <HideOnMouseStop
                    delay={1000}
                    defaultTransition
                    showOnlyOnContainerHover
                  > */}
                  <div
                    className={`absolute top-0 left-0 w-full h-full transition-all ${
                      controls ? "hide-a opacity-10" : ""
                    }`}
                  >
                    <div
                      onClick={() => {
                        setPlaying((prev) => !prev);
                      }}
                      className="absolute top-0 left-0 w-full h-full"
                    ></div>

                    <div
                      className={`${buttonVariants({
                        variant: "outline",
                      })} absolute top-1/2 -translate-y-1/2 left-1 w-10 h-10 transition-all border-none cursor-pointer`}
                      onClick={() => {
                        setPlaylist(true);
                      }}
                    >
                      <i className="fa-solid fa-bars fa-xl"></i>
                    </div>
                    <div
                      className={`flex flex-col gap-1 absolute max-h-[60%] overflow-auto bg-background z-50 top-1/2 -translate-y-1/2 p-1 rounded border border-accent transition-all pointer-events-auto left-1 ${
                        playlist ? "" : "hide-a"
                      }`}
                    >
                      {[...new Array(data.player.episodes.last)].map((_, i) => {
                        return (
                          <Button
                            variant={episode == i ? "secondary" : "outline"}
                            className={
                              episode == i ? "pointer-events-none" : ""
                            }
                            key={i}
                            disabled={episode == i ? true : false}
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
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-6">
                      <Button
                        variant={"secondary"}
                        className={`w-10 h-10 scale-[1.125] transition-all flex flex-col pt-5 gap-2`}
                        onClick={() => {
                          player.current.seekTo(currentTime - 10);
                          setCurrentTime(currentTime - 10);
                        }}
                      >
                        <i className="fa-solid fa-rotate-left fa-lg"></i>
                        <h1 className="text-xs">10 сек</h1>
                      </Button>
                      <Button
                        variant={"secondary"}
                        className={`w-10 h-10 scale-[1.25] transition-all ${
                          episode == 0 ? "hide-a" : ""
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
                        variant={"secondary"}
                        className={`w-10 h-10 scale-[1.5] transition-all ${
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
                        variant={"secondary"}
                        className={`w-10 h-10 scale-[1.25] transition-all ${
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
                        variant={"secondary"}
                        className={`w-10 h-10 scale-[1.125] transition-all flex flex-col pt-5 gap-2`}
                        onClick={() => {
                          player.current.seekTo(currentTime + 10);
                          setCurrentTime(currentTime + 10);
                        }}
                      >
                        <i className="fa-solid fa-rotate-right fa-lg"></i>
                        <h1 className="text-xs">10 сек</h1>
                      </Button>
                    </div>

                    <h1
                      className={`absolute top-1 left-1 rounded px-1 text-xl transition-all bg-background`}
                    >
                      Серия{" "}
                      <span className="text-accent font-bold">
                        {episodes[episode]?.episode}
                      </span>
                      : <b>{episodes[episode].name}</b>
                    </h1>

                    <div
                      className={`absolute w-full h-full top-0 left-0 z-20 ${
                        settings || playlist ? "" : "hidden"
                      }`}
                      onMouseOver={() => {
                        setSettings(false);
                        setPlaylist(false);
                      }}
                    ></div>

                    <div
                      className={`absolute bottom-0 rounded w-[99%] m-[0.5%] h-16 bg-background px-4 py-2 transition-all z-20`}
                    >
                      <VideoSeekSlider
                        max={maxTime}
                        currentTime={currentTime}
                        bufferTime={progress}
                        onChange={handleTimeChange}
                        limitTimeTooltipBySides={true}
                        className={"relative z-30"}
                      />
                      <div className="relative h-full flex justify-between items-end">
                        <h1 className="absolute bottom-0 left-0">
                          {currentTime == 0 || isNaN(currentTime)
                            ? "00:00"
                            : timeConvert(currentTime)}{" "}
                          / {timeConvert(maxTime)}
                        </h1>

                        <div
                          className="absolute bottom-0 right-2 cursor-pointer"
                          onClick={() => {
                            setSettings((prev) => !prev);
                            setSpeedS(false);
                            setQualityS(false);
                          }}
                        >
                          <i className="fa-solid fa-gear"></i>
                        </div>

                        <div
                          className={
                            "absolute bottom-0 right-10 cursor-pointer"
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
                        </div>

                        <div
                          className="absolute bottom-0 right-[70px] cursor-pointer"
                          onClick={() => {
                            setPipMode((prev) => !prev);
                          }}
                        >
                          <i className="fa-solid fa-minimize "></i>
                        </div>

                        <div
                          className={
                            "absolute bottom-0 right-24 flex gap-2 justify-center items-center cursor-pointer"
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
                            className={"w-32"}
                            defaultValue={[1]}
                            max={1}
                            step={0.01}
                            onValueChange={(e) => {
                              setVol(e[0]);
                            }}
                          />
                        </div>

                        <div
                          className={`absolute bg-background border border-accent rounded p-2 right-0 bottom-6 flex flex-col gap-2 transition-all z-30 ${
                            settings ? "" : "hide-a"
                          }`}
                        >
                          <div
                            className={"flex gap-2 justify-center items-center"}
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

                          <div
                            className="flex justify-between items-center p-0 cursor-pointer"
                            onClick={() => {
                              setSpeedS((prev) => !prev);
                              setQualityS(false);
                            }}
                          >
                            <h1>Скорость</h1>{" "}
                            <h1 className="text-accent">{speed}</h1>
                          </div>
                          <div
                            className={`absolute bottom-0 right-2 bg-background/95 p-2 rounded border border-accent flex flex-col gap-1 w-20 transition-all ${
                              speedS ? "" : "hide-a"
                            }`}
                          >
                            {["0.75", "1", "1.25", "1.5", "1.75", "2", "3"].map(
                              (v, i) => {
                                return (
                                  <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => {
                                      setSpeedS(false);
                                      setSpeed(v);
                                    }}
                                    key={i}
                                  >
                                    {v}
                                    {speed == v ? (
                                      <i className="fa-solid fa-circle scale-50 text-accent"></i>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>

                          <div
                            className="flex justify-between items-center p-0 cursor-pointer"
                            onClick={() => {
                              setQualityS((prev) => !prev);
                              setSpeedS(false);
                            }}
                          >
                            <h1>Качество</h1>{" "}
                            <h1 className="text-accent">
                              {vidQuality == "fhd"
                                ? "1080p"
                                : vidQuality == "hd"
                                ? "720p"
                                : "480p"}
                            </h1>
                          </div>
                          <div
                            className={`absolute bottom-0 right-2 bg-background/95 p-2 rounded border border-accent flex flex-col gap-1 w-20 transition-all ${
                              qualityS ? "" : "hide-a"
                            }`}
                          >
                            {["sd", "hd", "fhd"].map((v, i) => {
                              return episodes[episode].hls[v] ==
                                null ? undefined : (
                                <div
                                  className="flex justify-between items-center cursor-pointer"
                                  onClick={() => {
                                    setQualityS(false);
                                    setVidQuality(v);
                                  }}
                                  key={i}
                                >
                                  {v == "fhd"
                                    ? "1080p"
                                    : v == "hd"
                                    ? "720p"
                                    : "480p"}
                                  {vidQuality == v ? (
                                    <i className="fa-solid fa-circle scale-50 text-accent"></i>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`absolute top-0 left-0 w-full h-[10%] transition-all`}
                  >
                    <Button
                      variant={"outline"}
                      className={
                        "absolute top-1 left-1/2 -translate-x-1/2 w-8 h-8 pointer-events-auto"
                      }
                      onClick={() => {
                        setControls((prev) => !prev);
                      }}
                    >
                      {controls ? (
                        <i className="fa-solid fa-lock"></i>
                      ) : (
                        <i className="fa-solid fa-lock-open"></i>
                      )}
                    </Button>
                  </div>
                  {/* </HideOnMouseStop> */}

                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
                      buffering ? "" : "hide-a"
                    }`}
                  >
                    <l-quantum size="65" speed="2" color="red"></l-quantum>
                  </div>
                </div>
              </div>
            </FullScreen>

            <img
              src="https://www.anilibria.tv/img/pleer2.jpg"
              // src="https://raw.github.com/Muhammady0r/meedweff-cloud/master/roms/hyperos-1.0.1.0.2-eu-post-a13-ayan_xe/poster.jpg"
              className={`w-full ${light ? "" : "hidden"}`}
              alt=""
            />
          </div>
        </>
      )}
    </>
  );
};

export default Player;
