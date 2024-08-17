'use client'

import { useUser, UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { Box, Card, CardActionArea, Link, CardContent, Grid, Container, Button, Typography, AppBar, Toolbar, IconButton } from "@mui/material"
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../components/Sidebar';

export default function Flashcards(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()
    

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()
    }, [user])
    
    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    const handleDelete = async (flashcardId) => {
        if (!user) {
            console.error("User ID is undefined");
            return;
        }
    
        try {
            // Assuming "flashcards" is the name of the subcollection
            const flashcardRef = doc(db, "users", user.id, "flashcards", flashcardId);
            console.log("Attempting to delete document at path:", flashcardRef.path);
    
            await deleteDoc(flashcardRef);
            setFlashcards(prev => prev.filter(fc => fc.name !== flashcardId));
        } catch (error) {
            console.error("Error deleting collection:", error);
        }
    };

    return(
    <>
    <Sidebar /> 
    <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1300 }}>
        <UserButton />
    </Box>

    <Box className="bg-grid min-h-screen scrollbar">
            <Container maxWidth="md">
                <Box
                        sx={{
                            mt: 4,
                            mb: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 1,
                            position: 'relative',
                        }}
                    >
                        <Typography variant='h4' sx={{ pb: 2, fontWeight: 500 }} className="cycle-colors">Saved Flashcards </Typography>
                
       

            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ position: 'relative', '&:hover .delete-button': { opacity: 1 }, boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                                            borderRadius: '15px',
                                            background: 'linear-gradient(135deg, #ea8366 0%, #a26b4b 100%)', }}>
                            <CardActionArea onClick={() => (handleCardClick(flashcard.name))}>
                                <CardContent>  
                                    <Typography variant="h6">{flashcard.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                            <IconButton
                                className="delete-button"
                                onClick={() => handleDelete(flashcard.name)}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    </Grid>
                )

                )}
            </Grid>
            </Box>
        </Container>

    </Box>
</>)
}