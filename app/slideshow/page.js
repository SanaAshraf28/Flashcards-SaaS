"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Sidebar from '../components/Sidebar';
import { UserButton } from "@clerk/nextjs";
import GridOnIcon from '@mui/icons-material/GridOn';
import { IoArrowBack } from "react-icons/io5";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { IconButton } from '@mui/material';

export default function Slideshow() {
    const router = useRouter();
    const [announcementsEnabled, setAnnouncementsEnabled] = useState(false);
    const [flashcards, setFlashcards] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [flipped, setFlipped] = useState({});
    const [synth, setSynth] = useState(null);
    const [currentUtterance, setCurrentUtterance] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedFlashcards = localStorage.getItem('flashcards');
            if (storedFlashcards) {
                try {
                    setFlashcards(JSON.parse(storedFlashcards));
                } catch (error) {
                    console.error("Error parsing flashcards from localStorage:", error);
                    router.push('/flashcards'); // Redirect or handle error
                }
            } else {
                console.error("No flashcards found in local storage.");
                router.push('/flashcards'); // Redirect or handle error
            }
            setSynth(window.speechSynthesis)
        }
    }, [router]);

    useEffect(() => {
        if (synth && announcementsEnabled) {
            if (currentUtterance) {
                synth.cancel(); // Stop any ongoing speech
            }
            
            const utterance = new SpeechSynthesisUtterance(flashcards[currentSlide]?.front);
            setCurrentUtterance(utterance);
            synth.speak(utterance);

            // Clean up current utterance on component unmount
            return () => {
                if (currentUtterance) {
                    synth.cancel();
                }
            };
        }
    }, [currentSlide, announcementsEnabled, flashcards, synth]);


    const handlePrevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? flashcards.length - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        setCurrentSlide(prev => (prev === flashcards.length - 1 ? 0 : prev + 1));
    };

    const handleCardClick = () => {
        setFlipped(prev => ({
            ...prev,
            [currentSlide]: !prev[currentSlide],
        }));
        if (announcementsEnabled) {
            const textToAnnounce = flipped[currentSlide] 
                ? flashcards[currentSlide].front 
                : flashcards[currentSlide].back;
            announceFlashcard(textToAnnounce);
        }
    };

    const announceFlashcard = (text) => {
        if (announcementsEnabled && synth) {
            if (currentUtterance) {
                synth.cancel();
            }
            const utterance = new SpeechSynthesisUtterance(text);
            setCurrentUtterance(utterance);
            synth.speak(utterance);
        }
    };

    const toggleAnnouncements = () => {
        setAnnouncementsEnabled(prev => !prev);
    };

    if (flashcards.length === 0) return <Typography>Loading...</Typography>;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
                backgroundColor: '#000000',
                color: 'white',
            }}
        >
            <Sidebar />
            <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1300 }}>
                <UserButton />
            </Box>
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
                startIcon={<GridOnIcon sx={{fontSize: 'large'}} />}
                onClick={() => router.back()}
                sx={{ ml: 2 }}
                >
                </Button>
                <Box sx={{ position: "relative", top: 66, right: -35, zIndex: 1300, color: "white" }}>
                    <IconButton onClick={toggleAnnouncements}>
                        {announcementsEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                    </IconButton>
                </Box>
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '700px',
                }}
            >
                <Button onClick={handlePrevSlide}>
                    <ArrowBackIosIcon />
                </Button>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '300px',
                        width: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '15px',
                        padding: '20px',
                        color: 'white',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                        position: 'relative',
                        cursor: 'pointer',
                    }}
                    onClick={handleCardClick}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            transform: flipped[currentSlide] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 2,
                                color: '#fff',
                            }}
                        >
                            <Typography variant="h5">
                                {flashcards[currentSlide].front}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 2,
                                color: '#fff',
                                transform: 'rotateY(180deg)',
                                
                            }}
                        >
                            <Typography variant="h5">
                                {flashcards[currentSlide].back}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Button onClick={handleNextSlide}>
                    <ArrowForwardIosIcon />
                </Button>
            </Box>

            <Typography
                variant="caption"
                sx={{ mt: 2 }}
            >
                {currentSlide + 1} / {flashcards.length}
            </Typography>
        </Box>
    );
}
