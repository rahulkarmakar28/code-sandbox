"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCode = void 0;
const index_1 = require("../index");
const supported_languages = ["c", "cpp", "java", "python", "javascript", "typescript", "go", "rust"];
const runCode = async (req, res) => {
    try {
        const { code, language, roomID } = req.body;
        if (!supported_languages.includes(language))
            return res.status(400).json({ error: "Unsupported language" });
        index_1.redisClient.lPush("submission", JSON.stringify({ code, language, roomID }));
        return res.status(201).json({
            success: true, message: "submission received"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false, message: error.message
        });
    }
};
exports.runCode = runCode;
