import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAppDispatch, useAppSelector } from "../hooks";
import { loginUser } from "../slices/authSlice";
import Toast, { ToastState, emptyToast } from "../components/Toast";
import "./Login.css";

function Login() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ loginId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(emptyToast);
  const users = useAppSelector((state) => state.auth.users);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    const newErrors = { loginId: "", password: "" };
    const isEmail = /^\S+@\S+\.\S+$/.test(loginId);
    const isMobile = /^\d{10}$/.test(loginId);
    if (loginId === "") newErrors.loginId = "Email or mobile number is required";
    else if (!isEmail && !isMobile) newErrors.loginId = "Enter a valid email or 10-digit mobile number";
    if (password === "") newErrors.password = "Password is required";
    setErrors(newErrors);
    if (newErrors.loginId || newErrors.password) return;

    setLoading(true);
    setTimeout(() => {
      const user = users.find((u) => (u.email === loginId || u.mobile === loginId) && u.password === password);
      setLoading(false);
      if (user) {
        dispatch(loginUser(user));
        navigate("/home");
      } else {
        setToast({ open: true, message: "Invalid email/mobile or password. Please register first.", severity: "error" });
      }
    }, 800);
  };

  return (
    <Box className="login-page">
      <Paper className="login-card">
        <img src="/images/logo.svg" alt="FoodieGo logo" className="login-logo" />
        <Typography variant="h5">Login</Typography>
        <TextField label="Email or Mobile Number" value={loginId} onChange={(e) => setLoginId(e.target.value)} error={errors.loginId !== ""} helperText={errors.loginId} fullWidth />
        <TextField
          label="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
          error={errors.password !== ""} helperText={errors.password} fullWidth
          InputProps={{ endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="show or hide password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
            </InputAdornment>
          ) }}
        />
        <Button size="small" onClick={() => setToast({ open: true, message: "Forgot Password is not available in this demo", severity: "info" })}>Forgot Password?</Button>
        <Button variant="contained" size="large" onClick={handleLogin} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
        <Typography variant="body2">New user? <Link to="/register">Create Account</Link></Typography>
      </Paper>
      <Toast toast={toast} onClose={() => setToast(emptyToast)} />
    </Box>
  );
}
export default Login;
