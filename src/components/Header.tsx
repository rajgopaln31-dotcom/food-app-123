import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Badge, Menu, MenuItem } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logoutUser } from "../slices/authSlice";
import "./Header.css";

function Header() {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const goTo = (path: string) => { setMenuAnchor(null); navigate(path); };
  const handleLogout = () => { setMenuAnchor(null); dispatch(logoutUser()); navigate("/"); };

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar className="header-toolbar">
        <Link to="/home"><img src="/images/logo.svg" alt="FoodieGo logo" className="logo" /></Link>
        {/* Navigation buttons: hidden on small screens (shown inside the menu instead) */}
        <div className="nav-links">
          <Button onClick={() => goTo("/home")}>Home</Button>
          <Button onClick={() => goTo("/restaurants")}>Restaurants</Button>
          <Button onClick={() => goTo("/orders")}>My Orders</Button>
        </div>
        <div className="header-icons">
          <IconButton aria-label="cart" onClick={() => goTo("/cart")}>
            <Badge badgeContent={cartCount} color="primary" showZero><ShoppingCartIcon /></Badge>
          </IconButton>
          <IconButton aria-label="profile" onClick={(event) => setMenuAnchor(event.currentTarget)}><AccountCircleIcon /></IconButton>
        </div>
        <Menu anchorEl={menuAnchor} open={menuAnchor !== null} onClose={() => setMenuAnchor(null)}>
          <MenuItem disabled>{currentUser?.name}</MenuItem>
          <MenuItem className="mobile-only" onClick={() => goTo("/home")}>Home</MenuItem>
          <MenuItem className="mobile-only" onClick={() => goTo("/restaurants")}>Restaurants</MenuItem>
          <MenuItem onClick={() => goTo("/orders")}>My Orders</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
export default Header;
