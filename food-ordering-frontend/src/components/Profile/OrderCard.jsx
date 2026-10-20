import React, { useState } from 'react';
import { 
    Button, Card, Divider, Typography, Chip, Dialog, 
    DialogTitle, DialogContent, DialogContentText, DialogActions, 
    CircularProgress, Snackbar, Alert, Box 
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cancelOrder } from '../../State/Order/Action';
import { addItemToCart } from '../../State/Cart/Action';
import { api } from '../../config/api';

// Icons
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReplayIcon from '@mui/icons-material/Replay';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StorefrontIcon from '@mui/icons-material/Storefront';

import { ReviewModal } from '../Restaurant/ReviewModal';

export const OrderCard = ({ order }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    if (!order) return null;

    const isUnpaid = order.orderStatus === 'PENDING';
    const isCompleted = order.orderStatus === 'COMPLETED' || order.orderStatus === 'DELIVERED';
    const isDelivering = order.orderStatus === 'OUT_FOR_DELIVERY';
    const isPreparing = order.orderStatus === 'PAID';

    const statusText = isUnpaid ? 'Chờ thanh toán' :
                       order.orderStatus === 'PAID' ? 'Đang chuẩn bị' :
                       order.orderStatus === 'OUT_FOR_DELIVERY' ? 'Đang giao hàng' :
                       isCompleted ? 'Hoàn thành' : order.orderStatus || 'PENDING';

    const getStatusColor = () => {
        if (isUnpaid) return '#f43f5e'; // Red-pink
        if (order.orderStatus === 'PAID') return '#10b981'; // Green
        if (order.orderStatus === 'OUT_FOR_DELIVERY') return '#3b82f6'; // Blue
        if (isCompleted) return '#059669'; // Emerald
        return '#9ca3af'; // Gray
    };

    // Xác định bước của tiến trình giao hàng (1: Đặt đơn, 2: Chuẩn bị món, 3: Đang giao, 4: Hoàn thành)
    const getActiveStep = () => {
        if (isCompleted) return 4;
        if (isDelivering) return 3;
        if (isPreparing) return 2;
        return 1; // PENDING
    };

    const currentStep = getActiveStep();

    // Xử lý hủy đơn
    const handleConfirmCancel = async () => {
        if (jwt && order.id) {
            await dispatch(cancelOrder({ orderId: order.id, jwt }));
            setSnackbar({ open: true, message: `Đã hủy đơn hàng #${order.id}`, severity: 'info' });
        }
        setOpenConfirm(false);
    };

    // Xử lý thanh toán ngay qua cổng Stripe
    const handlePayNow = async () => {
        if (!jwt || !order.id) return;
        setIsPaying(true);
        try {
            const { data } = await api.post(`/api/order/${order.id}/payment-link`, {}, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            if (data.payment_url) {
                window.location.href = data.payment_url;
            }
        } catch (error) {
            console.error("Lỗi tạo link thanh toán:", error);
            setSnackbar({ open: true, message: 'Không thể tạo link thanh toán Stripe. Vui lòng thử lại!', severity: 'error' });
        } finally {
            setIsPaying(false);
        }
    };

    // Xử lý đặt lại đơn này (1-Click Reorder)
    const handleReorder = async () => {
        if (!jwt || !order.items || order.items.length === 0) return;
        setIsReordering(true);
        try {
            for (const item of order.items) {
                if (item.food?.id) {
                    await dispatch(addItemToCart({
                        jwt,
                        reqData: {
                            menuItemId: item.food.id,
                            quantity: item.quantity || 1,
                            ingredients: item.ingredients || []
                        }
                    }));
                }
            }
            setSnackbar({ open: true, message: 'Đã thêm các món vào giỏ hàng!', severity: 'success' });
            setTimeout(() => {
                navigate('/cart');
            }, 500);
        } catch (error) {
            console.error("Lỗi đặt lại đơn:", error);
            setSnackbar({ open: true, message: 'Không thể đặt lại đơn hàng. Vui lòng thử lại!', severity: 'error' });
        } finally {
            setIsReordering(false);
        }
    };

    // Chuyển tới trang nhà hàng
    const handleNavigateToRestaurant = () => {
        if (order.restaurant?.id) {
            const city = order.restaurant.address?.city || "vietnam";
            const name = order.restaurant.name || "restaurant";
            navigate(`/restaurant/${city}/${name}/${order.restaurant.id}`);
        }
    };

    // Tính tạm tính trước giảm giá
    const subtotal = order.items?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;

    return (
        <Card className="p-6 bg-gray-900/90 text-white border border-gray-800 shadow-xl rounded-2xl space-y-4 hover:border-gray-700 transition duration-300">
            {/* Header đơn hàng */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <ReceiptLongIcon sx={{ color: '#ec4899', fontSize: '1.25rem' }} />
                        <Typography variant="h6" className="font-bold text-gray-100 text-lg">
                            Đơn hàng #{order.id}
                        </Typography>
                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-gray-400">
                        <span 
                            onClick={handleNavigateToRestaurant}
                            className="font-semibold text-gray-300 hover:text-pink-400 cursor-pointer transition-colors flex items-center gap-1"
                        >
                            <StorefrontIcon sx={{ fontSize: '0.95rem' }} />
                            {order.restaurant?.name || "Hệ thống nhà hàng"}
                        </span>
                        <span>•</span>
                        <span>
                            {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'N/A'}
                        </span>
                    </div>
                </div>
                
                <Chip 
                    label={statusText} 
                    sx={{
                        color: 'white',
                        bgcolor: getStatusColor(),
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        borderRadius: '8px',
                        px: 0.5
                    }}
                />
            </div>

            {/* DÒNG THỜI GIAN TIẾN TRÌNH ĐƠN HÀNG TRỰC QUAN (PROGRESS STEPPER) */}
            <div className="py-2.5 px-3 bg-gray-950/60 rounded-xl border border-gray-800/80">
                <div className="grid grid-cols-4 items-center relative">
                    {/* Đường kẻ nối giữa các bước */}
                    <div className="absolute left-[12%] right-[12%] top-3.5 h-0.5 bg-gray-800 -z-0">
                        <div 
                            className="h-full bg-pink-500 transition-all duration-500" 
                            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '33%' : currentStep === 3 ? '66%' : '100%' }}
                        />
                    </div>

                    {/* Bước 1: Đặt đơn */}
                    <div className="flex flex-col items-center text-center z-10 space-y-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStep >= 1 ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/50' : 'bg-gray-800 text-gray-400'
                        }`}>
                            <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                        </div>
                        <span className={`text-[11px] font-medium ${currentStep >= 1 ? 'text-gray-200' : 'text-gray-500'}`}>
                            Đã đặt đơn
                        </span>
                    </div>

                    {/* Bước 2: Chuẩn bị món */}
                    <div className="flex flex-col items-center text-center z-10 space-y-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStep >= 2 ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/50' : 'bg-gray-800 text-gray-400'
                        }`}>
                            <SoupKitchenIcon sx={{ fontSize: '1rem' }} />
                        </div>
                        <span className={`text-[11px] font-medium ${currentStep >= 2 ? 'text-gray-200' : 'text-gray-500'}`}>
                            Chuẩn bị món
                        </span>
                    </div>

                    {/* Bước 3: Đang giao */}
                    <div className="flex flex-col items-center text-center z-10 space-y-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStep >= 3 ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/50' : 'bg-gray-800 text-gray-400'
                        }`}>
                            <TwoWheelerIcon sx={{ fontSize: '1rem' }} />
                        </div>
                        <span className={`text-[11px] font-medium ${currentStep >= 3 ? 'text-gray-200' : 'text-gray-500'}`}>
                            Đang giao
                        </span>
                    </div>

                    {/* Bước 4: Hoàn thành */}
                    <div className="flex flex-col items-center text-center z-10 space-y-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStep >= 4 ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/50' : 'bg-gray-800 text-gray-400'
                        }`}>
                            <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                        </div>
                        <span className={`text-[11px] font-medium ${currentStep >= 4 ? 'text-emerald-400' : 'text-gray-500'}`}>
                            Hoàn thành
                        </span>
                    </div>
                </div>
            </div>

            {/* Thông tin Địa chỉ nhận hàng nếu có */}
            {order.deliveryAddress && (
                <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-950/40 p-2.5 rounded-lg border border-gray-800/60">
                    <LocationOnIcon sx={{ fontSize: '1.1rem', color: '#10b981', mt: 0.1 }} />
                    <div className="leading-relaxed">
                        <span className="font-semibold text-gray-300 mr-1">Giao đến:</span>
                        <span>
                            {order.deliveryAddress.streetAddress || ''}
                            {order.deliveryAddress.city ? `, ${order.deliveryAddress.city}` : ''}
                        </span>
                    </div>
                </div>
            )}

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />

            {/* Danh sách món ăn trong đơn */}
            <div className="space-y-3">
                {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm text-gray-300">
                        <div className="flex items-center gap-3">
                            <img
                                className="h-11 w-11 object-cover rounded-lg border border-gray-800"
                                src={item.food?.images?.[0] || "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg"}
                                alt={item.food?.name}
                            />
                            <div>
                                <span className="font-medium text-gray-100">{item.food?.name}</span>
                                <span className="text-pink-400 font-semibold ml-2">x{item.quantity}</span>
                                {item.ingredients && item.ingredients.length > 0 && (
                                    <p className="text-[11px] text-gray-500 truncate max-w-xs">
                                        {item.ingredients.join(", ")}
                                    </p>
                                )}
                            </div>
                        </div>
                        <span className="font-semibold text-gray-300">
                            {(item.totalPrice)?.toLocaleString()} đ
                        </span>
                    </div>
                ))}
            </div>

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />

            {/* Chi tiết thanh toán & mã giảm giá */}
            <div className="space-y-1.5 text-xs text-gray-400 pl-1">
                <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString()} đ</span>
                </div>
                
                {order.couponCode && (
                    <div className="flex justify-between text-emerald-400 items-center">
                        <span className="flex items-center gap-1">
                            <LocalOfferIcon sx={{ fontSize: 13 }} />
                            Khuyến mãi ({order.couponCode}):
                        </span>
                        <span>-{order.discountAmount?.toLocaleString()} đ</span>
                    </div>
                )}

                <div className="flex justify-between items-center text-sm font-bold text-white pt-1.5 border-t border-gray-800/80">
                    <span>Tổng thanh toán:</span>
                    <span className="text-pink-400 text-lg font-extrabold">
                        {(order.totalPrice || order.totalAmount)?.toLocaleString()} đ
                    </span>
                </div>
            </div>

            {/* THANH NÚT HÀNH ĐỘNG THÔNG MINH */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-gray-800">
                {/* 1. Nếu đơn chưa thanh toán: Có nút Thanh toán ngay + Nút Hủy */}
                {isUnpaid && (
                    <>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenConfirm(true)}
                            sx={{
                                color: '#f87171',
                                borderColor: 'rgba(239, 68, 68, 0.4)',
                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' },
                                fontWeight: 600,
                                borderRadius: '10px',
                                px: 2.5,
                                fontSize: '0.8rem',
                                textTransform: 'none'
                            }}
                        >
                            Hủy đơn
                        </Button>

                        <Button
                            variant="contained"
                            disabled={isPaying}
                            onClick={handlePayNow}
                            startIcon={isPaying ? <CircularProgress size={14} color="inherit" /> : <CreditCardIcon />}
                            sx={{
                                bgcolor: '#e11d48',
                                '&:hover': { bgcolor: '#be123c' },
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '10px',
                                px: 3,
                                fontSize: '0.825rem',
                                textTransform: 'none'
                            }}
                        >
                            {isPaying ? 'Đang tạo link...' : 'Thanh toán ngay'}
                        </Button>
                    </>
                )}

                {/* 2. Nếu đơn đã hoàn thành: Có nút Đánh giá + Nút Đặt lại đơn */}
                {isCompleted && (
                    <>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenReviewModal(true)}
                            startIcon={<StarIcon sx={{ color: '#facc15' }} />}
                            sx={{
                                color: '#fef08a',
                                borderColor: 'rgba(250, 204, 21, 0.4)',
                                bgcolor: 'rgba(250, 204, 21, 0.05)',
                                '&:hover': { borderColor: '#facc15', bgcolor: 'rgba(250, 204, 21, 0.15)' },
                                fontWeight: 600,
                                borderRadius: '10px',
                                px: 2.5,
                                fontSize: '0.8rem',
                                textTransform: 'none'
                            }}
                        >
                            Đánh giá
                        </Button>

                        <Button
                            variant="contained"
                            disabled={isReordering}
                            onClick={handleReorder}
                            startIcon={isReordering ? <CircularProgress size={14} color="inherit" /> : <ReplayIcon />}
                            sx={{
                                bgcolor: '#ec4899',
                                '&:hover': { bgcolor: '#db2777' },
                                color: 'white',
                                fontWeight: 600,
                                borderRadius: '10px',
                                px: 3,
                                fontSize: '0.825rem',
                                textTransform: 'none'
                            }}
                        >
                            {isReordering ? 'Đang thêm vào giỏ...' : 'Đặt lại đơn này'}
                        </Button>
                    </>
                )}

                {/* 3. Nếu đơn đang giao hoặc đang chuẩn bị: Nút xem quán ăn */}
                {(isPreparing || isDelivering) && (
                    <Button
                        variant="outlined"
                        onClick={handleNavigateToRestaurant}
                        startIcon={<StorefrontIcon />}
                        sx={{
                            color: '#60a5fa',
                            borderColor: 'rgba(96, 165, 250, 0.4)',
                            '&:hover': { borderColor: '#3b82f6', bgcolor: 'rgba(59, 130, 246, 0.1)' },
                            fontWeight: 600,
                            borderRadius: '10px',
                            px: 2.5,
                            fontSize: '0.8rem',
                            textTransform: 'none'
                        }}
                    >
                        Xem quán ăn
                    </Button>
                )}
            </div>

            {/* Modal Đánh Giá Nhà Hàng / Món Ăn */}
            <ReviewModal
                open={openReviewModal}
                handleClose={() => setOpenReviewModal(false)}
                restaurantId={order.restaurant?.id}
                foodId={order.items?.[0]?.food?.id}
                foodName={order.items?.[0]?.food?.name}
                onSuccess={() => {
                    setSnackbar({ open: true, message: 'Đã gửi đánh giá thành công! Cảm ơn bạn đã phản hồi.', severity: 'success' });
                }}
            />

            {/* Dialog xác nhận hủy đơn hàng */}
            <Dialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                PaperProps={{
                    style: { backgroundColor: '#111827', color: 'white', border: '1px solid #1f2937', borderRadius: '16px' }
                }}
            >
                <DialogTitle className="border-b border-gray-800 text-pink-500 font-bold">
                    Xác nhận hủy đơn hàng #{order.id}?
                </DialogTitle>
                <DialogContent className="mt-4">
                    <DialogContentText style={{ color: '#d1d5db' }}>
                        Bạn có chắc chắn muốn hủy đơn hàng #{order.id} không? Hành động này sẽ xóa đơn và không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="p-4 border-t border-gray-800 gap-2">
                    <Button onClick={() => setOpenConfirm(false)} style={{ color: '#9ca3af', fontWeight: 'bold' }}>
                        Giữ lại đơn
                    </Button>
                    <Button 
                        onClick={handleConfirmCancel} 
                        variant="contained" 
                        sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' }, fontWeight: 'bold', borderRadius: '8px' }}
                    >
                        Đồng Ý Hủy
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toast Snackbar phản hồi */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{ width: '100%', borderRadius: '12px', bgcolor: '#111827', color: 'white', border: '1px solid #374151' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Card>
    );
};