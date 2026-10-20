import React, { useEffect, useState } from 'react';
import { 
    Card, CardMedia, CardContent, Typography, Box, Tabs, Tab, 
    Divider, Button, Chip, Snackbar, Alert 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEventsAction } from '../../State/Restaurant/Action';
import { useNavigate } from 'react-router-dom';

// Icons
import EventIcon from '@mui/icons-material/Event';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import axios from 'axios';
import { API_URL } from '../../config/api';

export const Events = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const navigate = useNavigate();

    // Lấy dữ liệu sự kiện từ store Redux
    const restaurant = useSelector(store => store.restaurant);
    const cart = useSelector(store => store.cart);

    // Tab control ("events" hoặc "coupons")
    const [tabValue, setTabValue] = useState("events");

    // Danh sách mã giảm giá từ API
    const [coupons, setCoupons] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const hasCartItems = (cart.cart?.item?.length || cart.cartItems?.length || 0) > 0;
    const eventsList = restaurant.events || [];
    const eventsCount = eventsList.length;
    const couponsCount = coupons.length;

    // Tự động tải cả Sự kiện và Danh sách Mã giảm giá khi vào trang
    useEffect(() => {
        if (jwt) {
            dispatch(getAllEventsAction({ jwt }));
        }
        fetchCoupons();
    }, [dispatch, jwt]);

    // Lấy danh sách mã giảm giá từ backend
    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/coupons`, {
                headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
            });
            setCoupons(data || []);
        } catch (err) {
            console.error("Lỗi lấy danh sách mã giảm giá:", err);
        }
    };

    // Điều hướng vào thực đơn của quán (tự động kích hoạt mã giảm giá không cần copy thủ công)
    const handleNavigateToRestaurant = (eventItem, couponCode = null) => {
        const restaurantObj = eventItem.restaurant;
        const restName = restaurantObj?.name || "nhà hàng";

        if (couponCode) {
            try {
                localStorage.setItem("pending_coupon", JSON.stringify({
                    code: couponCode,
                    restaurantId: restaurantObj?.id || null,
                    restName: restName,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.error("Lỗi lưu pending_coupon:", e);
            }
            setSnackbarMessage(`Đã kích hoạt mã "${couponCode}"! Đang mở thực đơn ${restName}...`);
            setOpenSnackbar(true);
        } else {
            setSnackbarMessage(`Đang chuyển đến thực đơn ${restName}...`);
            setOpenSnackbar(true);
        }

        if (restaurantObj?.id) {
            const city = restaurantObj.address?.city || "vietnam";
            const name = restaurantObj.name || "restaurant";
            const id = restaurantObj.id;
            setTimeout(() => {
                navigate(`/restaurant/${city}/${name}/${id}`);
            }, 600);
        } else {
            setTimeout(() => {
                navigate("/");
            }, 500);
        }
    };

    // Áp dụng trực tiếp 1 chạm từ thẻ Coupon sang Thực đơn quán hoặc Giỏ hàng
    const handleApplyCouponDirectly = (couponItem) => {
        try {
            localStorage.setItem("pending_coupon", JSON.stringify({
                code: couponItem.code,
                restaurantId: couponItem.restaurant?.id || null,
                restName: couponItem.restaurant?.name || "Hệ thống",
                timestamp: Date.now()
            }));
        } catch (e) {
            console.error("Lỗi lưu pending_coupon:", e);
        }

        if (couponItem.restaurant?.id) {
            setSnackbarMessage(`Đã kích hoạt mã "${couponItem.code}"! Đang mở thực đơn ${couponItem.restaurant.name}...`);
            setOpenSnackbar(true);
            const city = couponItem.restaurant.address?.city || "vietnam";
            const name = couponItem.restaurant.name || "restaurant";
            const id = couponItem.restaurant.id;
            setTimeout(() => {
                navigate(`/restaurant/${city}/${name}/${id}`);
            }, 600);
        } else {
            // Mã toàn sàn: Nếu giỏ đã có món thì dẫn vào giỏ áp dụng luôn, nếu giỏ trống thì ra trang chủ chọn món
            if (hasCartItems) {
                setSnackbarMessage(`Đã kích hoạt mã toàn sàn "${couponItem.code}"! Đang chuyển đến giỏ hàng...`);
                setOpenSnackbar(true);
                setTimeout(() => {
                    navigate("/cart");
                }, 600);
            } else {
                setSnackbarMessage(`Đã kích hoạt mã toàn sàn "${couponItem.code}"! Hãy chọn món để thưởng thức ưu đãi.`);
                setOpenSnackbar(true);
                setTimeout(() => {
                    navigate("/");
                }, 600);
            }
        }
    };

    const formatVietnameseDate = (dateStr) => {
        if (!dateStr) return "Chưa cập nhật";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} - ${hours}:${minutes}`;
        } catch {
            return dateStr;
        }
    };

    const getEventStatus = (startedAt, endsAt) => {
        try {
            const now = new Date();
            const start = new Date(startedAt);
            const end = new Date(endsAt);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return { label: "Đang diễn ra", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", border: "#10b981" };
            }

            if (now < start) {
                return { label: "Sắp diễn ra", color: "#60a5fa", bg: "rgba(96, 165, 250, 0.15)", border: "#60a5fa" };
            } else if (now > end) {
                return { label: "Đã kết thúc", color: "#9ca3af", bg: "rgba(156, 163, 175, 0.15)", border: "#9ca3af" };
            } else {
                return { label: "Đang diễn ra", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", border: "#10b981" };
            }
        } catch {
            return { label: "Đang diễn ra", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", border: "#10b981" };
        }
    };

    const formatVND = (value) => {
        if (!value && value !== 0) return "0 đ";
        return Number(value).toLocaleString('vi-VN') + " đ";
    };

    // Tìm mã giảm giá liên kết tương ứng với quán tạo ra sự kiện này
    const findMatchingCoupon = (restaurantId) => {
        if (!restaurantId || !coupons.length) return null;
        return coupons.find(c => c.restaurant?.id === restaurantId && c.active);
    };

    return (
        <div className="w-full pb-16 flex flex-col items-center px-4 lg:px-8">
            {/* Header Trang Sự kiện & Khuyến mãi đồng bộ chuẩn phong cách hệ thống */}
            <div className="w-full max-w-6xl py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800">
                <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 rounded-2xl text-pink-500 shadow-sm shadow-pink-500/10">
                        <EventIcon sx={{ fontSize: '1.85rem' }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-2xl font-bold text-gray-100 tracking-wide">
                                SỰ KIỆN & KHUYẾN MÃI
                            </h1>
                            <span className="text-xs bg-pink-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                                {eventsCount} sự kiện
                            </span>
                            <span className="text-xs bg-gray-800 text-gray-300 font-bold px-2.5 py-0.5 rounded-full border border-gray-700">
                                {couponsCount} mã ưu đãi
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Cập nhật tiến trình ưu đãi, sự kiện ẩm thực theo quán và mã giảm giá áp dụng trực tiếp khi đặt món
                        </p>
                    </div>
                </div>
            </div>

            {/* Thanh Tab điều hướng Hiện Đại */}
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.08)', width: '100%', maxWidth: '1152px', mt: 3, mb: 4 }}>
                <Tabs 
                    value={tabValue} 
                    onChange={(e, nv) => setTabValue(nv)} 
                    textColor="secondary"
                    indicatorColor="secondary"
                    sx={{
                        '& .MuiTab-root': {
                            color: '#9ca3af',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '0.925rem',
                            pb: 1.5,
                            px: 3
                        },
                        '& .Mui-selected': {
                            color: '#ec4899 !important',
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#ec4899',
                            height: 3,
                            borderRadius: '3px 3px 0 0'
                        }
                    }}
                >
                    <Tab label={`Sự kiện theo Quán (${eventsCount})`} value="events" />
                    <Tab label={`Mã giảm giá (${couponsCount})`} value="coupons" />
                </Tabs>
            </Box>

            {/* TAB 1: SỰ KIỆN & ƯU ĐÃI THEO QUÁN */}
            {tabValue === "events" && (
                <div className="w-full max-w-6xl flex flex-col">
                    {eventsList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {eventsList.map((item) => {
                                const status = getEventStatus(item.startedAt, item.endsAt);
                                const restName = item.restaurant?.name || "Hệ thống";
                                const eventPromo = item.promoCode 
                                    ? { 
                                        code: item.promoCode, 
                                        discountType: item.discountType || "PERCENTAGE", 
                                        discountValue: item.discountValue || 0, 
                                        minimumOrderValue: item.minimumOrderValue || 0 
                                      }
                                    : findMatchingCoupon(item.restaurant?.id);

                                return (
                                    <Card 
                                        key={item.id} 
                                        sx={{ 
                                            bgcolor: '#111827', 
                                            border: '1px solid #1f2937', 
                                            borderRadius: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                borderColor: '#ec4899',
                                                boxShadow: '0 12px 24px rgba(236, 72, 153, 0.15)'
                                            }
                                        }}
                                    >
                                        {/* Hình ảnh sự kiện + Badges */}
                                        <div className="relative h-48 w-full overflow-hidden bg-gray-800">
                                            <CardMedia
                                                component="img"
                                                image={item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"}
                                                alt={item.name}
                                                sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />

                                            {/* Trạng thái diễn ra */}
                                            <div className="absolute top-3 left-3">
                                                <Chip 
                                                    label={status.label} 
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: status.bg, 
                                                        color: status.color, 
                                                        border: `1px solid ${status.border}`,
                                                        fontWeight: 'bold',
                                                        backdropFilter: 'blur(4px)'
                                                    }}
                                                />
                                            </div>

                                            {/* Huy hiệu đặt Online */}
                                            <div className="absolute top-3 right-3">
                                                <Chip 
                                                    icon={<TwoWheelerIcon sx={{ fontSize: '0.9rem !important', color: '#10b981' }} />}
                                                    label="Đặt Online" 
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: 'rgba(16, 185, 129, 0.9)', 
                                                        color: 'white', 
                                                        fontWeight: 'bold',
                                                        backdropFilter: 'blur(4px)'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <CardContent className="flex-1 flex flex-col justify-between p-5 space-y-3.5">
                                            <div>
                                                {/* Nhãn xác định quán sở hữu sự kiện */}
                                                <div className="flex items-center gap-1.5 text-xs text-pink-400 font-semibold mb-1">
                                                    <StorefrontIcon sx={{ fontSize: '1rem' }} />
                                                    <span>Ưu đãi độc quyền của {restName}</span>
                                                </div>

                                                <Typography 
                                                    variant="h6" 
                                                    className="font-bold text-gray-100 line-clamp-2"
                                                    sx={{ minHeight: '3.2rem', lineHeight: 1.3 }}
                                                >
                                                    {item.name}
                                                </Typography>

                                                {/* Khu vực giao hàng */}
                                                <div className="flex items-start gap-2 text-xs text-gray-400 mt-2">
                                                    <LocationOnIcon sx={{ fontSize: '1rem', color: '#9ca3af', mt: '1px' }} />
                                                    <span className="line-clamp-1">
                                                        Khu vực phục vụ: <strong className="text-gray-300">{item.location || item.restaurant?.address?.city || "Toàn thành phố"}</strong>
                                                    </span>
                                                </div>

                                                {/* Khối Mã ưu đãi liên kết của quán nếu có */}
                                                {eventPromo ? (
                                                    <div className="mt-3 p-2.5 bg-gray-800/80 border border-dashed border-pink-500/60 rounded-xl flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <LocalOfferIcon sx={{ fontSize: '1.1rem', color: '#ec4899' }} />
                                                            <div>
                                                                <p className="text-xs font-bold text-pink-400 tracking-wider">Mã: {eventPromo.code}</p>
                                                                <p className="text-[11px] text-gray-400">
                                                                    {eventPromo.discountType === "PERCENTAGE" ? `Giảm ${eventPromo.discountValue}%` : `Giảm ${formatVND(eventPromo.discountValue)}`} (Đơn từ {formatVND(eventPromo.minimumOrderValue)})
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                                            Tự động áp dụng
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="mt-3 p-2 bg-gray-800/40 border border-gray-800 rounded-lg text-xs text-gray-400 flex items-center gap-1.5">
                                                        <RestaurantMenuIcon sx={{ fontSize: '0.95rem', color: '#ec4899' }} />
                                                        <span>Ưu đãi áp dụng trên thực đơn trực tuyến của quán</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Thời gian sự kiện */}
                                            <div className="pt-2.5 border-t border-gray-800 space-y-1 text-xs text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <CalendarMonthIcon sx={{ fontSize: '0.95rem', color: '#60a5fa' }} />
                                                    <span>Bắt đầu: {formatVietnameseDate(item.startedAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <AccessTimeIcon sx={{ fontSize: '0.95rem', color: '#f87171' }} />
                                                    <span>Kết thúc: {formatVietnameseDate(item.endsAt)}</span>
                                                </div>
                                            </div>

                                            {/* Nút hành động duy nhất: Đặt món áp dụng ngay */}
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                endIcon={<ArrowForwardIcon />}
                                                onClick={() => handleNavigateToRestaurant(item, eventPromo?.code)}
                                                sx={{
                                                    mt: 1.5,
                                                    bgcolor: '#ec4899',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    borderRadius: '10px',
                                                    py: 1,
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        bgcolor: '#db2777'
                                                    }
                                                }}
                                            >
                                                {eventPromo ? `Đặt món & Dùng mã ${eventPromo.code}` : `Xem thực đơn ${restName}`}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-gray-900/40 border border-gray-800 rounded-2xl">
                            <p className="text-gray-400 text-lg">Hiện tại chưa có sự kiện hoặc chương trình khuyến mãi nào đang diễn ra.</p>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: MÃ GIẢM GIÁ (COUPONS) */}
            {tabValue === "coupons" && (
                <div className="w-full max-w-6xl flex flex-col">
                    {coupons.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coupons.map((item) => {
                                const isSystemCoupon = !item.restaurant?.name;
                                return (
                                    <div 
                                        key={item.id} 
                                        className="relative bg-gray-900/90 border border-gray-800 rounded-2xl p-5 hover:border-pink-500/80 transition-all duration-300 shadow-xl flex flex-col justify-between group"
                                    >
                                        <div>
                                            {/* Header Voucher */}
                                            <div className="flex justify-between items-center mb-3">
                                                <Chip
                                                    icon={<ConfirmationNumberIcon sx={{ fontSize: '0.9rem !important', color: isSystemCoupon ? '#60a5fa' : '#f472b6' }} />}
                                                    label={isSystemCoupon ? "Mã Toàn Sàn" : `Quán: ${item.restaurant.name}`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: isSystemCoupon ? 'rgba(96, 165, 250, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                                                        color: isSystemCoupon ? '#93c5fd' : '#f472b6',
                                                        border: `1px solid ${isSystemCoupon ? 'rgba(96, 165, 250, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
                                                        fontWeight: 600,
                                                        maxWidth: '70%'
                                                    }}
                                                />
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {item.discountType === "PERCENTAGE" ? "Giảm theo %" : "Giảm tiền mặt"}
                                                </span>
                                            </div>

                                            {/* Khối Mã code dạng vé răng cưa rõ ràng */}
                                            <div className="flex justify-between items-center bg-gray-800/60 border border-dashed border-pink-500/50 rounded-xl px-4 py-2.5 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <LocalOfferIcon sx={{ color: '#ec4899', fontSize: '1.1rem' }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#ec4899', letterSpacing: '0.05em' }}>
                                                        {item.code}
                                                    </Typography>
                                                </div>
                                                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                                    {item.discountType === "PERCENTAGE" ? `Giảm ${item.discountValue}%` : `Giảm ${formatVND(item.discountValue)}`}
                                                </span>
                                            </div>

                                            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)', mb: 3 }} />

                                            {/* Giá trị giảm giá & Điều kiện */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-baseline">
                                                    <span className="text-xs text-gray-400">Mức giảm:</span>
                                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>
                                                        {item.discountType === "PERCENTAGE" ? `${item.discountValue}%` : formatVND(item.discountValue)}
                                                    </Typography>
                                                </div>

                                                <div className="flex justify-between items-center text-xs text-gray-400">
                                                    <span>Đơn tối thiểu:</span>
                                                    <span className="text-gray-200 font-semibold">{formatVND(item.minimumOrderValue)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Nút hành động duy nhất: Đặt món áp dụng ngay (Tự động kích hoạt không cần copy) */}
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            endIcon={isSystemCoupon ? <ShoppingCartIcon sx={{ fontSize: 16 }} /> : <ArrowForwardIcon sx={{ fontSize: 16 }} />}
                                            onClick={() => handleApplyCouponDirectly(item)}
                                            sx={{
                                                mt: 3.5,
                                                bgcolor: '#ec4899',
                                                color: 'white',
                                                borderRadius: '10px',
                                                fontSize: '0.825rem',
                                                fontWeight: 700,
                                                py: 1,
                                                textTransform: 'none',
                                                '&:hover': {
                                                    bgcolor: '#db2777',
                                                    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)'
                                                }
                                            }}
                                        >
                                            {isSystemCoupon ? "Dùng mã toàn sàn ngay" : `Đặt món tại ${item.restaurant.name}`}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-gray-900/40 border border-gray-800 rounded-2xl">
                            <p className="text-gray-400 text-lg">Chưa có mã giảm giá nào được phát hành trên hệ thống.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Toast thông báo sau khi kích hoạt mã */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setOpenSnackbar(false)} 
                    severity="success"
                    sx={{ width: '100%', borderRadius: '12px', bgcolor: '#111827', color: 'white', border: '1px solid #374151' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};