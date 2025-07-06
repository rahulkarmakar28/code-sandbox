"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const run_controller_1 = require("../controllers/run.controller");
const router = (0, express_1.Router)();
router.post("/", run_controller_1.runCode);
exports.default = router;
