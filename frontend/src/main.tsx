import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import theme from "./style/theme.ts";
import { CssBaseline, ThemeProvider } from "@mui/material";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>,
);