import { Request, Response } from "express"
import dotenv from "dotenv"

dotenv.config()
export const verify = async (req: Request, res: Response): Promise<any> => {
    const token = req.body.token;
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            secret: `${process.env.TURNSTILE_SECRET_KEY!}`,
            response: token!,
            remoteip: req.ip!,
        }),
    });

    const data = await response.json();
    if (data.success) {
        // Human verified
        res.json({success:true, message:"✅ Human verified"});
    } else {
        res.status(400).json({success:true, message:"❌ Verification failed"});
    }
}