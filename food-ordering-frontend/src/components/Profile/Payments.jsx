import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsersOrders } from '../../State/Order/Action';
import { 
    Box, Card, Button, Typography, Divider, 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Tabs, Tab, Chip, Avatar, AvatarGroup, Tooltip, IconButton 
} from '@mui/material';

// Icons
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentsIcon from '@mui/icons-material/Payments';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export const Payments = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    const orderState = useSelector(store => store.order);
    const authState = useSelector(store => store.auth);

    // Tab bộ lọc: "ALL" | "STRIPE" | "COD"
    const [tabFilter, setTabFilter] = useState("ALL");

    // Modal xem Hóa đơn điện tử
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [openInvoiceModal, setOpenInvoiceModal] = useState(false);

    // Tự động tải danh sách đơn hàng khi vào trang
    useEffect(() => {
        if (jwt) {
            dispatch(getUsersOrders(jwt));
        }
    }, [dispatch, jwt]);

    // Danh sách toàn bộ đơn hàng, sắp xếp mới nhất lên trước
    const allOrders = useMemo(() => {
        const raw = orderState.orders || [];
        return [...raw].sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.id || 0);
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.id || 0);
            return timeB - timeA;
        });
    }, [orderState.orders]);

    // Nhận diện phương thức thanh toán của đơn hàng (Stripe hoặc COD)
    const getOrderPaymentMethod = (order) => {
        if (order.paymentMethod) {
            return order.paymentMethod.toUpperCase();
        }
        // Dự phòng cho dữ liệu cũ: nếu đơn có trạng thái PAID thì là Stripe, còn lại là COD
        if (order.orderStatus === "PAID") return "STRIPE";
        return "COD";
    };

    // Kiểm tra xem đơn hàng đã thực sự được trả tiền chưa
    const isOrderActuallyPaid = (order) => {
        const isCancelled = order.orderStatus === "CANCELLED" || order.orderStatus === "CANCELED";
        if (isCancelled) return false;

        const method = getOrderPaymentMethod(order);
        if (method === "STRIPE") {
            // Đối với Stripe: Tiền đã trừ thẻ ngay khi đặt hàng thành công (trạng thái khác PENDING)
            return order.orderStatus !== "PENDING";
        }
        // Đối với COD: Khách chỉ thực sự thanh toán tiền khi đã nhận hàng thành công
        return order.orderStatus === "DELIVERED" || order.orderStatus === "COMPLETED";
    };

    // Nhận diện trạng thái thanh toán trực quan
    const getPaymentStatusInfo = (order) => {
        const isCancelled = order.orderStatus === "CANCELLED" || order.orderStatus === "CANCELED";
        const method = getOrderPaymentMethod(order);

        if (isCancelled) {
            return {
                label: "Giao dịch đã hủy",
                color: "error",
                bg: "rgba(239, 68, 68, 0.12)",
                text: "#f87171",
                border: "rgba(239, 68, 68, 0.3)",
                icon: <CancelIcon sx={{ fontSize: 16 }} />
            };
        }

        if (method === "STRIPE") {
            if (order.orderStatus === "PENDING") {
                return {
                    label: "Chờ thanh toán thẻ Stripe",
                    color: "error",
                    bg: "rgba(239, 68, 68, 0.12)",
                    text: "#f87171",
                    border: "rgba(239, 68, 68, 0.3)",
                    icon: <AccessTimeIcon sx={{ fontSize: 16 }} />
                };
            }
            return {
                label: "Đã thanh toán (Stripe)",
                color: "success",
                bg: "rgba(16, 185, 129, 0.12)",
                text: "#34d399",
                border: "rgba(16, 185, 129, 0.3)",
                icon: <CheckCircleIcon sx={{ fontSize: 16 }} />
            };
        }

        // Đơn COD:
        if (order.orderStatus === "DELIVERED" || order.orderStatus === "COMPLETED") {
            return {
                label: "Đã thanh toán tiền mặt (COD)",
                color: "success",
                bg: "rgba(16, 185, 129, 0.12)",
                text: "#34d399",
                border: "rgba(16, 185, 129, 0.3)",
                icon: <CheckCircleIcon sx={{ fontSize: 16 }} />
            };
        }

        if (order.orderStatus === "OUT_FOR_DELIVERY") {
            return {
                label: "Đang giao • Chuẩn bị tiền mặt",
                color: "primary",
                bg: "rgba(59, 130, 246, 0.12)",
                text: "#60a5fa",
                border: "rgba(59, 130, 246, 0.3)",
                icon: <TwoWheelerIcon sx={{ fontSize: 16 }} />
            };
        }

        return {
            label: "Thu tiền khi nhận hàng (COD)",
            color: "warning",
            bg: "rgba(245, 158, 11, 0.12)",
            text: "#fbbf24",
            border: "rgba(245, 158, 11, 0.3)",
            icon: <AccessTimeIcon sx={{ fontSize: 16 }} />
        };
    };

    // Thống kê tài chính tổng hợp
    const metrics = useMemo(() => {
        let totalSpent = 0;
        let stripeCount = 0;
        let codCount = 0;

        allOrders.forEach(o => {
            if (isOrderActuallyPaid(o)) {
                totalSpent += (o.totalPrice || o.totalAmount || 0);
            }

            const method = getOrderPaymentMethod(o);
            if (method === "STRIPE") {
                stripeCount++;
            } else {
                codCount++;
            }
        });

        return {
            totalSpent,
            stripeCount,
            codCount,
            totalCount: allOrders.length
        };
    }, [allOrders]);

    // Lọc danh sách theo Tab
    const filteredOrders = useMemo(() => {
        if (tabFilter === "STRIPE") {
            return allOrders.filter(o => getOrderPaymentMethod(o) === "STRIPE");
        }
        if (tabFilter === "COD") {
            return allOrders.filter(o => getOrderPaymentMethod(o) === "COD");
        }
        return allOrders;
    }, [allOrders, tabFilter]);

    // Mở xem Hóa đơn điện tử
    const handleViewInvoice = (order) => {
        setSelectedInvoice(order);
        setOpenInvoiceModal(true);
    };

    // In hóa đơn
    const handlePrintInvoice = () => {
        window.print();
    };

    // Điều hướng sang thực đơn quán để đặt lại
    const handleReorder = (order) => {
        const rest = order.restaurant;
        if (rest?.id) {
            const city = rest.address?.city || "vietnam";
            const name = rest.name || "restaurant";
            navigate(`/restaurant/${city}/${name}/${rest.id}`);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="pb-16 flex flex-col items-center w-full px-3 lg:px-8">
            {/* Header Trang */}
            <div className="w-full max-w-4xl py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-tr from-pink-500/20 to-rose-500/10 border border-pink-500/30 rounded-2xl text-pink-500 shadow-sm">
                        <ReceiptLongIcon sx={{ fontSize: '2rem' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-100 tracking-wide flex items-center gap-2.5">
                            LỊCH SỬ THANH TOÁN & GIAO DỊCH
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Theo dõi minh bạch toàn bộ giao dịch, phương thức thanh toán và hóa đơn điện tử cho các đơn hàng của bạn.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                    <Chip 
                        label={`${metrics.totalCount} giao dịch`} 
                        variant="outlined" 
                        size="small"
                        sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#9ca3af', fontWeight: 600 }}
                    />
                </div>
            </div>

            {/* 3 THẺ TỔNG QUAN TÀI CHÍNH */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-6">
                {/* Thẻ 1: Tổng chi tiêu tích lũy */}
                <Card className="bg-gradient-to-br from-gray-900 to-gray-850 border border-emerald-500/30 rounded-2xl p-5 shadow-lg flex items-center justify-between relative overflow-hidden">
                    <div className="space-y-1 relative z-10">
                        <p className="text-xs font-semibold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                            <MonetizationOnIcon sx={{ fontSize: '1rem' }} />
                            Tổng chi tiêu hoàn tất
                        </p>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
                            {metrics.totalSpent.toLocaleString()} đ
                        </Typography>
                        <p className="text-[11px] text-gray-400">
                            Chi tiêu ẩm thực trên hệ thống
                        </p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                        <MonetizationOnIcon sx={{ fontSize: '2.2rem' }} />
                    </div>
                </Card>

                {/* Thẻ 2: Thanh toán Online Stripe */}
                <Card className="bg-gradient-to-br from-gray-900 to-gray-850 border border-purple-500/30 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-purple-400 tracking-wider uppercase flex items-center gap-1.5">
                            <CreditCardIcon sx={{ fontSize: '1rem' }} />
                            Thanh toán Stripe
                        </p>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
                            {metrics.stripeCount} đơn
                        </Typography>
                        <p className="text-[11px] text-gray-400">
                            Thẻ tín dụng / Thẻ quốc tế
                        </p>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
                        <CreditCardIcon sx={{ fontSize: '2.2rem' }} />
                    </div>
                </Card>

                {/* Thẻ 3: Thanh toán COD */}
                <Card className="bg-gradient-to-br from-gray-900 to-gray-850 border border-amber-500/30 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                            <PaymentsIcon sx={{ fontSize: '1rem' }} />
                            Tiền mặt (COD)
                        </p>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
                            {metrics.codCount} đơn
                        </Typography>
                        <p className="text-[11px] text-gray-400">
                            Thanh toán khi nhận đồ ăn
                        </p>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
                        <PaymentsIcon sx={{ fontSize: '2.2rem' }} />
                    </div>
                </Card>
            </div>

            {/* THANH TABS LỌC THEO PHƯƠNG THỨC THANH TOÁN */}
            <div className="w-full max-w-4xl mt-6 mb-6">
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
                            label={`Tất cả giao dịch (${allOrders.length})`} 
                        />
                        <Tab 
                            value="STRIPE" 
                            label={`Thanh toán Online Stripe (${metrics.stripeCount})`} 
                        />
                        <Tab 
                            value="COD" 
                            label={`Tiền mặt COD (${metrics.codCount})`} 
                        />
                    </Tabs>
                </Box>
            </div>

            {/* DANH SÁCH CÁC HÓA ĐƠN GIAO DỊCH */}
            <div className="w-full max-w-4xl space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((item) => {
                        const statusInfo = getPaymentStatusInfo(item);
                        const method = getOrderPaymentMethod(item);
                        const formattedDate = item.createdAt 
                            ? new Date(item.createdAt).toLocaleString('vi-VN', {
                                hour: '2-digit', minute: '2-digit',
                                day: '2-digit', month: '2-digit', year: 'numeric'
                              })
                            : 'Mới đây';

                        return (
                            <Card 
                                key={item.id}
                                className="bg-gradient-to-br from-gray-900 via-[#13161f] to-gray-950 border border-gray-800/80 rounded-2xl p-5 hover:border-pink-500/40 transition-all duration-300 shadow-xl"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-800/80 pb-4">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        {/* Mã đơn */}
                                        <span className="font-mono font-bold text-xs bg-gray-800 text-pink-400 px-3 py-1 rounded-lg border border-gray-700">
                                            #{item.id}
                                        </span>

                                        {/* Tên nhà hàng */}
                                        <div className="flex items-center gap-1.5 text-gray-200 font-semibold text-sm">
                                            <StorefrontIcon sx={{ fontSize: 18 }} className="text-pink-500" />
                                            <span>{item.restaurant?.name || "Nhà hàng đối tác"}</span>
                                        </div>

                                        <span className="text-gray-500 text-xs hidden sm:inline">•</span>

                                        {/* Thời gian */}
                                        <span className="text-gray-400 text-xs">
                                            {formattedDate}
                                        </span>
                                    </div>

                                    {/* Nhãn phương thức & Trạng thái thanh toán */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {method === "STRIPE" ? (
                                            <Chip
                                                icon={<CreditCardIcon sx={{ fontSize: '1rem !important' }} />}
                                                label="Thẻ Online (Stripe)"
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(139, 92, 246, 0.15)',
                                                    color: '#c4b5fd',
                                                    borderColor: 'rgba(139, 92, 246, 0.3)',
                                                    borderWidth: 1,
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        ) : (
                                            <Chip
                                                icon={<PaymentsIcon sx={{ fontSize: '1rem !important' }} />}
                                                label="Tiền mặt (COD)"
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(245, 158, 11, 0.15)',
                                                    color: '#fcd34d',
                                                    borderColor: 'rgba(245, 158, 11, 0.3)',
                                                    borderWidth: 1,
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        )}

                                        <Chip
                                            icon={statusInfo.icon}
                                            label={statusInfo.label}
                                            size="small"
                                            sx={{
                                                bgcolor: statusInfo.bg,
                                                color: statusInfo.text,
                                                borderColor: statusInfo.border,
                                                borderWidth: 1,
                                                fontWeight: 700,
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Danh sách món ăn tóm tắt */}
                                <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 44, height: 44, borderColor: '#1f2937' } }}>
                                            {item.items?.map((orderItem) => (
                                                <Avatar 
                                                    key={orderItem.id} 
                                                    src={orderItem.food?.images?.[0]} 
                                                    alt={orderItem.food?.name} 
                                                    variant="rounded"
                                                />
                                            ))}
                                        </AvatarGroup>

                                        <div className="space-y-0.5">
                                            <p className="text-sm font-medium text-gray-200 line-clamp-1">
                                                {item.items?.map(oi => `${oi.food?.name} (x${oi.quantity})`).join(", ") || "Món ăn trong đơn"}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Giao đến: {item.deliveryAddress?.streetAddress || item.deliveryAddress?.city || "Địa chỉ mặc định"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Số tiền thanh toán */}
                                    <div className="text-left md:text-right shrink-0">
                                        {item.couponCode && (
                                            <div className="text-[11px] text-pink-400 flex items-center md:justify-end gap-1 mb-0.5">
                                                <LocalOfferIcon sx={{ fontSize: 13 }} />
                                                <span>Đã áp mã {item.couponCode} {item.discountAmount ? `(-${item.discountAmount.toLocaleString()}đ)` : ''}</span>
                                            </div>
                                        )}
                                        <div className="flex items-baseline md:justify-end gap-1.5">
                                            <span className="text-xs text-gray-400">Tổng thanh toán:</span>
                                            <span className="text-xl font-extrabold text-emerald-400">
                                                {(item.totalPrice || 0).toLocaleString()} đ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Nút thao tác dưới cùng */}
                                <div className="pt-3 border-t border-gray-800/60 flex flex-wrap items-center justify-between gap-2">
                                    <Button
                                        size="small"
                                        startIcon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
                                        onClick={() => handleViewInvoice(item)}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            color: '#ec4899',
                                            bgcolor: 'rgba(236, 72, 153, 0.08)',
                                            borderRadius: '8px',
                                            px: 1.5,
                                            '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.16)' }
                                        }}
                                    >
                                        Hóa đơn điện tử
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => handleReorder(item)}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '0.8rem',
                                                borderRadius: '8px',
                                                color: '#9ca3af',
                                                borderColor: '#374151',
                                                '&:hover': { borderColor: '#4b5563', color: 'white' }
                                            }}
                                        >
                                            Đặt lại
                                        </Button>

                                        <Button
                                            size="small"
                                            variant="contained"
                                            endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                                            onClick={() => navigate("/my-profile/orders")}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '0.8rem',
                                                borderRadius: '8px',
                                                bgcolor: '#1f2937',
                                                color: '#f3f4f6',
                                                '&:hover': { bgcolor: '#374151' }
                                            }}
                                        >
                                            Tiến trình đơn
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    /* Trạng thái trống */
                    <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 bg-gray-900/40 rounded-3xl border border-gray-800/80 p-8">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-500">
                            <ReceiptLongIcon sx={{ fontSize: 32 }} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-200">
                            Chưa có giao dịch thanh toán nào
                        </h3>
                        <p className="text-gray-400 text-xs max-w-md leading-relaxed">
                            {tabFilter === "ALL" 
                                ? "Khi bạn hoàn tất đặt món bằng thẻ Stripe hoặc tiền mặt COD, hóa đơn điện tử và chi tiết giao dịch sẽ được lưu trữ tự động tại đây."
                                : "Không tìm thấy giao dịch nào phù hợp với bộ lọc thanh toán đã chọn."}
                        </p>
                        <Button 
                            variant="contained" 
                            onClick={() => navigate("/")}
                            sx={{
                                background: 'linear-gradient(to right, #ec4899, #f43f5e)',
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: '10px',
                                px: 3,
                                mt: 2
                            }}
                        >
                            Khám Phá Món Ngon Ngay
                        </Button>
                    </div>
                )}
            </div>

            {/* MODAL POPUP: HÓA ĐƠN ĐIỆN TỬ (E-INVOICE) CHI TIẾT */}
            <Dialog
                open={openInvoiceModal}
                onClose={() => setOpenInvoiceModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#0f172a',
                        color: 'white',
                        border: '1px solid #1e293b',
                        borderRadius: '20px',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                        overflow: 'hidden'
                    }
                }}
            >
                {selectedInvoice && (
                    <>
                        {/* Header Hóa Đơn */}
                        <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 p-6 border-b border-slate-800 flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-pink-500 rounded-lg text-white">
                                        <RestaurantMenuIcon sx={{ fontSize: 18 }} />
                                    </div>
                                    <span className="font-extrabold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">
                                        ONLINE FOOD ORDERING
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-100 uppercase tracking-wider pt-2">
                                    HÓA ĐƠN BÁN HÀNG ĐIỆN TỬ
                                </h2>
                                <p className="text-xs text-gray-400 font-mono">
                                    Mã tra cứu: INV-{selectedInvoice.id}-{new Date(selectedInvoice.createdAt || Date.now()).getFullYear()}
                                </p>
                            </div>
                            <IconButton 
                                onClick={() => setOpenInvoiceModal(false)} 
                                sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <DialogContent className="p-6 space-y-5 bg-[#0b1120]">
                            {/* Thông tin 2 bên */}
                            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                                <div>
                                    <p className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider mb-1">
                                        ĐƠN VỊ CUNG CẤP:
                                    </p>
                                    <p className="font-bold text-gray-200 text-sm">{selectedInvoice.restaurant?.name || "Nhà hàng đối tác"}</p>
                                    <p className="text-gray-400 mt-0.5">{selectedInvoice.restaurant?.address?.streetAddress}, {selectedInvoice.restaurant?.address?.city}</p>
                                    <p className="text-gray-400">Giờ phục vụ: {selectedInvoice.restaurant?.openingHours || "08:00 - 22:00"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider mb-1">
                                        KHÁCH HÀNG:
                                    </p>
                                    <p className="font-bold text-gray-200 text-sm">{selectedInvoice.customer?.fullName || authState.user?.fullName || "Khách hàng"}</p>
                                    <p className="text-gray-400 mt-0.5">{selectedInvoice.customer?.email || authState.user?.email}</p>
                                    <p className="text-gray-400">Địa chỉ giao: {selectedInvoice.deliveryAddress?.streetAddress || selectedInvoice.deliveryAddress?.city}</p>
                                </div>
                            </div>

                            {/* Bảng kê chi tiết món ăn */}
                            <div>
                                <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                                    Chi tiết món ăn đặt mua:
                                </p>
                                <div className="border border-slate-800 rounded-xl overflow-hidden">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-900/80 text-gray-400 font-semibold border-b border-slate-800">
                                            <tr>
                                                <th className="py-2.5 px-3">Tên món ăn</th>
                                                <th className="py-2.5 px-3 text-center">SL</th>
                                                <th className="py-2.5 px-3 text-right">Đơn giá</th>
                                                <th className="py-2.5 px-3 text-right">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 text-gray-300">
                                            {selectedInvoice.items?.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-900/30">
                                                    <td className="py-2.5 px-3 font-medium">
                                                        {item.food?.name}
                                                        {item.ingredients?.length > 0 && (
                                                            <span className="block text-[10px] text-gray-500">
                                                                + {item.ingredients.join(", ")}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-center font-mono">x{item.quantity}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono">
                                                        {(item.food?.price || 0).toLocaleString()}đ
                                                    </td>
                                                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-white">
                                                        {((item.food?.price || 0) * (item.quantity || 1)).toLocaleString()}đ
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tổng kết tiền và Con dấu thanh toán */}
                            <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-slate-800">
                                {/* Con dấu điện tử chứng thực */}
                                <div>
                                    {getOrderPaymentMethod(selectedInvoice) === "STRIPE" ? (
                                        <div className="border-2 border-dashed border-emerald-500/60 bg-emerald-500/10 px-3.5 py-2 rounded-xl text-center">
                                            <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                                                ✓ ĐÃ THANH TOÁN ONLINE
                                            </p>
                                            <p className="text-[9px] text-emerald-300/80 font-mono">
                                                CỔNG STRIPE SECURE VERIFIED
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-amber-500/60 bg-amber-500/10 px-3.5 py-2 rounded-xl text-center">
                                            <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                                                ⏳ THANH TOÁN TIỀN MẶT
                                            </p>
                                            <p className="text-[9px] text-amber-300/80 font-mono">
                                                THU TIỀN KHI GIAO MÓN (COD)
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Chi tiết số tiền */}
                                <div className="w-full sm:w-auto space-y-1 text-right text-xs">
                                    {selectedInvoice.discountAmount > 0 && (
                                        <div className="flex justify-between sm:justify-end gap-4 text-pink-400">
                                            <span>Mã giảm giá ({selectedInvoice.couponCode}):</span>
                                            <span className="font-mono font-semibold">-{selectedInvoice.discountAmount.toLocaleString()}đ</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between sm:justify-end gap-4 text-gray-400">
                                        <span>Phí giao hàng:</span>
                                        <span className="font-mono text-emerald-400 font-medium">Miễn phí</span>
                                    </div>
                                    <div className="flex justify-between sm:justify-end gap-4 pt-1.5 border-t border-slate-800 text-sm">
                                        <span className="font-bold text-gray-200">TỔNG THANH TOÁN:</span>
                                        <span className="font-mono font-extrabold text-base text-emerald-400">
                                            {(selectedInvoice.totalPrice || 0).toLocaleString()} đ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>

                        <DialogActions className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between">
                            <Button 
                                startIcon={<PrintIcon />}
                                onClick={handlePrintInvoice}
                                sx={{ color: '#94a3b8', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}
                            >
                                In Hóa Đơn
                            </Button>
                            <Button 
                                variant="contained"
                                onClick={() => setOpenInvoiceModal(false)}
                                sx={{ 
                                    background: 'linear-gradient(to right, #ec4899, #f43f5e)',
                                    textTransform: 'none', 
                                    fontWeight: 700, 
                                    borderRadius: '8px', 
                                    px: 3 
                                }}
                            >
                                Đóng
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};
