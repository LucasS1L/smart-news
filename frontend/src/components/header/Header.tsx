import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import type {JSX} from "react";
import {NavLink} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import app_routes from "../../routes/app_routes.ts";

export default function Header(): JSX.Element {
    const theme = useTheme();

    const navIconButtonStyles = {
        color: theme.palette.text.primary,
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.08)',
            transform: 'scale(1.1)',
        },
        '&.active': {
            color: theme.palette.primary.main,
            backgroundColor: 'rgba(0,0,0,0.05)',
        }
    };

    const createButtonStyles = {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        fontWeight: 600,
        fontSize: "0.9rem",
        px: 3,
        py: 1,
        borderRadius: 2,
        borderWidth: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderWidth: 2,
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        },
    };

    return (
        <AppBar
            position="sticky"
            elevation={2}
            sx={{
                bgcolor: theme.palette.secondary.contrastText,
                borderBottom: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: {xs: 56, sm: 64},
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    {/* Logo/Brand Section */}
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <Typography
                            variant="h1"
                            component={NavLink}
                            to="/"
                            sx={{
                                fontSize: "1.5rem",
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                textDecoration: 'none',
                                transition: 'color 0.3s ease',
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                },
                            }}
                        >
                            Smart News
                        </Typography>
                    </Box>

                    {/* Navigation Section */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        {/* Home Button */}
                        <IconButton
                            component={NavLink}
                            to="/"
                            aria-label="Página inicial"
                            sx={navIconButtonStyles}
                        >
                            <HomeIcon sx={{fontSize: '1.5rem'}}/>
                        </IconButton>

                        {/* Create News Button */}
                        <Button
                            component={NavLink}
                            to={app_routes.createNews}
                            variant="outlined"
                            startIcon={<AddIcon/>}
                            sx={createButtonStyles}
                        >
                            Criar Notícia
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}