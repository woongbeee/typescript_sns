import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./src/graphql/typeDefs.js"
import resolvers from "./src/graphql/resolver.js"
import morgan from "morgan";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import nunjucks from "nunjucks";
import passport from "passport";
import passportConfig from "./src/passport/index.js";
import connection from "./src/models/index.js";
import pageRouter from "./src/routes/page.js";
import authRouter from "./src/routes/auth.js";
import postRouter from "./src/routes/post.js";
import deleteRouter from "./src/routes/delete.js";
import userRouter from "./src/routes/user.js";


dotenv.config();


const app = express();
passportConfig();
connection();


app.set("view engine", "html");
nunjucks.configure('src/views', {
    express: app,
    watch: true,
});


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/src/styles')));
app.use('/img' ,express.static(path.join(__dirname, '/src/uploads')));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: `${process.env.COOKIE_SECRET}`,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());


const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
});


await apolloServer.start();


apolloServer.applyMiddleware({
    app,
    path: "/graphql",
});

interface Error {
    name: string;
    status?: number;
    message: string;
    code?: number;
};

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/delete', deleteRouter);
app.use('/user', userRouter);


app.use((req: Request, res: Response, next: NextFunction) => {
    const error:Error= new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});


app.use((err: Error, req: Request, res: Response) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});



app.listen(5000, () => {
    console.log("Connected!");
})