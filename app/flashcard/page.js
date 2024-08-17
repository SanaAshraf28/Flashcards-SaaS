'use client'

import { useUser, UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { Button, Grid, Card, CardActionArea, CardContent, Container, Typography, Box } from '@mui/material'
import { useSearchParams } from "next/navigation"
import Sidebar from '../components/Sidebar';
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import SlideshowIcon from '@mui/icons-material/Slideshow';



export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    const router = useRouter();

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            console.log(colRef)
            const docs = await getDocs(colRef)
            console.log(docs)
            const flashcards = []

            docs.forEach((doc) => (
                flashcards.push({id: doc.id, ...doc.data()})
            ))
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [user, search])

    const handleSlideshow = () => {
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        router.push('/slideshow');
    };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
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
                        
                        <Typography
                            variant='h4'
                            sx={{
                                pb: 2,
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                            className="cycle-colors"
                        >
                            <Button
                                onClick={() => router.push('/flashcards')}
                            >
                                <IoArrowBack size={24} color="white" />
                            </Button>
                            Saved Flashcards
                            <Button
                            startIcon={<SlideshowIcon />}
                            onClick={handleSlideshow}
                            sx={{ ml: 2 }}
                            >
                            </Button>
                        </Typography>
                        <Container maxWidth = "100vw">
                        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        sx={{
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                                            borderRadius: '15px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            width: '105%',
                                            perspective: '1000px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        }}
                                    >
                                        <CardActionArea onClick={() => handleCardClick(index)}>
                                            <CardContent>
                                                <Box sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '260px',
                                                
                                                        transform: flipped[index] 
                                                            ? 'rotateY(180deg)'
                                                            : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box',
                                                        color: '#fff', 
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)',
                                                    },
                                                }}>
                                                    <div>
                                                        <div>
                                                            <Typography variant="h5" component="div">
                                                                {flashcard.front}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography variant="h5" component="div">
                                                                {flashcard.back}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                ))}
            </Grid>
        </Container>
    </Box>
    </Container>
    </Box>
    </>
    )

}