import { gql } from '@apollo/client';

// Login Mutation
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
        username
      }
    }
  }
`;

// Authenticated User Info
export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
    }
  }
`;

// Common Call Fields Fragment (Optional for reuse)
const CALL_FIELDS = gql`
  fragment CallFields on Call {
    id
    direction
    from
    to
    duration
    is_archived
    call_type
    via
    created_at
    notes {
      id
      content
    }
  }
`;

// Paginated Calls Query (used with pagination and filters)
export const GET_CALLS = gql`
  query GetCalls($offset: Float, $limit: Float) {
    paginatedCalls(offset: $offset, limit: $limit) {
      nodes {
        ...CallFields
      }
      totalCount
      hasNextPage
    }
  }
  ${CALL_FIELDS}
`;

// Get Call Detail by ID
export const CALL_DETAIL_QUERY = gql`
  query GetCall($id: Float!) {
    call(id: $id) {
      ...CallFields
    }
  }
  ${CALL_FIELDS}
`;

export const ARCHIVE_CALL = gql`
  mutation ArchiveCall($id: ID!) {
    archiveCall(id: $id) {
      id
      is_archived
    }
  }
`;

// Live Updates via Subscription
export const ON_UPDATE_CALL = gql`
  subscription OnUpdateCall($id: ID) {
    onUpdateCall(id: $id) {
      ...CallFields
    }
  }
  ${CALL_FIELDS}
`;

// Add Note to a Call (same as mutation)
export const ADD_NOTE = gql`
  mutation AddNote($input: AddNoteInput!) {
    addNote(input: $input) {
      id
      notes {
        id
        content
      }
    }
  }
`;
