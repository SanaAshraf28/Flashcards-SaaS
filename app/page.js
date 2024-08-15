'use client'
import { styled } from "@mui/material/styles";
import Sidebar from "./components/Sidebar";
import { Grid, Paper, Box, Button, Container, Typography, Link } from "@mui/material";
import { useUser, UserButton } from "@clerk/nextjs";
import getStripe from "@/utils/get-stripe";
import { motion } from "framer-motion";

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

const imageVariantsLeft = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1 },
  },
};

const imageVariantsRight = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, delay: 0.5 }, // Add delay for the right image
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
    <Box className="bg-grid min-h-screen scrollbar">
      <Sidebar />
      <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1300 }}>
        <UserButton />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10, pt: 10 }}>
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h2" className="cycle-colors">
            Welcome to <Box component="span" sx={{ fontWeight: 600}}>Notefy</Box>
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
              textTransform: "none",
              '&:hover': {
                backgroundColor: "#F9FAFB",
                color: "black",
              },
            }}
            href={isSignedIn ? "/generate" : "/sign-up"}
            className="font-thin"
          >
            Get Started
          </Button>
        </Box>

        <Grid container spacing={2} justifyContent="center" sx={{ my: 12 }}>
          <Grid item sx={{ mx: 3 }}>
            <motion.div variants={imageVariantsLeft} initial="hidden" animate="visible">
              <img src="/assets/Flashcards.jpg" alt="Flashcard 1" style={{ width: 500, height: 500 }} />
            </motion.div>
          </Grid>
          <Grid item sx={{ mx: 3 }}>
            <motion.div variants={imageVariantsRight} initial="hidden" animate="visible">
              <img src="/assets/Flashcards2.jpg" alt="Flashcard 2" style={{ width: 500, height: 500 }} />
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent="center" sx={{ my: 12 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" component="h2" sx={{ color: "#a2b3cd", mb: 3 }}>
              Key Features
            </Typography>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid container direction="column" spacing={3}>
                <Grid item>
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
                <Grid item>
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
                <Grid item>
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
          </Grid>
          <Grid item xs={12} md={8}>
            <motion.div variants={imageVariantsRight} initial="hidden" animate="visible">
              <img src="/assets/Students.jpg" alt="Students" style={{ width: 450, height: 'auto', paddingLeft: 5}} />
            </motion.div>
          </Grid>
        </Grid>

        <Box sx={{ my: 6, textAlign: "center", pb: 10 }}>
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
                    <Button sx={{
                      mt: 2,
                      px: 3,
                      py: 1,
                      color: "white",
                      backgroundColor: "#5f8ecf",
                      borderRadius: "8px",
                      textTransform: "none",
                      '&:hover': {
                        backgroundColor: "#F9FAFB",
                        color: "black",
                      },
                    }}>
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
                    <Button sx={{
                      mt: 2,
                      px: 3,
                      py: 1,
                      color: "white",
                      backgroundColor: "#5f8ecf",
                      borderRadius: "8px",
                      textTransform: "none",
                      '&:hover': {
                        backgroundColor: "#F9FAFB",
                        color: "black",
                      },
                    }} onClick={handleSubmit}>
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
