import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", quantity: 0, category: "", price: 0 });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editForm, setEditForm] = useState({ id: null, name: "", quantity: 0, category: "", price: 0 });
  const navigate = useNavigate();

  const fetchInventory = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/inventory?search=${search}&sort=${sort}`, { withCredentials: true });
      setItems(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/");
    }
  }, [search, sort, navigate]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleLogout = async () => {
    await axios.post("http://localhost:3000/api/logout", {}, { withCredentials: true });
    navigate("/");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:3000/api/inventory", formData, { withCredentials: true });
    setItems([...items, res.data]);
    setFormData({ name: "", quantity: 0, category: "", price: 0 });
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/inventory/${id}`, { withCredentials: true });
    setItems(items.filter((item) => item.id !== id));
  };

  const openEditModal = (item) => {
    setEditForm(item);
    setSelectedItem(item);
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:3000/api/inventory/${editForm.id}`, editForm, { withCredentials: true });
    setSelectedItem(null);
    fetchInventory();
  };

  const handleExportCSV = () => {
    const csvContent = ["Name,Quantity,Category,Price"].concat(
      items.map(i => `${i.name},${i.quantity},${i.category},${i.price}`)
    ).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalValue = items.reduce((acc, item) => acc + parseFloat(item.price || 0) * parseInt(item.quantity || 0), 0);

  const categoryData = Object.values(
    items.reduce((acc, item) => {
      const value = parseFloat(item.price || 0) * parseInt(item.quantity || 0);
      acc[item.category] = acc[item.category] || { category: item.category, value: 0 };
      acc[item.category].value += value;
      return acc;
    }, {})
  );

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>

      <Box mb={2}>
        <TextField
          label="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Select value={sort} onChange={(e) => setSort(e.target.value)} displayEmpty>
          <MenuItem value="">Sort by</MenuItem>
          <MenuItem value="category">Category</MenuItem>
          <MenuItem value="price">Price</MenuItem>
        </Select>
        <Button onClick={handleExportCSV} sx={{ ml: 2 }} variant="outlined">Export CSV</Button>
        <Button onClick={handleLogout} sx={{ ml: 2 }} variant="outlined" color="error">Logout</Button>
      </Box>

      <form onSubmit={handleAdd}>
        <TextField value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} label="Name" required sx={{ mr: 2 }} />
        <TextField type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} label="Quantity" sx={{ mr: 2 }} />
        <TextField value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} label="Category" sx={{ mr: 2 }} />
        <TextField type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} label="Price" sx={{ mr: 2 }} />
        <Button type="submit" variant="contained">Add</Button>
      </form>

      <Typography variant="h6" mt={4}>Total Inventory Value: €{totalValue.toFixed(2)}</Typography>

      <Box my={4}>
        <Typography variant="h6">Inventory Value per Category</Typography>
        <PieChart width={400} height={250}>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {categoryData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"][index % 4]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Box>

      <Box mt={2}>
        {items.map((item) => (
          <Paper key={item.id} sx={{ p: 2, mb: 1, backgroundColor: item.quantity < 5 ? "#ffe5e5" : "white" }}>
            <Typography><strong>{item.name}</strong> — Qty: {item.quantity}, Category: {item.category}, Price: €{item.price}</Typography>
            <Box mt={1}>
              <Button variant="outlined" onClick={() => openEditModal(item)} sx={{ mr: 1 }}>Update</Button>
              <Button variant="outlined" color="error" onClick={() => handleDelete(item.id)}>Delete</Button>
            </Box>
          </Paper>
        ))}
      </Box>

      <Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          <TextField fullWidth margin="dense" type="number" label="Quantity" value={editForm.quantity} onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })} />
          <TextField fullWidth margin="dense" label="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
          <TextField fullWidth margin="dense" type="number" step="0.01" label="Price" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedItem(null)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryPage;
