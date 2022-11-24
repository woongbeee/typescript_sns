import passport from "passport";
import User from "../models/user.js"
import local from './localStrategy.js';
import { createApolloFetch } from "apollo-fetch";

const fetch = createApolloFetch({
    uri: 'http://localhost:5000/graphql'
})

const serializeUser = () => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((id: User, done) => {
        fetch({
            query: `query GetUser($id: ID, $email: String, $nickname: String) {
                            getUser(_id: $id, email: $email, nickname: $nickname) {
                           _id
                           nickname
                           email
                           profile
                           post{_id}
                           follower{_id}
                           following{_id}
                           }
                         }`,
            variables: {
                email:id.email,
            },
        })
            .then((user) => {
                done(null, user.data.getUser);
            })
            .catch(error => done(error));

    });
     local();
};

export default serializeUser;