import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface NewsCardProps {
    title: string;
    description: string;
    author: string;
    source: string;
    date: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
                                               title,
                                               description,
                                               author,
                                               source,
                                               date,
                                               onEdit,
                                               onDelete
                                           }) => {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                }
            }}
        >
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                        mb: 2
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.6 }}
                >
                    {description}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                        <strong>Autor:</strong> {author}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                        <strong>Fonte:</strong> {source}
                    </Typography>
                    <Typography variant="caption" display="block">
                        <strong>Data:</strong> {date}
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={onEdit}
                    sx={{
                        mr: 1,
                        textTransform: 'none',
                        borderColor: '#666',
                        color: '#666',
                        '&:hover': {
                            borderColor: '#333',
                            backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                    }}
                >
                    Alterar
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={onDelete}
                    sx={{
                        textTransform: 'none',
                        backgroundColor: '#ef4444',
                        '&:hover': {
                            backgroundColor: '#dc2626'
                        }
                    }}
                >
                    Excluir
                </Button>
            </CardActions>
        </Card>
    );
};

export default NewsCard;