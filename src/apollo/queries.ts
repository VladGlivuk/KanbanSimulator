import {gql} from "@apollo/client";

export const ALL_Columns = gql`
    query AllColumns {
      allColumns {
        id
        title
      }
    }
`

export const ALL_Tasks = gql`
    query AllTasks {
      allTasks {
        id
        title
        columnId
        createdAt
      }
    }
`
