import { InferSchemaType } from 'mongoose'
import pkg from 'mongoose';

const { Schema, model } = pkg;



const userSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    nickname: { type: String, required:true, unique:true},
    email: { type: String, required: true, unique:true},
    password: { type: String, required: true, trim: true },
    profile: { type: String, default: "https://thevoicefinder.com/wp-content/themes/the-voice-finder/images/default-img.png"},
    createdAt: { type: Date, default: Date.now },
    post: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    follower: [{ type: Schema.Types.ObjectId ,ref:'User'}],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

type User = InferSchemaType<typeof userSchema>;

const User = model<User>('User', userSchema);

export default User;
