import React, { useState } from 'react';
import { Box, TextField, Paper, Button, Tab, Tabs } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { CiVideoOn } from "react-icons/ci";
import { IoCloudUploadOutline } from "react-icons/io5";



export default function DataInput({ onSubmit }) {
    const [activeTab, setActiveTab] = useState('text');
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [youtubeLink, setYoutubeLink] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setFile(null);
        setText('');
        setYoutubeLink('');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleYoutubeLinkChange = (e) => {
        setYoutubeLink(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit({ activeTab, text, file, youtubeLink });
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto', mt: 4 }}>
            {/* Tab Menu */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3, position: 'relative', 
                backgroundColor: '#a2b3cd', borderRadius: '24px', padding: '4px', width: 'fit-content' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        minHeight: 0,
                        '& .MuiTabs-indicator': {
                            display: 'none',
                        },
                    }}
                >
                    {['Text', 'PDF', 'YouTube'].map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            value={tab.toLowerCase()}
                            sx={{
                                fontSize: 17,
                                textTransform: 'capitalize',
                                padding: '6px 12px',
                                borderRadius: '24px',
                                color: activeTab === tab.toLowerCase() ? '#ffffff' : '#5B667D',
                                fontWeight: activeTab === tab.toLowerCase() ? 'bold' : 'normal',
                                cursor: 'pointer',
                                backgroundColor: activeTab === tab.toLowerCase() ? '#ffffff' : 'transparent',
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-5px',
                                    left: '-5px',
                                    right: '-5px',
                                    bottom: '-5px',
                                    border: activeTab === tab.toLowerCase() ? '2px solid white' : 'none',
                                    borderRadius: '24px',
                                    zIndex: -1,
                                },
                                fontFamily: 'monospace',
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Content Area */}
            <Paper
                sx={{
                    p: 4,
                    backgroundColor: isFocused ? '#d7deed' : '#e0e3ea',
                    borderRadius: '16px',
                    boxShadow: 'none',
                    minHeight: 330,
                }}
            >
                <AnimatePresence mode="wait">
                    {activeTab === 'text' && (
                        <motion.div
                            key="text"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                        >
                            <Box
                                component="textarea"
                                value={text}
                                onChange={handleTextChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="Paste in your notes or other content"
                                sx={{
                                    width: '100%',
                                    height: '330px',
                                    border: 'none',
                                    outline: 'none',
                                    backgroundColor: 'transparent',
                                    resize: 'none',
                                    color: '#424242',
                                    fontSize: '16px',
                                    padding: '0',
                                    margin: '0',
                                    lineHeight: '1.5',
                                }}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'pdf' && (
                        <motion.div
                        key="pdf"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed #90a4ae', // Dashed border
                                backgroundColor: '#f5f7fc', // Background color to match the first image
                                borderRadius: '16px',
                                padding: '40px',
                                textAlign: 'center',
                                width: '100%',
                                height: '265px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                                '&:hover': {
                                    backgroundColor: '#e3e6ef', // Lighter background color on hover
                                },
                                fontFamily: 'monospace',
                                fontSize: 17
                            }}
                            onClick={() => document.querySelector('input[type="file"]').click()} // Trigger file input on box click
                        >   
                            {file ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '16px' }}>
                                    <Box sx={{ color: '#90a4ae' }}>
                                        Uploaded file: <strong>{file.name}</strong>
                                    </Box>
                                    <Button 
                                        variant="outlined" 
                                        color="secondary" 
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering file input click
                                            setFile(null);
                                        }}
                                        sx={{
                                            borderRadius: '16px',
                                            padding: '8px 16px',
                                        }}
                                    >
                                        Remove PDF
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    <IoCloudUploadOutline
                                        style={{ 
                                            fontSize: '48px',  // Enlarge the icon
                                            color: '#90a4ae',  // Match the icon color
                                            marginBottom: '16px',
                                        }} 
                                    />
                                    <Box sx={{ color: '#90a4ae' }}>
                                        Upload a pdf file
                                    </Box>
                                </>
                            )}
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                hidden
                            />
                        </Box>
                    </motion.div>
                    
                    )}

                    {activeTab === 'youtube' && (
                    <motion.div
                        key="youtube"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CiVideoOn
                            style={{ 
                                fontSize: '72px',
                                color: '#707070',
                                marginBottom: '16px',
                                marginTop: '48px',
                            }} 
                        />
                        <TextField
                            value={youtubeLink}
                            onChange={handleYoutubeLinkChange}
                            placeholder="Enter a YouTube link"
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    borderRadius: '24px',
                                    backgroundColor: '#d7deed', // background color for the input
                                    '&.Mui-focused': {
                                        backgroundColor: '#c5d1e8', // background color when focused
                                    },
                                    fontFamily: 'monospace', // Match the font to the second image
                                    color: '#424242', // Adjust text color to match
                                },
                            }}
                            sx={{
                                width: '70%',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'transparent',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#90a4ae',
                                },
                            }}
                        />
                    </motion.div>
                    )}
                </AnimatePresence>
            </Paper>

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
                onClick={handleSubmit}
                className="font-thin"
            >
                Generate
            </Button>
        </Box>
    );
}
