import express from "express";
import { ethers } from "ethers";

const router = express.Router();

const privateKey = process.env.OWNER_PRIVATE_KEY;
let wallet = null;

// Only create wallet if private key is valid
if (privateKey && privateKey.length > 0 && privateKey !== 'your-private-key') {
  try {
    wallet = new ethers.Wallet(privateKey);
  } catch (error) {
    console.warn('Invalid private key provided, mint functionality disabled:', error.message);
  }
}

router.post("/mint-signature", async (req, res) => {
  try {
    const { address, metadata } = req.body;

    if (!address || !metadata) {
      return res.status(400).json({ error: "Missing address or metadata" });
    }

    if (!wallet) {
      return res.status(503).json({ 
        error: "Mint functionality not available", 
        message: "Private key not configured or invalid" 
      });
    }

    const message = ethers.solidityPackedKeccak256(
      ["address", "string"],
      [address, JSON.stringify(metadata)]
    );
    const signature = await wallet.signMessage(ethers.getBytes(message));

    res.json({ signature });
  } catch (error) {
    console.error("Mint signature error:", error);
    res.status(500).json({ error: "Failed to generate signature" });
  }
});

export default router;
