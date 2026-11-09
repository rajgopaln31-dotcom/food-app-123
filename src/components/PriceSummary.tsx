import { Paper, Typography, Divider } from "@mui/material";
import { useAppSelector } from "../hooks";
import { getTotals } from "../slices/cartSlice";
import "./PriceSummary.css";

// Shows subtotal, discount, delivery, tax and total. Used in Cart, Checkout and Payment pages.
function PriceSummary({ showItems }: { showItems?: boolean }) {
  const { items, coupon } = useAppSelector((state) => state.cart);
  const totals = getTotals(items, coupon);

  const row = (label: string, value: string) => (
    <div className="summary-row"><span>{label}</span><span>{value}</span></div>
  );

  return (
    <Paper className="price-summary">
      <Typography variant="h6">Price Summary</Typography>
      {showItems && items.map((item) => row(`${item.name} x ${item.quantity}`, `₹${item.price * item.quantity}`))}
      {showItems && <Divider />}
      {row("Subtotal", `₹${totals.subtotal}`)}
      {totals.discount > 0 && row(`Discount (${coupon})`, `- ₹${totals.discount}`)}
      {row("Delivery charges", `₹${totals.delivery}`)}
      {row("Taxes (5%)", `₹${totals.tax}`)}
      <Divider />
      <div className="summary-row total-row"><span>Total</span><span>₹{totals.total}</span></div>
    </Paper>
  );
}
export default PriceSummary;
