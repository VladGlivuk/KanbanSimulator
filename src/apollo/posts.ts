import {gql} from "@apollo/client";

export const ALL_POSTS = gql`
    query AllPosts {
      allPosts {
        id
        views
        title
      }
    }
`
