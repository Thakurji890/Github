import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// MUI Icons
import GitHubIcon from "@mui/icons-material/GitHub";
import SearchIcon from "@mui/icons-material/Search";
import BookIcon from "@mui/icons-material/Book";
import LockIcon from "@mui/icons-material/Lock";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import BugReportIcon from "@mui/icons-material/BugReport";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

/* ─── GitHub Dark Theme ─────────────────────────────────────── */
const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0d1117", paper: "#161b22" },
    primary: { main: "#58a6ff" },
    success: { main: "#3fb950" },
    text: { primary: "#e6edf3", secondary: "#8b949e" },
    divider: "#30363d",
  },
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    fontSize: 13,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 6,
          fontSize: 13,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6,
            fontSize: 13,
            backgroundColor: "#0d1117",
            "& fieldset": { borderColor: "#30363d" },
            "&:hover fieldset": { borderColor: "#58a6ff" },
            "&.Mui-focused fieldset": { borderColor: "#58a6ff" },
          },
          "& input": { color: "#e6edf3" },
          "& input::placeholder": { color: "#8b949e" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 20, fontSize: 11 },
      },
    },
  },
});

/* ─── Repo Card ─────────────────────────────────────────────── */
const RepoCard = ({ repo }) => (
  <Box
    sx={{
      border: "1px solid #30363d",
      borderRadius: 2,
      p: 2.5,
      mb: 2,
      bgcolor: "#161b22",
      transition: "border-color 0.15s",
      "&:hover": { borderColor: "#58a6ff" },
      cursor: "pointer",
    }}
  >
    {/* Repo Name + Visibility */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      {repo.visibility ? (
        <BookIcon sx={{ fontSize: 15, color: "#8b949e" }} />
      ) : (
        <LockIcon sx={{ fontSize: 15, color: "#8b949e" }} />
      )}
      <Typography sx={{ color: "#58a6ff", fontWeight: 600, fontSize: 14 }}>
        {repo.name}
      </Typography>
      <Chip
        label={repo.visibility ? "Public" : "Private"}
        size="small"
        sx={{
          bgcolor: "transparent",
          border: "1px solid #30363d",
          color: "#8b949e",
          height: 18,
          fontSize: 11,
        }}
      />
    </Box>

    {/* Description */}
    {repo.description && (
      <Typography variant="body2" sx={{ color: "#8b949e", mb: 1.5, lineHeight: 1.5 }}>
        {repo.description}
      </Typography>
    )}

    {/* Meta Row */}
    <Box sx={{ display: "flex", gap: 2.5, alignItems: "center", flexWrap: "wrap" }}>
      {/* Content count */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <FolderOpenIcon sx={{ fontSize: 13, color: "#8b949e" }} />
        <Typography variant="caption" sx={{ color: "#8b949e" }}>
          {repo.content?.length ?? 0} files
        </Typography>
      </Box>

      {/* Issues */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <BugReportIcon sx={{ fontSize: 13, color: "#8b949e" }} />
        <Typography variant="caption" sx={{ color: "#8b949e" }}>
          {repo.issues?.length ?? 0} issues
        </Typography>
      </Box>

      {/* Owner */}
      {repo.owner && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Avatar sx={{ width: 14, height: 14, fontSize: 9, bgcolor: "#238636" }}>
            {(repo.owner?.username || "U")[0].toUpperCase()}
          </Avatar>
          <Typography variant="caption" sx={{ color: "#8b949e" }}>
            {repo.owner?.username || "Unknown"}
          </Typography>
        </Box>
      )}
    </Box>
  </Box>
);

/* ─── Sidebar Repo Item ─────────────────────────────────────── */
const SidebarRepoItem = ({ repo }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      py: 0.8,
      px: 1,
      borderRadius: 1.5,
      cursor: "pointer",
      "&:hover": { bgcolor: "#21262d" },
      transition: "background 0.15s",
    }}
  >
    {repo.visibility ? (
      <BookIcon sx={{ fontSize: 13, color: "#8b949e", flexShrink: 0 }} />
    ) : (
      <LockIcon sx={{ fontSize: 13, color: "#8b949e", flexShrink: 0 }} />
    )}
    <Box sx={{ minWidth: 0 }}>
      <Typography
        noWrap
        sx={{ color: "#58a6ff", fontSize: 12, fontWeight: 500 }}
      >
        {repo.name}
      </Typography>
      {repo.issues?.length > 0 && (
        <Typography variant="caption" sx={{ color: "#8b949e" }}>
          {repo.issues.length} issue{repo.issues.length !== 1 ? "s" : ""}
        </Typography>
      )}
    </Box>
  </Box>
);

/* ─── Explore Card ──────────────────────────────────────────── */
const ExploreCard = ({ repo }) => (
  <Box
    sx={{
      py: 1.5,
      borderBottom: "1px solid #21262d",
      cursor: "pointer",
      "&:last-child": { borderBottom: "none" },
      "&:hover": { "& .repo-link": { textDecoration: "underline" } },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
      <Avatar sx={{ width: 18, height: 18, bgcolor: "#238636", fontSize: 9 }}>
        {repo.name?.[0]?.toUpperCase()}
      </Avatar>
      <Typography className="repo-link" sx={{ color: "#58a6ff", fontSize: 13, fontWeight: 600 }}>
        {repo.name}
      </Typography>
      <Chip
        label={repo.visibility ? "Public" : "Private"}
        size="small"
        sx={{
          ml: "auto",
          bgcolor: "transparent",
          border: "1px solid #30363d",
          color: "#8b949e",
          height: 16,
          fontSize: 10,
        }}
      />
    </Box>
    {repo.description && (
      <Typography
        sx={{
          color: "#8b949e",
          fontSize: 12,
          pl: 3.2,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: 1.4,
        }}
      >
        {repo.description}
      </Typography>
    )}
    <Box sx={{ display: "flex", gap: 1.5, mt: 0.8, pl: 3.2, alignItems: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <BugReportIcon sx={{ fontSize: 11, color: "#8b949e" }} />
        <Typography variant="caption" sx={{ color: "#8b949e" }}>
          {repo.issues?.length ?? 0}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <FolderOpenIcon sx={{ fontSize: 11, color: "#8b949e" }} />
        <Typography variant="caption" sx={{ color: "#8b949e" }}>
          {repo.content?.length ?? 0} files
        </Typography>
      </Box>
    </Box>
  </Box>
);

/* ─── Main Dashboard ─────────────────────────────────────────── */
const Dashoard = () => {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const res = await fetch(`http://localhost:5500/repo/user/${userId}`);
        const data = await res.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error(`${err} while fetching user repositories`);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const res = await fetch(`http://localhost:5500/repo/all`);
        const data = await res.json();
        setSuggestedRepositories(data || []);
      } catch (error) {
        console.error(`${error} while fetching all repositories`);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResult(repositories);
    } else {
      setSearchResult(
        repositories.filter((repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, repositories]);

  const displayRepos = searchResult.length > 0 ? searchResult : repositories;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* ── TOP NAVBAR ─────────────────────────────────── */}
      <Box
        component="nav"
        sx={{
          bgcolor: "#161b22",
          borderBottom: "1px solid #30363d",
          px: { xs: 2, md: 4 },
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <GitHubIcon sx={{ fontSize: 30, color: "#e6edf3" }} />

        <TextField
          placeholder="Search repositories..."
          size="small"
          sx={{ width: { xs: 150, md: 240 } }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#8b949e", fontSize: 16 }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2.5, ml: 1 }}>
          {["Pull requests", "Issues", "Marketplace", "Explore"].map((label) => (
            <Typography
              key={label}
              sx={{
                color: "#e6edf3",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": { color: "#58a6ff" },
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Notifications">
            <IconButton size="small" sx={{ color: "#e6edf3" }}>
              <NotificationsNoneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create new">
            <Button
              size="small"
              endIcon={<KeyboardArrowDownIcon fontSize="small" />}
              sx={{
                color: "#e6edf3",
                border: "1px solid #30363d",
                px: 1,
                minWidth: 0,
                "&:hover": { bgcolor: "#21262d", borderColor: "#8b949e" },
              }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Tooltip>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: "#238636",
              fontSize: 13,
              cursor: "pointer",
              border: "2px solid #30363d",
              "&:hover": { borderColor: "#58a6ff" },
            }}
          >
            U
          </Avatar>
        </Box>
      </Box>

      {/* ── PAGE BODY ──────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr", lg: "280px 1fr 310px" },
          gap: 3,
          maxWidth: 1280,
          mx: "auto",
          px: { xs: 2, md: 4 },
          pt: 4,
          pb: 6,
          width: "100%",
        }}
      >

        {/* ── LEFT SIDEBAR ─────────────────────────────── */}
        <Box>
          {/* User Card */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#238636",
                fontSize: 17,
                border: "2px solid #30363d",
              }}
            >
              U
            </Avatar>
            <Box>
              <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 14 }}>
                User
              </Typography>
              <Typography sx={{ color: "#8b949e", fontSize: 12 }}>@user</Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box
            sx={{
              display: "flex",
              gap: 0,
              mb: 2.5,
              border: "1px solid #30363d",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {[
              { label: "Repos", value: repositories.length, icon: <BookIcon sx={{ fontSize: 14 }} /> },
              { label: "Following", value: 0, icon: <PeopleAltOutlinedIcon sx={{ fontSize: 14 }} /> },
              { label: "Stars", value: 0, icon: <StarBorderIcon sx={{ fontSize: 14 }} /> },
            ].map((stat, i) => (
              <Box
                key={stat.label}
                sx={{
                  flex: 1,
                  py: 1.2,
                  px: 1,
                  textAlign: "center",
                  borderRight: i < 2 ? "1px solid #30363d" : "none",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#21262d" },
                }}
              >
                <Box sx={{ color: "#8b949e", mb: 0.2 }}>{stat.icon}</Box>
                <Typography sx={{ color: "#e6edf3", fontWeight: 700, fontSize: 14 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ color: "#8b949e", fontSize: 10 }}>{stat.label}</Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ borderColor: "#30363d", mb: 2 }} />

          {/* Repo search + list */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 13 }}>
              Repositories
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon sx={{ fontSize: "14px !important" }} />}
              sx={{ color: "#58a6ff", fontSize: 12, p: 0, minWidth: 0 }}
            >
              New
            </Button>
          </Box>

          <TextField
            placeholder="Find a repository..."
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#8b949e", fontSize: 14 }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
            {displayRepos.length > 0 ? (
              displayRepos.map((repo) => (
                <SidebarRepoItem key={repo._id} repo={repo} />
              ))
            ) : (
              <Typography sx={{ color: "#8b949e", fontSize: 12, mt: 1, pl: 1 }}>
                No repositories found.
              </Typography>
            )}
          </Box>
        </Box>

        {/* ── MAIN FEED ────────────────────────────────── */}
        <Box>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
            <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 16 }}>
              Your repositories
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: "#238636",
                color: "#fff",
                "&:hover": { bgcolor: "#2ea043" },
                fontSize: 12,
                px: 1.5,
              }}
            >
              New repository
            </Button>
          </Box>

          {/* Repos */}
          {displayRepos.length > 0 ? (
            displayRepos.map((repo) => (
              <RepoCard key={repo._id} repo={repo} />
            ))
          ) : (
            <Box
              sx={{
                border: "1px dashed #30363d",
                borderRadius: 2,
                p: 5,
                textAlign: "center",
                bgcolor: "#161b22",
              }}
            >
              <BookIcon sx={{ fontSize: 40, color: "#30363d", mb: 1 }} />
              <Typography sx={{ color: "#8b949e", mb: 2, fontSize: 14 }}>
                You don't have any repositories yet.
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                sx={{ bgcolor: "#238636", "&:hover": { bgcolor: "#2ea043" } }}
              >
                Create a repository
              </Button>
            </Box>
          )}
        </Box>

        {/* ── RIGHT SIDEBAR ────────────────────────────── */}
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          {/* Explore */}
          <Box
            sx={{
              border: "1px solid #30363d",
              borderRadius: 2,
              p: 2,
              bgcolor: "#161b22",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 13 }}>
                Explore repositories
              </Typography>
              <Typography sx={{ color: "#58a6ff", fontSize: 12, cursor: "pointer" }}>
                See more
              </Typography>
            </Box>
            <Divider sx={{ borderColor: "#30363d", mb: 1 }} />

            {suggestedRepositories.slice(0, 6).length > 0 ? (
              suggestedRepositories
                .slice(0, 6)
                .map((repo) => <ExploreCard key={repo._id} repo={repo} />)
            ) : (
              <Typography sx={{ color: "#8b949e", fontSize: 12, py: 1 }}>
                No public repositories yet.
              </Typography>
            )}
          </Box>

          {/* Quick Links */}
          <Box
            sx={{
              border: "1px solid #30363d",
              borderRadius: 2,
              p: 2,
              bgcolor: "#161b22",
            }}
          >
            <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 13, mb: 1.5 }}>
              Quick links
            </Typography>
            <Divider sx={{ borderColor: "#30363d", mb: 1.5 }} />
            {[
              "GitHub Docs",
              "GitHub Skills",
              "GitHub Blog",
              "Contact Support",
            ].map((link) => (
              <Typography
                key={link}
                sx={{
                  color: "#58a6ff",
                  fontSize: 13,
                  py: 0.8,
                  cursor: "pointer",
                  borderBottom: "1px solid #21262d",
                  "&:last-child": { borderBottom: "none" },
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {link}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashoard;
