import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAppDispatch, useAppSelector } from "../hooks";
import { registerUser } from "../slices/authSlice";
import Toast, { ToastState, emptyToast } from "../components/Toast";
import "./Register.css";

// Each field: its name in the form, label shown to the user, and the input type
const fields = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "mobile", label: "Mobile Number", type: "text" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password" },
];
const emptyForm: Record<string, string> = { name: "", email: "", mobile: "", password: "", confirmPassword: "" };

function Register() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(emptyToast);
  const users = useAppSelector((state) => state.auth.users);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = () => {
    const newErrors: Record<string, string> = {};
    if (form.name.trim() === "") newErrors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!/^\d{10}$/.test(form.mobile)) newErrors.mobile = "Mobile number must be 10 digits";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match";
    if (users.some((u) => u.email === form.email)) newErrors.email = "This email is already registered";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      dispatch(registerUser({ name: form.name, email: form.email, mobile: form.mobile, password: form.password }));
      setLoading(false);
      setToast({ open: true, message: "Registration successful! Please login.", severity: "success" });
      setTimeout(() => navigate("/"), 1200);
    }, 800);
  };

  return (
    <Box className="register-page">
      <Paper className="register-card">
        <img src="/images/logo.svg" alt="FoodieGo logo" className="register-logo" />
        <Typography variant="h5">Create Account</Typography>
        {fields.map((field) => (
          <TextField
            key={field.name} name={field.name} label={field.label} value={form[field.name]} onChange={handleChange}
            type={field.type === "password" && !showPassword ? "password" : "text"}
            error={errors[field.name] !== undefined} helperText={errors[field.name]} fullWidth
            InputProps={field.name === "password" ? { endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="show or hide password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
              </InputAdornment>
            ) } : undefined}
          />
        ))}
        <Button variant="contained" size="large" onClick={handleRegister} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
        <Typography variant="body2">Already have an account? <Link to="/">Login</Link></Typography>
      </Paper>
      <Toast toast={toast} onClose={() => setToast(emptyToast)} />
    </Box>
  );
}
export default Register;
