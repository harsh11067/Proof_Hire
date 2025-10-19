import { useContext, useState } from "react";
import { AirContext } from "../moca/AirProvider";
import { generateFileHash, issuePdfVC, verifyApplicantCredentials } from "../../scripts/issuePdfCredential";
import { usePrivy } from "@privy-io/react-auth";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

// NOTE: this component replaces Privy integration; it uses Moca AIR flows via the client scripts.
// Make sure client/scripts/issuePdfCredential.js uses your server endpoint /generate-moca-jwt to request partner JWTs.

interface Props {
  onVerificationComplete?: (result: any) => void;
  applicationId?: string;
}

export default function FileUploadWithVerification({ onVerificationComplete, applicationId }: Props) {
  const air = useContext(AirContext);
  const { user } = usePrivy();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "issued" | "verified" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [signedPayload, setSignedPayload] = useState<string | null>(null);
  const [isMocaLoggedIn, setIsMocaLoggedIn] = useState(false);

  const pickFile = (f: File | null) => {
    setFile(f);
    setStatus("idle");
    setMessage(null);
    setVerificationResult(null);
  };

  // Trigger Moca login widget (uses AirContext)
  const handleMocaLogin = async () => {
    if (!air) {
      setMessage("❌ Air service not available. Please check your Moca configuration.");
      return;
    }
    
    try {
      setMessage("Connecting to Moca...");
      
      // The SDK may expose openLogin / openAccount or similar; adapt to exact method in Air SDK
      if (typeof (air as any).openLogin === "function") {
        await (air as any).openLogin();
        setIsMocaLoggedIn(true);
        setMessage("✅ Signed in with Moca (AIR).");
      } else if (typeof (air as any).connect === "function") {
        await (air as any).connect();
        setIsMocaLoggedIn(true);
        setMessage("✅ Signed in with Moca (AIR)");
      } else {
        setMessage("⚠️ Moca login not available; make sure AirProvider is configured.");
      }
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Moca login failed: " + (err?.message ?? err));
      setIsMocaLoggedIn(false);
    }
  };

  // Main upload -> issue -> verify flow
  const handleUploadAndIssue = async () => {
    if (!file) {
      setMessage("❌ Please choose a file first.");
      return;
    }
    
    if (!isMocaLoggedIn) {
      setMessage("❌ Please sign in with Moca first.");
      return;
    }

    setStatus("uploading");
    setMessage("🔄 Hashing PDF and preparing issuance...");

    try {
      const hash = await generateFileHash(file);
      setMessage(`📄 File hashed: ${hash.slice(0, 12)}...`);

      // Upload file to backend first
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user?.id || 'anonymous');
      formData.append('fileHash', hash);

      const uploadResponse = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const uploadResult = await uploadResponse.json();
      console.log('File uploaded:', uploadResult);

      // issuePdfVC is in client/scripts/issuePdfCredential.js (it calls your server endpoint to get JWT and then
      // calls the AIR issuance API). It returns issuance data.
      const applicantDid = (window as any).__MOCA_DID__ || user?.id || null;
      const issueResult = await issuePdfVC(hash, file.name, applicantDid || undefined);

      setStatus("issued");
      setMessage("🎫 PDF credential issued. Verifying...");

      // Optionally, pass applicationId to verify flow
      const verification = await verifyApplicantCredentials(applicationId ?? issueResult?.credentialId ?? user?.id);

      setVerificationResult(verification);
      setStatus(verification?.verified ? "verified" : "error");
      setMessage(verification?.verified ? "✅ Verified successfully!" : "❌ Verification failed");

      if (onVerificationComplete) onVerificationComplete(verification);
    } catch (err: any) {
      console.error("upload/issue error", err);
      setStatus("error");
      setMessage("❌ Upload or issuance failed: " + (err?.message ?? err));
    }
  };

  // Lightweight "mint" flow: sign a structured payload with user's wallet.
  // This is immediate and shows a cryptographic proof of ownership. You can later use this signature server-side to mint on-chain.
  const handleMintSignature = async () => {
    if (!file) return setMessage("Upload a file first.");
    try {
      const hash = await generateFileHash(file);

      // Request wallet (MetaMask / injected) and sign message
      if (!(window as any).ethereum) {
        return alert("No wallet found. Install MetaMask or similar.");
      }
      const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];

      const timestamp = new Date().toISOString();
      const payload = {
        type: "ProofHirePDF",
        owner: account,
        fileName: file.name,
        fileHash: hash,
        issuedAt: timestamp,
      };

      const msg = `ProofHire PDF Ownership\n\n${JSON.stringify(payload, null, 2)}`;
      // personal_sign returns signature you can store or use as "mint" proof
      const signature = await (window as any).ethereum.request({
        method: "personal_sign",
        params: [msg, account],
      });

      setSignedPayload(JSON.stringify({ payload, signature }, null, 2));
      setMessage("Signed payload created — you can mint on-chain or submit signature to backend to mint NFT.");
    } catch (err: any) {
      console.error(err);
      setMessage("Signing failed: " + (err?.message ?? err));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-blue-600" />
          Resume Upload & Verification
        </h3>
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
              isMocaLoggedIn 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={handleMocaLogin}
          >
            {isMocaLoggedIn ? '✅ Moca Connected' : 'Sign in with Moca'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select PDF Resume
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => pickFile(e.target.files ? e.target.files[0] : null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {file && (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-medium text-gray-900">{file.name}</div>
                <div className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <div className="flex gap-2">
                <button 
                  className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
                    !isMocaLoggedIn || status === "uploading"
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={handleUploadAndIssue}
                  disabled={!isMocaLoggedIn || status === "uploading"}
                >
                  {status === "uploading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload & Issue VC
                    </>
                  )}
                </button>
                <button 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={handleMintSignature}
                >
                  Mint (Sign)
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {message && (
              <div className={`p-3 rounded-md text-sm mb-3 ${
                message.includes('✅') 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : message.includes('❌')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {message}
              </div>
            )}

            {/* Status Indicators */}
            {status !== "idle" && (
              <div className="flex items-center gap-2 mb-3">
                {status === "verified" && <CheckCircle className="w-5 h-5 text-green-600" />}
                {status === "error" && <AlertCircle className="w-5 h-5 text-red-600" />}
                {status === "uploading" && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
                <span className="text-sm font-medium">
                  {status === "verified" && "Verification Complete"}
                  {status === "error" && "Verification Failed"}
                  {status === "uploading" && "Processing..."}
                  {status === "issued" && "Credential Issued"}
                </span>
              </div>
            )}

            {/* Verification Result */}
            {verificationResult && (
              <div className="mt-4">
                <h4 className="font-medium text-sm text-gray-900 mb-2">Verification Result:</h4>
                <pre className="p-3 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                  {JSON.stringify(verificationResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Signed Payload */}
            {signedPayload && (
              <div className="mt-4">
                <h4 className="font-medium text-sm text-gray-900 mb-2">Signed Payload:</h4>
                <pre className="p-3 bg-black text-white rounded text-xs overflow-auto max-h-32">
                  {signedPayload}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
