import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "./middleware.js"
import bcrypt from "bcrypt";
import { createApolloFetch } from "apollo-fetch";


const router = express.Router();
const fetch = createApolloFetch({
    uri:'http://localhost:5000/graphql'
})



router.post('/join', isNotLoggedIn, async (req: Request, res: Response) => {

    const { email, nickname, password} = req.body;
    const hash = await bcrypt.hash(password, 12);
    try {
        fetch({
            query: `mutation CreateUser($email: String!,$nickname:String!, $password: String!) {
                        createUser(email:$email,nickname:$nickname, password: $password) {
                           _id
                           email
                           createdAt
                         }
                      }`,
            variables: {
                email: email,
                nickname: nickname,
                password: hash,
            }
        })
            .then((result) => {
                return res.redirect('/')
            })
    } catch (err) {
        res.redirect('error');
    }
          
});


router.post('/login', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?error=${info.message}`);
        }
        return req.login(user.data.getUser, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req,res,next);
});


router.get('/logout', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {

    req.logout((err) => {
        if (err) { return next(err); }
    })
    req.session.destroy((err) => {
        if (err) { return next(err); }
    })

    res.redirect('/')
});

router.post('/deleteaccount', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    try {
        fetch({
            query: ``,

        })
    } catch (err) {
        res.render('error')
    }
})

export default router;