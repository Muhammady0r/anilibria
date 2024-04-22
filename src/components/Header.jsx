import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import "./Header/Header.css";
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "./ui/button";

const Header = () => {
  const nav = useNavigate();
  const loc = useLocation();

  const randomTitle = function () {
    axios("https://api.anilibria.tv/v3/title/random?filter=code").then(
      (res) => {
        nav(`/release/${res.data.code}`);
      }
    );
  };

  return (
    <>
      <div className="header min-[888px]:rounded">
        <div className="header__mobile">
          <Link to={"/donate"}>
            <i className="fa-solid fa-circle-dollar-to-slot fa-lg"></i>
          </Link>
          <Link className={``} onClick={randomTitle}>
            <i className="fa-solid fa-dice fa-lg"></i>
          </Link>
          <NavLink
            className="header__mobile__link -translate-y-3"
            to={"/"}
            onClick={() => {
              scrollTo(0, 0);
            }}
          >
            <img src="/logo.png" alt="" className="h-5 scale-[3]" />
          </NavLink>
          <Link to={"/catalog"}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </Link>
          <Link to={"/history"}>
            <i className="fa-solid fa-clock-rotate-left"></i>
          </Link>
        </div>

        <div className="header__pc">
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
          <NavLink className="header__link" to={"/history"}>
            История
          </NavLink>
          <NavLink className="header__link" to={"/donate"}>
            Поддержать проект
          </NavLink>
        </div>
      </div>

      <Link
        to={"/donate"}
        className={`${loc.pathname == "/donate" ? "hidden" : ""}`}
      >
        <img
          src="https://www.anilibria.tv/img/support_al.png"
          className="w-full rounded min-[888px]:mt-2"
        />
      </Link>
    </>
  );
};

export default Header;
