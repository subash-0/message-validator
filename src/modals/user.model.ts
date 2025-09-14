import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry:Date;
  isAcceptingMessage:boolean;
  messages: Message[];
}

const UserSchemas:Schema<User>  = new Schema({
  name:{
    type:String,
    required:[true,"Name is Required !"],
   
  },
  username:{
    type:String,
    required:[true,"Username is Required !"],
    unique:true,
    min:3,
    trim:true,
    lowercase:true
  },
  email:{
     type:String,
    required:[true,"Email is Required !"],
    unique:true,
    match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Please Enter a Valid Email !"],
    trim:true,
    lowercase:true
   
  },
  password:{
    type:String,
    required:[true,"Password is Required !"],
    min:[8,"Password must be of 8 characters"],
   
  },
  verifyCode:{
    type:String,
    required:[true,"Verify Code is Required !"],
    min:[6,"Verify Code must be of 6 characters"],
   
  },
  verifyCodeExpiry:{
    type:Date,
    required:[true,"Verify Code Expiry is Required !"],
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  isAcceptingMessage:{
    type:Boolean,
    default:true
  },
  messages: [MessageSchema],
});


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchemas);

export default UserModel;