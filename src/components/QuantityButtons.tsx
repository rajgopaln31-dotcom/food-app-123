import { IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./QuantityButtons.css";

interface Props { quantity: number; onMinus: () => void; onPlus: () => void; }

function QuantityButtons({ quantity, onMinus, onPlus }: Props) {
  return (
    <div className="quantity-box">
      <IconButton size="small" aria-label="decrease" onClick={onMinus}><RemoveIcon /></IconButton>
      <Typography>{quantity}</Typography>
      <IconButton size="small" aria-label="increase" onClick={onPlus}><AddIcon /></IconButton>
    </div>
  );
}
export default QuantityButtons;
