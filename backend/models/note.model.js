import {Schema, model} from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["sticky", "todo", "text"],
      required: true,
      default: "text",
    },

    x: {
      type: Number,
      default: 0,
    },

    y: {
      type: Number,
      default: 0,
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
  },
  {
    timestamps: true,
  }
);

const Note = model("Note", noteSchema);

export default Note