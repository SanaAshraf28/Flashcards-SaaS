'use client';
import { useUser, UserButton } from '@clerk/nextjs';
import { CardActionArea, Card, CardContent, Container, Dialog, DialogActions, TextField, DialogContent, DialogContentText, DialogTitle, Typography, Box, Paper, Grid, CircularProgress, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { writeBatch, doc, collection, getDoc,  } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'next/navigation';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import DataInput from '../components/DataInput';  // Import the DataInput component

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        }
    }, []);

    const handleSubmit = async ({ activeTab, file, text, youtubeLink }) => {
        setLoading(true);
        setFlashcards([]);
        let extractedText = text;

        if (activeTab === 'pdf' && file) {
            extractedText = await extractTextFromPDF(file);
        }

        let url = '/api/generate';
        let body = { text: extractedText };

        if (activeTab === 'youtube' && youtubeLink) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            //url = 'https://flashcards-saas.onrender.com/api/generate-flashcards';
            url = '/api/generate-flashcards';
            body = { youtube_url: youtubeLink };
        }

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then((res) => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(`Server error: ${text}`);
                });
            }
            return res.json();
        })
        .then((data) => {
            console.log('Server response:', data);
            setFlashcards(activeTab === 'youtube' ? data.flashcards || [] : data);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching flashcards:', error);
            setLoading(false);
        });
    };

    const extractTextFromPDF = async (file) => {
        const fileReader = new FileReader();
    
        // Create a promise that resolves when the file is read
        const arrayBuffer = await new Promise((resolve, reject) => {
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
            fileReader.readAsArrayBuffer(file);
        });
    
        // Load the PDF document
        const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
    
        let text = '';
        // Extract text from each page
        for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(' ');
            text += pageText + '\n';
        }
    
        return text;
    };
    
        

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }
        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists.');
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }
        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });
        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

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
                    <Typography variant='h4' sx={{ pt:4, pb: 0, fontWeight: 500 }} className="cycle-colors">Generate Flashcards</Typography>
                    
                    {/* Data Input Area */}
                    <DataInput onSubmit={handleSubmit} />
                </Box>

                {flashcards.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant='h5'>Flashcards Preview</Typography>
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
                        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant='contained'
                                color='secondary'
                                sx={{
                                    padding: '10px 30px',
                                    fontSize: '16px',
                                    borderRadius: '50px',
                                    background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                                    color: '#fff',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                                    },
                                }}
                                onClick={handleOpen}
                            >
                                Save Flashcards
                            </Button>
                        </Box>
                    </Box>
                )}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontWeight: 'bold',
                            color: '#333',
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            fontSize: '24px',
                        }}
                    >
                        Save Flashcards
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText
                            sx={{
                                textAlign: 'center',
                                mb: 3,
                                color: '#666',
                                fontSize: '16px',
                            }}
                        >
                            Please enter a name for your flashcards collection
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin='dense'
                            label="Collection Name"
                            type='text'
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: '#f7f9fc',
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <Button
                            onClick={handleClose}
                            sx={{
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: '50px',
                                padding: '8px 20px',
                                '&:hover': {
                                    backgroundColor: '#777',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={saveFlashcards}
                            sx={{
                                color: '#fff',
                                backgroundColor: '#1976d2',
                                borderRadius: '50px',
                                padding: '8px 20px',
                                '&:hover': {
                                    backgroundColor: '#005bb5',
                                },
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    </>
    );
}
