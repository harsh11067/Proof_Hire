// src/components/Header.jsx
import React from "react";
import MocaLoginButton from "./MocaLoginButton";

export default function Header({ onLoggedIn }) {
  return (
    <header className="w-full border-b bg-white/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg w-10 h-10 bg-gradient-to-tr from-[#071A3A] to-[#4AD8C3] flex items-center justify-center text-white font-bold">
            PH
          </div>
          <div>
            <h1 className="text-lg font-semibold">ProofHire</h1>
            <p className="text-xs text-slate-500">Privacy-first verified hiring</p>
          </div>
        </div>

        <div>
          <MocaLoginButton onLoggedIn={onLoggedIn} />
        </div>
      </div>
    </header>
  );
}
