import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, IconButton, TextField, Button, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../hooks";
import { changeQuantity, removeItem, setCoupon, validCoupons } from "../slices/cartSlice";
import QuantityButtons from "../components/QuantityButtons";
import PriceSummary from "../components/PriceSummary";
import Toast, { ToastState, emptyToast } from "../components/Toast";
import "./Cart.css";

function Cart() {
  const { items, coupon } = useAppSelector((state) => state.cart);
  const [couponText, setCouponText] = useState("");
  const [toast, setToast] = useState<ToastState>(emptyToast);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleApplyCoupon = () => {
    const code = couponText.trim().toUpperCase();
    if (validCoupons.includes(code)) {
      dispatch(setCoupon(code));
      setToast({ open: true, message: `Coupon ${code} applied`, severity: "success" });
    } else {
      setToast({ open: true, message: "Invalid coupon code. Try SAVE10 or FLAT50", severity: "error" });
    }
  };

  if (items.length === 0) {
    return (
      <Paper className="empty-cart">
        <Typography variant="h5">Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate("/restaurants")}>Browse Restaurants</Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h5">Your Cart - {items[0].restaurantName}</Typography>
      <Box className="cart-layout">
        <Box className="cart-items">
          {items.map((item) => (
            <Paper key={item.key} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-image" />
              <Box className="cart-info">
                <Typography variant="h6">{item.name}</Typography>
                {item.addOns !== "" && <Typography variant="body2" color="text.secondary">Add-ons: {item.addOns}</Typography>}
                <Typography>₹{item.price * item.quantity}</Typography>
              </Box>
              <QuantityButtons quantity={item.quantity} onMinus={() => dispatch(changeQuantity({ key: item.key, change: -1 }))} onPlus={() => dispatch(changeQuantity({ key: item.key, change: 1 }))} />
              <IconButton aria-label="remove item" onClick={() => dispatch(removeItem(item.key))}><DeleteIcon /></IconButton>
            </Paper>
          ))}
        </Box>
        <Box className="cart-side">
          <Paper className="coupon-box">
            <TextField size="small" label="Coupon code" value={couponText} onChange={(e) => setCouponText(e.target.value)} />
            <Button variant="outlined" onClick={handleApplyCoupon}>Apply Coupon</Button>
          </Paper>
          {coupon !== "" && <Alert severity="success" onClose={() => dispatch(setCoupon(""))}>Coupon {coupon} applied</Alert>}
          <PriceSummary />
          <Button variant="contained" size="large" onClick={() => navigate("/checkout")}>Proceed to Checkout</Button>
        </Box>
      </Box>
      <Toast toast={toast} onClose={() => setToast(emptyToast)} />
    </Box>
  );
}
export default Cart;
