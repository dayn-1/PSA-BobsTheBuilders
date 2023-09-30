"use client";

import { PrismaClient } from "@prisma/client";
import Navbar from "./components/navbar";
import PriorityModal from "./components/priorityModal";
import PasirPanjangTerminal from "/public/static/PasirPanjangTerminal.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShip, faGear } from "@fortawesome/free-solid-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useState } from "react";
import Link from "next/link";
config.autoAddCss = false;

export default function Home() {
  // const prisma = new PrismaClient();

  // const vessels = await prisma.vessel.findMany();
  // console.log(vessels);

  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  console.log(PasirPanjangTerminal);
  return (
    <main>
      <div className="bg-gray-100 font-poppins">
        <Navbar />
        <div className="grid-cols-10 grid" onClick={() => setShowModal(true)}>
          <div className="col-span-9" />
          <div className="justify-end flex mt-6 mx-20 text-[#3b3b3b] hover:text-blue-600 cursor-pointer">
            <h3 className="mx-4">Settings</h3>
            <FontAwesomeIcon icon={faGear} size="xl" />
          </div>
        </div>
        <h1 className="justify-center flex underline-offset-4 underline text-xl mb-8">
          {" "}
          Port Dashboard{" "}
        </h1>
        <div className="grid grid-cols-10 gap-2">
          <div className="relative col-span-7 m-10">
            <h1 className="mb-2 font-semibold text-xl">PSA Pasir Panjang </h1>
            <img
              src="/static/PasirPanjangTerminal.jpeg"
              alt="Map"
              className="border-2 border-black"
            />
            <div className="left-2 text-2xl text-black absolute bottom-[380px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#C70039] opacity-90"
              />
            </div>
            <div className="left-2 text-2xl text-black absolute bottom-[480px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#1E8449] opacity-90"
              />
            </div>
            <div className="left-2 text-2xl text-black absolute bottom-[595px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#F1C40F] opacity-90"
              />
            </div>
            <Link href="/berth" as="/berth/1">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[530px] left-[130px]">
                1
              </div>
            </Link>
            <Link href="/berth/[id]" as="/berth/2">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[500px] left-[80px]">
                2
              </div>
            </Link>
            <Link href="/berth" as="/berth/3">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[405px] left-[80px]">
                3
              </div>
            </Link>
            <Link href="/berth" as="/berth/4">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[315px] left-[80px]">
                4
              </div>
            </Link>
            <Link href="/berth" as="/berth/5">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[265px] left-[265px]">
                5
              </div>
            </Link>
            <Link href="/berth" as="/berth/6">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[185px] left-[265px]">
                6
              </div>
            </Link>
            <Link href="/berth" as="/berth/7">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[110px] left-[370px]">
                7
              </div>
            </Link>
            <Link href="/berth" as="/berth/8">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[110px] left-[480px]">
                8
              </div>
            </Link>
            <Link href="/berth" as="/berth/9">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[110px] left-[590px]">
                9
              </div>
            </Link>
            <Link href="/berth" as="/berth/10">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[110px] left-[700px]">
                10
              </div>
            </Link>
          </div>
          <div className="col-span-3 border border-black mx-8 rounded-3xl">
            <h1 className="text-center font-semibold text-xl my-8">Events</h1>
          </div>
        </div>
        <div>
          <PriorityModal visible={showModal} onClose={handleCloseModal} />
        </div>
        {/* {vessels.map((vessel) => (
          <div key={vessel.id}>{vessel.name}</div>
        ))} */}
      </div>
    </main>
  );
}
