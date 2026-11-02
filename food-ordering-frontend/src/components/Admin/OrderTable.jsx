import React, { useEffect, useState } from 'react';
import { 
    Box, Card, CardHeader, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Avatar, AvatarGroup, 
    Button, Menu, MenuItem, Chip, Dialog, DialogTitle, 
    DialogContent, DialogActions, IconButton, Typography, Divider, Tooltip 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantsOrder, updateOrderStatus } from '../../State/RestaurantOrder/Action';

// Icons
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentsIcon from '@mui/icons-material/Payments';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

// Danh sách trạng thái chuẩn cho quy trình bếp
const orderStatusList = [
    { label: "Bắt đầu làm món (Chuẩn bị)", value: "PAID" },
    { label: "Giao cho shipper (Đang giao)", value: "OUT_FOR_DELIVERY" },
    { label: "Đã giao thành công (Hoàn thành)", value: "COMPLETED" },
    { label: "Hủy đơn hàng (Từ chối nhận)", value: "CANCELLED" }
];

// Nhãn hiển thị trạng thái
const getStatusLabel = (status) => {
    switch (status) {
        case "PENDING": return "Chờ quán nhận";
        case "PAID": return "Đang chuẩn bị món";
        case "OUT_FOR_DELIVERY": return "Đang giao hàng";
        case "DELIVERED": return "Đã giao hàng";
        case "COMPLETED": return "Hoàn thành";
        case "CANCELLED":
        case "CANCELED": return "Đã hủy đơn";
        default: return status || "Chờ xử lý";
    }
};

// Màu sắc badge trạng thái
const getStatusChipProps = (status) => {
    switch (status) {
        case "PENDING": 
            return { 
                bg: "rgba(245, 158, 11, 0.15)", 
                text: "#fbbf24", 
                border: "rgba(245, 158, 11, 0.35)", 
                icon: <AccessTimeIcon sx={{ fontSize: '0.9rem !important' }} /> 
            };
        case "PAID": 
            return { 
                bg: "rgba(16, 185, 129, 0.15)", 
                text: "#34d399", 
                border: "rgba(16, 185, 129, 0.35)", 
                icon: <SoupKitchenIcon sx={{ fontSize: '0.9rem !important' }} /> 
            };
        case "OUT_FOR_DELIVERY": 
            return { 
                bg: "rgba(59, 130, 246, 0.15)", 
                text: "#60a5fa", 
                border: "rgba(59, 130, 246, 0.35)", 
                icon: <TwoWheelerIcon sx={{ fontSize: '0.9rem !important' }} /> 
            };
        case "DELIVERED": 
        case "COMPLETED": 
            return { 
                bg: "rgba(5, 150, 105, 0.2)", 
                text: "#10b981", 
                border: "rgba(5, 150, 105, 0.4)", 
                icon: <CheckCircleIcon sx={{ fontSize: '0.9rem !important' }} /> 
            };
        default: 
            return { 
                bg: "rgba(156, 163, 175, 0.15)", 
                text: "#9ca3af", 
                border: "rgba(156, 163, 175, 0.3)", 
                icon: <AccessTimeIcon sx={{ fontSize: '0.9rem !important' }} /> 
            };
    }
};

// Nhận diện phương thức thanh toán của đơn
const getOrderPaymentMethod = (order) => {
    if (order.paymentMethod) return order.paymentMethod.toUpperCase();
    if (order.orderStatus === "PAID") return "STRIPE";
    return "COD";
};

export const OrderTable = ({ filterValue }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    // Lấy dữ liệu từ Redux store
    const restaurant = useSelector(store => store.restaurant);
    const restaurantOrder = useSelector(store => store.restaurantOrder);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const open = Boolean(anchorEl);

    // Modal xem chi tiết đơn hàng
    const [selectedDetailOrder, setSelectedDetailOrder] = useState(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);

    // Kéo danh sách đơn từ Backend khi vào trang hoặc đổi bộ lọc
    useEffect(() => {
        if (restaurant.usersRestaurant?.id) {
            dispatch(fetchRestaurantsOrder({
                restaurantId: restaurant.usersRestaurant.id,
                orderStatus: "",
                jwt: jwt
            }));
        }
    }, [dispatch, jwt, restaurant.usersRestaurant?.id, filterValue]);

    // Lọc đơn hàng theo tab
    const filteredOrders = restaurantOrder.orders?.filter((item) => {
        if (filterValue === "ALL") return true;
        if (filterValue === "PENDING") return item.orderStatus === "PENDING" || item.orderStatus === "PAID";
        if (filterValue === "OUT_FOR_DELIVERY") return item.orderStatus === "OUT_FOR_DELIVERY";
        if (filterValue === "COMPLETED") return item.orderStatus === "COMPLETED" || item.orderStatus === "DELIVERED";
        if (filterValue === "CANCELLED") return item.orderStatus === "CANCELLED" || item.orderStatus === "CANCELED";
        return item.orderStatus === filterValue;
    }) || [];

    // Mở menu cập nhật trạng thái
    const handleUpdateStatusClick = (event, orderId) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrderId(orderId);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedOrderId(null);
    };

    // Bắn API cập nhật trạng thái
    const handleUpdateOrder = (orderStatus) => {
        if (selectedOrderId) {
            dispatch(updateOrderStatus({ orderId: selectedOrderId, orderStatus, jwt }));
        }
        handleCloseMenu();
    };

    // Mở modal chi tiết đơn
    const handleOpenDetail = (order) => {
        setSelectedDetailOrder(order);
        setOpenDetailModal(true);
    };

    return (
        <Box className="mt-5">
            <Card className='mt-1 bg-gray-900 border border-gray-800 shadow-xl rounded-2xl overflow-hidden'>
                <CardHeader 
                    title={
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-100 flex items-center gap-2">
                                <RestaurantMenuIcon sx={{ color: '#ec4899' }} />
                                QUẢN LÝ ĐƠN HÀNG NHÀ HÀNG
                            </span>
                            <span className="text-xs text-gray-400 font-normal">
                                Tổng số: <strong className="text-pink-400">{filteredOrders.length}</strong> đơn
                            </span>
                        </div>
                    } 
                    sx={{ pt: 2.5, pb: 2, px: 3, borderBottom: '1px solid rgba(255,255,255,0.06)' }} 
                />

                <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                    <Table sx={{ minWidth: 800 }} aria-label="order table">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                <TableCell sx={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.8rem' }}>Mã ĐH & Giờ</TableCell>
                                <TableCell sx={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.8rem' }}>Khách hàng & SĐT</TableCell>
                                <TableCell sx={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.8rem' }}>Món ăn & Topping</TableCell>
                                <TableCell sx={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.8rem' }}>Thanh toán & Thu tiền</TableCell>
                                <TableCell sx={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.8rem' }}>Trạng thái</TableCell>
                                <TableCell align="center" sx={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.8rem' }}>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((item) => {
                                    const method = getOrderPaymentMethod(item);
                                    const statusProps = getStatusChipProps(item.orderStatus);
                                    const isStripe = method === "STRIPE";

                                    return (
                                        <TableRow 
                                            key={item.id} 
                                            hover
                                            sx={{ 
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.02) !important' }
                                            }}
                                        >
                                            {/* 1. Mã đơn & Thời gian */}
                                            <TableCell component="th" scope="row">
                                                <div className="space-y-1">
                                                    <span className="font-extrabold text-pink-400 text-sm block">
                                                        #{item.id}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400 font-mono block">
                                                        {item.createdAt 
                                                            ? new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(item.createdAt).toLocaleDateString('vi-VN')
                                                            : 'Hôm nay'}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* 2. Khách hàng & SĐT & Địa chỉ */}
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-gray-200 text-xs">
                                                        {item.customer?.fullName || "Khách đặt online"}
                                                    </p>
                                                    <p className="text-[11px] text-pink-400 flex items-center gap-1 font-mono">
                                                        <PhoneIcon sx={{ fontSize: 12 }} />
                                                        <span>{item.deliveryAddress?.mobile || item.customer?.phone || "Chưa có SĐT"}</span>
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 flex items-center gap-1 max-w-[200px] truncate" title={item.deliveryAddress?.streetAddress || item.deliveryAddress?.city}>
                                                        <LocationOnIcon sx={{ fontSize: 12, color: '#10b981', flexShrink: 0 }} />
                                                        <span className="truncate">{item.deliveryAddress?.streetAddress || item.deliveryAddress?.city || "Địa chỉ mặc định"}</span>
                                                    </p>
                                                </div>
                                            </TableCell>

                                            {/* 3. Món ăn & Topping chi tiết cho Bếp */}
                                            <TableCell>
                                                <div className="space-y-1.5 max-w-[260px]">
                                                    {item.items?.map((orderItem) => (
                                                        <div key={orderItem.id} className="text-xs">
                                                            <div className="flex items-center gap-1.5 text-gray-200 font-medium">
                                                                <span className="text-pink-400 font-bold">x{orderItem.quantity}</span>
                                                                <span>{orderItem.food?.name}</span>
                                                            </div>
                                                            {orderItem.ingredients && orderItem.ingredients.length > 0 && (
                                                                <p className="text-[11px] text-gray-400 pl-4 font-sans">
                                                                    <span className="text-pink-400/80 mr-1">+</span>
                                                                    <span>{orderItem.ingredients.join(", ")}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>

                                            {/* 4. THANH TOÁN & THU TIỀN (PHÂN BIỆT RÕ RÀNG COD vs STRIPE) */}
                                            <TableCell>
                                                <div className="space-y-1.5">
                                                    {isStripe ? (
                                                        item.orderStatus === "PENDING" ? (
                                                            <div>
                                                                <Chip
                                                                    icon={<CreditCardIcon sx={{ fontSize: '0.9rem !important', color: '#f43f5e' }} />}
                                                                    label="CHỜ THANH TOÁN STRIPE"
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(244, 63, 94, 0.15)',
                                                                        color: '#f43f5e',
                                                                        border: '1px solid rgba(244, 63, 94, 0.35)',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.72rem',
                                                                        borderRadius: '6px'
                                                                    }}
                                                                />
                                                                <p className="text-[11px] text-rose-400 font-semibold mt-1">
                                                                    ⚠️ Khách chưa quẹt thẻ • Chưa làm món
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <Chip
                                                                    icon={<CreditCardIcon sx={{ fontSize: '0.9rem !important', color: '#c4b5fd' }} />}
                                                                    label="ĐÃ TRẢ QUA STRIPE"
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(139, 92, 246, 0.15)',
                                                                        color: '#c4b5fd',
                                                                        border: '1px solid rgba(139, 92, 246, 0.35)',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.72rem',
                                                                        borderRadius: '6px'
                                                                    }}
                                                                />
                                                                <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                                                                    ✓ Đã thanh toán thẻ • KHÔNG thu tiền
                                                                </p>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div>
                                                            <Chip
                                                                icon={<PaymentsIcon sx={{ fontSize: '0.9rem !important', color: '#f59e0b' }} />}
                                                                label="TIỀN MẶT (COD)"
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: 'rgba(245, 158, 11, 0.15)',
                                                                    color: '#fbbf24',
                                                                    border: '1px solid rgba(245, 158, 11, 0.4)',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.72rem',
                                                                    borderRadius: '6px'
                                                                }}
                                                            />
                                                            <p className="text-xs text-amber-300 font-extrabold mt-1">
                                                                Shipper thu: {(item.totalPrice || item.totalAmount || 0).toLocaleString()} đ
                                                            </p>
                                                        </div>
                                                    )}

                                                    {item.couponCode && (
                                                        <div className="text-[10px] text-pink-400 flex items-center gap-0.5">
                                                            <LocalOfferIcon sx={{ fontSize: 11 }} />
                                                            <span>Mã {item.couponCode} {item.discountAmount ? `(-${item.discountAmount.toLocaleString()}đ)` : ''}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* 5. Trạng thái đơn */}
                                            <TableCell>
                                                <Chip
                                                    icon={statusProps.icon}
                                                    label={getStatusLabel(item.orderStatus)}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: statusProps.bg,
                                                        color: statusProps.text,
                                                        border: `1px solid ${statusProps.border}`,
                                                        fontWeight: 700,
                                                        fontSize: '0.75rem',
                                                        borderRadius: '8px',
                                                        px: 0.5
                                                    }}
                                                />
                                            </TableCell>

                                            {/* 6. Thao tác: Chi tiết & Cập nhật trạng thái */}
                                            <TableCell align="center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Tooltip title="Xem chi tiết đơn hàng & In phiếu bếp">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleOpenDetail(item)}
                                                            startIcon={<VisibilityIcon sx={{ fontSize: 15 }} />}
                                                            sx={{
                                                                color: '#9ca3af',
                                                                borderColor: 'rgba(255,255,255,0.15)',
                                                                fontSize: '0.75rem',
                                                                textTransform: 'none',
                                                                borderRadius: '8px',
                                                                px: 1.5,
                                                                '&:hover': { borderColor: '#ec4899', color: '#ec4899', bgcolor: 'rgba(236, 72, 153, 0.08)' }
                                                            }}
                                                        >
                                                            Chi tiết
                                                        </Button>
                                                    </Tooltip>

                                                    {item.orderStatus === 'CANCELLED' || item.orderStatus === 'CANCELED' || item.orderStatus === 'COMPLETED' || item.orderStatus === 'DELIVERED' ? (
                                                        <Button 
                                                            variant="outlined" 
                                                            size="small" 
                                                            disabled
                                                            sx={{ 
                                                                borderColor: 'rgba(255,255,255,0.08) !important', 
                                                                color: '#6b7280 !important', 
                                                                fontWeight: 500,
                                                                fontSize: '0.72rem',
                                                                textTransform: 'none',
                                                                borderRadius: '8px',
                                                                px: 1.2
                                                            }}
                                                        >
                                                            Đã đóng
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            variant="contained" 
                                                            size="small" 
                                                            onClick={(e) => handleUpdateStatusClick(e, item.id)}
                                                            sx={{ 
                                                                bgcolor: '#ec4899', 
                                                                '&:hover': { bgcolor: '#db2777' },
                                                                color: 'white', 
                                                                fontWeight: 'bold',
                                                                fontSize: '0.75rem',
                                                                textTransform: 'none',
                                                                borderRadius: '8px',
                                                                px: 1.5
                                                            }}
                                                        >
                                                            Cập nhật
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8, color: '#9ca3af' }}>
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <RestaurantMenuIcon sx={{ fontSize: 36, color: '#4b5563' }} />
                                            <p className="text-sm font-medium text-gray-400">Không có đơn hàng nào trong mục này</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* MENU THAY ĐỔI TRẠNG THÁI TIẾN TRÌNH */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        sx: {
                            bgcolor: '#1f2937',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                            '& .MuiMenuItem-root': {
                                fontSize: '0.85rem',
                                py: 1.2,
                                px: 2,
                                '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }
                            }
                        }
                    }}
                >
                    {(() => {
                        const activeOrder = restaurantOrder.orders?.find(o => o.id === selectedOrderId);
                        if (!activeOrder) return null;
                        const isPendingStripe = (getOrderPaymentMethod(activeOrder) === "STRIPE") && (activeOrder.orderStatus === "PENDING");
                        const canCancel = activeOrder.orderStatus === "PENDING";

                        return orderStatusList
                            .filter(status => {
                                // 1. Nếu đơn Stripe đang chờ khách thanh toán, quán có thể Xác nhận thanh toán (PAID) hoặc Hủy đơn (CANCELLED)
                                if (isPendingStripe) {
                                    return status.value === "PAID" || status.value === "CANCELLED";
                                }
                                // 2. Nếu đơn không còn là PENDING (đã trả tiền hoặc đang giao), không cho phép Hủy đơn
                                if (status.value === "CANCELLED" && !canCancel) {
                                    return false;
                                }
                                return true;
                            })
                            .map((status) => (
                                <MenuItem 
                                    key={status.value} 
                                    onClick={() => handleUpdateOrder(status.value)}
                                    sx={
                                        status.value === "CANCELLED" 
                                            ? { color: '#f87171 !important' } 
                                            : (status.value === "PAID" && isPendingStripe)
                                                ? { color: '#34d399 !important', fontWeight: 'bold' }
                                                : {}
                                    }
                                >
                                    {isPendingStripe && status.value === "PAID" ? "✓ Xác nhận đã quẹt thẻ (Bắt đầu làm món)" : status.label}
                                </MenuItem>
                            ));
                    })()}
                </Menu>

                {/* MODAL XEM CHI TIẾT ĐƠN HÀNG & PHIẾU BẾP */}
                <Dialog
                    open={openDetailModal}
                    onClose={() => setOpenDetailModal(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            bgcolor: '#111827',
                            color: 'white',
                            borderRadius: '20px',
                            border: '1px solid #1f2937',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
                        }
                    }}
                >
                    {selectedDetailOrder && (
                        <>
                            {/* Header Modal */}
                            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/60">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <RestaurantMenuIcon sx={{ color: '#ec4899', fontSize: 20 }} />
                                        <h3 className="font-bold text-lg text-gray-100">
                                            PHIẾU ĐƠN HÀNG #{selectedDetailOrder.id}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Đặt lúc: {selectedDetailOrder.createdAt ? new Date(selectedDetailOrder.createdAt).toLocaleString('vi-VN') : 'N/A'}
                                    </p>
                                </div>
                                <IconButton onClick={() => setOpenDetailModal(false)} sx={{ color: '#9ca3af' }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>

                            <DialogContent className="p-5 space-y-4">
                                {/* Khung Cảnh Báo Thu Tiền (RẤT QUAN TRỌNG CHO CHỦ QUÁN & SHIPPER) */}
                                {getOrderPaymentMethod(selectedDetailOrder) === "STRIPE" ? (
                                    selectedDetailOrder.orderStatus === "PENDING" ? (
                                        <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3.5 flex items-start gap-3">
                                            <CreditCardIcon sx={{ color: '#fb7185', fontSize: 24, mt: 0.2 }} />
                                            <div>
                                                <p className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                                                    ⚠ CHỜ KHÁCH THANH TOÁN QUA STRIPE (CHƯA QUẸT THẺ)
                                                </p>
                                                <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                                                    Khách hàng chọn thanh toán thẻ nhưng <strong>CHƯA HOÀN TẤT GIAO DỊCH</strong>. Quán nên đợi khách thanh toán xong hoặc xác nhận đơn trước khi làm món.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-purple-950/40 border border-purple-500/40 rounded-xl p-3.5 flex items-start gap-3">
                                            <CreditCardIcon sx={{ color: '#c4b5fd', fontSize: 24, mt: 0.2 }} />
                                            <div>
                                                <p className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                                                    ✓ ĐÃ THANH TOÁN TRỰC TUYẾN QUA STRIPE
                                                </p>
                                                <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                                                    Khách hàng đã thanh toán 100% qua thẻ tín dụng/quốc tế. Quán chỉ bàn giao món cho tài xế/khách, <strong>TUYỆT ĐỐI KHÔNG THU THÊM TIỀN MẶT</strong>.
                                                </p>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 flex items-start gap-3">
                                        <PaymentsIcon sx={{ color: '#fbbf24', fontSize: 24, mt: 0.2 }} />
                                        <div>
                                            <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                                                ⚠ THANH TOÁN TIỀN MẶT KHI NHẬN HÀNG (COD)
                                            </p>
                                            <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                                                Shipper / nhân viên giao hàng <strong>CẦN THU TIỀN MẶT</strong> khi giao đồ ăn:
                                                <span className="text-amber-400 font-extrabold text-sm ml-1">
                                                    {(selectedDetailOrder.totalPrice || selectedDetailOrder.totalAmount || 0).toLocaleString()} đ
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Thông tin khách hàng & Địa chỉ */}
                                <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-3.5 text-xs space-y-2">
                                    <div className="flex justify-between items-center border-b border-gray-800/80 pb-2">
                                        <span className="text-gray-400">Khách hàng:</span>
                                        <span className="font-bold text-gray-200">
                                            {selectedDetailOrder.customer?.fullName || "Khách lẻ"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-800/80 pb-2">
                                        <span className="text-gray-400">Số điện thoại:</span>
                                        <span className="font-bold text-pink-400 font-mono">
                                            {selectedDetailOrder.deliveryAddress?.mobile || selectedDetailOrder.customer?.phone || "Chưa có SĐT"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start pt-0.5">
                                        <span className="text-gray-400 shrink-0 mr-2">Giao đến:</span>
                                        <span className="font-medium text-gray-200 text-right">
                                            {selectedDetailOrder.deliveryAddress?.streetAddress || selectedDetailOrder.deliveryAddress?.city || "Địa chỉ mặc định"}
                                        </span>
                                    </div>
                                </div>

                                {/* Bảng danh sách món ăn & Topping chi tiết */}
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                                        Chi tiết món chế biến:
                                    </p>
                                    <div className="border border-gray-800 rounded-xl overflow-hidden">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-gray-900 text-gray-400 border-b border-gray-800 font-semibold">
                                                <tr>
                                                    <th className="p-2.5">Món ăn</th>
                                                    <th className="p-2.5 text-center">SL</th>
                                                    <th className="p-2.5 text-right">Đơn giá</th>
                                                    <th className="p-2.5 text-right">Tổng</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800/60 text-gray-300">
                                                {selectedDetailOrder.items?.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-800/20">
                                                        <td className="p-2.5 font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <img 
                                                                    src={item.food?.images?.[0] || "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg"} 
                                                                    alt={item.food?.name} 
                                                                    className="w-8 h-8 rounded object-cover" 
                                                                />
                                                                <div>
                                                                    <span>{item.food?.name}</span>
                                                                    {item.ingredients?.length > 0 && (
                                                                        <p className="text-[10px] text-pink-400 font-normal">
                                                                            + {item.ingredients.join(", ")}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-2.5 text-center font-bold text-pink-400">
                                                            x{item.quantity}
                                                        </td>
                                                        <td className="p-2.5 text-right font-mono">
                                                            {(item.food?.price || 0).toLocaleString()}đ
                                                        </td>
                                                        <td className="p-2.5 text-right font-mono font-bold text-white">
                                                            {(item.totalPrice || ((item.food?.price || 0) * (item.quantity || 1))).toLocaleString()}đ
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Tổng kết tiền & Giảm giá */}
                                <div className="space-y-1.5 text-xs text-gray-400 pt-2 border-t border-gray-800">
                                    {selectedDetailOrder.couponCode && (
                                        <div className="flex justify-between text-pink-400 font-medium">
                                            <span>Mã giảm giá ({selectedDetailOrder.couponCode}):</span>
                                            <span className="font-mono">-{selectedDetailOrder.discountAmount?.toLocaleString()} đ</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-sm font-bold text-white pt-1 border-t border-gray-800/80">
                                        <span>Tổng tiền đơn hàng:</span>
                                        <span className="text-base text-pink-400 font-extrabold">
                                            {(selectedDetailOrder.totalPrice || selectedDetailOrder.totalAmount || 0).toLocaleString()} đ
                                        </span>
                                    </div>
                                </div>
                            </DialogContent>

                            <DialogActions className="p-4 border-t border-gray-800 bg-gray-900/60 flex justify-between">
                                <Button
                                    onClick={() => window.print()}
                                    sx={{ color: '#9ca3af', textTransform: 'none', fontSize: '0.8rem', fontWeight: 600 }}
                                >
                                    In phiếu bếp
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setOpenDetailModal(false)}
                                    sx={{ bgcolor: '#ec4899', '&:hover': { bgcolor: '#db2777' }, textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 3 }}
                                >
                                    Đóng
                                </Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>
            </Card>
        </Box>
    );
};