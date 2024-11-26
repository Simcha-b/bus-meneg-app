import React from "react";
import { Outlet } from "react-router-dom";
import  Heder  from "./Heder";
function Layout() {
  return (
    <>
      <Heder />
      <Outlet />
    </>
  );
}

export default Layout;
