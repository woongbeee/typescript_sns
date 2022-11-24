import { InferSchemaType, Types } from 'mongoose'
import pkg from 'mongoose';

const { Schema, model} = pkg;


const postSchema = new Schema({
    _id:Schema.Types.ObjectId,
    writer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    nickname: { type:String, ref:'User' },
    text:String,
    pictures:[String],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
})

type Post = InferSchemaType<typeof postSchema>;

const Post = model<Post>('Post', postSchema);

export default Post;