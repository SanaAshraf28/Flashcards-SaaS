'use client';
import { useUser, UserButton } from '@clerk/nextjs';
import { Button, CardActionArea, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, Box, Paper, Grid, CircularProgress, Tabs, Tab, AppBar  } from '@mui/material';
import { useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    const [section, setSection] = useState('text');
    const [fileUploaded, setFileUploaded] = useState(false);
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
        setFileUploaded(true);
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
        setFile(null);
        setYoutubeLink('');
        setFileUploaded(false);
    };

    const handleYoutubeLinkChange = (e) => {
        setYoutubeLink(e.target.value);
        setText('');
        setFile(null);
        setFileUploaded(false);
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
        console.log(youtubeLink===true);
        if (youtubeLink) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            //url = `${apiUrl}/api/generate-flashcards`;
            url = 'http://localhost:5000/api/generate-flashcards';
            body = { youtube_url: youtubeLink };
        }
        console.log(body);
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then((res) => res.json())
        .then((data) => {
            if(youtubeLink){
                setFlashcards(data.flashcards || []);
            }else{setFlashcards(data);}
            
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
                        <Typography variant='h4' sx={{ pb: 2, fontWeight: 500 }} className="cycle-colors">Generate Flashcards</Typography>
                        <Paper sx={{ p: 4, width: '100%', zIndex: 1, backgroundColor: 'white' }}>
                            {/* Tabs for section navigation */}
                            <Tabs
                                value={section}
                                onChange={(event, newValue) => setSection(newValue)}
                                aria-label="Flashcard generation options"
                                sx={{ mb: 2 }}
                            >
                                <Tab label="Enter Text" value="text" />
                                <Tab label="Enter YouTube Link" value="youtube" />
                                <Tab label="Upload PDF" value="pdf" />
                            </Tabs>


                            {/* Text Section */}
                            {section === 'text' && (
                                <Box>
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
                                </Box>
                            )}

                            {/* YouTube URL Section */}
                            {section === 'youtube' && (
                                <Box>
                                    <TextField 
                                        value={youtubeLink} 
                                        onChange={handleYoutubeLinkChange} 
                                        label="Enter YouTube Link"
                                        fullWidth
                                        variant='outlined'
                                        helperText="Enter a YouTube link to generate flashcards."
                                        sx={{ mb: 2 }}
                                    />
                                </Box>
                            )}

                            {/* PDF Upload Section */}
                            {section === 'pdf' && (
                                <Box>
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
                                        {fileUploaded && (
                                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                File Uploaded: {file ? file.name : 'No file selected'}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}

                            {/* Submit Button */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                fullWidth
                                disabled={loading}
                                sx={{ mt: 4 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Submit'}
                            </Button>
                        </Paper>
                    </Box>



                                {flashcards.length > 0 && (
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography 
                            variant='h4' 
                            sx={{ 
                                mb: 3, 
                                fontWeight: 'bold', 
                                textTransform: 'uppercase', 
                                color: '#1976d2',
                                letterSpacing: '0.1em'
                            }}
                        >
                            Flashcards Preview
                        </Typography>
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

                /* Dialog for saving flashcards */
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
