"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verify = async (req, res) => {
    const token = req.body["cf-turnstile-response"];
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            secret: `${process.env.TURNSTILE_SECRET_KEY}`,
            response: token,
            remoteip: req.ip,
        }),
    });
    const data = await response.json();
    if (data.success) {
        // Human verified
        res.send("✅ Human verified");
    }
    else {
        res.status(400).send("❌ Verification failed");
    }
};
exports.verify = verify;
