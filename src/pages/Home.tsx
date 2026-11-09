import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, MenuItem, Card, CardActionArea, CardMedia, CardContent, Alert } from "@mui/material";
import { Restaurant, Food } from "../types";
import { getRestaurants, getAllFoods } from "../services/api";
import { categories, locations } from "../data/mockData";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSearch, setCategory, setLocation } from "../slices/restaurantSlice";
import RestaurantCard from "../components/RestaurantCard";
import CardSkeleton from "../components/CardSkeleton";
import "./Home.css";

function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchText, setSearchText] = useState("");
  const location = useAppSelector((state) => state.restaurant.location);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Load data once when the page opens
  useEffect(() => {
    Promise.all([getRestaurants(), getAllFoods()])
      .then(([restaurantList, foodList]) => { setRestaurants(restaurantList); setFoods(foodList); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const handleSearch = () => { dispatch(setSearch(searchText)); navigate("/restaurants"); };
  const handleCategory = (name: string) => { dispatch(setCategory(name)); dispatch(setSearch("")); navigate("/restaurants"); };

  const popularRestaurants = [...restaurants].sort((a, b) => b.reviews - a.reviews).slice(0, 3);
  const topRatedRestaurants = restaurants.filter((restaurant) => restaurant.rating >= 4.5);
  const recommendedFoods = foods.filter((food) => food.category === "Main Course" && food.available);
  const banners = [{ image: "/images/banner1.svg", alt: "10% off with SAVE10" }, { image: "/images/banner2.svg", alt: "Rs 50 off with FLAT50" }];

  return (
    <Box>
      {/* Delivery location and search bar */}
      <Box className="hero">
        <TextField select size="small" label="Delivery Location" value={location} onChange={(e) => dispatch(setLocation(e.target.value))} className="location-box">
          {locations.map((place) => <MenuItem key={place} value={place}>{place}</MenuItem>)}
        </TextField>
        <TextField size="small" label="Search restaurants or food" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="search-box" />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>

      {/* Categories */}
      <Typography variant="h5" className="section-title">What's on your mind?</Typography>
      <Box className="category-row">
        {categories.map((category) => (
          <Box key={category.name} className="category-item" onClick={() => handleCategory(category.name)}>
            <img src={category.image} alt={category.name} />
            <Typography variant="body2">{category.name}</Typography>
          </Box>
        ))}
      </Box>

      {/* Offers */}
      <Box className="banner-grid section-title">
        {banners.map((banner) => <img key={banner.image} src={banner.image} alt={banner.alt} onClick={() => navigate("/restaurants")} />)}
      </Box>

      {error && <Alert severity="error">Could not load data. Please refresh the page.</Alert>}
      {loading && <CardSkeleton />}

      {!loading && !error && (
        <>
          <Typography variant="h5" className="section-title">Popular Restaurants</Typography>
          <Box className="card-grid">{popularRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}</Box>

          <Typography variant="h5" className="section-title">Recommended Food</Typography>
          <Box className="card-grid">
            {recommendedFoods.map((food) => (
              <Card key={food.id}>
                <CardActionArea onClick={() => navigate(`/restaurant/${food.restaurantId}`)}>
                  <CardMedia component="img" image={food.image} alt={food.name} className="food-image" />
                  <CardContent>
                    <Typography variant="h6">{food.name}</Typography>
                    <Typography variant="body2" color="text.secondary">₹{food.price}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>

          <Typography variant="h5" className="section-title">Top Rated Restaurants</Typography>
          <Box className="card-grid">{topRatedRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}</Box>
        </>
      )}
    </Box>
  );
}
export default Home;
