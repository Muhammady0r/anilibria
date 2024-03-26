import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import "./Header/Header.css";
import axios from "axios";

const Header = () => {
  const nav = useNavigate();

  const randomTitle = function () {
    axios("https://api.anilibria.tv/v3/title/random?filter=code").then(
      (res) => {
        nav(`/release/${res.data.code}`);
      }
    );
  };

  return (
    <>
      <div className="header rounded">
        <NavLink className="header__link" to={"/"}>
          Главная
        </NavLink>
        <NavLink className="header__link" to={"/catalog"}>
          Релизы
        </NavLink>
        <NavLink className="header__link" to={"/schedule"}>
          Расписание
        </NavLink>
        <Link className="header__link" onClick={randomTitle}>
          Случайное
        </Link>
        <Link
          className="header__link"
          to={"https://anilibria.app/"}
          target="_blank"
        >
          Приложение
        </Link>
        <NavLink className="header__link" to={"/donate"}>
          Поддержать проект
        </NavLink>
      </div>
      <Link to={"/donate"}>
        <img
          src="https://www.anilibria.tv/img/support_al.png"
          className="w-full rounded mt-2"
        />
      </Link>
    </>
  );
};

export default Header;
