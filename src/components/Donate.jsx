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
        <Card className={"p-4"}>
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
        </Card>
      </div>
    </>
  );
};

export default Donate;
