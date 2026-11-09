import React, { useState } from 'react';
import { 
    Dashboard, 
    ShoppingBag, 
    Fastfood, 
    Category, 
    LocalDining, 
    Event, 
    AdminPanelSettings, 
    Logout, 
    RateReview, 
    LocalOffer, 
    MonetizationOn, 
    People, 
    AutoAwesome, 
    Storefront, 
    ChevronRight,
    Close
} from '@mui/icons-material';
import { Drawer, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
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
    { title: "Thông tin quán", icon: <AdminPanelSettings />, path: "/details" }
];

const superAdminMenu = [
    { title: "Tổng quan", icon: <Dashboard />, path: "/" },
    { title: "Trợ lý AI Copilot", icon: <AutoAwesome sx={{ color: '#ec4899' }} />, path: "/ai-copilot" },
    { title: "Người dùng", icon: <People />, path: "/users" },
    { title: "Đánh giá", icon: <RateReview />, path: "/reviews" },
    { title: "Mã giảm giá", icon: <LocalOffer />, path: "/coupons" },
    { title: "Doanh thu", icon: <MonetizationOn />, path: "/revenue" }
];

export const AdminSidebar = ({ mobileOpen = false, handleClose }) => {
    const isSmallScreen = useMediaQuery("(max-width:1080px)");
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { auth, restaurant } = useSelector(store => store);
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
        navigate(`/admin/restaurant${item.path}`);
        if (handleClose) handleClose();
    };

    const handleConfirmLogout = () => {
        setOpenLogoutConfirm(false);
        dispatch(logout());
        navigate("/");
        if (handleClose) handleClose();
    };

    const drawerContent = (
        <div className="flex flex-col h-full justify-between bg-[#0a0a0e] text-gray-200 select-none no-scrollbar">
            {/* 1. Header: Thông tin Nhà Hàng / Hệ Thống */}
            <div className="p-4 border-b border-gray-800/80 bg-gradient-to-b from-gray-900/80 to-transparent shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar quán hoặc icon Super Admin với viền phát sáng */}
                        <div className="relative shrink-0">
                            {isSuperAdmin ? (
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-600/25">
                                    <AdminPanelSettings sx={{ fontSize: 24 }} />
                                </div>
                            ) : (
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-[1.5px] shadow-lg shadow-pink-600/25">
                                    <img 
                                        src={restaurant?.usersRestaurant?.images?.[0] || "http://localhost:5173/images/tiem_com_tam_facade.jpg"} 
                                        alt="Logo" 
                                        className="w-full h-full object-cover rounded-[14px]"
                                    />
                                </div>
                            )}
                            {/* Chấm tròn báo trạng thái Hoạt động */}
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0a0a0e]"></span>
                            </span>
                        </div>

                        {/* Tên quán và trạng thái */}
                        <div className="min-w-0 flex-1">
                            <h2 className="text-sm font-extrabold text-white truncate tracking-tight">
                                {isSuperAdmin 
                                    ? "Hệ Thống Quản Trị" 
                                    : (restaurant?.usersRestaurant?.name || "Quản Trị Nhà Hàng")}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <p className="text-[11px] font-semibold text-emerald-400 tracking-wide uppercase">
                                    {isSuperAdmin ? "Super Admin" : (restaurant?.usersRestaurant?.open ? "Đang Mở Cửa" : "Đang Hoạt Động")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Nút đóng trên màn hình nhỏ */}
                    {isSmallScreen && (
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                        >
                            <Close sx={{ fontSize: 20 }} />
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Menu Navigation: Danh sách các tab chức năng */}
            <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto no-scrollbar">
                <div className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
                    <span>Menu Quản Trị</span>
                    <span className="text-[10px] text-gray-600 font-medium">v2.5</span>
                </div>

                {currentMenu.map((item, i) => {
                    const active = isItemActive(item.path);
                    const isAi = item.path === '/ai-copilot';
                    const isOrders = item.path === '/orders';

                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleNavigate(item)}
                            className={`w-full group text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                active
                                    ? "bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 text-white shadow-lg shadow-pink-600/30 ring-1 ring-pink-400/40"
                                    : "text-gray-300 hover:text-white hover:bg-gray-900/90 border border-transparent hover:border-gray-800/80"
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                    active ? "text-white" : isAi ? "text-pink-400" : "text-gray-400 group-hover:text-pink-400"
                                }`}>
                                    {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                                </span>
                                <span className="truncate">{item.title}</span>
                            </div>

                            {/* Huy hiệu điểm nhấn */}
                            <div className="flex items-center gap-1.5">
                                {isAi && (
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                        active 
                                            ? "bg-white/25 text-white border border-white/30" 
                                            : "bg-pink-500/15 text-pink-400 border border-pink-500/30 group-hover:bg-pink-500/25"
                                    }`}>
                                        AI 2.0
                                    </span>
                                )}
                                {isOrders && (
                                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                        active
                                            ? "bg-white/25 text-white border border-white/30"
                                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    }`}>
                                        Live
                                    </span>
                                )}
                                {active && !isAi && !isOrders && (
                                    <ChevronRight sx={{ fontSize: 16 }} className="text-white/80" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* 3. Footer: Nút Xem Cửa Hàng + Thẻ Thông Tin Chủ Quán + Đăng Xuất */}
            <div className="p-3 border-t border-gray-800/80 bg-gradient-to-t from-gray-900/60 to-transparent space-y-2.5 shrink-0">
                {/* Nút Xem Giao Diện Khách Hàng */}
                <button
                    type="button"
                    onClick={() => {
                        navigate("/");
                        if (handleClose) handleClose();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-900 border border-gray-800/80 hover:border-pink-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                    <Storefront sx={{ fontSize: 16 }} className="text-gray-400 group-hover:text-pink-400 transition-colors" />
                    <span>Xem giao diện khách hàng</span>
                </button>

                {/* Thẻ người dùng đăng nhập */}
                <div className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-md shadow-pink-600/30">
                            {auth.user?.fullName ? auth.user.fullName.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-200 truncate">
                                {auth.user?.fullName || "Chủ Quán"}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                                {auth.user?.email || "chuquan@food.com"}
                            </p>
                        </div>
                    </div>

                    {/* Nút đăng xuất nhanh */}
                    <button
                        type="button"
                        title="Đăng xuất tài khoản"
                        onClick={() => setOpenLogoutConfirm(true)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer shrink-0"
                    >
                        <Logout sx={{ fontSize: 17 }} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Drawer
                variant={isSmallScreen ? "temporary" : "permanent"}
                onClose={handleClose}
                open={isSmallScreen ? mobileOpen : true}
                anchor='left'
                sx={{
                    zIndex: 40,
                    '& .MuiDrawer-paper': {
                        width: { xs: '80vw', sm: '320px', lg: '280px' },
                        boxSizing: 'border-box',
                        backgroundColor: '#0a0a0e',
                        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#f3f4f6',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': { display: 'none !important' },
                        scrollbarWidth: 'none !important',
                        msOverflowStyle: 'none !important',
                        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.4)'
                    }
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Hộp thoại xác nhận đăng xuất đồng bộ Dark Mode */}
            <Dialog
                open={openLogoutConfirm}
                onClose={() => setOpenLogoutConfirm(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#18181b',
                        color: 'white',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        p: 1,
                        minWidth: '320px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold' }}>
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                        <Logout sx={{ fontSize: 18 }} />
                    </div>
                    Xác Nhận Đăng Xuất
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                        Bạn có chắc chắn muốn đăng xuất khỏi tài khoản quản trị không? Mọi thay đổi chưa lưu có thể bị gián đoạn.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        onClick={() => setOpenLogoutConfirm(false)}
                        sx={{ 
                            color: '#9ca3af', 
                            borderRadius: '10px',
                            fontWeight: '600',
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } 
                        }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleConfirmLogout}
                        variant="contained"
                        color="error"
                        sx={{ 
                            borderRadius: '10px', 
                            fontWeight: 'bold',
                            textTransform: 'none',
                            px: 2.5,
                            boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)'
                        }}
                    >
                        Đăng xuất
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
