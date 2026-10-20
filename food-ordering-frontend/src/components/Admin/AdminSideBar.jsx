import React, { useState } from 'react';
import { Dashboard, ShoppingBag, Fastfood, Category, LocalDining, Event, AdminPanelSettings, Logout, RateReview, LocalOffer, MonetizationOn, People, AutoAwesome } from '@mui/icons-material';
import { Divider, Drawer, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../State/Authentication/Action'; // Đảm bảo đường dẫn này đúng với file Action của bạn

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
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
    
    const isSuperAdmin = auth.user && auth.user.role === "ROLE_ADMIN";
    const currentMenu = isSuperAdmin ? superAdminMenu : ownerMenu;

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
            >
                <div className='w-[70vw] lg:w-[20vw] h-screen flex flex-col justify-center text-xl space-y-[1.65rem] pt-16'>
                    {currentMenu.map((item, i) => (
                        <React.Fragment key={i}>
                            <div onClick={() => handleNavigate(item)} className='px-5 flex items-center gap-5 cursor-pointer hover:text-gray-400'>
                                {item.icon}
                                <span>{item.title}</span>
                            </div>
                            {i !== currentMenu.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
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