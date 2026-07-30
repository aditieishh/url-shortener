import mongoose  from "mongoose";

const URLSchema = new mongoose.Schema({
    originalURL : { type:String,required:true},
    shortId : { type:String,unique:true},
    clicks : {type:Number,default:0},
},{ timestamps: true });

export default mongoose.model("Url",URLSchema);