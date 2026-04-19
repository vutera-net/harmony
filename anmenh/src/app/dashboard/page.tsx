"use client";
import React from "react";
import { useUser } from "../../context/UserContext";
import { getDailyEnergy } from "../../lib/energy-service";
import DashboardHeader from "../../components/pages/Dashboard/DashboardHeader";
import EnergyCard from "../../components/pages/Dashboard/EnergyCard";
import ElementBalance from "../../components/pages/Dashboard/ElementBalance";
import DailyAdvice from "../../components/pages/Dashboard/DailyAdvice";
import Layout from "../../components/Layout";

export default function DashboardPage() {
  const { profile } = useUser();
  const energy = getDailyEnergy(profile);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <DashboardHeader userName={profile?.name || "Bạn"} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <EnergyCard score={energy.score} status={energy.status} />
            <DailyAdvice advice={energy.advice} />
          </div>
          
          <div className="space-y-6">
            <ElementBalance data={energy.elementBalance} />
          </div>
        </div>

        {!profile && (
          <div className="mt-12 p-6 glass rounded-3xl text-center">
            <p className="text-zinc-400 mb-4">
              Để nhận được các phân tích chính xác hơn, hãy cập nhật hồ sơ của bạn.
            </p>
            <a 
              href="/bridge" 
              className="inline-block bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
              Cập nhật hồ sơ
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}
