import { Router } from "express";
import { createWorkspaceController, getUserWorkspacesController, inviteFriendToWorkspaceController } from "../controllers/workspace.controller.js";
import { verifyJWTToken } from "../middlewares/auth.middleware.js";

const workspaceRouter = Router();

workspaceRouter.route("/create").post(verifyJWTToken, createWorkspaceController);
workspaceRouter.route("/getworkspace").get(verifyJWTToken, getUserWorkspacesController);
workspaceRouter.route("/invite/:friendToInvite").post(verifyJWTToken, inviteFriendToWorkspaceController);

export default workspaceRouter