import { InferSchemaType,Types } from 'mongoose'
import pkg from 'mongoose';

const { Schema, model } = pkg;


interface Comment {
    _id: Types.ObjectId,
    writer:Types.ObjectId,
    post: Types.ObjectId,
    comment: string,
    createdAt:Date,
}

const commentSchema = new Schema({
    _id:Schema.Types.ObjectId,
    writer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    post: { type: Schema.Types.ObjectId, required: true, ref: 'Post'},
    comment: { type: String, required:true },
    createdAt: { type: Date, default: Date.now }
})

//type Comment = InferSchemaType<typeof commentSchema>;
const Comment =model<Comment>('Comment', commentSchema);

export default Comment;