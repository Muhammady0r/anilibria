import React from "react";
import { Link, NavLink } from "react-router-dom";

import "./Header/Header.css";

const Header = () => {
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
        <NavLink className="header__link" to={"/random"}>
          Случайное
        </NavLink>
        <Link
          className="header__link"
          to={"https://anilibria.app/"}
          target="_blank"
        >
          Приложение
        </Link>
        <NavLink className="header__link" to={"/team"}>
          Команда
        </NavLink>
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
