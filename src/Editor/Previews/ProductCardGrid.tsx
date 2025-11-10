import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Rating,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ShoppingCart, Favorite, FavoriteBorder } from "@mui/icons-material";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  discount: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    discount: 30,
  },
  {
    id: 2,
    name: "Wireless Mouse",
    price: 34.99,
    originalPrice: 49.99,
    rating: 4.2,
    reviews: 89,
    inStock: true,
    discount: 30,
  },
  {
    id: 3,
    name: "USB-C Cable",
    price: 14.99,
    originalPrice: 24.99,
    rating: 4.8,
    reviews: 312,
    inStock: false,
    discount: 40,
  },
  {
    id: 4,
    name: "Portable Charger",
    price: 59.99,
    originalPrice: 89.99,
    rating: 4.6,
    reviews: 245,
    inStock: true,
    discount: 33,
  },
];

export default function ProductCardGrid() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (productId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3" marginBottom={4} fontWeight="bold">
        Featured Products
      </Typography>

      <Grid container spacing={3}>
        {PRODUCTS.map((product) => (
          <Grid
            key={product.id}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 4,
                },
                position: "relative",
              }}
            >
              {/* Discount Badge */}
              {product.discount > 0 && (
                <Chip
                  label={`-${product.discount}%`}
                  color="error"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontWeight: "bold",
                    zIndex: 1,
                  }}
                />
              )}

              {/* Product Image Placeholder */}
              <Box
                sx={{
                  width: "100%",
                  paddingTop: "100%",
                  position: "relative",
                  backgroundColor: "action.hover",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Product Image
                </Typography>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>

                {/* Rating */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    marginBottom: 2,
                  }}
                >
                  <Rating
                    value={product.rating}
                    readOnly
                    size="small"
                    precision={0.1}
                  />
                  <Typography variant="caption" color="text.secondary">
                    ({product.reviews})
                  </Typography>
                </Box>

                {/* Price */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through" }}
                  >
                    ${product.originalPrice.toFixed(2)}
                  </Typography>
                </Box>

                {/* Stock Status */}
                <Typography
                  variant="caption"
                  color={product.inStock ? "success.main" : "error.main"}
                  sx={{ marginTop: 1, display: "block" }}
                >
                  {product.inStock ? "✓ In Stock" : "Out of Stock"}
                </Typography>
              </CardContent>

              <CardActions sx={{ gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  disabled={!product.inStock}
                >
                  Add to Cart
                </Button>
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => toggleFavorite(product.id)}
                >
                  {favorites.has(product.id) ? (
                    <Favorite color="error" />
                  ) : (
                    <FavoriteBorder />
                  )}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

