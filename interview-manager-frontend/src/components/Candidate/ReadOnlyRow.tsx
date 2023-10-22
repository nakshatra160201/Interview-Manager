import React from "react";
import Candidate from "../../interfaces/Candidate";

interface ReadOnlyRowProps {
  candidate: Candidate;
  handleEditClick: (candidate: Candidate) => void;
  handleDeleteClick: (candidateId: string) => void;
}

const ReadOnlyRow: React.FC<ReadOnlyRowProps> = ({
  candidate,
  handleEditClick,
  handleDeleteClick,
}) => {
  return (
    <tr>
      <td>{candidate.name}</td>
      <td>{candidate.status}</td>
      <td>{candidate.feedback}</td>
      <td>{candidate.rating}</td>
      <td>
        <button type="button" onClick={(event) => handleEditClick(candidate)}>
          Edit
        </button>
        <button type="button" onClick={() => handleDeleteClick(candidate._id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;
