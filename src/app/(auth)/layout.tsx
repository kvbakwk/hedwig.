import "@app/utils/globals.css";

import { Metadata } from "next";

import { redirect } from "next/navigation";
import { loginCheck } from "@app/api/login";

import NavItem from "@components/NavItem";
import Container from "@components/styled/auth/Container";
import LeftBar from "@components/styled/auth/LeftBar";
import LeftBarTitle from "@components/styled/auth/LeftBarTitle";
import Nav from "@components/styled/auth/Nav";
import RightBar from "@components/styled/auth/RightBar";
import RightBarTitle from "@components/styled/auth/RightBarTitle";
import RulesItem from "@components/auth/RulesItem";
import CenterBar from "@components/styled/auth/CenterBar";

export const metadata: Metadata = {
  title: "schcool",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootAuthLayout({ children }) {
  if (await loginCheck()) redirect("/");

  return (
    <html lang="pl" className="font-noto">
      <body>
        <div className="grid grid-cols-[1fr_500px_1fr] w-screen h-screen bg-surface-container">
          <div className="flex flex-col justify-center items-center gap-[150px] w-full h-full bg-background">
            <div className="font-bold text-primary text-[57px] text-center w-[250px] h-[70px]">
              hedwig.
            </div>
            <div className="flex flex-col gap-[10px] text-primary w-[270px] h-fit p-[10px]">
              <NavItem
                value="logowanie"
                icon={"account_circle"}
                fillIcon={true}
                page="/logowanie"
                href="/logowanie"
              />
              <NavItem
                value="rejestracja"
                icon={"person_add"}
                page="/rejestracja"
                href="/rejestracja"
                fillIcon={true}
              />
            </div>
          </div>
          <div className="flex justify-center items-center w-full h-full">
            {children}
          </div>
          <div className="grid grid-rows-[1fr_100px] w-full h-full">
            <div className="flex flex-col justify-center items-center w-full h-full">
              <RulesItem />
            </div>
            <div className="flex justify-center items-center gap-[10px] text-primary w-full h-[70px] mb-[30px] py-[10px] select-none">
              <span className="font-semibold">abcde.</span>
              <span className="font-light">@</span>
              <span className="font-semibold">2025</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
