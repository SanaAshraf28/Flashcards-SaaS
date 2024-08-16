'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { AppBar, Toolbar, Link, Button, IconButton, CardActionArea, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, Box, Paper, Grid, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import Sidebar from '../components/Sidebar';  // Import the Sidebar component

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [flipped, setFlipped] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        }
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setText('');
        setYoutubeLink('');
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
        setFile(null);
        setYoutubeLink('');
    };

    const handleYoutubeLinkChange = (e) => {
        setYoutubeLink(e.target.value);
        setText('');
        setFile(null);
    };

    const extractTextFromPDF = async (file) => {
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.onload = async () => {
                try {
                    const arrayBuffer = fileReader.result;
                    const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
                    let text = '';
                    for (let i = 0; i < pdf.numPages; i++) {
                        const page = await pdf.getPage(i + 1);
                        const content = await page.getTextContent();
                        const pageText = content.items.map(item => item.str).join(' ');
                        text += pageText + '\n';
                    }
                    resolve(text);
                } catch (error) {
                    reject(error);
                }
            };
            fileReader.onerror = (error) => reject(error);
            fileReader.readAsArrayBuffer(file);
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setText('');
        setFlashcards([]);
        let extractedText = text;

        if (file) {
            extractedText = await extractTextFromPDF(file);
        }

        let url = '/api/generate';
        let body = { text: extractedText };

        if (youtubeLink) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            url = 'http://localhost:5000/api/generate-flashcards';
            body = { youtube_url: youtubeLink };
        }

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then((res) => res.json())
        .then((data) => {
            setFlashcards(data.flashcards || []);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching flashcards:', error);
            setLoading(false);
        });
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
        handleClose();
        router.push('/flashcards');
    };

    return (
    <>
        <Sidebar /> {/* Include the Sidebar component */}
        
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
                    <Typography variant='h4'>Generate Flashcards</Typography>
                    <Paper sx={{ p: 4, width: '100%', zIndex: 1, backgroundColor: 'white' }}>
                        <Typography variant='h6' gutterBottom>
                            Upload PDF, Enter Text, or Input YouTube Link
                        </Typography>

                        {/* Text Input Section */}
                        <TextField 
                            value={text} 
                            onChange={handleTextChange} 
                            label="Enter Text"
                            fullWidth
                            multiline
                            rows={4}
                            variant='outlined'
                            helperText="Type or paste text here to generate flashcards."
                            sx={{ mb: 2 }}
                        />
                        
                        <Typography variant='body1' align="center" sx={{ my: 2 }}>
                            OR
                        </Typography>

                        {/* YouTube Link Input Section */}
                        <TextField 
                            value={youtubeLink} 
                            onChange={handleYoutubeLinkChange} 
                            label="Enter YouTube Link"
                            fullWidth
                            variant='outlined'
                            helperText="Enter a YouTube link to generate flashcards."
                            sx={{ mb: 2 }}
                        />

                        <Typography variant='body1' align="center" sx={{ my: 2 }}>
                            OR
                        </Typography>

                        {/* File Upload Section */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                            <Button
                                variant="contained"
                                component="label"
                                color="secondary"
                            >
                                Upload PDF
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    hidden
                                />
                            </Button>
                            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                                Upload a PDF to extract text for flashcard generation.
                            </Typography>
                        </Box>

                        {/* Submit Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            fullWidth
                        >
                            Submit
                        </Button>
                    </Paper>
                </Box>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress /> 
                    </Box>
                )}

                {flashcards.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant='h5'>Flashcards Preview</Typography>
                        <Grid container spacing={3}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardActionArea
                                            onClick={() => {
                                                handleCardClick(index);
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
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
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Button variant='contained' color='secondary' onClick={handleOpen}>
                                Save
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Dialog for saving flashcards */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Save Flashcards</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
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
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={saveFlashcards}>Save</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    </>
    );
}
