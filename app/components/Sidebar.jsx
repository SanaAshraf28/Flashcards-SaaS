import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Drawer, List, ListItem, ListItemText, Typography, IconButton, Box, Link } from "@mui/material";
import { useState } from "react";
import { FaBars } from "react-icons/fa";  // Importing the menu icon from react-icons
import HomeIcon from '@mui/icons-material/Home';  // Importing the Home icon from MUI

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser(); // Get the user information from Clerk

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          top: 12,
          left: isOpen ? 200 : 16,
          transition: "left 0.3s ease",
          zIndex: 1300,
          color: isOpen ? "black" : "white",
          
          '&:hover': {
            backgroundColor: "#a2b3cd",
          },
        }}
      >
        <FaBars />
      </IconButton>

      {!isOpen && (
        <Typography variant="h5" sx={{ 
          position: "fixed", 
          top: 16,
          left: 72, 
          color: "white",
          zIndex: 1200,
        }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Notefy
          </Link>
        </Typography>
      )}

      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250, bgcolor: "#a2b3cd", color: "#020617", height: "100%", position: "relative" }}>
          <List>
            <ListItem>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Notefy</Typography>
            </ListItem>

            <SignedIn>
              {/* Image Container */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                position: 'relative',
              }}>
                {/* Background Image */}
                <Box
                  component="img"
                  src="/assets/Flashcards2.jpg"  // Provide the path to the image file
                  alt="Profile Background"
                  sx={{
                    width: 250,
                    height: "auto",
                  }}
                />
                
                <Box sx={{ 
                  position: 'absolute', 
                  top: '35%',  // Adjust to position the UserButton
                  left: '50%', 
                  transform: 'translate(-50%, -50%) scale(3)',  // Increase the scale value
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: 3
                }}>
                  <UserButton 
                    userProfileMode="modal" 
                  />
                  {user && (
                    <Box sx={{
                      mt: .25,
                      px: .5, 
                      py: 0.125, 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',  // Slightly darken the background
                      borderRadius: '8px', 
                      backdropFilter: 'blur(4px)',  // Slightly blur the background behind the text
                    }}>
                      <Typography sx={{ fontWeight: 600, color: 'white', fontSize: 10 }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <ListItem button component="a" href="/" onClick={toggleDrawer}>
                <HomeIcon sx={{ marginRight: 1.5 }} />
                <ListItemText primary="Home" sx={{ pt: .5 }}/>
              </ListItem>

              <ListItem button onClick={toggleDrawer}>
                <ListItemText primary="Generate" />
              </ListItem>
              <ListItem button onClick={toggleDrawer}>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </SignedIn>
            
            <SignedOut>
              <ListItem button component="a" href="/sign-in" onClick={toggleDrawer}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button component="a" href="/sign-up" onClick={toggleDrawer}>
                <ListItemText primary="Register" />
              </ListItem>
            </SignedOut>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
