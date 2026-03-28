"use client";

import { useState } from "react";
import { trpc } from "@/trpc/Provider";
import { useRouter } from "next/navigation";

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [gender, setGender] = useState("");

  const createProfile = trpc.profile.createProfile.useMutation({
    onSuccess: () => {
      // Simulate the "Vỡ òa" effect before redirecting
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }
  });

  const handleComplete = () => {
    setStep(4);
    createProfile.mutate({
      userId: "temp-session-id", // TODO: Replace with actual session user ID
      birthDate,
      birthTime,
      gender,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      {step === 1 && (
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-light mb-6">
            Vũ trụ luôn có một tần số <br/> dành riêng cho bạn.
          </h1>
          <p className="text-gray-400 mb-10">Hãy cùng chúng tôi giải mã nó.</p>
          <button 
            onClick={() => setStep(2)}
            className="px-8 py-3 bg-white text-black font-medium rounded-full hover:scale-105 transition-transform"
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
              <label className="block text-sm text-gray-400 mb-2">Ngày sinh (Dương lịch)</label>
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 focus:outline-none focus:border-yellow-600/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Giờ sinh (Tùy chọn, để tăng độ chính xác)</label>
              <input 
                type="time" 
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 focus:outline-none focus:border-yellow-600/50"
              />
            </div>
            <button 
              disabled={!birthDate}
              onClick={() => setStep(3)}
              className="mt-4 px-8 py-3 bg-white text-black font-medium rounded-full disabled:opacity-50 transition-all hover:scale-105"
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
              className={`p-6 border rounded-xl transition-all ${gender === 'Nam' ? 'bg-zinc-800 border-white' : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80'}`}
            >
              Nam
            </button>
            <button 
              onClick={() => setGender("Nữ")}
              className={`p-6 border rounded-xl transition-all ${gender === 'Nữ' ? 'bg-zinc-800 border-white' : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80'}`}
            >
              Nữ
            </button>
          </div>
          <button 
            disabled={!gender}
            onClick={handleComplete}
            className="mt-10 px-8 py-3 w-full bg-white text-black font-medium rounded-full disabled:opacity-50 transition-all hover:scale-105"
          >
            Giải Mã Vận Mệnh
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center animate-pulse">
          <div className="w-24 h-24 border-t-2 border-yellow-500 border-solid rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-2xl font-light text-yellow-500">Đang đồng bộ tần số vũ trụ...</h2>
          <p className="text-gray-500 mt-4 text-sm">Quá trình này chỉ mất vài giây.</p>
        </div>
      )}
    </div>
  );
}
