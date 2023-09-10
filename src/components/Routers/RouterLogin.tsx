//ROUTER
import { BrowserRouter, Routes, Route } from "react-router-dom"
//CONTEXT
import { useEffect, useState } from "react"
//Types
import { DataType } from "../../types/DataType"
//PAGES
import HomePage from "../../pages/Home/HomePage"
import LoginPage from "../../pages/Login/LoginPage"
import MainPage from "../../pages/Main/MainPage"
import RegistrationPage from "../../pages/Register/RegistrationPage"
import RestaurantDetailsPage from "../../pages/RestaurantDetails/RestaurantDetailsPage"
import AdminLoginPage from "../../administration/AdminLoginPage"
import AdminPanel from "../../administration/AdminPanel"
import ProfilePage from "../../pages/Profile/ProfilePage"
import PaymentPage from "../../pages/Payment/PaymentPage"



export default function RouterLogin() {

    return (
        <BrowserRouter>
            <Routes>
                {/*USER*/}
                <Route path="/" element={<HomePage/>} />
                <Route path="/home" element={<HomePage/>} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/restaurant" element={<RestaurantDetailsPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                {/*ADMIN*/}
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
            </Routes>
        </BrowserRouter>
    )


}