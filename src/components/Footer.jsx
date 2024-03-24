import React from "react";

import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer container mt-4">
      <Card className={"p-4 grid grid-cols-3"}>
        <div className="flex gap-2">
          <Link to={"http://www.animespirit.ru/"}>
            <img src="https://www.anilibria.tv/img/button/1.jpg" alt="" />
          </Link>
          <Link to={"https://github.com/anilibria"}>
            <img src="https://www.anilibria.tv/img/button/github.png" alt="" />
          </Link>
          <Link to={"https://alice2k.work/"}>
            <img src="https://www.anilibria.tv/img/button/alice2k.png" alt="" />
          </Link>
        </div>
        <img src="https://www.anilibria.tv/img/footer.png" alt="" />
        <p className="text-xs self-end">
          Весь материал на сайте представлен исключительно для домашнего
          ознакомительного просмотра. В случаях нарушения авторских прав -
          обращайтесь на почту firegamesboy0220@gmail.com
        </p>
      </Card>
    </div>
  );
};

export default Footer;
