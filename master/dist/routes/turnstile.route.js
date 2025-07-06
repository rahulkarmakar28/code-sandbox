"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const turnstile_controller_1 = require("../controllers/turnstile.controller");
const router = (0, express_1.Router)();
router.post("/", turnstile_controller_1.verify);
exports.default = router;
