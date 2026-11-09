import { useState } from "react";
import { Dialog, DialogContent, DialogActions, Typography, Button, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { Food, AddOn } from "../types";
import { addOns } from "../data/mockData";
import QuantityButtons from "./QuantityButtons";
import "./FoodDetailsDialog.css";

interface Props { food: Food; onClose: () => void; onAdd: (food: Food, quantity: number, selectedAddOns: AddOn[]) => void; }

// Popup showing food details with add-ons and quantity. The price changes as the user selects add-ons.
function FoodDetailsDialog({ food, onClose, onAdd }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  const toggleAddOn = (addOn: AddOn) => {
    if (selectedAddOns.includes(addOn)) setSelectedAddOns(selectedAddOns.filter((a) => a !== addOn));
    else setSelectedAddOns([...selectedAddOns, addOn]);
  };
  const addOnPrice = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (food.price + addOnPrice) * quantity;

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent className="food-dialog-content">
        <img src={food.image} alt={food.name} className="dialog-image" />
        <Typography variant="h5">{food.name}</Typography>
        <Typography color="text.secondary">{food.description}</Typography>
        <Typography>Price: ₹{food.price}</Typography>
        {food.available && (
          <>
            <Typography variant="subtitle1">Customize / Add-ons</Typography>
            <FormGroup>
              {addOns.map((addOn) => (
                <FormControlLabel key={addOn.name} label={`${addOn.name} (+₹${addOn.price})`}
                  control={<Checkbox checked={selectedAddOns.includes(addOn)} onChange={() => toggleAddOn(addOn)} />} />
              ))}
            </FormGroup>
            <QuantityButtons quantity={quantity} onMinus={() => quantity > 1 && setQuantity(quantity - 1)} onPlus={() => setQuantity(quantity + 1)} />
          </>
        )}
        {!food.available && <Typography color="error">Currently not available</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!food.available} onClick={() => onAdd(food, quantity, selectedAddOns)}>Add to Cart - ₹{totalPrice}</Button>
      </DialogActions>
    </Dialog>
  );
}
export default FoodDetailsDialog;
