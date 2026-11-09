import React, { useState } from 'react';
import { Dashboard, ShoppingBag, Fastfood, Category, LocalDining, Event, AdminPanelSettings, Logout, RateReview, LocalOffer, MonetizationOn, People, AutoAwesome } from '@mui/icons-material';
import { Divider, Drawer, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../State/Authentication/Action';

const ownerMenu = [
    { title: "Tổng quan", icon: <Dashboard />, path: "/" },
    { title: "Trợ lý AI Copilot", icon: <AutoAwesome sx={{ color: '#ec4899' }} />, path: "/ai-copilot" },
    { title: "Đơn hàng", icon: <ShoppingBag />, path: "/orders" },
    { title: "Thực đơn", icon: <Fastfood />, path: "/menu" },
    { title: "Danh mục món", icon: <Category />, path: "/category" },
    { title: "Nguyên liệu", icon: <LocalDining />, path: "/ingredients" },
    { title: "Sự kiện", icon: <Event />, path: "/event" },
    { title: "Thông tin quán", icon: <AdminPanelSettings />, path: "/details" },
    { title: "Đăng xuất", icon: <Logout />, path: "/" }
];

const superAdminMenu = [
    { title: "Tổng quan", icon: <Dashboard />, path: "/" },
    { title: "Trợ lý AI Copilot", icon: <AutoAwesome sx={{ color: '#ec4899' }} />, path: "/ai-copilot" },
    { title: "Người dùng", icon: <People />, path: "/users" },
    { title: "Đánh giá", icon: <RateReview />, path: "/reviews" },
    { title: "Mã giảm giá", icon: <LocalOffer />, path: "/coupons" },
    { title: "Doanh thu", icon: <MonetizationOn />, path: "/revenue" },
    { title: "Đăng xuất", icon: <Logout />, path: "/" }
];

export const AdminSidebar = ({ handleClose }) => {
    const isSmallScreen = useMediaQuery("(max-width:1080px)");
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
    
    const isSuperAdmin = auth.user && auth.user.role === "ROLE_ADMIN";
    const currentMenu = isSuperAdmin ? superAdminMenu : ownerMenu;

    const isItemActive = (path) => {
        if (path === "/") {
            return location.pathname === "/admin/restaurant" || location.pathname === "/admin/restaurant/";
        }
        if (path === "/menu") {
            return location.pathname.startsWith("/admin/restaurant/menu") || location.pathname.startsWith("/admin/restaurant/add-menu");
        }
        return location.pathname.startsWith(`/admin/restaurant${path}`);
    };

    const handleNavigate = (item) => {
        if (item.title === "Đăng xuất" || item.title === "Logout") {
            setOpenLogoutConfirm(true);
            return;
        }
        navigate(`/admin/restaurant${item.path}`);
        if (handleClose) handleClose();
    };

    const handleConfirmLogout = () => {
        setOpenLogoutConfirm(false);
        dispatch(logout()); // Gọi hàm đăng xuất
        navigate("/"); // Đá về trang chủ Khách hàng
        if (handleClose) handleClose();
    };

    return (
        <div>
            <Drawer
                variant={isSmallScreen ? "temporary" : "permanent"}
                onClose={handleClose}
                open={true}
                anchor='left'
                sx={{ zIndex: 1 }}
                PaperProps={{
                    sx: {
                        overflow: 'hidden',
                        backgroundColor: '#121212',
                        color: 'white',
                        '&::-webkit-scrollbar': { display: 'none !important' },
                        scrollbarWidth: 'none !important',
                        msOverflowStyle: 'none !important'
                    }
                }}
            >
                {/* Giữ nguyên cấu trúc giao diện cũ, căn chỉnh chiều cao và khoảng cách để vừa khít màn hình không cần cuộn */}
                <div className='w-[70vw] lg:w-[20vw] h-screen flex flex-col justify-center text-lg lg:text-xl space-y-3 lg:space-y-3.5 py-4 no-scrollbar select-none'>
                    {currentMenu.map((item, i) => {
                        const active = isItemActive(item.path);
                        return (
                            <React.Fragment key={i}>
                                <div 
                                    onClick={() => handleNavigate(item)} 
                                    className={`px-5 py-1 flex items-center gap-5 cursor-pointer transition-colors duration-150 ${
                                        active 
                                            ? 'text-pink-500 font-bold' 
                                            : 'text-gray-200 hover:text-gray-400'
                                    }`}
                                >
                                    <span className={active ? 'text-pink-500' : ''}>
                                        {item.icon}
                                    </span>
                                    <span>{item.title}</span>
                                </div>
                                {i !== currentMenu.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />}
                            </React.Fragment>
                        );
                    })}
                </div>
            </Drawer>

            {/* Hộp thoại xác nhận đăng xuất đồng bộ Dark Mode */}
            <Dialog
                open={openLogoutConfirm}
                onClose={() => setOpenLogoutConfirm(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#1f2937',
                        color: 'white',
                        borderRadius: '12px',
                        p: 1,
                        minWidth: '320px'
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold' }}>
                    <Logout sx={{ color: '#f87171' }} />
                    Xác Nhận Đăng Xuất
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#d1d5db' }}>
                        Bạn có chắc chắn muốn đăng xuất khỏi tài khoản quản trị không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        onClick={() => setOpenLogoutConfirm(false)}
                        sx={{ color: '#9ca3af', '&:hover': { bgcolor: 'rgba(156, 163, 175, 0.1)' } }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleConfirmLogout}
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: '6px', fontWeight: 'bold' }}
                    >
                        Đăng xuất
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
