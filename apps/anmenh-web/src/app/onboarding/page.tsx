"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/trpc/Provider";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OnboardingWizard() {
  const router = useRouter();
  const { status } = useSession();
  const [step, setStep] = useState(1);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [gender, setGender] = useState("");

  // Bắt buộc đăng nhập
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const createProfile = trpc.profile.createProfile.useMutation({
    onSuccess: () => {
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }
  });

  const handleComplete = () => {
    setStep(4);
    createProfile.mutate({
      birthDate,
      birthTime,
      gender,
    });
  };

  if (status === "loading") return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 bg-white dark:bg-black text-black dark:text-white transition-colors duration-500">
      {step === 1 && (
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-light mb-6">
            Vũ trụ luôn có một tần số <br/> dành riêng cho bạn.
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 italic">Hãy cùng chúng tôi giải mã nó.</p>
          <button 
            onClick={() => setStep(2)}
            className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:scale-105 transition-all shadow-xl dark:shadow-white/5"
          >
            Bắt đầu
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center animate-fade-in w-full max-w-md">
          <h2 className="text-3xl font-light mb-8">Bạn sinh ra khi nào?</h2>
          <div className="flex flex-col gap-6 text-left">
            <div>
              <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">Ngày sinh (Dương lịch)</label>
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 dark:focus:border-yellow-600/50 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">Giờ sinh (Để tăng độ chính xác)</label>
              <input 
                type="time" 
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 dark:focus:border-yellow-600/50 text-black dark:text-white"
              />
            </div>
            <button 
              disabled={!birthDate}
              onClick={() => setStep(3)}
              className="mt-4 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full disabled:opacity-30 transition-all hover:scale-105"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center animate-fade-in w-full max-w-md">
          <h2 className="text-3xl font-light mb-8">Giới tính của bạn?</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setGender("Nam")}
              className={`p-8 border rounded-2xl transition-all ${gender === 'Nam' ? 'bg-zinc-900 dark:bg-zinc-800 text-white border-black dark:border-white shadow-lg' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'}`}
            >
              Nam
            </button>
            <button 
              onClick={() => setGender("Nữ")}
              className={`p-8 border rounded-2xl transition-all ${gender === 'Nữ' ? 'bg-zinc-900 dark:bg-zinc-800 text-white border-black dark:border-white shadow-lg' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'}`}
            >
              Nữ
            </button>
          </div>
          <button 
            disabled={!gender}
            onClick={handleComplete}
            className="mt-10 px-8 py-4 w-full bg-yellow-500 dark:bg-yellow-600 text-white font-bold rounded-full disabled:opacity-30 transition-all hover:scale-105 shadow-xl shadow-yellow-500/20"
          >
            Giải Mã Vận Mệnh
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center">
          <div className="w-24 h-24 border-t-2 border-yellow-500 border-solid rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-2xl font-light text-yellow-600 dark:text-yellow-500">Đang đồng bộ tần số vũ trụ...</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-sm font-medium">Hệ thống đang giải mã bản đồ Sinh mệnh của bạn.</p>
        </div>
      )}
    </div>
  );
}
