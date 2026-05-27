import ApiError from "../config/ApiError.js";
import ApiResponse from "../config/ApiResponse.js";
import Workspace from "../models/workspace.model.js";

const createWorkspaceController = async (req, res) => {
  /**
   * extract data from currently logged in user
   * take workspace name and description from user
   * validate data
   * create workspace with current logged in user
   * add other users (if applicable)
   * return success message
   */
  try {
    const { _id } = req.user; // current logged in user
    const { name, description } = req.body;

    if (!name) throw new ApiError(404, "All fields are required");

    const workspace = await Workspace.create({
      name,
      description,
      owner: _id,
    });

    if (!workspace) throw new ApiError(500, "Error while creating workspace");

    return res
      .status(201)
      .json(new ApiResponse(201, "Workspace created", workspace));
  } catch (error) {
    throw new ApiError(500, `Something went wrong ${error}`);
  }
};

const getUserWorkspacesController = async (req, res) => {
  /**
   * extract id from currently logged in user
   * find workspaces related to the user
   * if any return success message
   */
  try {
    const owner = req.user._id; // current logged in user

    const specificWorkspace = await Workspace.find({ /* .find() return an array */
    $or: [
      { owner},
      { members: owner }
    ]
  });

    if (specificWorkspace.length === 0)
      throw new ApiError(500, "Error while creating workspace");

    return res
      .status(200)
      .json(new ApiResponse(200, "Founded Workspace", specificWorkspace));
    } catch (error) {
      throw new ApiError(500, `Something went wrong while finding workspaces ${error}`);
    }
  };
  
  const inviteFriendToWorkspaceController = async (req, res) =>{
    /**
     * takes reference of the current workspace from body
     * member id's to include in the workspace from params
     * validate member and workspace
     * check if member is alreay a friend of logged in user or not
     * if not fails everything
     * if yes, return response
    */
   try {
     const {_id, friends} = req.user;
     const {friendToInvite} = req.params;
     const {workspaceId} = req.body;
     
     if(!friendToInvite || !workspaceId) throw new ApiError(404, "All fields are required");
     
     const workspace = await Workspace.findById(workspaceId)
     
     // checks whether the logged in user and query parameter is same or not to prevent from owner to join his own workspace
     if(_id.toString() === friendToInvite) throw new ApiError(403, "owner is already is joined");
     
     // checks whether the inviting friend is an exisitng friend of logged in user or not
     if(!(friends.includes(friendToInvite))) throw new ApiError(403, "id is not in the friendlist");
     
     // checks whether the workspace owner is owned by logged in user or not
     if(!(workspace.owner.toString() === _id.toString())) throw new ApiError(403, "can't find workspace");
     
     // checks whether the friend is not already a member of the workspace
     if(workspace.members.includes(friendToInvite)) throw new ApiError(403, "already a member of the workspace");
     
     
     const workspaceUpdate = await Workspace.findByIdAndUpdate(workspaceId, {
       $push: {
         members: friendToInvite
        }
      })
      
   if(!workspaceUpdate) throw new ApiError(500, "can't update the workspace");
   
   return res
   .status(200)
   .json(new ApiResponse(200, "Member Added", workspaceUpdate));
  } catch (error) {
    throw new ApiError(500, `Something went wrong while adding member inside workspace ${error}`);
  }
}

export { createWorkspaceController, getUserWorkspacesController, inviteFriendToWorkspaceController };
