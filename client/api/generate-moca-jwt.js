// api/generate-moca-jwt.js
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const partnerId = process.env.MOCA_PARTNER_ID;
  const privateKey = process.env.MOCA_PRIVATE_KEY;
  if (!partnerId || !privateKey) return res.status(500).json({ error: "Server misconfigured" });

  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: partnerId, iat: now, exp: now + 300 }; // 5 mins
  try {
    const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Sign failed" });
  }
}
