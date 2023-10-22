import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";
import authService from "../../services/auth.service";
import CandidateService from "../../services/candidate.service";
import Candidate from "../../interfaces/Candidate";
import "../../style/Candidate.css";

const CandidateTable: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [editCandidateId, setEditCandidateId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Candidate>({
    _id: "",
    name: "",
    status: "",
    feedback: "",
    rating: 0,
  });
  const [addFormData, setAddFormData] = useState<Candidate>({
    _id: "",
    name: "",
    status: "",
    feedback: "",
    rating: 0,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      window.location.href = "/";
    }
    const expiryDate = localStorage.getItem("expiryDate");

    if (new Date(expiryDate!) <= new Date()) {
      handleLogout();
      return;
    }
    const remainingMilliseconds =
      new Date(expiryDate!).getTime() - new Date().getTime();
    setAutoLogout(remainingMilliseconds);
    fetchCandidates();
  }, []);

  const fetchCandidates = () => {
    CandidateService.getCandidates()
      .then((data) => {
        setCandidates(data);
      })
      .catch((error) => {
        console.error("Failed to fetch candidates:", error);
      });
  };

  const handleAddFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddFormData({ ...addFormData, [name]: value });
  };

  const handleEditFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleAddFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    CandidateService.addCandidate(addFormData)
      .then((newCandidate) => {
        setCandidates([...candidates, newCandidate]);
        setAddFormData({
          _id: "",
          name: "",
          status: "",
          feedback: "",
          rating: 0,
        });
      })
      .catch((error) => {
        console.error("Failed to add a candidate:", error);
      });
  };

  const handleEditFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!editCandidateId) return;

    const editedCandidate = {
      ...editFormData,
      _id: editCandidateId,
    };

    CandidateService.updateCandidate(editCandidateId, editFormData)
      .then(() => {
        const updatedCandidates = candidates.map((candidate) =>
          candidate._id === editCandidateId ? editedCandidate : candidate
        );
        setCandidates(updatedCandidates);
        setEditCandidateId(null);
      })
      .catch((error) => {
        console.error("Failed to update a candidate:", error);
      });
  };

  const handleEditClick = (candidate: Candidate) => {
    setEditCandidateId(candidate._id);
    setEditFormData(candidate);
  };

  const handleCancelClick = () => {
    setEditCandidateId(null);
  };

  const handleDeleteClick = (candidateId: string) => {
    CandidateService.deleteCandidate(candidateId)
      .then(() => {
        const updatedCandidates = candidates.filter(
          (candidate) => candidate._id !== candidateId
        );
        setCandidates(updatedCandidates);
      })
      .catch((error) => {
        console.error("Failed to delete a candidate:", error);
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const setAutoLogout = (milliseconds: number) => {
    setTimeout(() => {
      handleLogout();
    }, milliseconds);
  };

  return (
    <div className="app-container">
      <button onClick={handleLogout}>Logout</button>
      {!candidates.length && <h1>No candidates added</h1>}
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Feedback</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <React.Fragment key={candidate._id}>
                {editCandidateId === candidate._id ? (
                  <EditableRow
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <ReadOnlyRow
                    candidate={candidate}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </form>

      <h2>Add a Candidate</h2>
      <form onSubmit={handleAddFormSubmit}>
        <input
          type="text"
          name="name"
          required
          placeholder="Candidate name"
          onChange={handleAddFormChange}
          value={addFormData.name}
        />
        <input
          type="text"
          name="status"
          required
          placeholder="Status"
          onChange={handleAddFormChange}
          value={addFormData.status}
        />
        <input
          type="text"
          name="feedback"
          placeholder="Feedback"
          onChange={handleAddFormChange}
          value={addFormData.feedback}
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          onChange={handleAddFormChange}
          value={addFormData.rating}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default CandidateTable;
