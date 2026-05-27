import { workerData } from "node:worker_threads";
import ApiError from "../config/ApiError.js";
import ApiResponse from "../config/ApiResponse.js";
import Note from "../models/note.model.js";
import Workspace from "../models/workspace.model.js";

const createNoteController = async (req, res) => {
  /**
   * input should look like:
    {
      "title": "Reminder",
      "content": "Finish backend",
      "type": "sticky",
      "x": 100,
      "y": 200,
      "workspaceId": "..."
    }
    * take all data as input
    * validate
    * save it in the database 
   */

  try {
    const { input, title, content, type, x, y, workspaceId } = req.body;
    const { _id } = req.user;

    if (!input || !title || !content || !type || !x || !y || !workspaceId)
      throw new ApiError(404, "All the fields are required");

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new ApiError(500, "Can't fetch workspace details");
    console.log(workspace.members);
    console.log(workspace.owner);
    console.log(workspace.members.includes(_id.toString()));
    console.log(workspace.owner.toString() === _id.toString());
    if (
      workspace.members.includes(_id.toString()) &&
      workspace.owner.toString() === _id.toString()
    )
      throw new ApiError(404, "Outside member can't do anything");

    const note = await Note.create({
      title,
      content,
      type,
      x,
      y,
      workspace: workspace._id,
      createdBy: _id,
    });

    if (!note) throw new ApiError(500, "Can't create notes");

    return res.status(201).json(new ApiResponse(201, "Note Created", note));
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while creating note: ${error}`,
    );
  }
};

const getWorkspaceNotesController = async (req, res) => {
  const { workspaceId } = req.params;

  if (!workspaceId) throw new ApiError(404, "Workspace id is required");

  const allWorkSpace = await Note.find({ workspace: workspaceId });
  if (allWorkSpace.length <= 0)
    throw new ApiError(500, "Not found any workspace");

  return res
    .status(200)
    .json(new ApiResponse(200, "All Workspace details", allWorkSpace));
};

export { createNoteController, getWorkspaceNotesController };
