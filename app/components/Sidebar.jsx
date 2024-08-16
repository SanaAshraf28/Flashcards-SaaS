import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Drawer, List, ListItem, ListItemText, Typography, IconButton, Box, Link } from "@mui/material";
import { useState } from "react";
import { FaBars } from "react-icons/fa";  // Importing the icon from react-icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          color: "white",
          
          '&:hover': {
            backgroundColor: "#a2b3cd",
          },
        }}
      >
        <FaBars />
      </IconButton>

      {/* Conditionally render the Notefy text based on sidebar state */}
      {!isOpen && (
        <Typography variant="h5" sx={{ 
          position: "fixed", 
          top: 16,
          left: 72, 
          color: "white",
          zIndex: 1200,  // Adjusting zIndex to be behind the sidebar
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
              <Typography variant="h6">Notefy</Typography>
            </ListItem>
            <SignedIn>
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
