'use client'
import { styled } from "@mui/material/styles";
import Sidebar from "./components/Sidebar";
import { Grid, Paper, Box, Button, Container, Typography, Link } from "@mui/material";
import { useUser, UserButton } from "@clerk/nextjs";
import getStripe from "@/utils/get-stripe";
import { useState } from "react";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const { isSignedIn } = useUser();

  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ origin: "https://localhost:3000" }),
    });

    if (!checkoutSession.ok) {
      throw new Error(`HTTP error! status: ${checkoutSession.status}`);
    }

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSessionJson.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <Box className="bg-grid min-h-screen">
      <Sidebar />
      <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1300 }}>
        <UserButton />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10, top: 100 }}>
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h3" className="cycle-colors">
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h5" sx={{ color: "gray" }}>
            Build your flashcards today!
          </Typography>
          <Button
  sx={{
    mt: 2,
    px: 3,
    py: 1,
    color: "white",  // White text color
    backgroundColor: "#5f8ecf",
    borderRadius: "8px",  // Fully rounded button
    fontWeight: "bold",  // Bold text
    textTransform: "none",
    '&:hover': {
      backgroundColor: "#F9FAFB",  // Slightly darker on hover
      color: "black",  // Change text color on hover
    },
  }}
  href={isSignedIn ? "/generate" : "/sign-up"}
>
  Get Started
</Button>

        </Box>

        <Box sx={{ my: 6 }}>
          <Typography variant="h4" component="h2" align="center" sx={{ color: "white" }}>
            Key Features
          </Typography>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={4}>
              <Item>
                <Typography variant="h6" sx={{ color: "black" }}>
                  Feature 1
                </Typography>
                <Typography sx={{ color: "black" }}>
                  Input your materials and get your flashcards today!
                </Typography>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Typography variant="h6" sx={{ color: "black" }}>
                  Feature 2
                </Typography>
                <Typography sx={{ color: "black" }}>
                  Input your materials and get your flashcards today!
                </Typography>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Typography variant="h6" sx={{ color: "black" }}>
                  Feature 3
                </Typography>
                <Typography sx={{ color: "black" }}>
                  Input your materials and get your flashcards today!
                </Typography>
              </Item>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h4" sx={{ color: "white" }}>
            Pricing
          </Typography>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignItems={"center"}>
            <Grid item xs={6}>
              <Item>
                <Typography variant="h6" gutterBottom sx={{ color: "black" }}>
                  Basic Plan
                </Typography>
                <Typography sx={{ color: "black" }}>
                  Access to basic features and limited storage
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
                  Go Basic
                </Button>
              </Item>
            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography variant="h6" gutterBottom sx={{ color: "black" }}>
                  Premium
                </Typography>
                <Typography sx={{ color: "black" }}>
                  Input your materials and get your flashcards today!
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleSubmit}>
                  Go Pro
                </Button>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
