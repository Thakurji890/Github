import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Chip, TextField, IconButton,
  CircularProgress, Divider, Tooltip,
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CloseIcon from "@mui/icons-material/Close";
import { issueAPI } from "../../api/api";

const IssueList = ({ repoId, onIssueChange }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("open");
  const [error, setError] = useState("");

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await issueAPI.getAll();
      // Filter issues by repoId since backend returns all issues
      const filtered = (res.data || []).filter(
        (issue) => issue.repository === repoId || issue.repository?._id === repoId
      );
      setIssues(filtered);
      onIssueChange && onIssueChange(filtered);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (repoId) fetchIssues();
  }, [repoId]);

  const handleCreate = async () => {
    if (!title.trim()) { setError("Title is required."); return; }
    if (!description.trim()) { setError("Description is required."); return; }
    setError("");
    setCreating(true);
    try {
      await issueAPI.create({ title: title.trim(), description: description.trim(), repository: repoId });
      setTitle(""); setDescription(""); setShowForm(false);
      fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create issue.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (issue) => {
    try {
      const newStatus = issue.status === "open" ? "closed" : "open";
      await issueAPI.update(issue._id, {
        title: issue.title,
        description: issue.description,
        status: newStatus,
      });
      fetchIssues();
    } catch (err) {
      console.error("Failed to update issue:", err);
    }
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm("Delete this issue?")) return;
    try {
      await issueAPI.delete(issueId);
      fetchIssues();
    } catch (err) {
      console.error("Failed to delete issue:", err);
    }
  };

  const displayedIssues = issues.filter((i) => i.status === filterStatus);

  return (
    <Box>
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {["open", "closed"].map((status) => (
            <Button
              key={status}
              size="small"
              onClick={() => setFilterStatus(status)}
              startIcon={status === "open" ? <RadioButtonUncheckedIcon /> : <CheckCircleOutlineIcon />}
              sx={{
                color: filterStatus === status ? "#e6edf3" : "#8b949e",
                fontWeight: filterStatus === status ? 700 : 400,
                fontSize: 13, textTransform: "none",
                borderBottom: filterStatus === status ? "2px solid #f78166" : "none",
                borderRadius: 0, pb: 0.5,
                "&:hover": { color: "#e6edf3", bgcolor: "transparent" },
              }}
            >
              {status === "open"
                ? `${issues.filter((i) => i.status === "open").length} Open`
                : `${issues.filter((i) => i.status === "closed").length} Closed`}
            </Button>
          ))}
        </Box>
        <Button
          variant="contained" size="small"
          startIcon={<AddIcon />}
          onClick={() => setShowForm((v) => !v)}
          sx={{ bgcolor: "#238636", color: "#fff", "&:hover": { bgcolor: "#2ea043" } }}
        >
          New issue
        </Button>
      </Box>

      {/* Create Issue Form */}
      {showForm && (
        <Box sx={{ border: "1px solid #30363d", borderRadius: 2, p: 2.5, mb: 2.5, bgcolor: "#161b22" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 14 }}>New Issue</Typography>
            <IconButton size="small" onClick={() => setShowForm(false)} sx={{ color: "#8b949e" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          {error && <Typography sx={{ color: "#f85149", fontSize: 12, mb: 1 }}>{error}</Typography>}
          <TextField
            fullWidth size="small" placeholder="Issue title" value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#0d1117", borderRadius: 1,
                "& fieldset": { borderColor: "#30363d" },
                "&:hover fieldset": { borderColor: "#58a6ff" },
              },
            }}
          />
          <TextField
            fullWidth size="small" multiline rows={3}
            placeholder="Describe the issue..."
            value={description} onChange={(e) => setDescription(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#0d1117", borderRadius: 1,
                "& fieldset": { borderColor: "#30363d" },
                "&:hover fieldset": { borderColor: "#58a6ff" },
              },
            }}
          />
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button size="small" onClick={() => setShowForm(false)}
              sx={{ borderColor: "#30363d", color: "#e6edf3", border: "1px solid #30363d", "&:hover": { bgcolor: "#21262d" } }}>
              Cancel
            </Button>
            <Button size="small" variant="contained" onClick={handleCreate} disabled={creating}
              sx={{ bgcolor: "#238636", "&:hover": { bgcolor: "#2ea043" } }}>
              {creating ? <CircularProgress size={14} color="inherit" /> : "Submit issue"}
            </Button>
          </Box>
        </Box>
      )}

      {/* Issue List */}
      <Box sx={{ border: "1px solid #30363d", borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#58a6ff" }} size={24} />
          </Box>
        ) : displayedIssues.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <BugReportIcon sx={{ fontSize: 40, color: "#30363d", mb: 1 }} />
            <Typography sx={{ color: "#8b949e" }}>
              No {filterStatus} issues found.
            </Typography>
          </Box>
        ) : (
          displayedIssues.map((issue, idx) => (
            <Box
              key={issue._id}
              sx={{
                px: 3, py: 2,
                borderBottom: idx < displayedIssues.length - 1 ? "1px solid #21262d" : "none",
                display: "flex", alignItems: "flex-start", gap: 2,
                "&:hover": { bgcolor: "#21262d" },
              }}
            >
              {/* Status Toggle */}
              <Tooltip title={issue.status === "open" ? "Close issue" : "Reopen issue"}>
                <IconButton size="small" onClick={() => handleToggleStatus(issue)} sx={{ mt: 0.3, p: 0 }}>
                  {issue.status === "open" ? (
                    <RadioButtonUncheckedIcon sx={{ color: "#3fb950", fontSize: 18 }} />
                  ) : (
                    <CheckCircleOutlineIcon sx={{ color: "#8b949e", fontSize: 18 }} />
                  )}
                </IconButton>
              </Tooltip>

              {/* Issue Content */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
                  <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 14 }}>
                    {issue.title}
                  </Typography>
                  <Chip
                    label={issue.status}
                    size="small"
                    sx={{
                      height: 18, fontSize: 10,
                      bgcolor: issue.status === "open" ? "#238636" : "#21262d",
                      color: issue.status === "open" ? "#fff" : "#8b949e",
                      border: issue.status === "closed" ? "1px solid #30363d" : "none",
                    }}
                  />
                </Box>
                <Typography sx={{ color: "#8b949e", fontSize: 12, lineHeight: 1.5 }}>
                  {issue.description}
                </Typography>
              </Box>

              {/* Delete */}
              <Tooltip title="Delete issue">
                <IconButton size="small" onClick={() => handleDelete(issue._id)}
                  sx={{ color: "#8b949e", "&:hover": { color: "#f85149" } }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default IssueList;
