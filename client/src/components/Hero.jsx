// src/components/Hero.jsx
import React from "react";

export default function Hero({ onGetVerified }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Verify once, apply everywhere.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Issue privacy-preserved credentials for work history, education, and proof-of-skill — powered by Moca Network.
          </p>

          <div className="mt-8 flex gap-4">
            <button onClick={onGetVerified} className="px-5 py-3 rounded-xl bg-[#4AD8C3] font-semibold">
              Get Verified
            </button>
            <a className="px-5 py-3 rounded-xl border" href="#demo">
              Watch demo
            </a>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold">Live demo</h4>
          <ol className="mt-3 list-decimal list-inside text-slate-600">
            <li>Sign in with Moca</li>
            <li>Issue a "Verified Developer" credential</li>
            <li>Apply to a job — system auto-verifies</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
