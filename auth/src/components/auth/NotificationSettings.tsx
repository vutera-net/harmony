"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function NotificationSettings() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if browser supports push notifications
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setMessage("Trình duyệt của bạn không hỗ trợ thông báo.");
      return;
    }

    // Check current subscription status
    navigator.serviceWorker.getRegistration().then(async (reg) => {
      if (reg) {
        const sub = await reg.pushManager.getSubscription();
        setIsSubscribed(!!sub);
      }
    });
  }, []);

  const toggleSubscription = async () => {
    setLoading(true);
    setMessage(null);

    try {
      if (isSubscribed) {
        // Unsubscribe
        const response = await fetch("/api/notifications/unsubscribe", { method: "POST" });
        if (response.ok) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            const sub = await reg.pushManager.getSubscription();
            if (sub) await sub.unsubscribe();
          }
          setIsSubscribed(false);
          setMessage("Đã tắt thông báo.");
        }
      } else {
        // Subscribe
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setMessage("Bạn cần cấp quyền thông báo để sử dụng tính năng này.");
          setLoading(false);
          return;
        }

        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BO__cCIF43KVvoyuJD6sD2X_L-NMQrEOtgbiklBbSmsUXEclFmFMqF9uJh3r4ieXNUULIRF5qNK9TiEklHqA03U",
        });

        const response = await fetch("/api/notifications/subscribe", {
          method: "POST",
          body: JSON.stringify(sub),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          setIsSubscribed(true);
          setMessage("Đã bật thông báo nhắc nhở hằng ngày!");
        }
      }
    } catch (error) {
      console.error("Notification error:", error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-xl w-full max-w-md mt-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {isSubscribed ? <Bell size={20} /> : <BellOff size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-sm">Nhắc nhở vận hạn hằng ngày</h3>
            <p className="text-xs text-stone-500">Nhận thông báo mỗi sáng để xem tử vi</p>
          </div>
        </div>
        <button
          onClick={toggleSubscription}
          disabled={loading}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50",
            isSubscribed 
              ? "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300" 
              : "bg-primary text-white hover:brightness-110"
          )}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : (isSubscribed ? "Tắt" : "Bật")}
        </button>
      </div>
      {message && (
        <p className="text-[10px] text-center mt-3 text-stone-400 animate-pulse">{message}</p>
      )}
    </motion.div>
  );
}
