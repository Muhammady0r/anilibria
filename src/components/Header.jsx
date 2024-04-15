import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

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
      {/* <Menubar className={"header border-accent"}>
        <MenubarMenu>
          <MenubarTrigger className={"header__trigger"}>Меню</MenubarTrigger>
          <MenubarContent>
            <MenubarItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"/"}>
                Главное
              </NavLink>
            </MenubarItem>
            <MenubarItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"/catalog"}>
                Релизы
              </NavLink>
            </MenubarItem>
            <MenubarItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"/schedule"}>
                Расписание
              </NavLink>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"https://anilibria.app/"}>
                Приложение
              </NavLink>
            </MenubarItem>
            <MenubarItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"/donate"}>
                Поддержать проект
              </NavLink>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"/history"}>
                История
              </NavLink>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar> */}

      <div className="header rounded">
        <DropdownMenu>
          <DropdownMenuTrigger className="header__menu flex justify-center items-center gap-1">
            <i className="fa-solid fa-bars fa-lg"></i> Меню
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuLabel>Меню</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"/"}>
                Главное
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"/catalog"}>
                Релизы
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"/schedule"}>
                Расписание
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"https://anilibria.app/"}>
                Приложение
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"/donate"}>
                Поддержать проект
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={"p-0"}>
              <NavLink className={"p-2 w-full"} to={"/history"}>
                История просмотра
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
