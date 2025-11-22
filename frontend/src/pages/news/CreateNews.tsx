import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { newsService } from '../../api/services/newsService';
import { useNewsForm } from '../../hooks/useNewsForm';
import app_routes from '../../routes/app_routes';
import NewsForm from "../../components/newsForm/NewsForm.tsx";

const CreateNewsPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        formData,
        selectedDate,
        errors,
        validateForm,
        handleChange,
        handleDateChange,
        resetForm,
    } = useNewsForm();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            const newsData = {
                title: formData.title,
                text: formData.text,
                date: formData.date,
                ...(formData.author && { author: formData.author }),
                ...(formData.source && { source: formData.source }),
            };

            await newsService.createNews(newsData);
            setSuccessMessage('Notícia criada com sucesso!');

            setTimeout(() => {
                navigate(app_routes.home);
            }, 1500);
        } catch (error) {
            console.log(error)
            setErrorMessage('Erro ao criar notícia. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        resetForm();
        navigate(app_routes.home);
    };

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
                        Criar Nova Notícia
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 4, color: theme.palette.text.secondary }}>
                        Preencha os campos abaixo para criar uma nova notícia
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
                        submitLabel="Criar Notícia"
                    />
                </Paper>
            </Container>
        </Box>
    );
};

export default CreateNewsPage;