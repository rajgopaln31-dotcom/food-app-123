import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, IconButton, RadioGroup, Radio, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Address } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addAddress, updateAddress, deleteAddress, selectAddress } from "../slices/addressSlice";
import PriceSummary from "../components/PriceSummary";
import Toast, { ToastState, emptyToast } from "../components/Toast";
import "./Checkout.css";

const emptyForm = { fullName: "", mobile: "", house: "", street: "", landmark: "", city: "", state: "", pin: "", instructions: "" };
type AddressForm = typeof emptyForm;

// Each form field: name, label and whether it is required
const fields: { name: keyof AddressForm; label: string; required: boolean }[] = [
  { name: "fullName", label: "Full Name", required: true },
  { name: "mobile", label: "Mobile Number", required: true },
  { name: "house", label: "House Number", required: true },
  { name: "street", label: "Street", required: true },
  { name: "landmark", label: "Landmark", required: false },
  { name: "city", label: "City", required: true },
  { name: "state", label: "State", required: true },
  { name: "pin", label: "PIN Code", required: true },
  { name: "instructions", label: "Delivery Instructions", required: false },
];

function Checkout() {
  const { addresses, selectedId } = useAppSelector((state) => state.address);
  const cartItems = useAppSelector((state) => state.cart.items);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastState>(emptyToast);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const openAddDialog = () => { setForm(emptyForm); setEditId(null); setErrors({}); setDialogOpen(true); };
  const openEditDialog = (address: Address) => { setForm({ ...address }); setEditId(address.id); setErrors({}); setDialogOpen(true); };

  const handleSaveAddress = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && form[field.name].trim() === "") newErrors[field.name] = `${field.label} is required`;
    });
    if (!newErrors.mobile && !/^\d{10}$/.test(form.mobile)) newErrors.mobile = "Mobile number must be 10 digits";
    if (!newErrors.pin && !/^\d{6}$/.test(form.pin)) newErrors.pin = "PIN code must be 6 digits";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (editId === null) dispatch(addAddress({ ...form, id: Date.now() }));
    else dispatch(updateAddress({ ...form, id: editId }));
    setDialogOpen(false);
    setToast({ open: true, message: "Address saved", severity: "success" });
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) setToast({ open: true, message: "Your cart is empty", severity: "error" });
    else if (selectedId === null) setToast({ open: true, message: "Please select or add a delivery address", severity: "error" });
    else navigate("/payment");
  };

  return (
    <Box>
      <Typography variant="h5">Delivery Address</Typography>
      <Box className="checkout-layout">
        <Box className="address-section">
          <RadioGroup value={selectedId === null ? "" : String(selectedId)} onChange={(e) => dispatch(selectAddress(Number(e.target.value)))}>
            {addresses.map((address) => (
              <Paper key={address.id} className="address-card">
                <FormControlLabel value={String(address.id)} control={<Radio />} className="address-label"
                  label={<Box><Typography variant="h6">{address.fullName}</Typography>
                    <Typography variant="body2">{address.house}, {address.street}, {address.landmark} {address.city}, {address.state} - {address.pin}</Typography>
                    <Typography variant="body2">Mobile: {address.mobile}</Typography></Box>} />
                <IconButton aria-label="edit address" onClick={() => openEditDialog(address)}><EditIcon /></IconButton>
                <IconButton aria-label="delete address" onClick={() => dispatch(deleteAddress(address.id))}><DeleteIcon /></IconButton>
              </Paper>
            ))}
          </RadioGroup>
          {addresses.length === 0 && <Typography>No saved addresses. Please add one.</Typography>}
          <Button variant="outlined" onClick={openAddDialog}>Add New Address</Button>
        </Box>
        <Box className="summary-section">
          <PriceSummary showItems />
          <Button variant="contained" size="large" onClick={handlePlaceOrder}>Place Order</Button>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId === null ? "Add New Address" : "Edit Address"}</DialogTitle>
        <DialogContent className="address-form">
          {fields.map((field) => (
            <TextField key={field.name} label={field.label} value={form[field.name]} fullWidth size="small"
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              error={errors[field.name] !== undefined} helperText={errors[field.name]} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAddress}>Save Address</Button>
        </DialogActions>
      </Dialog>
      <Toast toast={toast} onClose={() => setToast(emptyToast)} />
    </Box>
  );
}
export default Checkout;
