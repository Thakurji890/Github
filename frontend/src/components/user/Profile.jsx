import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Avatar, Button, Divider, TextField,
  CircularProgress, IconButton, Tooltip,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GitHubIcon from "@mui/icons-material/GitHub";
import BookIcon from "@mui/icons-material/Book";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { userAPI } from "../../api/api";
import { useAuth } from "../../authContext";
import ContributionHeatmap from "./ContributionHeatmap";

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

const Profile = () => {
  const navigate = useNavigate();
  const { setCurrUser } = useAuth() || { setCurrUser: () => {} };

  const handleSignOut = () => {
    localStorage.clear();
    setCurrUser(null);
    navigate("/auth");
  };

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [deleting, setDeleting] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await userAPI.getProfile(userId);
        setUser(res.data);
        setNewEmail(res.data.email || "");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  const handleUpdateProfile = async () => {
    setSaving(true); setSaveError("");
    try {
      const payload = { email: newEmail };
      if (newPassword.trim()) payload.password = newPassword;
      const res = await userAPI.updateProfile(userId, payload);
      setUser(res.data);
      setEditing(false); setNewPassword("");
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure? Your account will be permanently deleted.")) return;
    setDeleting(true);
    try {
      await userAPI.deleteProfile(userId);
      localStorage.clear();
      setCurrUser(null);
      navigate("/auth");
    } catch (err) {
      console.error("Failed to delete profile:", err);
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* Navbar */}
      <Box sx={{ bgcolor: "#161b22", borderBottom: "1px solid #30363d", px: 4, py: 1, display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <GitHubIcon sx={{ fontSize: 28, color: "#e6edf3", mr: 2 }} />
        <Button size="small" startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}
          sx={{ color: "#8b949e", "&:hover": { color: "#58a6ff" } }}>
          Dashboard
        </Button>
        <Button size="small" onClick={handleSignOut}
          sx={{ ml: "auto", color: "#8b949e", "&:hover": { color: "#f85149" } }}>
          Sign out
        </Button>
      </Box>

      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 4 }, pt: 4, pb: 6 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "240px 1fr" }, gap: 4 }}>

        {/* Left — User Card */}
        <Box>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "#238636", fontSize: 32, mb: 2, border: "3px solid #30363d" }}>
            {(user?.username || "U")[0].toUpperCase()}
          </Avatar>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: "#e6edf3" }}>{user?.username}</Typography>
          <Typography sx={{ color: "#8b949e", fontSize: 14, mb: 2 }}>{user?.email}</Typography>

          <Divider sx={{ borderColor: "#30363d", my: 2 }} />

          {/* Stats */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BookIcon sx={{ fontSize: 16, color: "#8b949e" }} />
              <Typography sx={{ color: "#e6edf3", fontSize: 13 }}>
                <Box component="span" fontWeight={700}>{user?.repositories?.length ?? 0}</Box>
                <Box component="span" sx={{ color: "#8b949e" }}> repositories</Box>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PeopleAltOutlinedIcon sx={{ fontSize: 16, color: "#8b949e" }} />
              <Typography sx={{ color: "#e6edf3", fontSize: 13 }}>
                <Box component="span" fontWeight={700}>{user?.follewedUsers?.length ?? 0}</Box>
                <Box component="span" sx={{ color: "#8b949e" }}> following</Box>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StarBorderIcon sx={{ fontSize: 16, color: "#8b949e" }} />
              <Typography sx={{ color: "#e6edf3", fontSize: 13 }}>
                <Box component="span" fontWeight={700}>{user?.starRepos?.length ?? 0}</Box>
                <Box component="span" sx={{ color: "#8b949e" }}> starred repos</Box>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right — Profile Details */}
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#e6edf3", mb: 2 }}>Profile Settings</Typography>

          {/* Edit Profile */}
          <Box sx={{ border: "1px solid #30363d", borderRadius: 2, p: 2.5, bgcolor: "#161b22", mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 14 }}>Account Info</Typography>
              {!editing ? (
                <Tooltip title="Edit profile">
                  <IconButton size="small" onClick={() => setEditing(true)} sx={{ color: "#8b949e" }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Tooltip title="Save">
                    <IconButton size="small" onClick={handleUpdateProfile} disabled={saving}
                      sx={{ color: "#3fb950", border: "1px solid #30363d", borderRadius: 1 }}>
                      {saving ? <CircularProgress size={14} /> : <CheckIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <IconButton size="small" onClick={() => { setEditing(false); setNewEmail(user?.email || ""); setNewPassword(""); setSaveError(""); }}
                      sx={{ color: "#f85149", border: "1px solid #30363d", borderRadius: 1 }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            {saveError && <Typography sx={{ color: "#f85149", fontSize: 12, mb: 1.5 }}>{saveError}</Typography>}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box>
                <Typography sx={{ color: "#8b949e", fontSize: 12, mb: 0.5 }}>Username</Typography>
                <Typography sx={{ color: "#e6edf3", fontSize: 14, pl: 0.5 }}>{user?.username}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: "#8b949e", fontSize: 12, mb: 0.5 }}>Email address</Typography>
                {editing ? (
                  <TextField fullWidth size="small" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                ) : (
                  <Typography sx={{ color: "#e6edf3", fontSize: 14, pl: 0.5 }}>{user?.email}</Typography>
                )}
              </Box>
              {editing && (
                <Box>
                  <Typography sx={{ color: "#8b949e", fontSize: 12, mb: 0.5 }}>New Password <Box component="span" sx={{ fontStyle: "italic" }}>(leave blank to keep current)</Box></Typography>
                  <TextField fullWidth size="small" type="password" placeholder="New password"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </Box>
              )}
            </Box>
          </Box>

          {/* Repositories summary */}
          <Box sx={{ border: "1px solid #30363d", borderRadius: 2, p: 2.5, bgcolor: "#161b22", mb: 3 }}>
            <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 14, mb: 1.5 }}>Repositories</Typography>
            <Divider sx={{ borderColor: "#30363d", mb: 1.5 }} />
            {user?.repositories?.length > 0 ? (
              user.repositories.slice(0, 5).map((repoId, idx) => (
                <Box key={idx} sx={{ py: 0.8, borderBottom: idx < user.repositories.length - 1 ? "1px solid #21262d" : "none", display: "flex", alignItems: "center", gap: 1 }}>
                  <BookIcon sx={{ fontSize: 13, color: "#8b949e" }} />
                  <Typography
                    sx={{ color: "#58a6ff", fontSize: 13, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                    onClick={() => navigate(`/repo/${repoId}`)}
                  >
                    {typeof repoId === "string" ? repoId : repoId.name || repoId}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ color: "#8b949e", fontSize: 13 }}>No repositories yet.</Typography>
            )}
            {user?.repositories?.length > 5 && (
              <Typography sx={{ color: "#58a6ff", fontSize: 12, mt: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
                View all {user.repositories.length} repositories →
              </Typography>
            )}
          </Box>

          {/* Danger Zone */}
          <Box sx={{ border: "1px solid #f85149", borderRadius: 2, p: 2.5, bgcolor: "#161b22" }}>
            <Typography sx={{ color: "#f85149", fontWeight: 700, fontSize: 14, mb: 1 }}>⚠ Danger Zone</Typography>
            <Divider sx={{ borderColor: "#f8514940", mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 13 }}>Delete account</Typography>
                <Typography sx={{ color: "#8b949e", fontSize: 12 }}>Once deleted, your account cannot be recovered.</Typography>
              </Box>
              <Button variant="outlined" size="small" startIcon={<DeleteOutlineIcon />}
                onClick={handleDeleteProfile} disabled={deleting}
                sx={{ borderColor: "#f85149", color: "#f85149", "&:hover": { bgcolor: "#f8514920" } }}>
                {deleting ? <CircularProgress size={14} /> : "Delete account"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <ContributionHeatmap username={user?.username} />
    </Box>
    </ThemeProvider>
  );
};

export default Profile;
