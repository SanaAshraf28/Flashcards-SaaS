'use client'
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import Link from 'next/link';


export default function ContactForm() {
    return (
        <Box sx={{ pt:10, pb: 90, backgroundColor: "#000000", textAlign: 'center'}}>
            <Typography variant='h4' color={"white"} marginTop={40}>
                Thank you for contacting. We will get back to you as soon as possible.
            </Typography>
            <Link href={'/'}>
                <Button sx={{variant: 'contained', backgroundColor: "white", top : 10, color:'primary'}}>
                    Go Back
                </Button>
            </Link>
        </Box>
    )
}