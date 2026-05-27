import { Router } from "express";
import { verifyJWTToken } from "../middlewares/auth.middleware.js";
import { createNoteController, getWorkspaceNotesController } from "../controllers/note.controller.js";

const noteRouter = Router();

noteRouter.route("/createnote").post(verifyJWTToken, createNoteController)
noteRouter.route("/allnote/:workspaceId").get(verifyJWTToken, getWorkspaceNotesController)

export default noteRouter;