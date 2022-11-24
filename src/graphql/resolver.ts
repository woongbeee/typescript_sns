import User from "../models/user.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import Schema from 'mongoose';


const resolvers = {
    user: {
        following: async ({ following }: any) => {
            return await User.find({ _id: { $in: following } });
        },

        follower: async ({ follower }: any) => {
            return await User.find<User>({ _id: { $in: follower } });
        }
    },
    post: {
        comments: async ({ comments }: any) => {
            return await Comment.find({ _id: { $in: comments } }).populate('writer');
        },
        writer: async (writer: any) => {
                return await User.findById({ _id: writer.writer});
        },
        likes: async ({ likes }: any) => {
            return await User.find({ _id: { $in: likes } });
        }
    },
    Query: {
        getUser: async (_: any, args: User) => {
            if (args._id) {
                let user = await User.findById<User>(args._id).exec();
                return user;
            } else if (args.email) {
                let user = await User.findOne<User>({
                    email: args.email
                }).exec();
                return user;
            } else {
                let user = await User.findOne<User>({
                    nickname: args.nickname
                }).exec();
                return user;
            }
        },

        getFollowing: async (_:any, args:User) => {
            const user = await User.findById(args._id).exec();
            if (user !== null) {
                return await User.find({ _id: { $in: user.following } }).exec();
            }          
        },

        getFollower: async (_:any, args:User) => {
            const user = await User.findById(args._id).exec();
            if (user !== null) {
                return await User.find({ _id: { $in: user.follower } }).exec();
            }
        },

        getPosts: async (_: any, args: Post) => {
            if (args._id) {
                const result = await Post.findById<Post>(args._id);
                return [result];
            } else if (args.writer) {
                const result = await Post.find<Post>({
                    writer:args.writer
                });
                return result;
            } else {
                return await Post.find({});
            }
        },

        getComments: async () => {
            const comments = await Comment.find({});
            return comments;
        }
    },

    Mutation: {
        createUser: async (_: any, args: User) => {
            const { email, password, nickname } = args;
            const newUser = new User({
                _id: new Schema.Types.ObjectId(),
                email: email,
                nickname:nickname,
                password: password,
            })
            await newUser.save();
            return newUser;
        },

        createPost: async (_: any, args: Post) => {
            const { writer, nickname, text, pictures }: any = args;
            const targetWriter = await User.findById(writer);
            const newPost = new Post({
                _id: new Schema.Types.ObjectId(),
                writer: writer._id as User,
                nickname: nickname,
                text: text,
                pictures: pictures,
            })           
            await newPost.save();
            if (targetWriter !== null && newPost !== null) {
                await targetWriter.post.push(newPost.id);
                await targetWriter.save();
            } else {
                console.log('Post has not saved, try again');
            }
            return newPost;
        },

        createComment: async (_: any, args: Comment) => {
            const { writer, post, comment }: any = args;
            const targetPost = await Post.findById(post);
            const newComment = await new Comment({
                _id: new Schema.Types.ObjectId(),
                writer: writer._id as User,
                post: post._id as Post,
                comment: comment,
            });
            await newComment.save();
            if (targetPost !== null && newComment !== null) {
                await targetPost.comments?.push(newComment.id);
                await targetPost.save();

                return newComment;
            } else {
                console.log("Failed to save comments")
            }
        },

        deleteUser: async (_: any, args: User) => {
            const deletedUser = await User.findByIdAndDelete(args._id);
                                await Post.deleteMany({ writer: args._id });
                                await Comment.deleteMany({ writer: args._id });
            return deletedUser;
        },

        deletePost: async (_: any, args: Post) => {
            const deletedPost = await Post.findByIdAndDelete(args._id);
                                await Comment.deleteMany({ post: args._id });        
            if (deletedPost !== null) {               
                await User.findByIdAndUpdate(deletedPost.writer, { $pull: { post: deletedPost.id } });

                return deletedPost;
            }
        },

        deleteComment: async (_: any, args: Comment) => {
            const deletedComment = await Comment.findByIdAndDelete(args._id);
            if (deletedComment !== null) {
                await Post.findByIdAndUpdate(deletedComment.post, { $pull: {comments:deletedComment.id}});
                return deletedComment;
            }
        },

        updateUser: async (_: any, args: User) => {
            const targetUser = await User.findByIdAndUpdate(args._id, { nickname: args.nickname, profile: args.profile });
            if (targetUser!) {
                return null
            } else {
                const result = await User.findById(args._id);
                return result;
            }
                
        },

        updatePassword: async (_: any, args: User) => {
            const targetUser = await User.findByIdAndUpdate(args._id, { password: args.password });
            return targetUser;          
        },

        updatePost: async (_: any, args: Post) => {
            const targetPost = await Post.findByIdAndUpdate(args._id, { text: args.text, pictures: args.pictures });
            return targetPost;
        },

        followUser: async (_: any, args: User) => {
            const user = await User.findById(args._id);
            const target = await User.findById(args.following);

            if (user !== null && target !== null) {
                await user.following.push(target.id);
                await user.save();
                await target.follower.push(user.id);
                await target.save();
            }
            return target;
        },

        unfollowUser: async (_: any, args: User) => {
            const user = await User.findByIdAndUpdate(args._id, { $pull: { following: args.follower } });
            const target = await User.findByIdAndUpdate(args.follower, { $pull: { follower: args._id } });
            if (user !== null && target !== null) {
                await user.save();
                await target.save();
            }
             return target;
        },

        like: async (_: any, args: Post) => {
            const post = await Post.findByIdAndUpdate(args._id, { $push: { likes: args.likes } }).exec();
            if (post) {
                await post.save();
            }
            return post;

        },

        unlike: async (_: any, args: Post) => {
            const post = await Post.findByIdAndUpdate(args._id, { $pull: { likes: args.likes } }).exec();
            if (post) {
                await post.save();
            }
            return post;
        },
    },
    
               
}

export default resolvers;