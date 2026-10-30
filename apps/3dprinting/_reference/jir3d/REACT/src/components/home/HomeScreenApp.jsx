import React from "react";
import Footer from "../footer/Footer";
import { NavBar } from "../navbar/NavBar";
import { HomeScreenBody } from "./HomeScreenBody";

export const HomeScreenApp = () => {
  return (
    <>
      <NavBar />
      <HomeScreenBody />
      <Footer />
    </>
  );
};
