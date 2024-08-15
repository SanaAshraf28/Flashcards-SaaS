'use client'
import { styled } from "@mui/material/styles";
import Sidebar from "./components/Sidebar";
import { Grid, Paper, Box, Button, Container, Typography, Link } from "@mui/material";
import { useUser, UserButton } from "@clerk/nextjs";
import getStripe from "@/utils/get-stripe";
import { motion } from "framer-motion";  // Import Framer Motion

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1 },
  },
};

const pricing1 = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, delay: 1.5 },
  },
};

const pricing2 = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, delay: 2 },
  },
};

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
              color: "white",
              backgroundColor: "#5f8ecf",
              borderRadius: "8px",
              fontWeight: "bold",
              textTransform: "none",
              '&:hover': {
                backgroundColor: "#F9FAFB",
                color: "black",
              },
            }}
            href={isSignedIn ? "/generate" : "/sign-up"}
          >
            Get Started
          </Button>

        </Box>

        <Box sx={{ my: 6 }}>
          <Typography variant="h4" component="h2" align="center" sx={{ color: "#a2b3cd", pb: 3 }}>
            Key Features
          </Typography>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={4}>
                <motion.div variants={itemVariants}>
                  <Item>
                    <Typography variant="h6" sx={{ color: "black" }}>
                      Feature 1
                    </Typography>
                    <Typography sx={{ color: "black" }}>
                      Input your materials and get your flashcards today!
                    </Typography>
                  </Item>
                </motion.div>
              </Grid>
              <Grid item xs={4}>
                <motion.div variants={itemVariants}>
                  <Item>
                    <Typography variant="h6" sx={{ color: "black" }}>
                      Feature 2
                    </Typography>
                    <Typography sx={{ color: "black" }}>
                      Input your materials and get your flashcards today!
                    </Typography>
                  </Item>
                </motion.div>
              </Grid>
              <Grid item xs={4}>
                <motion.div variants={itemVariants}>
                  <Item>
                    <Typography variant="h6" sx={{ color: "black" }}>
                      Feature 3
                    </Typography>
                    <Typography sx={{ color: "black" }}>
                      Input your materials and get your flashcards today!
                    </Typography>
                  </Item>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Box>

        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h4" sx={{ color: "#a2b3cd", pb: 4 }}>
            Pricing
          </Typography>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignItems={"center"}>
              <Grid item xs={6}>
                <motion.div variants={pricing1}>
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
                </motion.div>
              </Grid>

              <Grid item xs={6}>
                <motion.div variants={pricing2}>
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
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
