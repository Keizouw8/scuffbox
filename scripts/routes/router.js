import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";

import setNonce from "../middleware/setNonce.js";
import csp from "../middleware/csp.js";

import index from "./index.js";

const router = Router();

router.use("/static", express.static("./static"));
// router.use(helmet());
router.use(cors());
// router.use(csp);
// router.use(setNonce);

router.get("/", index);

export default router;