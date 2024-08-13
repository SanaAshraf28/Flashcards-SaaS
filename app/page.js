"use client"

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { experimentalStyled as styled } from '@mui/material/styles';
import { Grid, Paper, Box, Button, Container, AppBar, Toolbar, Typography } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const handleSubmit = async ()=>{
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        origin: 'https://localhsot:3000',
      }
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }
  return (
    <Container maxWidth='lg'>
      <Head>
        <title>
          Flashcard Saas
        </title>
        <meta name="description" content = "Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant = "h6" style={{flexGrow:1}}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in"> Login </Button>
            <Button color="inherit" href="/sign-up"> Register </Button>
          </SignedOut>
        </Toolbar>
      </AppBar>

      <Box
        sx={({
          textAlign: "center",
          my:4,
        })}>
        <Typography variant = "h3"> Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5">
          Build your flashcards today!
        </Typography>
        <Button variant="contained" color="primary" sx={{at: 2}}>
          Get Started
        </Button>
      </Box>
      <Box sx = {{my: 6}}>
        <Typography variant="h4" components="h2" align="center">
          Key Features
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={4}>
            <Item><Typography variant="h6">
              Feature 1
            </Typography>
            <Typography> {' '} Input your materials and get your flashcards today!</Typography></Item>
          </Grid>
          <Grid item xs={4}>
            <Item><Typography variant="h6">
              Feature 2
            </Typography>
            <Typography> {' '} Input your materials and get your flashcards today!</Typography></Item>
          </Grid>
          <Grid item xs={4}>
            <Item><Typography variant="h6">
              Feature 3
            </Typography>
            <Typography> {' '} Input your materials and get your flashcards today!</Typography></Item>
          </Grid>
        </Grid>
      </Box>

     
      <Box sx = {{my: 6, textAlign: 'center'}}>
        <Typography variant="h4">
          Pricing
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignItems={"center"}>
          <Grid item xs={6}>
            <Item><Typography variant="h6" gutterBottom>
              Basic Plan
            </Typography>
            <Typography> {' '} Access to basic features and limited storage</Typography>
            <Button variant="contained" color="secondary" sx={{mt:2}}>
              Go Basic
            </Button>
            </Item>
          </Grid>

          <Grid item xs={6}>
            <Item><Typography variant="h6" gutterBottom>
              Premium
            </Typography>
            <Typography> {' '} Input your materials and get your flashcards today!</Typography>
            <Button variant="contained" color="secondary" sx={{mt:2}} onClick={handleSubmit} >
              Go Pro
            </Button>
            </Item>
          </Grid>

        </Grid>

      </Box>
    </Container>
  );
}
