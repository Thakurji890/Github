import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, Switch,
  FormControlLabel, CircularProgress, IconButton,
  Backdrop, Fade, Modal, Divider,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import BookIcon from "@mui/icons-material/Book";
import { repoAPI } from "../../api/api";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0d1117", paper: "#161b22" },
    primary: { main: "#58a6ff" },
    text: { primary: "#e6edf3", secondary: "#8b949e" },
    divider: "#30363d",
  },
  typography: { fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`, fontSize: 13 },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6, fontSize: 13, backgroundColor: "#0d1117",
            "& fieldset": { borderColor: "#30363d" },
            "&:hover fieldset": { borderColor: "#58a6ff" },
            "&.Mui-focused fieldset": { borderColor: "#58a6ff" },
          },
        },
      },
    },
    MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 500, borderRadius: 6 } } },
  },
});

const CreateRepo = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) { setError("Repository name is required."); return; }
    setError("");
    setLoading(true);
    try {
      const owner = localStorage.getItem("userId");
      const res = await repoAPI.create({
        name: name.trim(),
        description: description.trim(),
        visibility: isPublic,
        owner,
        content: [],
        issues: [],
      });
      onCreated && onCreated(res.data);
      setName(""); setDescription(""); setIsPublic(true);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create repository.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Modal open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 300 }}>
        <Fade in={open}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 540 },
            bgcolor: "#161b22", border: "1px solid #30363d",
            borderRadius: 2, p: 3, outline: "none",
          }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#e6edf3" }}>
                Create a new repository
              </Typography>
              <IconButton size="small" onClick={onClose} sx={{ color: "#8b949e" }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Divider sx={{ borderColor: "#30363d", mb: 2.5 }} />

            {/* Name */}
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", mb: 0.7 }}>
              Repository name <Box component="span" sx={{ color: "#f85149" }}>*</Box>
            </Typography>
            <TextField
              fullWidth size="small" placeholder="my-awesome-repo"
              value={name} onChange={(e) => setName(e.target.value)}
              error={!!error} sx={{ mb: 2 }}
            />
            {error && <Typography sx={{ color: "#f85149", fontSize: 12, mb: 1.5 }}>{error}</Typography>}

            {/* Description */}
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", mb: 0.7 }}>
              Description <Box component="span" sx={{ color: "#8b949e", fontWeight: 400 }}>(optional)</Box>
            </Typography>
            <TextField
              fullWidth size="small" multiline rows={2}
              placeholder="Short description of the repository..."
              value={description} onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2.5 }}
            />

            {/* Visibility */}
            <Box sx={{ border: "1px solid #30363d", borderRadius: 2, p: 2, mb: 3 }}>
              <Box
                onClick={() => setIsPublic(true)}
                sx={{
                  display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5,
                  cursor: "pointer", p: 1, borderRadius: 1,
                  border: isPublic ? "1px solid #238636" : "1px solid transparent",
                  "&:hover": { bgcolor: "#21262d" },
                }}
              >
                <BookIcon sx={{ color: isPublic ? "#3fb950" : "#8b949e", mt: 0.2 }} />
                <Box>
                  <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 13 }}>Public</Typography>
                  <Typography sx={{ color: "#8b949e", fontSize: 12 }}>Anyone on the internet can see this repository.</Typography>
                </Box>
              </Box>
              <Box
                onClick={() => setIsPublic(false)}
                sx={{
                  display: "flex", alignItems: "flex-start", gap: 1.5,
                  cursor: "pointer", p: 1, borderRadius: 1,
                  border: !isPublic ? "1px solid #58a6ff" : "1px solid transparent",
                  "&:hover": { bgcolor: "#21262d" },
                }}
              >
                <LockIcon sx={{ color: !isPublic ? "#58a6ff" : "#8b949e", mt: 0.2 }} />
                <Box>
                  <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 13 }}>Private</Typography>
                  <Typography sx={{ color: "#8b949e", fontSize: 12 }}>You choose who can see and commit to this repository.</Typography>
                </Box>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
              <Button
                variant="outlined" size="small" onClick={onClose}
                sx={{ borderColor: "#30363d", color: "#e6edf3", "&:hover": { borderColor: "#8b949e", bgcolor: "#21262d" } }}
              >
                Cancel
              </Button>
              <Button
                variant="contained" size="small" onClick={handleCreate} disabled={loading || !name.trim()}
                sx={{ bgcolor: "#238636", color: "#fff", "&:hover": { bgcolor: "#2ea043" }, "&:disabled": { bgcolor: "#238636", opacity: 0.5 } }}
              >
                {loading ? <CircularProgress size={16} color="inherit" /> : "Create repository"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default CreateRepo;
