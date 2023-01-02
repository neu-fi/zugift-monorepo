import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import router, { NextRouter, useRouter } from "next/router";
import React, { useEffect } from "react";
import { ConnectOrSwitchNetworkButton } from "./web3/ConnectOrSwitchNetworkButton";

type HeaderProps = {};

interface ITab {
  name: string;
  href: string;
}

export const tabs: ITab[] = [
  { name: "Mint", href: "/" },
  { name: "My Cards", href: "/my-cards" },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

function redirectToTab($event: React.ChangeEvent<HTMLSelectElement>): void {
  const tab = tabs.find((tab: ITab) => tab.name === $event.target.value);
  if (tab) {
    router.push(tab.href);
  }
}

function isCurrent(tab: ITab, router: NextRouter): boolean {
  return router.pathname === tab.href;
}

export default function Header(props: HeaderProps) {
  const router = useRouter();

  return (
    <div className="px-6 pt-6 lg:px-8">
      <div>
        <nav className="flex h-9 items-center justify-between">
          <div>
            <a href="/#" className="-m-1.5 p-1.5">
              <span className="sr-only">Regen Bingo</span>
              <img
                className="h-6 sm:h-8 md:h-8"
                src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=600"
                alt=""
              />
            </a>
          </div>
          <div className="mr-8 lg:mr-0 flex justify-center font-semibold">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                id="tabs"
                name="tabs"
                className="text-lg ml-2 p-2 rounded-xl shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 "
                defaultValue={tabs.find((tab) => isCurrent(tab, router))?.name}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  redirectToTab(event)
                }
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <nav
                className="ml-28 md:ml-52 space-x-8 lg:space-x-12 xl:space-x-16"
                aria-label="Tabs"
              >
                {tabs.map((tab) => (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      isCurrent(tab, router)
                        ? "hover:bg-yellow-2 hover:text-black bg-green-2 text-white"
                        : "hover:bg-green-3",
                      "px-4 py-3 rounded-xl "
                    )}
                    aria-current={isCurrent(tab, router) ? "page" : undefined}
                  >
                    {tab.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <ConnectOrSwitchNetworkButton />
        </nav>
      </div>
    </div>
  );
}