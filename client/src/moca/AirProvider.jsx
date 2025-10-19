// src/moca/AirProvider.jsx
import React, { createContext, useMemo } from "react";
import { AirService } from "@mocanetwork/airkit"; // adapt if name differs

// Context to provide AirService instance app-wide
export const AirContext = createContext(null);

export default function AirProvider({ children }) {
  const air = useMemo(() => {
    // configure per Moca docs
    return new AirService({
      partnerId: process.env.NEXT_PUBLIC_MOCA_PARTNER_ID,
      apiBase: process.env.NEXT_PUBLIC_MOCA_API_BASE ?? "https://api.air.moca.network",
      environment: process.env.NODE_ENV === "production" ? "production" : "staging",
    });
  }, []);

  return <AirContext.Provider value={air}>{children}</AirContext.Provider>;
}
