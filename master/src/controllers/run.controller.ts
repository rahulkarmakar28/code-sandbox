import { Request, Response } from "express"
import { redisClient } from "../index"


const supported_languages = ["c", "cpp", "java", "python", "javascript", "typescript", "go", "rust"]

export const runCode = async (req: Request, res: Response): Promise<any> => {
    try {
        const { code, language, roomID } = req.body;

        if (!supported_languages.includes(language)) return res.status(400).json({ error: "Unsupported language" });

        redisClient.lPush("submission", JSON.stringify({ code, language, roomID }))

        return res.status(201).json({
            success: true, message: "submission received"
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false, message: error.message
        })
    }
};
