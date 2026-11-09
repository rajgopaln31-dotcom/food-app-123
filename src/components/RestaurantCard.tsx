import { useNavigate } from "react-router-dom";
import { Card, CardActionArea, CardMedia, CardContent, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Restaurant } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { toggleFavourite } from "../slices/favouriteSlice";
import "./RestaurantCard.css";

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favouriteIds = useAppSelector((state) => state.favourite.ids);
  const isFavourite = favouriteIds.includes(restaurant.id);

  return (
    <Card className="restaurant-card">
      <CardActionArea onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
        <CardMedia component="img" image={restaurant.image} alt={restaurant.name} className="restaurant-image" />
      </CardActionArea>
      <CardContent>
        <div className="card-title-row">
          <Typography variant="h6">{restaurant.name}</Typography>
          <IconButton aria-label="favourite" onClick={() => dispatch(toggleFavourite(restaurant.id))}>
            {isFavourite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </div>
        <Typography variant="body2" color="text.secondary">
          {restaurant.category} • ⭐ {restaurant.rating} • {restaurant.time} mins • ₹{restaurant.priceForTwo} for two
        </Typography>
      </CardContent>
    </Card>
  );
}
export default RestaurantCard;
