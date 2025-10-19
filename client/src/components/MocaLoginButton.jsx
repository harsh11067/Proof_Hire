// src/components/MocaLoginButton.jsx
import React, { useContext, useState } from "react";
import { AirContext } from "../moca/AirProvider";

/**
 * Triggers a server-side JWT creation, then opens AIR Kit login/issuer flow.
 * This component assumes the AirService instance has methods `openLogin` or `startIssuance`.
 * Adapt to actual SDK method names from Moca docs.
 */
export default function MocaLoginButton({ onLoggedIn }) {
  const air = useContext(AirContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // ask backend for a short-lived partner token (server signs with private key)
      const res = await fetch("/generate-moca-jwt", { method: "POST" });
      const { token } = await res.json();

      // SDK call to open AIR login widget / modal
      // NOTE: adapt `air.openLogin` to the correct method from Moca SDK
      if (!air) throw new Error("Air service not found");

      // Example: start the login widget, passing the server token
      await air.openLogin({ partnerAuthToken: token });

      // call callback if provided
      onLoggedIn && onLoggedIn();
    } catch (err) {
      console.error("Login failed", err);
      alert("Login failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-md hover:opacity-95"
      disabled={loading}
    >
      {loading ? "Connecting..." : "Sign in with Moca"}
    </button>
  );
}
