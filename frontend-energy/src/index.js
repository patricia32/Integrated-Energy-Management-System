import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import LoginPage from "./LoginPage";
import ClientHome from "./ClientHome";
import AdminHome from "./AdminHome";
import RegisterPage from "./RegisterPage";

const router = createBrowserRouter([
    {
        path: "/public/login",
        element: <LoginPage />,
    },
    {
        path: "/public/register",
        element: <RegisterPage />,
    },
    {
        path: "/client/home",
        element: <ClientHome />,
    },
    {
        path: "/admin/home",
        element: <AdminHome />,
    },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
