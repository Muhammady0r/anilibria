import { Link, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import UpdatesList from "./components/UpdatesList";
import Home from "./components/Home";
import PageNotFound from "./components/PageNotFound";
import Releases from "./components/Releases";
import Donate from "./components/Donate";
import Footer from "./components/Footer";
import Schedule from "./components/Schedule";
import Title from "./components/Title";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Titles from "./components/Titles";

import "ldrs/grid";
import History from "./components/History";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function App() {
  const loc = useLocation();

  // window.onscroll = (e) => {
  //   console.log(window.scrollY);
  // };

  return (
    <>
      <div className="container relative ">
        <img
          src="https://www.anilibria.tv/img/29.png"
          alt=""
          className={`w-full `}
        />
        <Alert className={"mt-2 rounded border-accent w-full"}>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>
            Не оффициальная, фан копия сайта{" "}
            <Dialog>
              <DialogTrigger className="text-blue-500 hover:underline">
                Anilibria.tv
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    <img
                      src="/logo.png"
                      className="rounded-full h-40 m-auto"
                      alt=""
                    />
                  </DialogTitle>
                  <h1 className="text-center text-3xl font-bold py-2">
                    Anilibria
                  </h1>
                  <DialogDescription
                    className={"text-center cursor-pointer"}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "https://www.anilibria.tv/"
                      );
                      toast(`Скопировано!`);
                    }}
                  >
                    Anilibria.tv
                  </DialogDescription>
                </DialogHeader>
                <Link
                  className="m-auto bg-accent py-3 px-4 rounded-3xl font-bold"
                  to="https://www.anilibria.tv/"
                  target="_blank"
                >
                  Перейти
                </Link>
              </DialogContent>
            </Dialog>{" "}
            от{" "}
            <Dialog>
              <DialogTrigger className="text-blue-500 hover:underline">
                • Просто Кот ᓚᘏᗢ •
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    <p className="text-blue-500 mb-6 flex gap-2 justify-start items-center">
                      Telegram <i className="fa-brands fa-telegram fa-xl"></i>
                    </p>
                    <img
                      src="/avatar.jpg"
                      className="rounded-full h-40 m-auto"
                      alt=""
                    />
                  </DialogTitle>
                  <h1 className="text-center text-3xl font-bold py-2">
                    • Просто Кот ᓚᘏᗢ •
                  </h1>
                  <DialogDescription
                    className={"text-center cursor-pointer"}
                    onClick={() => {
                      navigator.clipboard.writeText("@Meed0ff");
                      toast(`Скопировано!`);
                    }}
                  >
                    @Meed0ff
                  </DialogDescription>
                </DialogHeader>
                <Link
                  className="m-auto bg-accent py-3 px-4 rounded-3xl font-bold"
                  to="tg://resolve?domain=Meed0ff"
                >
                  Написать сообщение
                </Link>
                <Link
                  className="m-auto border-2 border-accent text-accent py-3 px-4 rounded-3xl font-bold"
                  to="https://web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3DMeed0ff"
                >
                  Открыть в веб
                </Link>
              </DialogContent>
            </Dialog>
          </AlertTitle>
        </Alert>
      </div>

      <div
        className={`app container grid ${
          loc.pathname == "/donate" ? "min-[888px]:mt-2" : "mt-2"
        } gap-2`}
      >
        <div className="max-[1220px]:order-1">
          <Header />
          <div className="w-full mb-2"></div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/release/:code" element={<Title />} />
            <Route path="/titles" element={<Titles />} />
            <Route path="/catalog" element={<Releases />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/history" element={<History />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
        <UpdatesList />
      </div>
      <Footer className={``} />
      <SpeedInsights />
      <Toaster />
    </>
  );
}

export default App;
