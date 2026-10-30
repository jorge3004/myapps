import React from "react";
import Catalago from "./Catalago";
import Inicio from "./Inicio";
import { Nosotros } from "./Nosotros";
import Whatsapp from "./Whatsapp";

export const HomeScreenBody = () => {
  return (
    <div className="home container pt-5">
      <Inicio />
      <Catalago />
      <Nosotros />
      <Whatsapp />
    </div>
  );
};
