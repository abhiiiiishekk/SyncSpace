import mongoose from "mongoose";

const dbConnection = async () =>{
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI)
    if(!connection){
      console.log("can't connect with db")
      process.exit(1)
    }
  } catch (error) {
    console.log("Error in db connection: "+error)
    process.exit(1)
  }
}

export default dbConnection