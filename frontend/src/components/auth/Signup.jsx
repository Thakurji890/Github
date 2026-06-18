import { useState } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useAuth } from "../../authContext";

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

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5500/signup", {
        email: email,
        password: password,
        username: username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Signup is failed");
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
              Create your account
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
              noValidate
              onSubmit={handleSignup}
              sx={{ width: "100%" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="username"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    autoFocus
                    size="small"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    size="small"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
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
                onClick={handleSignup}
              >
                {loading ? "Loading... " : "Sign up"}
              </Button>
            </Box>
          </Paper>

          <Box sx={{ mt: 3, p: 2, border: '1px solid #30363d', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link href="/auth" variant="body2" sx={{ color: '#58a6ff', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Signup;
