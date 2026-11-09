import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, RadioGroup, Radio, FormControlLabel, TextField, MenuItem, Alert, CircularProgress } from "@mui/material";
import { Order } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getTotals, clearCart } from "../slices/cartSlice";
import { addOrder } from "../slices/orderSlice";
import PriceSummary from "../components/PriceSummary";
import Toast, { ToastState, emptyToast } from "../components/Toast";
import "./Payment.css";

function Payment() {
  const { items, coupon } = useAppSelector((state) => state.cart);
  const { addresses, selectedId } = useAppSelector((state) => state.address);
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(emptyToast);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const address = addresses.find((a) => a.id === selectedId);
  const totals = getTotals(items, coupon);

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    if (method === "upi" && !/^\w+@\w+$/.test(upiId)) newErrors.upiId = "Enter a valid UPI ID like name@upi";
    if (method === "card") {
      if (!/^\d{16}$/.test(cardNumber)) newErrors.cardNumber = "Card number must be 16 digits";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) newErrors.expiry = "Use MM/YY format";
      if (!/^\d{3}$/.test(cvv)) newErrors.cvv = "CVV must be 3 digits";
    }
    if (method === "netbanking" && bank === "") newErrors.bank = "Please select a bank";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = () => {
    if (loading) return; // stops double clicking
    if (!validatePayment()) return;
    setLoading(true);
    // Simulated payment. For testing a failed payment use UPI "fail@upi" or card "0000000000000000".
    setTimeout(() => {
      setLoading(false);
      if (upiId === "fail@upi" || cardNumber === "0000000000000000") {
        setToast({ open: true, message: "Payment failed. Please try again.", severity: "error" });
        return;
      }
      if (!address) return;
      const order: Order = {
        id: "FD" + Date.now().toString().slice(-6), restaurantName: items[0].restaurantName, items,
        total: totals.total, address, paymentMethod: method, createdAt: Date.now(),
      };
      dispatch(addOrder(order)); // order is created only after payment is successful
      dispatch(clearCart());
      navigate(`/order-confirmation/${order.id}`);
    }, 2000);
  };

  if (items.length === 0 || !address) {
    return (
      <Paper className="payment-empty">
        <Alert severity="warning">Your cart is empty or no address is selected.</Alert>
        <Button variant="contained" onClick={() => navigate("/home")}>Go to Home</Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h5">Payment</Typography>
      <Box className="payment-layout">
        <Paper className="payment-box">
          <Typography variant="h6">Choose payment method</Typography>
          <RadioGroup value={method} onChange={(e) => { setMethod(e.target.value); setErrors({}); }}>
            <FormControlLabel value="upi" control={<Radio />} label="UPI" />
            <FormControlLabel value="card" control={<Radio />} label="Credit / Debit Card" />
            <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
            <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
          </RadioGroup>

          {method === "upi" && <TextField label="UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} error={errors.upiId !== undefined} helperText={errors.upiId} fullWidth />}
          {method === "card" && (
            <>
              <TextField label="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} error={errors.cardNumber !== undefined} helperText={errors.cardNumber} fullWidth />
              <TextField label="Expiry (MM/YY)" value={expiry} onChange={(e) => setExpiry(e.target.value)} error={errors.expiry !== undefined} helperText={errors.expiry} fullWidth />
              <TextField label="CVV" type="password" value={cvv} onChange={(e) => setCvv(e.target.value)} error={errors.cvv !== undefined} helperText={errors.cvv} fullWidth />
            </>
          )}
          {method === "netbanking" && (
            <TextField select label="Select Bank" value={bank} onChange={(e) => setBank(e.target.value)} error={errors.bank !== undefined} helperText={errors.bank} fullWidth>
              {["SBI", "HDFC", "ICICI", "Axis"].map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
            </TextField>
          )}
          {method === "cod" && <Alert severity="info">Pay in cash when your food arrives.</Alert>}
        </Paper>

        <Box className="payment-summary">
          <PriceSummary showItems />
          <Button variant="contained" size="large" onClick={handlePay} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : `Pay Now ₹${totals.total}`}
          </Button>
          <Button onClick={() => navigate("/checkout")} disabled={loading}>Cancel Payment</Button>
        </Box>
      </Box>
      <Toast toast={toast} onClose={() => setToast(emptyToast)} />
    </Box>
  );
}
export default Payment;
