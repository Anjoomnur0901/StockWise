import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/login", form, { withCredentials: true });
      navigate("/inventory");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>StockWise Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Username" margin="normal" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <TextField fullWidth label="Password" type="password" margin="normal" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Login</Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">Don't have an account? <Link to="/register">Register here</Link></Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;