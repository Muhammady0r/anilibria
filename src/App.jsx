import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import UpdatesList from "./components/UpdatesList";
import Home from "./components/Home";
import PageNotFound from "./components/PageNotFound";

function App() {
  return (
    <>
      <h1 className="absolute top-2 right-2 text-xs">
        Это не оффициальный сайт Анилибрии. Офф ->{" "}
        <a href="https://anilibria.tv" className="text-cyan-600">
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
        <UpdatesList />
      </div>
    </>
  );
}

export default App;
