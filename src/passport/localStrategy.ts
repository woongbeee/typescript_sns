import passport from "passport";
import passportLocal  from "passport-local";
import bcrypt from "bcrypt";
import { createApolloFetch } from "apollo-fetch";



const LocalStrategy = passportLocal.Strategy;
const fetch = createApolloFetch({
    uri: 'http://localhost:5000/graphql'
})

const local=()=> {
    passport.use(new LocalStrategy ({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const user = await fetch({
                query: `query GetUser($id: ID, $email: String, $nickname: String) {
                            getUser(_id: $id, email: $email, nickname: $nickname) {
                                _id
                                nickname
                                password
                                email
                                profile
                                post{_id}
                                follower{_id}
                                following{_id}
                              }
                            }`,

                variables: { email: email },
            });

            if (user.data.getUser !== null) {
                  const hash = await bcrypt.compare(password, user.data.getUser.password);
                    if (hash) {
                         done(null, user);
                       } else {
                       done(null, false, { message: 'wrong password' });
                       }
               } else {
                    done(null, false, { message: 'not a member' })
               }
              
        } catch (error) {
            done(error);
        }
    }))
};

export default local;