import React, { useState, useEffect } from "react";
import "./../styles/DashBoardPage.css";

function DashboardPage() {
  const [role, setRole] = useState("");
  const [requests, setRequests] = useState([]);
  const [reason, setReason] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [decisionReasons, setDecisionReasons] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.user) {
      setRole(userData.user.role);
    }
  }, []);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const createBonusRequest = async () => {
    if (!reason || !title || !amount || !file) {
      setError("Please fill out all fields and attach a file.");
      return;
    }
    setError("");

    try {
      const formData = new FormData();
      formData.append("reason", reason);
      formData.append("title", title);
      formData.append("amount", amount);
      formData.append("userId", "676ab4236a70f674a70c7ac7");
      formData.append("file", file);

      const token = JSON.parse(localStorage.getItem("userData")).token;

      const response = await fetch(
        "https://finance-system.koyeb.app/api/bonus",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create bonus request.");
      }

      setSuccess("Bonus request created successfully!");
      setReason("");
      setTitle("");
      setAmount("");
      setFile(null);
    } catch (error) {
      console.error(error);
      setError("Error creating bonus request.");
    }
  };

  const fetchRequests = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userData")).token;

      const response = await fetch(
        "https://finance-system.koyeb.app/api/bonus/monthly?month=12&year=2024",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch requests.");
      }

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDecision = async (requestId, status) => {
    const reason = decisionReasons[requestId];
    if (!reason) {
      setError("Please provide a reason for approval/rejection.");
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("userData")).token;

      const response = await fetch(
        `https://finance-system.koyeb.app/api/bonus/${requestId}/approve-reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: status,
            reason: reason,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process the request.");
      }

      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: status } : req
        )
      );
      setDecisionReasons((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
      setSuccess(`Request ${status} successfully!`);
    } catch (error) {
      console.error(error.message);
      setError("Error processing the request.");
    }
  };

  useEffect(() => {
    if (role === "staff") {
      fetchRequests();
    }
  }, [role]);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {role === "manager" && (
        <div className="manager-section">
          <h2>Create Bonus Request</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="custom-file-upload-container">
            <label className="custom-file-upload">
              Upload File
              <input type="file" onChange={handleFileUpload} hidden />
            </label>
          </div>
          <div className="submit-request-container">
            <button onClick={createBonusRequest}>Submit Request</button>
          </div>
        </div>
      )}
      {role === "staff" && (
        <div className="staff-section">
          <h2>Bonus Requests</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          {requests.length > 0 ? (
            <ul>
              {requests.map((request) => (
                <li key={request._id}>
                  <p>
                    <strong>Title:</strong> {request.title}
                  </p>
                  <p>
                    <strong>Reason:</strong> {request.reason}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${request.amount}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </p>
                  {request.status === "pending" && (
                    <>
                      <input
                        type="text"
                        placeholder="Reason for decision"
                        value={decisionReasons[request._id] || ""}
                        onChange={(e) =>
                          setDecisionReasons((prev) => ({
                            ...prev,
                            [request._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        onClick={() => handleDecision(request._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(request._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No requests available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
