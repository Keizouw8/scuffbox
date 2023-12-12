import express, { Router } from "express";
import cors from "cors";

import index from "./index.js";
import join from "./join.js";
import game from "./game.js";

const router = Router();

router.use("/static", express.static("./static"));
router.use(cors());

router.get("/", index);
router.get("/join", join);
router.get("/game/:id", game);

export default router;