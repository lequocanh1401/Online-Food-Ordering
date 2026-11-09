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
        dispatch(logout());
        navigate("/");
        if (handleClose) handleClose();
    };

    return (
        <div>
            <Drawer
                variant={isSmallScreen ? "temporary" : "permanent"}
                onClose={handleClose}
                open={true}
                anchor='left'
                sx={{ zIndex: 1, position: "sticky" }}
                PaperProps={{
                    sx: {
                        overflow: 'hidden',
                        backgroundColor: '#111827',
                        color: 'white',
                        borderRight: '1px solid rgba(75, 85, 99, 0.4)',
                        '&::-webkit-scrollbar': { display: 'none !important' },
                        scrollbarWidth: 'none !important',
                        msOverflowStyle: 'none !important'
                    }
                }}
            >
                {/* Bố cục dàn đều vừa vặn và phong cách đồng bộ 100% với phân hệ khách hàng (ProfileNavigation) */}
                <div className={`w-[70vw] lg:w-[20vw] h-[100vh] flex flex-col justify-center text-xl ${currentMenu.length > 7 ? 'gap-5 lg:gap-6' : 'gap-8'} pt-16 bg-gray-900 text-white select-none`}>
                    {currentMenu.map((item, i) => {
                        const isActive = isItemActive(item.path);
                        return (
                            <React.Fragment key={i}>
                                <div 
                                    onClick={() => handleNavigate(item)} 
                                    className={`px-5 flex items-center justify-between cursor-pointer transition-colors ${
                                        isActive 
                                            ? 'text-pink-500 font-semibold' 
                                            : 'hover:text-pink-400 text-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center space-x-5">
                                        <span className={isActive ? 'text-pink-500' : ''}>
                                            {item.icon}
                                        </span>
                                        <span>{item.title}</span>
                                    </div>
                                </div>
                                {i !== currentMenu.length - 1 && <Divider sx={{ bgcolor: "rgba(75, 85, 99, 0.4)" }} />}
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
                        bgcolor: '#111827',
                        color: 'white',
                        border: '1px solid #1f2937',
                        borderRadius: '16px',
                        p: 1,
                        maxWidth: 400
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold', color: '#f87171' }}>
                    <Logout sx={{ color: '#f87171' }} />
                    Xác Nhận Đăng Xuất
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#9ca3af' }}>
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
