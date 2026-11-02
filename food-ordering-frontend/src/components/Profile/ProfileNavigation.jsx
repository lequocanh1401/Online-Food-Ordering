import React, { useState } from 'react';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { 
    Divider, Drawer, useMediaQuery, 
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../State/Authentication/Action';

const menu = [
    { title: "Đơn hàng", icon: <ShoppingBagIcon />, path: "orders" },
    { title: "Yêu thích", icon: <FavoriteIcon />, path: "favorites" },
    { title: "Địa chỉ", icon: <HomeIcon />, path: "address" },
    { title: "Lịch sử thanh toán", icon: <ReceiptLongIcon />, path: "payments" },
    { title: "Thông báo", icon: <NotificationsActiveIcon />, path: "notifications" },
    { title: "Sự kiện", icon: <EventIcon />, path: "events" },
    { title: "Đăng xuất", icon: <LogoutIcon />, path: "logout" }
];

export const ProfileNavigation = ({ open, handleClose }) => {
    const isSmallScreen = useMediaQuery('(max-width:900px)');
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

    // Lắng nghe số lượng thông báo chưa đọc từ LocalStorage
    const [unreadCount, setUnreadCount] = useState(() => {
        try {
            const count = localStorage.getItem("unread_notifications_count");
            return count ? parseInt(count, 10) : 0;
        } catch {
            return 0;
        }
    });

    React.useEffect(() => {
        const handleCountChange = () => {
            try {
                const count = localStorage.getItem("unread_notifications_count");
                setUnreadCount(count ? parseInt(count, 10) : 0);
            } catch {
                setUnreadCount(0);
            }
        };
        window.addEventListener("notifications_count_changed", handleCountChange);
        window.addEventListener("storage", handleCountChange);
        return () => {
            window.removeEventListener("notifications_count_changed", handleCountChange);
            window.removeEventListener("storage", handleCountChange);
        };
    }, []);

    const handleNavigate = (item) => {
        if (item.title === "Đăng xuất") {
            setOpenLogoutConfirm(true);
            return;
        }
        navigate(`/my-profile/${item.path}`);
        if (isSmallScreen && handleClose) handleClose();
    };

    const handleConfirmLogout = () => {
        setOpenLogoutConfirm(false);
        dispatch(logout());
        navigate("/");
        if (isSmallScreen && handleClose) handleClose();
    };

    return (
        <div>
            <Drawer
                variant={isSmallScreen ? "temporary" : "permanent"}
                onClose={handleClose}
                open={isSmallScreen ? open : true}
                anchor='left'
                sx={{ zIndex: 1, position: "sticky" }}
            >
                <div className='w-[50vw] lg:w-[20vw] h-[100vh] flex flex-col justify-center text-xl gap-8 pt-16 bg-gray-900 text-white'>
                    {menu.map((item, i) => {
                        const isActive = item.path !== "logout" && location.pathname.includes(item.path);
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
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </div>
                                    {item.path === "notifications" && unreadCount > 0 && (
                                        <span className="text-xs bg-pink-600 text-white font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                {i !== menu.length - 1 && <Divider sx={{ bgcolor: "rgba(75, 85, 99, 0.4)" }} />}
                            </React.Fragment>
                        );
                    })}
                </div>
            </Drawer>

            {/* Hộp thoại xác nhận đăng xuất đồng bộ giao diện Dark Mode */}
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
                <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5, color: '#f87171' }}>
                    <WarningAmberIcon sx={{ color: '#ef4444' }} />
                    Xác Nhận Đăng Xuất
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#9ca3af' }}>
                        Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button 
                        onClick={() => setOpenLogoutConfirm(false)} 
                        sx={{ color: '#9ca3af', '&:hover': { color: 'white' } }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleConfirmLogout} 
                        variant="contained" 
                        sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, fontWeight: 600, px: 2.5 }}
                    >
                        Đăng Xuất
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};