import express, { Request, Response, NextFunction } from "express";
import { isLoggedIn, isNotLoggedIn } from "./middleware.js"
import { createApolloFetch } from "apollo-fetch";

const router = express.Router();
const fetch = createApolloFetch({
    uri: 'http://localhost:5000/graphql'
})


router.post("/post", isLoggedIn, async (req: Request, res: Response) => {
    try {
        fetch({
            query: `mutation DeletePost($_id: ID!) {
                               deletePost(_id: $_id) {
                                 _id
                               }
                             }`,
            variables: {
                _id: req.body.postId,
            }
        })
            .then(() => {
                res.redirect('/');
            })
    } catch (err) {
        console.log("Post has not deleted, please try again");
    }
});

router.post("/comment", isLoggedIn, async (req: Request, res: Response) => {

    try {
        fetch({
            query: `mutation DeleteComment($_id: ID!) {
                               deleteComment(_id: $_id) {
                                 _id
                               }
                             }`,
            variables: {
                _id: req.body.commentId,
            }
        })
            .then((result) => {
                console.log("delete", result);
                res.redirect('/');
            })

    } catch (err) {
        console.log("Comment has not deleted, please try again");
    }
});

export default router;