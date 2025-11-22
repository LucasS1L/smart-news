import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import type { NewsItemPost } from '../types/news';

export interface FormErrors {
    title?: string;
    text?: string;
    date?: string;
}

export const useNewsForm = (initialData?: NewsItemPost) => {
    const [formData, setFormData] = useState<NewsItemPost>(
        initialData || {
            title: '',
            text: '',
            author: '',
            source: '',
            date: dayjs().format('YYYY-MM-DD'),
        }
    );

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
        initialData?.date ? dayjs(initialData.date) : dayjs()
    );

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'O título é obrigatório';
        } else if (formData.title.length < 10) {
            newErrors.title = 'O título deve ter no mínimo 10 caracteres';
        }

        if (!formData.text.trim()) {
            newErrors.text = 'O texto da notícia é obrigatório';
        } else if (formData.text.length < 50) {
            newErrors.text = 'O texto deve ter no mínimo 50 caracteres';
        }

        if (!formData.date) {
            newErrors.date = 'A data é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof NewsItemPost) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });

        if (errors[field as keyof FormErrors]) {
            setErrors({
                ...errors,
                [field]: undefined,
            });
        }
    };

    const handleDateChange = (newDate: Dayjs | null) => {
        setSelectedDate(newDate);
        if (newDate && newDate.isValid()) {
            setFormData({
                ...formData,
                date: newDate.format('YYYY-MM-DD'),
            });

            if (errors.date) {
                setErrors({
                    ...errors,
                    date: undefined,
                });
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            text: '',
            author: '',
            source: '',
            date: dayjs().format('YYYY-MM-DD'),
        });
        setSelectedDate(dayjs());
        setErrors({});
    };

    return {
        formData,
        setFormData,
        selectedDate,
        errors,
        validateForm,
        handleChange,
        handleDateChange,
        resetForm,
    };
};