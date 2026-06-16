import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Chip, Divider, TextField,
  IconButton, CircularProgress, Tooltip, Avatar, Paper,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GitHubIcon from "@mui/icons-material/GitHub";
import BookIcon from "@mui/icons-material/Book";
import LockIcon from "@mui/icons-material/Lock";
import BugReportIcon from "@mui/icons-material/BugReport";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { repoAPI, issueAPI } from "../../api/api";
import IssueList from "../issue/IssueList";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0d1117", paper: "#161b22" },
    primary: { main: "#58a6ff" },
    success: { main: "#3fb950" },
    error: { main: "#f85149" },
    text: { primary: "#e6edf3", secondary: "#8b949e" },
    divider: "#30363d",
  },
  typography: { fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`, fontSize: 13 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 500, borderRadius: 6 } } },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6, fontSize: 13, backgroundColor: "#0d1117",
            "& fieldset": { borderColor: "#30363d" },
            "&:hover fieldset": { borderColor: "#58a6ff" },
          },
        },
      },
    },
  },
});

const RepoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("code");

  // Edit description state
  const [editingDesc, setEditingDesc] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [savingDesc, setSavingDesc] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        setLoading(true);
        const res = await repoAPI.getById(id);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setRepo(data);
        setNewDesc(data?.description || "");
      } catch (err) {
        console.error("Failed to fetch repo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [id]);

  const handleToggleVisibility = async () => {
    setToggling(true);
    try {
      const res = await repoAPI.toggleVisibility(id);
      setRepo(res.data.repository);
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    } finally {
      setToggling(false);
    }
  };

  const handleUpdateDescription = async () => {
    setSavingDesc(true);
    try {
      await repoAPI.update(id, { description: newDesc, content: repo?.content || [] });
      setRepo((prev) => ({ ...prev, description: newDesc }));
      setEditingDesc(false);
    } catch (err) {
      console.error("Failed to update description:", err);
    } finally {
      setSavingDesc(false);
    }
  };

  const handleDeleteRepo = async () => {
    if (!window.confirm(`Are you sure you want to delete "${repo?.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await repoAPI.delete(id);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete repo:", err);
      setDeleting(false);
    }
  };

  if (loading) return (
    <ThemeProvider theme={darkTheme}><CssBaseline />
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#0d1117" }}>
        <CircularProgress sx={{ color: "#58a6ff" }} />
      </Box>
    </ThemeProvider>
  );

  if (!repo) return (
    <ThemeProvider theme={darkTheme}><CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#0d1117" }}>
        <Typography sx={{ color: "#8b949e", mb: 2 }}>Repository not found.</Typography>
        <Button onClick={() => navigate("/")} startIcon={<ArrowBackIcon />} sx={{ color: "#58a6ff" }}>Back to Dashboard</Button>
      </Box>
    </ThemeProvider>
  );

  const tabs = [
    { key: "code", label: "Code" },
    { key: "issues", label: `Issues (${repo.issues?.length ?? 0})` },
    { key: "settings", label: "Settings" },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* Top Nav */}
      <Box sx={{ bgcolor: "#161b22", borderBottom: "1px solid #30363d", px: 4, py: 1, display: "flex", alignItems: "center", gap: 2, position: "sticky", top: 0, zIndex: 100 }}>
        <GitHubIcon sx={{ fontSize: 28, color: "#e6edf3" }} />
        <Button size="small" startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}
          sx={{ color: "#8b949e", "&:hover": { color: "#58a6ff" } }}>
          Dashboard
        </Button>
      </Box>

      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, pt: 3, pb: 6 }}>

        {/* Repo Header */}
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {repo.visibility ? <BookIcon sx={{ color: "#8b949e" }} /> : <LockIcon sx={{ color: "#8b949e" }} />}
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#58a6ff" }}>{repo.name}</Typography>
            <Chip
              label={repo.visibility ? "Public" : "Private"}
              size="small"
              sx={{ bgcolor: "transparent", border: "1px solid #30363d", color: "#8b949e", fontSize: 11 }}
            />
          </Box>

          {/* Header Actions */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title={repo.visibility ? "Make Private" : "Make Public"}>
              <Button
                variant="outlined" size="small" onClick={handleToggleVisibility}
                disabled={toggling}
                startIcon={repo.visibility ? <VisibilityOffIcon /> : <VisibilityIcon />}
                sx={{ borderColor: "#30363d", color: "#e6edf3", "&:hover": { borderColor: "#8b949e", bgcolor: "#21262d" } }}
              >
                {toggling ? <CircularProgress size={14} /> : (repo.visibility ? "Make private" : "Make public")}
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Owner */}
        {repo.owner && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Avatar sx={{ width: 18, height: 18, bgcolor: "#238636", fontSize: 10 }}>
              {(repo.owner?.username || "U")[0].toUpperCase()}
            </Avatar>
            <Typography sx={{ color: "#8b949e", fontSize: 13 }}>
              {repo.owner?.username || "Unknown"} / <Box component="span" sx={{ color: "#e6edf3", fontWeight: 600 }}>{repo.name}</Box>
            </Typography>
          </Box>
        )}

        {/* Description */}
        <Box sx={{ mb: 2 }}>
          {editingDesc ? (
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <TextField
                fullWidth size="small" multiline rows={2}
                value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Add a description..."
              />
              <Tooltip title="Save">
                <IconButton size="small" onClick={handleUpdateDescription} disabled={savingDesc}
                  sx={{ color: "#3fb950", border: "1px solid #30363d", borderRadius: 1 }}>
                  {savingDesc ? <CircularProgress size={16} /> : <CheckIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton size="small" onClick={() => { setEditingDesc(false); setNewDesc(repo.description || ""); }}
                  sx={{ color: "#f85149", border: "1px solid #30363d", borderRadius: 1 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ color: "#8b949e", fontSize: 14 }}>
                {repo.description || <Box component="span" sx={{ fontStyle: "italic" }}>No description provided.</Box>}
              </Typography>
              <Tooltip title="Edit description">
                <IconButton size="small" onClick={() => setEditingDesc(true)} sx={{ color: "#8b949e" }}>
                  <EditIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Tabs */}
        <Box sx={{ display: "flex", borderBottom: "1px solid #30363d", mb: 3, gap: 0 }}>
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              sx={{
                color: activeTab === tab.key ? "#e6edf3" : "#8b949e",
                borderBottom: activeTab === tab.key ? "2px solid #f78166" : "2px solid transparent",
                borderRadius: 0, px: 2, pb: 1.2, fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400,
                "&:hover": { color: "#e6edf3", bgcolor: "transparent" },
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {/* ── CODE TAB ── */}
        {activeTab === "code" && (
          <Box>
            <Paper sx={{ bgcolor: "#161b22", border: "1px solid #30363d", borderRadius: 2, overflow: "hidden" }}>
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #30363d", bgcolor: "#21262d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 13 }}>Files</Typography>
                <Typography sx={{ color: "#8b949e", fontSize: 12 }}>{repo.content?.length ?? 0} items</Typography>
              </Box>
              {repo.content?.length > 0 ? (
                repo.content.map((item, idx) => (
                  <Box key={idx} sx={{
                    px: 2, py: 1.2, borderBottom: idx < repo.content.length - 1 ? "1px solid #21262d" : "none",
                    display: "flex", alignItems: "center", gap: 1.5,
                    "&:hover": { bgcolor: "#21262d" }, cursor: "pointer",
                  }}>
                    <BookIcon sx={{ fontSize: 14, color: "#8b949e" }} />
                    <Typography sx={{ color: "#58a6ff", fontSize: 13 }}>{item}</Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <BookIcon sx={{ fontSize: 40, color: "#30363d", mb: 1 }} />
                  <Typography sx={{ color: "#8b949e" }}>This repository is empty.</Typography>
                </Box>
              )}
            </Paper>
          </Box>
        )}

        {/* ── ISSUES TAB ── */}
        {activeTab === "issues" && (
          <IssueList repoId={id} onIssueChange={(issues) => setRepo((prev) => ({ ...prev, issues }))} />
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <Box>
            <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 16, mb: 2 }}>Repository Settings</Typography>

            {/* Danger Zone */}
            <Box sx={{ border: "1px solid #f85149", borderRadius: 2, p: 2.5, bgcolor: "#161b22" }}>
              <Typography sx={{ color: "#f85149", fontWeight: 700, fontSize: 14, mb: 1 }}>⚠ Danger Zone</Typography>
              <Divider sx={{ borderColor: "#f8514940", mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 13 }}>Delete this repository</Typography>
                  <Typography sx={{ color: "#8b949e", fontSize: 12 }}>
                    Once you delete a repository, there is no going back.
                  </Typography>
                </Box>
                <Button
                  variant="outlined" size="small"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={handleDeleteRepo}
                  disabled={deleting}
                  sx={{ borderColor: "#f85149", color: "#f85149", "&:hover": { bgcolor: "#f8514920", borderColor: "#f85149" } }}
                >
                  {deleting ? <CircularProgress size={14} /> : "Delete repository"}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default RepoPage;
