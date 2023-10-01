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
import { redirect } from "next/navigation";
config.autoAddCss = false;

export default async function Home() {
    const session = await getServerSession(options) 
    if (session != null) {
      redirect('/dashboard')
    }
    return (
      <main>
        <h2>{JSON.stringify(session)}</h2>
      </main>
    )
}
