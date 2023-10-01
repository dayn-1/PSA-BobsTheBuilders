"use client";

import { PrismaClient } from "@prisma/client";
import Navbar from "./components/navbar";
import PriorityModal from "./components/priorityModal";
import PasirPanjangTerminal from "/public/static/PasirPanjangTerminal.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShip, faGear } from "@fortawesome/free-solid-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
config.autoAddCss = false;

interface Shipment {
  id: number;
  shipId: number;
  vesselName: string;
  type: string;
  flag: string;
  grossTonnage: number;
  deadweight: number;
  length: number;
  beam: number;
  draught: number;
  eta: Date;
  etd: Date;
  berth?: number;
  linkedId: number;
}

type Berth = {
  berthNo: number;
  berthName: string;
  // Other properties of the Berth type
};

const berthMappingList: Berth[] = [
  { berthNo: 1, berthName: "P25" },
  { berthNo: 2, berthName: "P24" },
  { berthNo: 3, berthName: "P23" },
  { berthNo: 4, berthName: "P22" },
  { berthNo: 5, berthName: "P6" },
  { berthNo: 6, berthName: "P5" },
  { berthNo: 7, berthName: "P1" },
  { berthNo: 8, berthName: "P2" },
  { berthNo: 9, berthName: "P3" },
  { berthNo: 10, berthName: "P4" },
];

function getBerthName(berthNo: number | undefined): string {
  if (berthNo === undefined) {
    return "No Available Berth";
  }
  const berthInfo = berthMappingList.find((berth) => berth.berthNo === berthNo);
  return berthInfo ? berthInfo.berthName : "Unassigned";
}

export default function Home() {
  const session = await getServerSession(options);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/shipments"); // Replace with your actual API endpoint
        const data = await response.json();
        // Sort the shipments by eta in ascending order
        // const sortedShipments = data.shipments.sort(
        //   (a: Shipment, b: Shipment) => a.eta.getTime() - b.eta.getTime()
        // );
        setShipments(data.shipments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  function sortShips(shipments: Shipment[]): Shipment[] {
    // Sort the shipments by eta in ascending order
    const sortedShipments = [...shipments].sort(
      (a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime()
    );
    return sortedShipments;
  }

  function filterNow(allShipments: Shipment[]) {
    return sortShips(allShipments).filter((shipment) => {
      const timeNow = new Date("2023-09-30T20:35:00.000Z");
      return (
        // shipment.berth !== -1 &&
        new Date(shipment.eta) <= timeNow && new Date(shipment.etd) >= timeNow
      );
    });
  }

  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };

    return new Date(date).toLocaleString(undefined, options);
  }

  if (loading) {
    return <p>Loading...</p>;
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
          <div className="relative col-span-7 m-10 h-[660px]">
            <h1 className="mb-2 font-semibold text-xl">PSA Pasir Panjang </h1>
            <img
              src="/static/PasirPanjangTerminal.jpeg"
              alt="Map"
              className="border-2 border-black"
            />
            <div className="left-2 text-2xl text-black absolute bottom-[320px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#C70039] opacity-90"
              />
            </div>
            <div className="left-2 text-2xl text-black absolute bottom-[400px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#1E8449] opacity-90"
              />
            </div>
            <div className="left-2 text-2xl text-black absolute bottom-[500px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#F1C40F] opacity-90"
              />
            </div>
            <div className="text-2xl text-black absolute left-[128px] bottom-[600px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#C70039] opacity-90"
              />
            </div>
            <div className="text-2xl text-black absolute left-[335px] bottom-[200px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#C70039] opacity-90"
              />
            </div>
            <div className="text-2xl text-black absolute left-[335px] bottom-[280px]  text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#C70039] opacity-90"
              />
            </div>
            <div className="left-[365px] text-2xl text-black absolute bottom-[170px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#C70039] opacity-90"
              />
            </div>
            <div className="left-[470px] text-2xl text-black absolute bottom-[170px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#C70039] opacity-90"
              />
            </div>
            <div className="left-[580px] text-2xl text-black absolute bottom-[170px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#C70039] opacity-90"
              />
            </div>
            <div className="left-[695px] text-2xl text-black absolute bottom-[170px] text-center">
              <FontAwesomeIcon
                icon={faShip}
                size="xl"
                className="text-[#C70039] opacity-90"
              />
            </div>
            <Link href="/berth" as="/berth/1">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[530px] left-[130px] bg-gray-700 text-white">
                1
              </div>
            </Link>
            <Link href="/berth/[id]" as="/berth/2">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[500px] left-[80px] bg-gray-700 text-white">
                2
              </div>
            </Link>
            <Link href="/berth" as="/berth/3">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[405px] left-[80px] bg-gray-700 text-white">
                3
              </div>
            </Link>
            <Link href="/berth" as="/berth/4">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[315px] left-[80px] bg-gray-700 text-white">
                4
              </div>
            </Link>
            <Link href="/berth" as="/berth/5">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[265px] left-[265px] bg-gray-700 text-white">
                5
              </div>
            </Link>
            <Link href="/berth" as="/berth/6">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[185px] left-[265px] bg-gray-700 text-white">
                6
              </div>
            </Link>
            <Link href="/berth" as="/berth/7">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[110px] left-[370px] bg-gray-700 text-white">
                7
              </div>
            </Link>
            <Link href="/berth" as="/berth/8">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[110px] left-[480px] bg-gray-700 text-white">
                8
              </div>
            </Link>
            <Link href="/berth" as="/berth/9">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[110px] left-[590px] bg-gray-700 text-white">
                9
              </div>
            </Link>
            <Link href="/berth" as="/berth/10">
              <div className="h-10 w-10 bg-blue-500 flex items-center justify-center absolute bottom-[110px] left-[700px] bg-gray-700 text-white">
                10
              </div>
            </Link>
          </div>
          <div className="col-span-3 border border-black mx-6 rounded-3xl">
            <h1 className="text-center font-semibold text-xl my-8">Events</h1>
            {shipments.length > 0 ? (
              <div className="mx-8">
                <h1 className="text-center flex justify-center font-semibold">
                  {" "}
                  Current Shipments{" "}
                </h1>
                {filterNow(shipments).map((shipment) => (
                  <div key={shipment.id}>
                    <h2 className="font-semibold">{shipment.vesselName}</h2>{" "}
                    <h3
                      className={
                        getBerthName(shipment.berth) === "Unassigned"
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Allocated Berth: {getBerthName(shipment.berth)}
                    </h3>
                    ETA: {formatDate(shipment.eta)} <br /> ETD:{" "}
                    {formatDate(shipment.etd)}
                  </div>
                ))}
              </div>
            ) : (
              <li>No shipments available.</li>
            )}
          </div>
        </div>
        <div>
          <PriorityModal visible={showModal} onClose={handleCloseModal} />
        </div>
      </div>
    </main>
  );
}
