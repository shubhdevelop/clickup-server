import { Router } from "express";
import {
  createDoc,
  getUserDocs,
  deleteDoc,
  updateDocSetting,
} from "../controllers/docs.controller.js";

const router = Router();

router.route("/:userId").get(getUserDocs);
// router.route("/:userId?filter")
router.route("/new").post(createDoc);
router.route("/delete").delete(deleteDoc);
router.route("/").patch(updateDocSetting);

export default router;
