import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Paper, Button, Stepper, Step, StepLabel, Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAppSelector } from "../hooks";
import "./OrderConfirmation.css";

const statuses = ["Order Placed", "Order Confirmed", "Preparing", "Ready for Pickup", "On the Way", "Delivered"];

function OrderConfirmation() {
  const { id } = useParams();
  const order = useAppSelector((state) => state.order.orders.find((o) => o.id === id));
  const [now, setNow] = useState(Date.now());
  const timelineRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Simulated tracking: re-check the time every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 2000);
    return () => clearInterval(timer);
  }, []);

  if (!order) return <Alert severity="error">Order not found.</Alert>;

  // The status moves forward every 8 seconds (mock data)
  const step = Math.min(5, Math.floor((now - order.createdAt) / 8000));
  const deliveryTime = new Date(order.createdAt + 35 * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const a = order.address;

  return (
    <Box className="confirm-page">
      <Paper className="confirm-box">
        <CheckCircleIcon color="success" className="success-icon" />
        <Typography variant="h5">Order placed successfully!</Typography>
        <Typography>Order ID: <b>{order.id}</b></Typography>
        <Typography>Restaurant: {order.restaurantName}</Typography>
        <Typography>Payment: {order.paymentMethod.toUpperCase()}</Typography>
        <Typography>Estimated delivery: {deliveryTime} (about 35 mins)</Typography>
        <Typography>Delivery address: {a.fullName}, {a.house}, {a.street}, {a.city}, {a.state} - {a.pin}</Typography>
        <Typography variant="h6">Items</Typography>
        {order.items.map((item) => <Typography key={item.key}>{item.name} x {item.quantity} - ₹{item.price * item.quantity}</Typography>)}
        <Typography variant="h6">Total paid: ₹{order.total}</Typography>
      </Paper>

      <Paper className="confirm-box" ref={timelineRef}>
        <Typography variant="h6">Order Status (simulated)</Typography>
        <Stepper activeStep={step === 5 ? 6 : step} orientation="vertical">
          {statuses.map((status) => <Step key={status}><StepLabel>{status}</StepLabel></Step>)}
        </Stepper>
      </Paper>

      <Box className="confirm-buttons">
        <Button variant="contained" onClick={() => timelineRef.current?.scrollIntoView({ behavior: "smooth" })}>Track Order</Button>
        <Button variant="outlined" onClick={() => navigate("/home")}>Continue Shopping</Button>
        <Button variant="outlined" onClick={() => navigate("/orders")}>View My Orders</Button>
      </Box>
    </Box>
  );
}
export default OrderConfirmation;
