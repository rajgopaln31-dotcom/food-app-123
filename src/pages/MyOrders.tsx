import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useAppSelector } from "../hooks";
import "./MyOrders.css";

function MyOrders() {
  const orders = useAppSelector((state) => state.order.orders);
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <Paper className="orders-empty">
        <Typography variant="h5">You have no orders yet</Typography>
        <Button variant="contained" onClick={() => navigate("/restaurants")}>Order Now</Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h5">My Orders</Typography>
      <Box className="orders-list">
        {orders.map((order) => (
          <Paper key={order.id} className="order-card">
            <Box>
              <Typography variant="h6">{order.restaurantName}</Typography>
              <Typography variant="body2">Order ID: {order.id} • {new Date(order.createdAt).toLocaleString()}</Typography>
              <Typography variant="body2">{order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}</Typography>
              <Typography>Total: ₹{order.total}</Typography>
            </Box>
            <Button variant="outlined" onClick={() => navigate(`/order-confirmation/${order.id}`)}>Track Order</Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
export default MyOrders;
