"use client";
import React from "react";

interface DashboardHeaderProps {
  userName: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const today = new Date();
  const dateString = today.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="mb-8 text-center md:text-left">
      <h1 className="text-3xl font-bold text-white mb-2">
        Chào {userName}, <span className="text-amber-500">An Nhiên!</span>
      </h1>
      <p className="text-zinc-400 text-lg">{dateString}</p>
    </header>
  );
}
