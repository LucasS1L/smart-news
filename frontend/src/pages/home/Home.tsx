import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    CircularProgress,
    Alert,
    Typography,
    TextField,
    InputAdornment,
    Paper,
    Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Hero from './sections/Hero';
import NewsCard from '../../components/card/NewsCard';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {useNewsSearch} from "../../hooks/useNewSearch.ts";
import app_routes from "../../routes/app_routes.ts";

dayjs.locale('pt-br');

export default function Home() {
    const theme = useTheme();
    const navigate = useNavigate();
    const {
        news,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        hasSearched,
        deleteNews,
    } = useNewsSearch(500);

    const handleEdit = (id: number) => {
        navigate(`${app_routes.editNews}/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
            try {
                await deleteNews(id);
            } catch (error) {
                console.error('Erro ao excluir:', error);
            }
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const formatDate = (date: string) => {
        return dayjs(date).format('DD [de] MMMM [de] YYYY');
    };

    return (
        <>
            <Hero />

            {/* Seção de Busca */}
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: 4,
                }}
            >
                <Box sx={{ maxWidth: '800px', mx: 'auto', px: 3 }}>
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ mb: 3 }}
                    >
                        Buscar Notícias
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="Digite palavras-chave para buscar notícias..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery && (
                                    <InputAdornment position="end">
                                        <ClearIcon
                                            sx={{ cursor: 'pointer', color: 'text.secondary' }}
                                            onClick={handleClearSearch}
                                        />
                                    </InputAdornment>
                                ),
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: theme.palette.background.default,
                            }
                        }}
                    />

                </Box>
            </Box>

            {/* Conteúdo Principal */}
            <Box sx={{ p: 4, backgroundColor: theme.palette.background.default, minHeight: '60vh' }}>
                {/* Estado de loading */}
                {loading && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <CircularProgress />
                        <Typography variant="body1" color="text.secondary">
                            Buscando notícias...
                        </Typography>
                    </Box>
                )}

                {/* Estado de erro */}
                {error && !loading && (
                    <Alert severity="error" sx={{ maxWidth: '600px', mx: 'auto' }}>
                        {error}
                    </Alert>
                )}

                {/* Estado sem resultados */}
                {!loading && !error && hasSearched && news.length === 0 && (
                    <Paper
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px',
                            flexDirection: 'column',
                            gap: 2,
                            p: 4,
                            maxWidth: '600px',
                            mx: 'auto',
                        }}
                    >
                        <Typography variant="h5" color="text.secondary" align="center">
                            Nenhum resultado encontrado
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="center">
                            Não encontramos notícias relacionadas a "{searchQuery}"
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            Tente buscar com outras palavras-chave ou termos diferentes
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={handleClearSearch}
                            sx={{ mt: 2 }}
                        >
                            Limpar busca
                        </Button>
                    </Paper>
                )}

                {/* Resultados da busca */}
                {!loading && !error && hasSearched && news.length > 0 && (
                    <>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                {news.length} resultado{news.length > 1 ? 's' : ''} encontrado{news.length > 1 ? 's' : ''}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Resultados para: "{searchQuery}"
                            </Typography>
                        </Box>

                        <Grid container spacing={3} >
                            {news.map((item) => (
                                <Grid sx={{width:"100%"}} key={item.id} >
                                    <NewsCard
                                        title={item.title}
                                        description={
                                            item.text
                                        }
                                        author={item.author || 'Autor desconhecido'}
                                        source={item.source || 'Fonte não informada'}
                                        date={formatDate(item.date)}
                                        onEdit={() => handleEdit(item.id)}
                                        onDelete={() => handleDelete(item.id)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
            </Box>
        </>
    );
}