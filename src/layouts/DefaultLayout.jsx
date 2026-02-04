import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function DefaultLayout({ nameApp }) {
  return (
    <>
      <Header nameApp={nameApp} />
      <Outlet />
   
    </>
  );
}