import React from 'react';
import { TextField, Stack, Button, CircularProgress } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import type {NewsItemPost} from "../../types/news.ts";
import type {FormErrors} from "../../hooks/useNewsForm.ts";

interface NewsFormProps {
    formData: NewsItemPost;
    selectedDate: Dayjs | null;
    errors: FormErrors;
    loading: boolean;
    onFieldChange: (field: keyof NewsItemPost) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDateChange: (date: Dayjs | null) => void;
    onSubmit: (event: React.FormEvent) => void;
    onCancel: () => void;
    submitLabel?: string;
}

const NewsForm: React.FC<NewsFormProps> = ({
                                               formData,
                                               selectedDate,
                                               errors,
                                               loading,
                                               onFieldChange,
                                               onDateChange,
                                               onSubmit,
                                               onCancel,
                                               submitLabel = 'Salvar',
                                           }) => {
    return (
        <form onSubmit={onSubmit}>
            <Stack spacing={3}>
                <TextField
                    fullWidth
                    required
                    label="Título"
                    value={formData.title}
                    onChange={onFieldChange('title')}
                    error={!!errors.title}
                    helperText={errors.title || `${formData.title.length} caracteres`}
                    disabled={loading}
                    placeholder="Digite o título da notícia"
                />

                <TextField
                    fullWidth
                    required
                    label="Texto da Notícia"
                    multiline
                    rows={10}
                    value={formData.text}
                    onChange={onFieldChange('text')}
                    error={!!errors.text}
                    helperText={errors.text || `${formData.text.length} caracteres`}
                    disabled={loading}
                    placeholder="Digite o conteúdo completo da notícia"
                />

                <TextField
                    fullWidth
                    label="Autor (opcional)"
                    value={formData.author}
                    onChange={onFieldChange('author')}
                    disabled={loading}
                    placeholder="Nome do autor"
                />

                <TextField
                    fullWidth
                    label="Fonte (opcional)"
                    value={formData.source}
                    onChange={onFieldChange('source')}
                    disabled={loading}
                    placeholder="Fonte da notícia"
                />

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                    <DatePicker
                        label="Data *"
                        value={selectedDate}
                        onChange={onDateChange}
                        disabled={loading}
                        format="DD/MM/YYYY"
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.date,
                                helperText: errors.date,
                                InputLabelProps: {
                                    sx: {
                                        fontSize: '1.2rem',
                                        fontWeight: 500,
                                    }
                                },
                                InputProps: {
                                    sx: {
                                        fontSize: '1rem',
                                    }
                                },
                            },
                            day: {
                                sx: {
                                    fontSize: '0.875rem',
                                }
                            },
                            calendarHeader: {
                                sx: {
                                    '& .MuiPickersCalendarHeader-label': {
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                    }
                                }
                            },
                            actionBar: {
                                sx: {
                                    '& .MuiButton-root': {
                                        fontSize: '0.85rem',
                                    }
                                }
                            }
                        }}
                    />
                </LocalizationProvider>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : submitLabel}
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};

export default NewsForm;