import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { AdminSidebar } from './AdminSideBar';
import { Dashboard } from './Dashboard';
import { Orders } from './Orders';
import { Menu } from './Menu';
import { RestaurantDetails } from './RestaurantDetails';
import { AdminIngredients } from './Ingredients';
import { FoodCategory } from './FoodCategory';
import { Events } from './Events';
import { CreateRestaurantForm } from './CreateRestaurantForm';
import { CreateMenuForm } from './CreateMenuForm'; // Import form thêm món ăn
import { AiCopilot } from './AiCopilot';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantByUserId } from '../../State/Restaurant/Action';

// Super Admin Components
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { SuperAdminReviews } from './SuperAdminReviews';
import { SuperAdminCoupons } from './SuperAdminCoupons';
import { SuperAdminRevenue } from './SuperAdminRevenue';
import { SuperAdminUsers } from './SuperAdminUsers';
import { OrderNotificationListener } from './OrderNotificationListener';

export const Admin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");
    const { restaurant, auth } = useSelector(store => store);
    const handleClose = () => { };

    const isSuperAdmin = auth.user && auth.user.role === "ROLE_ADMIN";

    useEffect(() => {
        if (!jwt) {
            navigate("/");
        } else if (auth.user && auth.user.role !== "ROLE_RESTAURANT_OWNER" && auth.user.role !== "ROLE_ADMIN") {
            navigate("/");
        }
    }, [jwt, auth.user, navigate]);

    useEffect(() => {
        if (jwt && auth.user && auth.user.role === "ROLE_RESTAURANT_OWNER") {
            dispatch(getRestaurantByUserId(jwt));
        }
    }, [jwt, auth.user, dispatch]);

    if (auth.isLoading || (jwt && !auth.user)) {
        return (
            <div className="flex items-center justify-center min-h-[80vh] text-gray-400 font-medium">
                Đang tải thông tin...
            </div>
        );
    }

    if (!isSuperAdmin && (!restaurant?.usersRestaurant || !restaurant?.usersRestaurant?.id)) {
        return (
            <div className="pt-5 pb-20">
                <CreateRestaurantForm />
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-black text-white'>
            {/* Thanh Header Hồng chung của hệ thống */}
            <Navbar />
            <div className='lg:flex justify-between min-h-[80vh]'>
                <div className='sticky h-[80vh] lg:w-[20%]'>
                    <AdminSidebar handleClose={handleClose} />
                </div>
                <div className='lg:w-[80%] pb-10 relative mt-5 lg:mt-0'>
                    {/* Real-time Order Alert Listener (Step 3) */}
                    <OrderNotificationListener />
                <Routes>
                    {isSuperAdmin ? (
                        <>
                            <Route path='/' element={<SuperAdminDashboard />} />
                            <Route path='/ai-copilot' element={<AiCopilot />} />
                            <Route path='/users' element={<SuperAdminUsers />} />
                            <Route path='/reviews' element={<SuperAdminReviews />} />
                            <Route path='/coupons' element={<SuperAdminCoupons />} />
                            <Route path='/revenue' element={<SuperAdminRevenue />} />
                        </>
                    ) : (
                        <>
                            <Route path='/' element={<Dashboard />} />
                            <Route path='/ai-copilot' element={<AiCopilot />} />
                            <Route path='/orders' element={<Orders />} />
                            <Route path='/menu' element={<Menu />} />
                            <Route path='/add-menu' element={<CreateMenuForm />} /> {/* Đường dẫn gọi form */}
                            <Route path='/ingredients' element={<AdminIngredients />} />
                            <Route path='/category' element={<FoodCategory />} />
                            <Route path='/event' element={<Events />} />
                            <Route path='/details' element={<RestaurantDetails />} />
                        </>
                    )}
                </Routes>
            </div>
        </div>
    </div>
    );
};