import { gql } from '@apollo/client';

export const CREATE_COLUMN = gql`
  mutation CreateColumn($title: String!) {
    createColumn(title: $title) {
      id
      title
    }
  }
`;

export const DELETE_COLUMN = gql`
  mutation DeleteColumn($id: ID!) {
    removeColumn(id: $id) {
      id
    }
  }
`;

export const UPDATE_COLUMN = gql`
  mutation UpdateColumn($id: ID!, $title: String!) {
    updateColumn(id: $id, title: $title) {
      id
      title
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($columnId: String!, $title: String!, $createdAt: Date!) {
    createTask(columnId: $columnId, title: $title, createdAt: $createdAt) {
      id
      columnId
      createdAt
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String!) {
    updateTask(id: $id, title: $title) {
      id
      title
      columnId
      createdAt
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    removeTask(id: $id) {
      id
    }
  }
`;
