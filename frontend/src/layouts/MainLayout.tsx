import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from "../components/header/Header.tsx";

const MainLayout: React.FC = () => {
    return (
        <Box>
            <Header />
            <Box component="main">
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;