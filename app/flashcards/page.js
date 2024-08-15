'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { Card, CardActionArea, Link, CardContent, Grid, Container, Button, Typography, AppBar, Toolbar, IconButton } from "@mui/material"
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import DeleteIcon from '@mui/icons-material/Delete';

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
        console.log(flashcardId)
        if (!user) {
          console.error("User ID is undefined");
          return;
        }
    
        try {
            const flashcardRef = doc(db, "users", user.id, flashcardId);
            console.log("Attempting to delete document at path:", flashcardRef.path);
            await deleteDoc(flashcardRef);
            setFlashcards(prev => prev.filter(fc => fc.id !== flashcardId));
        } catch (error) {
            console.error("Error deleting collection:", error);
            // /users/user_2kfyDkAIH7inEEdtBfBOmScVgmQ/Planets
        }
      };

    return(<Container maxWidth="100vw">
        <AppBar position="static" sx={{backgroundColor: '#3f51b5'}} maxWidth='100%'>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="home"
                    href="/generate"
                    >
                    <ArrowBackIosNewRoundedIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
        <Grid container spacing = {3} sx={{mt: 4}}>
            {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm = {6} md = {4} key = {index}>
                <Card sx={{ position: 'relative', '&:hover .delete-button': { opacity: 1 } }}>
                    <CardActionArea onClick={()=>(handleCardClick(flashcard.name))}>
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
    </Container>)
}