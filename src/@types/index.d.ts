import User from "../models/user.js";
import Post from "../models/post.js";
import { Request } from 'express';

export { };

declare module 'express-serve-static-core' {
        export interface Request {
            user:User;
        }  
}


