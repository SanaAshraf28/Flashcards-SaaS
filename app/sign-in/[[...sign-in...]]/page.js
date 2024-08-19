import { SignIn } from "@clerk/nextjs";
import { AppBar, Container, Typography, Toolbar, Button, Box, Navbar } from "@mui/material";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

export default function SignUpPage(){
    return (
    <Box className="bg-grid min-h-screen scrollbar">
      <Box sx={{ position: "fixed", top: 0, right: 0, left: 0, zIndex: 1900 }}>
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", // Space between Sidebar and the other elements
            alignItems: "center",
          }}
        >
          <Sidebar />
        </Box>
        </Box>          
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center"
        sx = {{
            paddingTop: '80px',
        }}
        >
            <SignIn />       
        </Box>
    </Box>
    )
}