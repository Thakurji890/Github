import { useEffect, useState } from "react";
import { useAuth } from "../../authContext";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import { userAPI } from "../../api/api";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0d1117",
      paper: "#161b22",
    },
    primary: {
      main: "#58a6ff",
    },
    text: {
      primary: "#c9d1d9",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid #30363d",
        },
      },
    },
  },
});

const Login = () => {
  const { setCurrUser } = useAuth() || {
    setCurrUser: () => {},
  };

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    if (setCurrUser) {
      setCurrUser(null);
    }
  }, [setCurrUser]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await userAPI.login({
        email: email,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: "transparent" }}>
              <GitHubIcon sx={{ fontSize: 48, color: "#c9d1d9" }} />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mt: 1, fontWeight: 300, letterSpacing: '-0.5px' }}>
              Sign in to GitHub
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 2,
            }}
          >
            <Box
              component="form"
              onSubmit={handleLogin}
              noValidate
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username or email address"
                name="email"
                autoComplete="email"
                autoFocus
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Password</Typography>
                <Link href="#" variant="body2" sx={{ color: '#58a6ff', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Forgot password?
                </Link>
              </Box>
              <TextField
                margin="dense"
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 1,
                  py: 1,
                  bgcolor: "#238636",
                  color: "#ffffff",
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#2ea043" },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign in"}
              </Button>
            </Box>
          </Paper>

          <Box sx={{ mt: 3, p: 2, border: '1px solid #30363d', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              New to GitHub?{" "}
              <Link href="/signup" variant="body2" sx={{ color: '#58a6ff', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Create an account
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
