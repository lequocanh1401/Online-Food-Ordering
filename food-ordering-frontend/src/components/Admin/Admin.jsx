import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
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
import { Menu as MenuIcon } from '@mui/icons-material';

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
    const [mobileOpen, setMobileOpen] = useState(false);

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
        <div className='min-h-screen bg-gray-950 flex flex-col lg:flex-row'>
            {/* Thanh điều hướng trên cùng cho Mobile / Tablet */}
            <div className='lg:hidden sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <button
                        type='button'
                        onClick={() => setMobileOpen(true)}
                        className='p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors'
                    >
                        <MenuIcon sx={{ fontSize: 22 }} />
                    </button>
                    <span className='font-bold text-sm text-white truncate max-w-[220px]'>
                        {isSuperAdmin ? "Hệ Thống Quản Trị" : (restaurant?.usersRestaurant?.name || "Quản Trị Nhà Hàng")}
                    </span>
                </div>
                <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20'>
                    <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></span>
                    <span className='text-[11px] font-bold text-emerald-400 uppercase tracking-wider'>Live</span>
                </div>
            </div>

            {/* Sidebar drawer container */}
            <div className='lg:w-[280px] shrink-0'>
                <AdminSidebar mobileOpen={mobileOpen} handleClose={() => setMobileOpen(false)} />
            </div>

            {/* Vùng nội dung chính */}
            <div className='flex-1 min-w-0 pb-10 px-3 sm:px-6 lg:px-8 pt-4 lg:pt-6 relative'>
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
    );
};