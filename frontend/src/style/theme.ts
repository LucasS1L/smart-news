import { createTheme } from '@mui/material/styles';



const theme = createTheme({
    palette: {
        mode: 'light',

        primary: {
            main: '#000000',
            contrastText: '#ffffff'
        },

        secondary: {
            main: '#424242',
            contrastText: '#bdbdbd'
        },

        background: {
            default: '#f5f5f5',
            paper: '#ffffff'
        },

        text: {
            primary: '#000000',
            secondary: '#424242',
        },

        divider: '#bdbdbd',
    },

    typography: {
        fontFamily: 'Elms Sans, sans-serif',

        h1: {
            fontSize: '2.2rem',
            fontWeight: 700,
            color: '#000',
        },
        h2: {
            fontSize: '1.8rem',
            fontWeight: 600,
            color: '#000',
        },
        body1: {
            fontSize: '1.4rem',
            color: '#424242',
        },
        body2: {
            fontSize: '.9rem',
            color: '#616161',
        }
    },

    components: {

        // Botões
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 6,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                }
            }
        },

        // Cards das notícias
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
                }
            }
        },

        // TextFields - Customização de fontes
        MuiTextField: {
            styleOverrides: {
                root: {
                    // Label (Título do campo)
                    '& .MuiInputLabel-root': {
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: '#424242',
                    },
                    // Label quando focado
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#000000',
                        fontWeight: 600,
                    },
                    // Texto digitado no input
                    '& .MuiInputBase-input': {
                        fontSize: '0.9rem',
                        color: '#000000',
                    },
                    // Placeholder
                    '& .MuiInputBase-input::placeholder': {
                        fontSize: '0.85rem',
                        opacity: 0.6,
                        color: '#616161',
                    },
                    // Helper text (texto de ajuda/erro)
                    '& .MuiFormHelperText-root': {
                        fontSize: '0.75rem',
                        marginTop: '4px',
                    },
                    // Borda do campo
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#bdbdbd',
                        },
                        '&:hover fieldset': {
                            borderColor: '#424242',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#000000',
                        },
                    },
                }
            }
        },


        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: '0.9rem',
                }
            }
        },

        // Alerts
        MuiAlert: {
            styleOverrides: {
                root: {
                    fontSize: '0.875rem',
                },
                message: {
                    fontSize: '0.875rem',
                }
            }
        }
    }
});

export default theme;