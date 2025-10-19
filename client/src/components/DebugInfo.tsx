import { useContext } from "react";
import { AirContext } from "../moca/AirProvider";
import { usePrivy } from "@privy-io/react-auth";

export default function DebugInfo() {
  const air = useContext(AirContext);
  const { user, ready } = usePrivy();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold text-gray-900 mb-4">Debug Information</h3>
      
      <div className="space-y-3 text-sm">
        <div>
          <strong>Privy Ready:</strong> {ready ? "✅ Yes" : "❌ No"}
        </div>
        
        <div>
          <strong>User Logged In:</strong> {user ? "✅ Yes" : "❌ No"}
        </div>
        
        {user && (
          <div>
            <strong>User ID:</strong> {user.id}
          </div>
        )}
        
        {user?.wallet?.address && (
          <div>
            <strong>Wallet Address:</strong> {user.wallet.address}
          </div>
        )}
        
        <div>
          <strong>Air Context:</strong> {air ? "✅ Available" : "❌ Not Available"}
        </div>
        
        {air && (
          <div>
            <strong>Air Methods:</strong> {Object.keys(air).join(", ")}
          </div>
        )}
        
        <div>
          <strong>Environment Variables:</strong>
          <ul className="ml-4 mt-1">
            <li>MOCA_API_BASE: {process.env.MOCA_API_BASE || "Not set"}</li>
            <li>MOCA_ISSUER_DID: {process.env.MOCA_ISSUER_DID || "Not set"}</li>
            <li>AIR_VERIFY_API_URL: {process.env.AIR_VERIFY_API_URL || "Not set"}</li>
            <li>AIR_VERIFY_API_KEY: {process.env.AIR_VERIFY_API_KEY ? "Set" : "Not set"}</li>
          </ul>
        </div>
        
        <div>
          <strong>Window MOCA_DID:</strong> {(window as any).__MOCA_DID__ || "Not set"}
        </div>
      </div>
    </div>
  );
}

