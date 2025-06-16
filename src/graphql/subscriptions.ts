import { gql } from '@apollo/client';

export const ON_UPDATE_CALL_SUBSCRIPTION = gql`
  subscription OnUpdateCall($id: ID) {
    onUpdateCall(id: $id) {
      id
      is_archived
      notes {
        id
        content
      }
    }
  }
`;