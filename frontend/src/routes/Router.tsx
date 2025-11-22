import {Routes, Route} from "react-router-dom";
import app_routes from "./app_routes.ts";

import Home from "../pages/home/Home.tsx";
import CreateNews from "../pages/news/CreateNews.tsx";
import MainLayout from "../layouts/MainLayout.tsx";
import EditNewsPage from "../pages/news/EditNews.tsx";


export default function Router() {
    return (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path={app_routes.home} element={<Home/>}/>
                <Route path={app_routes.createNews} element={<CreateNews/>}/>
                <Route path={`${app_routes.editNews}/:id`} element={<EditNewsPage />} />
            </Route>
        </Routes>
    );
}