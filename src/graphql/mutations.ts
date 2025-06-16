import { gql } from '@apollo/client';

// Refresh the access token (used for handling expired sessions)
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshToken {
      access_token
      user {
        id
        username
      }
    }
  }
`;

// Archive a call (toggle is_archived flag)
export const ARCHIVE_CALL_MUTATION = gql`
  mutation ArchiveCall($id: ID!) {
    archiveCall(id: $id) {
      id
      is_archived
    }
  }
`;

// Add a note to a call
export const ADD_NOTE_MUTATION = gql`
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
