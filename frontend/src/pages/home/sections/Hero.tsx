import {
    Container,
    Typography,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";

export default function Hero() {
    const theme = useTheme();
    return (
        <Container maxWidth="lg" sx={{
            py: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: {xs: "2000px", sm: "100%"}
        }}>

            <Typography
                variant="h3"
                sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    mb: 5,
                    fontSize: {xs: "1.5rem", md: "2rem"},
                }}
            >
                Últimas Notícias
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontWeight: 600,
                    mb: 2,
                    maxWidth: "60%",
                    textAlign: "center"
                }}
            >
                Mantenha-se atualizado com as notícias mais recentes, cobrindo diversos assuntos.
            </Typography>
        </Container>
    );
}