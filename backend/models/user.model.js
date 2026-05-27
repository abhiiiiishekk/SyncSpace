import { model, Schema } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
  name: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    sentRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    receivedRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
}, {timestamps: true})

userSchema.pre("save", async function(){
  console.log("Inside save")
  if(this.isModified(this.password)) return 
  console.log("Inside save, after this isModified")
  this.password = await bcrypt.hash(this.password, 10)
  console.log("Inside save after hashed: ",this.password)
})

const User = model("User", userSchema)

export default User