import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Drawer, List, ListItem, ListItemText, ListItemButton, Typography, IconButton, Box } from "@mui/material";
// import { useRouter } from "next/router";
import { useState } from "react";
import { FaBars } from "react-icons/fa";  // Importing the icon from react-icons
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const router = useRouter();

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: isOpen ? "absolute" : "fixed",
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
      <Typography variant="h5" sx={{ 
        position: "fixed", 
        top: 16,
        left: 72, 
        color: "white",
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Notefy
        </Link>
      </Typography>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250, bgcolor: "#a2b3cd", color: "#020617", height: "100%", position: "relative", marginTop:3 }}>
          <List>
            <ListItem>
              <Typography variant="h6">Notefy</Typography>
            </ListItem>
            <SignedIn>
              <ListItemButton onClick={() => {toggleDrawer(); router.push('/generate'); }}>
                <ListItemText primary="Generate" />
              </ListItemButton>
              <ListItemButton onClick={() => {toggleDrawer(); router.push('/generate'); }}>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
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