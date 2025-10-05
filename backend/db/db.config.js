const mongoose=require("mongoose")
const config=async(url)=>{
   try {
      await mongoose.connect(url)
      return console.log("Connected to MongoDB"); 
   } catch (error) {
      return console.log("Error Occured in connecting mongodb: "+error)
   }
}
module.exports=config