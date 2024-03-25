import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import UpdatesList from "./components/UpdatesList";
import Home from "./components/Home";
import PageNotFound from "./components/PageNotFound";
import axios from "axios";
import Fetch from "./components/Fetch";
import Releases from "./components/Releases";
import Donate from "./components/Donate";
import Footer from "./components/Footer";
import Schedule from "./components/Schedule";
import Title from "./components/Title";
import { useEffect } from "react";
import Random from "./components/Random";

function App() {
  return (
    <>
      <h1 className="absolute top-2 right-2 text-xs text-center z-50">
        Это не оффициальный сайт Анилибрии. <br />
        Офф{" "}
        <a
          href="https://anilibria.tv"
          className="text-blue-500"
          target="_blank"
        >
          Anilibria.tv
        </a>
      </h1>
      <h1 className="absolute top-2 left-2 text-xs text-center z-50">
        Фан копия сайта{" "}
        <a href="https://anilibria.tv" className="text-blue-500">
          Anilibria.tv
        </a>
      </h1>
      <div className="container relative">
        <img
          src="https://www.anilibria.tv/img/29.png"
          alt=""
          className="w-full"
        />
      </div>
      <div className="app container grid mt-2 gap-2">
        <div>
          <Header />
          <div className="w-full mb-2"></div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/release/:code" element={<Title />} />
            <Route path="/random" element={<Random />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/fetch-titles" element={<Fetch />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
        <UpdatesList />
      </div>
      <Footer />
    </>
  );
}

export default App;
