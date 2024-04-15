import React from "react";
import { Card } from "./ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Donate = () => {
  return (
    <>
      <div>
        <Card className={"p-4 pt-6 grid grid-cols-2 max-md:grid-cols-1"}>
          <iframe
            width={"100%"}
            height={"210px"}
            src="https://yoomoney.ru/quickpay/shop-widget?writer=seller&targets=%D0%94%D0%BE%D0%B1%D1%80%D0%BE%D0%B2%D0%BE%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%BF%D0%BE%D0%B6%D0%B5%D1%80%D1%82%D0%B2%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5&default-sum=200&button-text=14&payment-type-choice=on&mobile-payment-type-choice=on&successURL=https%3A%2F%2Fwww.anilibria.tv%2Fpages%2Fdonate.php&quickpay=shop&account=4100115839344905&"
            frameBorder="0"
          ></iframe>
          <div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Яндекс деньги</TableCell>
                  <TableCell className="text-right">4100115839344905</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Webmoney</TableCell>
                  <TableCell className="text-right">
                    Больше не поддерживается
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">PayPal</TableCell>
                  <TableCell className="text-right">
                    Временно не поддерживается
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="text-center mt-2">
              <a
                href="https://www.patreon.com/anilibria"
                className="text-blue-600"
              >
                https://www.patreon.com/anilibria
              </a>{" "}
              - ежемесячное добровольное пожертвование!
            </p>
            <p className="text-center mt-2">
              <a href="https://boosty.to/anilibriatv" className="text-blue-600">
                https://boosty.to/anilibriatv
              </a>{" "}
              - ежемесячное добровольное пожертвование!
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Donate;
