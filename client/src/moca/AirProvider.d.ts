import React from "react";

export interface AirService {
  partnerId?: string;
  apiBase?: string;
  environment?: string;
}

export const AirContext: React.Context<AirService | null>;

export default function AirProvider({ children }: { children: React.ReactNode }): JSX.Element;



