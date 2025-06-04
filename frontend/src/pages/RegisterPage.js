import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/register", form);
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>Register for StockWise</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Username" margin="normal" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <TextField fullWidth label="Password" type="password" margin="normal" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Register</Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">Already have an account? <Link to="/">Login</Link></Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
