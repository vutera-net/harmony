"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "anmenh_profile";

export interface UserProfile {
  name: string;
  birthYear: number;
  gender: "male" | "female";
  plan: "FREE" | "PREMIUM";
  // Keep birthDate for backward compat with CanXuong/BatTrach
  birthDate: string;
}

interface UserContextType {
  profile: UserProfile | null;
  saveProfile: (p: UserProfile) => void;
  clearProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Normalize: ensure birthYear exists
        if (!parsed.birthYear && parsed.birthDate) {
          parsed.birthYear = new Date(parsed.birthDate).getFullYear();
        }
        setProfile(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    // Ensure birthDate is in sync with birthYear
    const normalized: UserProfile = {
      ...newProfile,
      birthDate: `${newProfile.birthYear}-01-01`,
    };
    setProfile(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider value={{ profile, saveProfile, clearProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
