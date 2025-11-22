import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Alert, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { newsService } from '../../api/services/newsService';
import { useNewsForm } from '../../hooks/useNewsForm';
import app_routes from '../../routes/app_routes';
import NewsForm from "../../components/newsForm/NewsForm.tsx";

const EditNewsPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        formData,
        setFormData,
        selectedDate,
        errors,
        validateForm,
        handleChange,
        handleDateChange,
    } = useNewsForm();

    useEffect(() => {
        const fetchNews = async () => {
            if (!id) return;

            try {
                const response = await newsService.getNews(Number(id));
                setFormData(response.data);
            } catch (error) {
                console.log(error)
                setErrorMessage('Erro ao carregar notícia.');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchNews();
    }, [id, setFormData]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!validateForm() || !id) return;

        setLoading(true);

        try {
            const newsData = {
                title: formData.title,
                text: formData.text,
                date: formData.date,
                ...(formData.author && { author: formData.author }),
                ...(formData.source && { source: formData.source }),
            };

            await newsService.updateNews(Number(id), newsData);
            setSuccessMessage('Notícia atualizada com sucesso!');

            setTimeout(() => {
                navigate(app_routes.home);
            }, 1500);
        } catch (error) {
            console.log(error)
            setErrorMessage('Erro ao atualizar notícia. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(app_routes.home);
    };

    if (fetchLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
                py: 4,
            }}
        >
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h2" gutterBottom>
                        Editar Notícia
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 4, color: theme.palette.text.secondary }}>
                        Atualize os campos que deseja modificar
                    </Typography>

                    {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}
                    {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}

                    <NewsForm
                        formData={formData}
                        selectedDate={selectedDate}
                        errors={errors}
                        loading={loading}
                        onFieldChange={handleChange}
                        onDateChange={handleDateChange}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        submitLabel="Atualizar Notícia"
                    />
                </Paper>
            </Container>
        </Box>
    );
};

export default EditNewsPage;