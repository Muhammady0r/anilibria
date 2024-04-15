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
import { SpeedInsights } from "@vercel/speed-insights/react";
import Titles from "./components/Titles";

import "ldrs/grid";
import History from "./components/History";

function App() {
  return (
    <>
      <div className="container relative">
        <img
          src="https://www.anilibria.tv/img/29.png"
          alt=""
          className="w-full max-md:h-[250px] max-md:object-cover"
        />
      </div>
      <div className="app container grid mt-2 gap-2">
        <div className="max-[1220px]:order-1">
          <Header />
          <div className="w-full mb-2"></div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/release/:code" element={<Title />} />
            <Route path="/titles" element={<Titles />} />
            <Route path="/catalog" element={<Releases />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/fetch-titles" element={<Fetch />} />
            <Route path="/history" element={<History />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
        <UpdatesList />
      </div>
      <Footer />
      <SpeedInsights />
    </>
  );
}

export default App;
