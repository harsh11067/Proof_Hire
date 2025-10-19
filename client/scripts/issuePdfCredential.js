// scripts/issuePdfCredential.js
// Browser-compatible version for client-side use

// Helper function to generate hash from file buffer (browser-compatible)
async function generateFileHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function issuePdfVC(pdfHash, filename, applicantDid) {
  // Ask your server to create a short-lived partner token first (or reuse server-side SDK)
  const tokenRes = await fetch("/generate-moca-jwt", { method: "POST" });
  const { token } = await tokenRes.json();

  // Use process.env for environment variables (defined in vite.config.ts)
  const mocaApiBase = process.env.MOCA_API_BASE || "https://api.air.moca.network";
  const mocaIssuerDid = process.env.MOCA_ISSUER_DID;

  // Then call Moca/AIR issuance endpoint (example placeholder)
  const issuanceResp = await fetch(`${mocaApiBase}/credentials/issue`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      issuerDid: mocaIssuerDid,
      credentialTemplateId: "pdf-hash-credential-v1", // register template in Moca dashboard
      credentialSubject: {
        pdfHash,
        filename,
        applicantDid,
        issuedAt: new Date().toISOString(),
      },
    }),
  });

  if (!issuanceResp.ok) {
    const text = await issuanceResp.text();
    throw new Error(`Issuance failed: ${text}`);
  }
  const j = await issuanceResp.json();
  return j;
}

// Function to call AIR Verify API
async function callAirVerifyAPI(applicationId) {
  try {
    // Use process.env for environment variables (defined in vite.config.ts)
    const airVerifyApiUrl = process.env.AIR_VERIFY_API_URL;
    const airVerifyApiKey = process.env.AIR_VERIFY_API_KEY;

    if (!airVerifyApiUrl || !airVerifyApiKey) {
      throw new Error("AIR Verify API URL and Key must be set in environment variables");
    }

    const response = await fetch(`${airVerifyApiUrl}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${airVerifyApiKey}`,
      },
      body: JSON.stringify({ applicationId }),
    });

    if (!response.ok) {
      throw new Error(`Failed API call: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to verify applicant credentials", error);
    throw error;
  }
}

// Function to verify applicant credentials
async function verifyApplicantCredentials(applicationId) {
  try {
    const verificationResult = await callAirVerifyAPI(applicationId);
    console.log("Verification result", verificationResult);
    return verificationResult;
  } catch (error) {
    throw new Error("Verification failed: " + error.message);
  }
}

export { verifyApplicantCredentials, callAirVerifyAPI, issuePdfVC, generateFileHash };

