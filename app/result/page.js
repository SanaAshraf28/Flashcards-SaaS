'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import getStripe from "@/utils/get-stripe"
import { useSearchParams } from "next/navigation"
import { CircularProgress, Container, Typography, Box, Button } from "@mui/material"

const ResultPage = () => {
    const handleSubmit = async ()=>{
        const checkoutSession = await fetch('/api/checkout_sessions', {
          method: 'POST',
          headers: {
            origin: 'https://localhost:3000',
          }
        })
    
        if (!checkoutSession.ok) {
          throw new Error(`HTTP error! status: ${checkoutSession.status}`);
        }
    
        const checkoutSessionJson = await checkoutSession.json()
    
        if (checkoutSession.statusCode === 500) {
          console.error(checkoutSession.message)
          return
        }
    
        const stripe = await getStripe()
        const {error} = await stripe.redirectToCheckout({
          sessionId: checkoutSessionJson.id,
        })
    
        if (error) {
          console.warn(error.message)
        }
      }
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) {
                setError("No session ID provided");
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`api/checkout_sessions?session_id=${session_id}`)
                const sessionData = await res.json()
                if (res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error)
                }
            }
            catch (err) {
                setError("An error occurred")
            } finally {
                setLoading(false)
            }
        }
        fetchCheckoutSession()
    }, [session_id])
    if (loading){
        return(
            <Container maxWidth = "100vw" sx={{
                textAlign: 'center', mt:4,
            }}>
                <CircularProgress />
                <Typography variant="h6"> Loading...</Typography>
            </Container>
        )
    }
    if (error) {
        return(
            <Container maxWidth = "100vw" sx={{
                textAlign: 'center', mt:4,
            }}>
                <Typography variant="h6"> {error} </Typography>
            </Container>
        )
    }
    return(
        <Container maxWidth = "100vw" sx={{
            textAlign: 'center', mt:4,
        }}>
            {session.payment_status  === 'paid' ? (
                <>
                    <Typography variant="h4"> Thank you for purchasing!</Typography>
                    <Box sx = {{mt:22}}>
                        <Typography variant = "h6">
                            Session ID: {session_id}
                        </Typography>
                        <Typography variant="body1">
                            We have received your payment. You will receive an email with the order details shortly.
                        </Typography>
                    </Box>
                </>
            ) : (
                <>
                    <Typography variant="h4"> Payment Failed</Typography>
                    <Box sx = {{mt:22}}>
                        {/* <Typography variant = "h6">
                            Session ID: {session_id}
                        </Typography> */}
                        <Typography variant="body1">
                            Oops... Looks like your payment did not go through! Please try again!
                        </Typography>
                        <Button variant="contained" color="primary" sx={{at: 2}} onClick={handleSubmit}>
                            Try Again
                        </Button>
                    </Box>
                </>
            )}
            
        </Container>
    )
}

export default ResultPage