import express, { Request, Response, NextFunction } from "express";
import { isLoggedIn, isNotLoggedIn } from "./middleware.js"
import { createApolloFetch } from "apollo-fetch";



const router = express.Router();
const fetch = createApolloFetch({
    uri: 'http://localhost:5000/graphql'
})



router.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.user = req.user;
    next();
})

//모든 게시글 가져오기
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        fetch({
            query: `query GetPosts {
                      getPosts {
                        _id
                        writer{
                            _id
                            nickname
                            profile
                            following{_id}
                            follower{_id}
                               }
                        comments {
                          _id
                          writer {
                            _id
                            nickname
                             }
                              comment
                            }
                           text
                           pictures
                           likes {
                             _id
                             nickname
                             profile
                           }
                           createdAt
                         }
                        }`,
             })
            .then((result) => {
                result.data.getPosts.reverse();
                res.render('main', { title: 'sns', posts: result.data.getPosts})
            })

    } catch (err) {
        console.log(err);
        next(err);
    }
});

//특정 게시글 가져오기
router.get('/getpost', async (req: Request, res: Response) => {
    try {      
        fetch({
            query: `query GetPosts($id: ID) {
                          getPosts(_id: $id) {
                            pictures
                            text
                            likes {
                              _id
                            }
                            comments {
                              _id
                              comment
                              writer {
                                nickname
                              }
                            }
                          }
                        }`,
            variables: {
                id:req.query.id
            }
        })
            .then((result) => {
                res.send(result.data.getPosts[0]);
            })
    } catch (err) {
        console.log("post router", err)
    }
})


//사용자 피드 모아보기
router.get('/getfeed', async (req: Request, res: Response) => {
    try {
        fetch({
            query: `query GetPosts($writer: String) {
                          getPosts(writer: $writer) {
                            _id
                            pictures
                            writer{
                                _id
                                profile
                                nickname
                                post{_id}
                                follower{_id}
                                following{_id}
                              }
                             likes{_id}
                           }
                        }`,
            variables: {
                writer: req.query.id
            }
        })
            .then((result) => {
                res.render('feed', { title: "sns", feed:result.data.getPosts});
            })
    } catch (err) {
        console.log(err)
    }
})


//회원 가입 페이지 
router.get('/join', isNotLoggedIn, async (req: Request, res: Response) => {
    res.render('join');
});

//사용자 정보 페이지
router.get('/profile', isLoggedIn, async (req: Request, res: Response) => {
    res.render('profile');
});

//비밀번호 변경 && 회원탈퇴 페이지
router.get('/password', isLoggedIn, async (req: Request, res: Response) => {
    let { keyword } = req.query;
    if (keyword === 'change') {
        res.render('password', { keyword: 'change' });
    } else {
        res.render('password', { keyword: 'delete' });
    }
});

export default router;