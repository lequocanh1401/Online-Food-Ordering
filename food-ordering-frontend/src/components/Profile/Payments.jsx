import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsersOrders, cancelOrder } from '../../State/Order/Action';
import { 
    Box, Card, CardContent, Button, Typography, Divider, CircularProgress, 
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, 
    Tabs, Tab, Chip, Tooltip, Snackbar, Alert 
} from '@mui/material';
import { api } from '../../config/api';

// Icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Hạn chót thanh toán cho đơn hàng ẩm thực F&B (30 phút)
const ORDER_EXPIRY_MINUTES = 30;

export const Payments = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    const order = useSelector(store => store.order);

    // Tab bộ lọc: "ALL" | "ACTIVE" | "EXPIRED"
    const [tabFilter, setTabFilter] = useState("ALL");

    // Loading khi tạo link Stripe
    const [loadingOrderId, setLoadingOrderId] = useState(null);

    // Modal xác nhận hủy 1 đơn
    const [openConfirmSingle, setOpenConfirmSingle] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // Modal xác nhận dọn sạch toàn bộ đơn quá hạn
    const [openConfirmBatch, setOpenConfirmBatch] = useState(false);
    const [isCleaningBatch, setIsCleaningBatch] = useState(false);

    // Toast phản hồi
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Tự động kéo lịch sử đơn hàng mới nhất
    useEffect(() => {
        if (jwt) {
            dispatch(getUsersOrders(jwt));
        }
    }, [dispatch, jwt]);

    // Helper tính toán thời gian và trạng thái hết hạn của từng đơn
    const getOrderTiming = (orderItem) => {
        const orderTimeMs = orderItem.createdAt ? new Date(orderItem.createdAt).getTime() : 0;
        const nowMs = Date.now();
        const diffMinutes = orderTimeMs > 0 ? Math.floor((nowMs - orderTimeMs) / (1000 * 60)) : 999999;
        const remainingMinutes = Math.max(0, ORDER_EXPIRY_MINUTES - diffMinutes);
        const isExpired = diffMinutes >= ORDER_EXPIRY_MINUTES;

        return {
            isExpired,
            remainingMinutes,
            diffMinutes,
            formattedTime: orderItem.createdAt ? new Date(orderItem.createdAt).toLocaleString('vi-VN') : 'Mới đây'
        };
    };

    // Lọc ra các đơn hàng PENDING và luôn sắp xếp MỚI NHẤT LÊN ĐẦU
    const allUnpaidOrders = useMemo(() => {
        const raw = order.orders?.filter(o => o.orderStatus === 'PENDING') || [];
        return [...raw].sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.id || 0);
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.id || 0);
            return timeB - timeA;
        });
    }, [order.orders]);

    // Phân loại đơn: Còn hạn giữ món vs Đã quá hạn
    const { activeOrders, expiredOrders, totalValidAmount } = useMemo(() => {
        const active = [];
        const expired = [];
        let validSum = 0;

        allUnpaidOrders.forEach((o) => {
            const { isExpired } = getOrderTiming(o);
            if (isExpired) {
                expired.push(o);
            } else {
                active.push(o);
                validSum += (o.totalPrice || 0);
            }
        });

        return {
            activeOrders: active,
            expiredOrders: expired,
            totalValidAmount: validSum
        };
    }, [allUnpaidOrders]);

    // Danh sách hiển thị theo Tab đã chọn
    const displayedOrders = useMemo(() => {
        if (tabFilter === "ACTIVE") return activeOrders;
        if (tabFilter === "EXPIRED") return expiredOrders;
        return allUnpaidOrders;
    }, [tabFilter, activeOrders, expiredOrders, allUnpaidOrders]);

    // Thanh toán qua Stripe
    const handlePayNow = async (orderId) => {
        setLoadingOrderId(orderId);
        try {
            const { data } = await api.post(`/api/order/${orderId}/payment-link`, {}, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            if (data.payment_url) {
                window.location.href = data.payment_url;
            }
        } catch (error) {
            console.error("Lỗi tạo link thanh toán:", error);
            setSnackbar({ open: true, message: 'Không thể tạo link thanh toán Stripe. Vui lòng thử lại!', severity: 'error' });
        } finally {
            setLoadingOrderId(null);
        }
    };

    // Mở popup hủy 1 đơn
    const handleCancelClick = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenConfirmSingle(true);
    };

    // Xác nhận hủy 1 đơn
    const handleConfirmCancelSingle = async () => {
        if (jwt && selectedOrderId) {
            await dispatch(cancelOrder({ orderId: selectedOrderId, jwt }));
            setSnackbar({ open: true, message: `Đã hủy đơn hàng #${selectedOrderId}`, severity: 'info' });
        }
        setOpenConfirmSingle(false);
        setSelectedOrderId(null);
    };

    // Dọn sạch toàn bộ đơn quá hạn cùng lúc (Batch cancel)
    const handleConfirmCleanBatch = async () => {
        setIsCleaningBatch(true);
        try {
            for (const expiredOrder of expiredOrders) {
                await dispatch(cancelOrder({ orderId: expiredOrder.id, jwt }));
            }
            setSnackbar({ open: true, message: `Đã dọn dẹp ${expiredOrders.length} đơn hàng quá hạn thành công!`, severity: 'success' });
        } catch (err) {
            console.error("Lỗi dọn dẹp đơn quá hạn:", err);
            setSnackbar({ open: true, message: 'Có lỗi trong quá trình dọn dẹp đơn.', severity: 'error' });
        } finally {
            setIsCleaningBatch(false);
            setOpenConfirmBatch(false);
        }
    };

    // Điều hướng sang thực đơn quán để đặt lại
    const handleReorderAtRestaurant = (restaurantObj) => {
        if (restaurantObj?.id) {
            const city = restaurantObj.address?.city || "vietnam";
            const name = restaurantObj.name || "restaurant";
            navigate(`/restaurant/${city}/${name}/${restaurantObj.id}`);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="pb-16 flex flex-col items-center w-full px-3 lg:px-8">
            {/* Header Trang */}
            <div className="w-full max-w-4xl py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-500 shadow-sm">
                        <AccountBalanceWalletIcon sx={{ fontSize: '1.75rem' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-100 tracking-wide flex items-center gap-2.5">
                            HÓA ĐƠN CHỜ THANH TOÁN
                            {activeOrders.length > 0 && (
                                <span className="text-xs bg-amber-600 text-white font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                                    {activeOrders.length} cần thanh toán
                                </span>
                            )}
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Quản lý các đơn hàng trực tuyến. Đơn hàng F&B có thời gian giữ món trong 30 phút.
                        </p>
                    </div>
                </div>

                {/* Nút dọn sạch các đơn quá hạn */}
                {expiredOrders.length > 0 && (
                    <Tooltip title="Xóa tất cả các đơn hàng đã hết hạn giữ món (> 30 phút)" arrow>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DeleteSweepIcon sx={{ fontSize: '1.1rem' }} />}
                            onClick={() => setOpenConfirmBatch(true)}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                borderRadius: '8px',
                                color: '#f87171',
                                borderColor: 'rgba(248, 113, 113, 0.4)',
                                '&:hover': {
                                    borderColor: '#ef4444',
                                    color: '#ef4444',
                                    bgcolor: 'rgba(239, 68, 68, 0.1)'
                                }
                            }}
                        >
                            Dọn sạch đơn quá hạn ({expiredOrders.length})
                        </Button>
                    </Tooltip>
                )}
            </div>

            {/* THẺ TỔNG QUAN TÀI CHÍNH THÔNG MINH */}
            {allUnpaidOrders.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mt-5">
                    {/* Thẻ 1: Đang chờ thanh toán hợp lệ */}
                    <Card className="bg-gradient-to-r from-gray-900 to-gray-850 border border-amber-500/30 rounded-2xl shadow-lg p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-amber-400 tracking-wider flex items-center gap-1.5 uppercase">
                                <AccessTimeIcon sx={{ fontSize: '1rem' }} />
                                Đang giữ chỗ làm món ({activeOrders.length} đơn)
                            </p>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
                                {totalValidAmount.toLocaleString()} đ
                            </Typography>
                            <p className="text-[11px] text-gray-400">
                                Vui lòng thanh toán sớm để nhà hàng chế biến món cho bạn
                            </p>
                        </div>
                        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
                            <CreditCardIcon sx={{ fontSize: '2rem' }} />
                        </div>
                    </Card>

                    {/* Thẻ 2: Thống kê đơn quá hạn */}
                    <Card className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-400 tracking-wider flex items-center gap-1.5 uppercase">
                                <WarningAmberIcon sx={{ fontSize: '1rem', color: '#9ca3af' }} />
                                Đã hết hạn giữ đơn
                            </p>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#9ca3af' }}>
                                {expiredOrders.length} đơn
                            </Typography>
                            <p className="text-[11px] text-gray-500">
                                {expiredOrders.length > 0 
                                    ? "Đã quá 30 phút. Quán không thể giữ món cũ." 
                                    : "Không có đơn hàng nào bị quá hạn."}
                            </p>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded-2xl border border-gray-700/50 text-gray-500">
                            <RestaurantMenuIcon sx={{ fontSize: '2rem' }} />
                        </div>
                    </Card>
                </div>
            )}

            {/* THANH TABS LỌC THEO TRẠNG THÁI */}
            <div className="w-full max-w-4xl mt-4 mb-6">
                <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                    <Tabs
                        value={tabFilter}
                        onChange={(e, val) => setTabFilter(val)}
                        textColor="inherit"
                        sx={{
                            '& .MuiTab-root': {
                                color: '#9ca3af',
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                minHeight: '48px',
                                px: 2,
                            },
                            '& .Mui-selected': {
                                color: '#ec4899 !important',
                                fontWeight: 'bold'
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#ec4899',
                                height: 3,
                                borderRadius: '3px'
                            }
                        }}
                    >
                        <Tab 
                            value="ALL" 
                            label={
                                <Box className="flex items-center gap-1.5">
                                    <span>Tất cả hóa đơn</span>
                                    <Chip label={allUnpaidOrders.length} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(255,255,255,0.1)', color: '#d1d5db' }} />
                                </Box>
                            } 
                        />
                        <Tab 
                            value="ACTIVE" 
                            label={
                                <Box className="flex items-center gap-1.5">
                                    <span>Cần thanh toán ngay</span>
                                    {activeOrders.length > 0 && (
                                        <Chip label={activeOrders.length} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#f59e0b', color: 'black', fontWeight: 'bold' }} />
                                    )}
                                </Box>
                            } 
                        />
                        <Tab 
                            value="EXPIRED" 
                            label={
                                <Box className="flex items-center gap-1.5">
                                    <span>Đã quá hạn</span>
                                    {expiredOrders.length > 0 && (
                                        <Chip label={expiredOrders.length} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af' }} />
                                    )}
                                </Box>
                            } 
                        />
                    </Tabs>
                </Box>
            </div>

            {/* DANH SÁCH CÁC THẺ ĐƠN HÀNG CHỜ THANH TOÁN */}
            <div className="space-y-4 w-full max-w-4xl">
                {displayedOrders.length === 0 ? (
                    <Card className="bg-gray-900/60 text-white border border-gray-800/80 rounded-2xl shadow-xl py-14">
                        <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
                            <div className="p-4 bg-gray-800/60 rounded-full border border-gray-700/50 text-emerald-400">
                                <AccountBalanceWalletIcon sx={{ fontSize: '3rem' }} />
                            </div>
                            <Typography variant="h6" className="font-semibold text-gray-300">
                                {tabFilter === "ACTIVE" 
                                    ? "Tuyệt vời! Bạn không có đơn hàng nào cần thanh toán gấp." 
                                    : tabFilter === "EXPIRED" 
                                    ? "Không có đơn hàng nào bị quá hạn." 
                                    : "Bạn không có hóa đơn nào đang chờ thanh toán."}
                            </Typography>
                            <Typography variant="body2" className="text-gray-500 max-w-sm">
                                Các đơn hàng mới đặt sẽ hiển thị tại đây để bạn tiện hoàn tất thanh toán qua cổng Stripe.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate("/")}
                                sx={{
                                    bgcolor: '#e91e63',
                                    color: 'white',
                                    fontWeight: 600,
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    mt: 1,
                                    '&:hover': { bgcolor: '#c2185b' }
                                }}
                            >
                                Khám phá món ngon ngay
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    displayedOrders.map((unpaidOrder) => {
                        const { isExpired, remainingMinutes, formattedTime } = getOrderTiming(unpaidOrder);

                        return (
                            <Card 
                                key={unpaidOrder.id} 
                                className={`rounded-2xl transition-all duration-200 ${
                                    isExpired
                                        ? 'bg-gray-900/40 border border-gray-800/70 hover:border-gray-700'
                                        : 'bg-gradient-to-r from-gray-900 via-gray-900 to-gray-850 border border-amber-500/40 shadow-lg shadow-amber-500/5 hover:border-amber-400'
                                }`}
                            >
                                <CardContent className="p-6 space-y-4">
                                    {/* Hàng 1: Mã đơn, Huy hiệu thời gian, Giá tiền */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <Typography variant="h6" className="font-bold text-white text-lg">
                                                    Đơn hàng #{unpaidOrder.id}
                                                </Typography>
                                                
                                                {/* Huy hiệu thời gian giữ đơn */}
                                                {isExpired ? (
                                                    <span className="text-[11px] font-semibold text-gray-400 bg-gray-800 border border-gray-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                        <AccessTimeIcon sx={{ fontSize: '0.85rem' }} />
                                                        Đã quá hạn giữ đơn (&gt; 30 phút)
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                                                        <AccessTimeIcon sx={{ fontSize: '0.85rem' }} />
                                                        Còn {remainingMinutes} phút giữ món
                                                    </span>
                                                )}
                                            </div>

                                            <Typography variant="caption" className="text-gray-400 block">
                                                Thời điểm đặt: {formattedTime}
                                            </Typography>
                                        </div>

                                        {/* Tổng tiền đơn hàng */}
                                        <div className="text-left sm:text-right">
                                            <Typography className={`text-xl font-extrabold ${isExpired ? 'text-gray-400' : 'text-pink-500'}`}>
                                                {unpaidOrder.totalPrice?.toLocaleString()} đ
                                            </Typography>
                                            {unpaidOrder.discountAmount > 0 && (
                                                <Typography variant="caption" className="text-emerald-400 font-medium">
                                                    (Đã giảm {unpaidOrder.discountAmount?.toLocaleString()} đ)
                                                </Typography>
                                            )}
                                        </div>
                                    </div>

                                    <Divider sx={{ bgcolor: isExpired ? 'rgba(255,255,255,0.05)' : 'rgba(245, 158, 11, 0.15)' }} />

                                    {/* Hàng 2: Nhà hàng & Danh sách món ăn */}
                                    <div className="space-y-2.5 text-sm">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <StorefrontIcon sx={{ fontSize: '1.1rem', color: isExpired ? '#9ca3af' : '#ec4899' }} />
                                            <span className="text-gray-400">Nhà hàng:</span> 
                                            <strong className="text-gray-100">{unpaidOrder.restaurant?.name || "Nhà hàng"}</strong>
                                        </div>

                                        <div className="pl-6 space-y-1.5">
                                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                                                Món đã chọn:
                                            </span>
                                            {unpaidOrder.items?.map((item) => (
                                                <div key={item.id} className="text-xs text-gray-300 flex justify-between items-center py-0.5">
                                                    <span>• {item.food?.name} <span className="text-gray-500 font-bold">x {item.quantity}</span></span>
                                                    <span className="text-gray-400 font-medium">{item.totalPrice?.toLocaleString()} đ</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Địa chỉ giao */}
                                        {unpaidOrder.deliveryAddress && (
                                            <div className="text-xs text-gray-400 pl-6 pt-1">
                                                Giao đến: <span className="text-gray-300">{unpaidOrder.deliveryAddress.streetAddress}, {unpaidOrder.deliveryAddress.city}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cảnh báo nếu đã quá hạn giữ món */}
                                    {isExpired && (
                                        <div className="p-3 bg-gray-800/40 border border-gray-700/50 rounded-xl text-xs text-gray-400 flex items-start gap-2">
                                            <InfoOutlinedIcon sx={{ fontSize: '1.1rem', color: '#9ca3af', mt: '1px' }} />
                                            <span>
                                                Đơn hàng này đã vượt quá thời gian giữ chỗ của nhà hàng (30 phút). Để đảm bảo độ tươi ngon của món ăn, vui lòng hủy đơn hoặc bấm <strong>Đặt món mới tại quán</strong>.
                                            </span>
                                        </div>
                                    )}

                                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />

                                    {/* Hàng 3: Các nút hành động */}
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-1">
                                        {/* Nút hủy đơn (màu đỏ) */}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                                            onClick={() => handleCancelClick(unpaidOrder.id)}
                                            sx={{
                                                color: '#f87171',
                                                borderColor: 'rgba(248, 113, 113, 0.4)',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '0.8rem',
                                                borderRadius: '8px',
                                                px: 2,
                                                py: 0.6,
                                                '&:hover': {
                                                    borderColor: '#ef4444',
                                                    color: '#ef4444',
                                                    bgcolor: 'rgba(239, 68, 68, 0.08)'
                                                }
                                            }}
                                        >
                                            Hủy đơn này
                                        </Button>

                                        {/* Nút hành động chính tùy theo trạng thái còn hạn hay quá hạn */}
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            {isExpired ? (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    size="small"
                                                    endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
                                                    onClick={() => handleReorderAtRestaurant(unpaidOrder.restaurant)}
                                                    sx={{
                                                        bgcolor: '#374151',
                                                        color: 'white',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '0.82rem',
                                                        borderRadius: '8px',
                                                        px: 2.5,
                                                        py: 0.8,
                                                        '&:hover': { bgcolor: '#4b5563' }
                                                    }}
                                                >
                                                    Đặt món mới tại quán
                                                </Button>
                                            ) : (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    size="small"
                                                    disabled={loadingOrderId !== null}
                                                    onClick={() => handlePayNow(unpaidOrder.id)}
                                                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                                                    sx={{
                                                        color: 'white',
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        fontSize: '0.85rem',
                                                        borderRadius: '8px',
                                                        px: 3,
                                                        py: 0.8,
                                                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                                                    }}
                                                >
                                                    {loadingOrderId === unpaidOrder.id ? (
                                                        <CircularProgress size={20} color="inherit" />
                                                    ) : (
                                                        "Thanh toán ngay (Stripe)"
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* DIALOG XÁC NHẬN HỦY 1 ĐƠN HÀNG */}
            <Dialog
                open={openConfirmSingle}
                onClose={() => setOpenConfirmSingle(false)}
                PaperProps={{
                    style: { backgroundColor: '#111827', color: 'white', border: '1px solid #1f2937', borderRadius: '16px', maxWidth: 440 }
                }}
            >
                <DialogTitle className="border-b border-gray-800 text-pink-500 font-bold flex items-center gap-2">
                    <WarningAmberIcon sx={{ color: '#ef4444' }} />
                    Xác nhận hủy đơn hàng #{selectedOrderId}?
                </DialogTitle>
                <DialogContent className="mt-4">
                    <DialogContentText style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
                        Bạn có chắc chắn muốn hủy đơn hàng này không? Sau khi hủy, đơn sẽ được xóa khỏi danh sách chờ thanh toán.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="p-4 border-t border-gray-800 gap-2">
                    <Button onClick={() => setOpenConfirmSingle(false)} style={{ color: '#9ca3af', textTransform: 'none', fontWeight: 600 }}>
                        Đóng
                    </Button>
                    <Button 
                        onClick={handleConfirmCancelSingle} 
                        variant="contained" 
                        sx={{ 
                            bgcolor: '#dc2626', 
                            '&:hover': { bgcolor: '#b91c1c' },
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            textTransform: 'none'
                        }}
                    >
                        Đồng Ý Hủy
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DIALOG XÁC NHẬN DỌN SẠCH TẤT CẢ ĐƠN QUÁ HẠN */}
            <Dialog
                open={openConfirmBatch}
                onClose={() => !isCleaningBatch && setOpenConfirmBatch(false)}
                PaperProps={{
                    style: { backgroundColor: '#111827', color: 'white', border: '1px solid #1f2937', borderRadius: '16px', maxWidth: 460 }
                }}
            >
                <DialogTitle className="border-b border-gray-800 text-amber-500 font-bold flex items-center gap-2">
                    <DeleteSweepIcon sx={{ color: '#f59e0b' }} />
                    Dọn sạch {expiredOrders.length} đơn hàng quá hạn?
                </DialogTitle>
                <DialogContent className="mt-4 space-y-2">
                    <DialogContentText style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
                        Hệ thống sẽ tự động hủy và xóa toàn bộ các đơn hàng đã vượt quá 30 phút giữ món. Thao tác này giúp danh sách hóa đơn của bạn luôn gọn gàng và chính xác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="p-4 border-t border-gray-800 gap-2">
                    <Button 
                        disabled={isCleaningBatch}
                        onClick={() => setOpenConfirmBatch(false)} 
                        style={{ color: '#9ca3af', textTransform: 'none', fontWeight: 600 }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button 
                        disabled={isCleaningBatch}
                        onClick={handleConfirmCleanBatch} 
                        variant="contained" 
                        sx={{ 
                            bgcolor: '#ef4444', 
                            '&:hover': { bgcolor: '#dc2626' },
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            textTransform: 'none'
                        }}
                    >
                        {isCleaningBatch ? <CircularProgress size={20} color="inherit" /> : "Xác Nhận Dọn Sạch"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* TOAST THÔNG BÁO TƯƠNG TÁC */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: '10px', fontWeight: 600 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};
