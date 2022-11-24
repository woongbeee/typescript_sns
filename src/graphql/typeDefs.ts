import { gql } from 'apollo-server-express';

const typeDefs = gql
   `type user {
      _id:ID
      nickname: String
      email: String
      password:String
      profile:String
      createdAt:String
      post:[post]
      follower:[user]
      following:[user]
    }

   input userInput {
      _id:ID
      nickname: String
      email: String
      password:String
      profile:String
      createdAt:String
      post:[ID]
      follower:[ID]
      following:[ID]
    }

   type post{
      _id:ID
      writer:user
      nickname:String
      comments:[comment]
      text:String!
      pictures:[String]     
      likes:[user]
      createdAt:String
     }

   input postInput{
      _id:ID
      writer:ID
      comments:[ID]
      text:String
      pictures:[String]
      likes:[ID]
      createdAt:String
     }

    type comment{
      _id:ID
      writer:user
      post:post     
      comment:String!
      createdAt:String
     }

    input commentInput{
      _id:ID
      writer:ID
      post:ID
      comment:String!
      createdAt:String
     }


   type Query {
       getUser(_id:ID,email:String,nickname:String):user
       getFollowing(_id:ID):[user]
       getFollower(_id:ID):[user]
       getPosts(_id:ID,writer:String): [post]
       getComments: [comment]
     }

   type Mutation {
       createUser(email:String!,nickname:String!,password:String!):user
       createPost(writer:userInput!,nickname:String!,text:String!, pictures:[String],comments:[commentInput],likes:[userInput]):post
       createComment(_id:ID,writer:userInput!,post:postInput,comment:String!):comment
       deleteUser(_id:ID!):user
       deletePost(_id:ID!):post
       deleteComment(_id:ID!):comment
       updateUser(_id:ID!,nickname:String,password:String, profile:String):user
       updatePassword(_id:ID!,password:String!):user
       updatePost(_id:ID!,text:String,pictures:[String]):post
       followUser(_id:ID!,following:ID!):user
       unfollowUser(_id:ID!,follower:ID!):user
       like(_id:ID!,likes:ID!):post
       unlike(_id:ID!,likes:ID!):post
    }  
`;


export default typeDefs;