import React, { useEffect, useState, useMemo } from 'react';
import { OrderCard } from './OrderCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsersOrders } from '../../State/Order/Action';
import { 
    Box, Tab, Tabs, TextField, InputAdornment, 
    IconButton, Button, Chip 
} from '@mui/material';

// Icons
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export const Orders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");
    const order = useSelector(store => store.order);

    const [filterValue, setFilterValue] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    // Tự động gọi API kéo danh sách đơn hàng khi vừa vào trang
    useEffect(() => {
        if (jwt) {
            dispatch(getUsersOrders(jwt));
        }
    }, [dispatch, jwt]);

    const handleFilterChange = (event, newValue) => {
        setFilterValue(newValue);
    };

    const allOrders = order.orders || [];

    // Tính toán thống kê nhanh
    const totalOrdersCount = allOrders.length;
    
    // Đơn đang xử lý (Chờ thanh toán, Đã thanh toán, Đang giao)
    const activeOrdersCount = allOrders.filter(
        item => item.orderStatus === "PENDING" || item.orderStatus === "PAID" || item.orderStatus === "OUT_FOR_DELIVERY"
    ).length;

    // Tổng tiền các đơn đã hoàn thành
    const totalSpent = allOrders
        .filter(item => item.orderStatus === "COMPLETED" || item.orderStatus === "DELIVERED")
        .reduce((sum, item) => sum + (item.totalPrice || item.totalAmount || 0), 0);

    // Đếm số lượng theo từng tab
    const processingCount = allOrders.filter(
        item => item.orderStatus === "PENDING" || item.orderStatus === "PAID"
    ).length;
    const deliveryCount = allOrders.filter(
        item => item.orderStatus === "OUT_FOR_DELIVERY"
    ).length;
    const completedCount = allOrders.filter(
        item => item.orderStatus === "COMPLETED" || item.orderStatus === "DELIVERED"
    ).length;

    // Lọc đơn hàng theo Tab và Từ khóa tìm kiếm
    const filteredOrders = useMemo(() => {
        let list = allOrders.filter((item) => {
            if (filterValue === "ALL") return true;
            if (filterValue === "PENDING") return item.orderStatus === "PENDING" || item.orderStatus === "PAID";
            if (filterValue === "OUT_FOR_DELIVERY") return item.orderStatus === "OUT_FOR_DELIVERY";
            if (filterValue === "COMPLETED") return item.orderStatus === "COMPLETED" || item.orderStatus === "DELIVERED";
            return item.orderStatus === filterValue;
        });

        // Lọc theo từ khóa tìm kiếm (mã đơn, tên nhà hàng, tên món ăn)
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase().trim().replace(/^#/, '');
            list = list.filter(item => {
                const idMatch = String(item.id).includes(q);
                const restNameMatch = (item.restaurant?.name || '').toLowerCase().includes(q);
                const foodMatch = item.items?.some(i => (i.food?.name || '').toLowerCase().includes(q));
                return idMatch || restNameMatch || foodMatch;
            });
        }

        // Sắp xếp đơn mới nhất lên đầu
        return [...list].sort((a, b) => (b.id || 0) - (a.id || 0));
    }, [allOrders, filterValue, searchTerm]);

    const handleResetFilters = () => {
        setSearchTerm("");
        setFilterValue("ALL");
    };

    return (
        <div className="pb-16 px-4 lg:px-8 flex flex-col items-center w-full min-h-screen">
            {/* Header Trang Đơn Hàng */}
            <div className="w-full max-w-4xl py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800">
                <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 rounded-2xl text-pink-500 shadow-sm shadow-pink-500/10">
                        <ShoppingBagIcon sx={{ fontSize: '1.85rem' }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-2xl font-bold text-gray-100 tracking-wide">
                                LỊCH SỬ ĐƠN HÀNG
                            </h1>
                            <span className="text-xs bg-gray-800 text-gray-300 font-bold px-3 py-0.5 rounded-full border border-gray-700">
                                {totalOrdersCount} đơn hàng
                            </span>
                            {activeOrdersCount > 0 && (
                                <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    {activeOrdersCount} đơn đang xử lý
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Theo dõi tiến trình các đơn hàng và quản lý chi tiết bữa ăn bạn đã đặt.
                        </p>
                    </div>
                </div>

                {/* Thống kê chi tiêu */}
                {totalSpent > 0 && (
                    <div className="text-left md:text-right bg-gray-900/80 border border-gray-800 px-3.5 py-2 rounded-xl">
                        <span className="text-[11px] text-gray-400 block font-medium">Đã thanh toán:</span>
                        <span className="text-sm font-bold text-pink-400">
                            {totalSpent.toLocaleString()} đ
                        </span>
                    </div>
                )}
            </div>

            {/* Thanh Tìm Kiếm & Tabs Bộ Lọc */}
            {totalOrdersCount > 0 && (
                <div className="w-full max-w-4xl mt-6 space-y-4">
                    {/* Ô Tìm Kiếm Nhanh */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-900/60 p-3 rounded-2xl border border-gray-800">
                        <div className="w-full sm:w-80">
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Tìm theo mã đơn (#1352), tên quán, món ăn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#9ca3af', fontSize: '1.2rem' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchTerm && (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setSearchTerm("")}>
                                                <ClearIcon sx={{ color: '#9ca3af', fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        bgcolor: '#111827',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '0.85rem',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ec4899' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ec4899' }
                                    }
                                }}
                            />
                        </div>

                        {/* Thông tin số kết quả */}
                        <div className="text-xs text-gray-400 self-end sm:self-auto px-1">
                            Hiển thị <strong className="text-pink-400">{filteredOrders.length}</strong> / {totalOrdersCount} đơn
                        </div>
                    </div>

                    {/* Bộ lọc Tabs Hiện Đại */}
                    <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.08)', width: '100%' }}>
                        <Tabs 
                            value={filterValue} 
                            onChange={handleFilterChange} 
                            textColor="secondary"
                            indicatorColor="secondary"
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    color: '#9ca3af',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    px: 2.5,
                                    minHeight: 44,
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
                            <Tab label={`Tất cả (${totalOrdersCount})`} value="ALL" />
                            <Tab label={`Đang chuẩn bị (${processingCount})`} value="PENDING" />
                            <Tab label={`Đang giao (${deliveryCount})`} value="OUT_FOR_DELIVERY" />
                            <Tab label={`Hoàn thành (${completedCount})`} value="COMPLETED" />
                        </Tabs>
                    </Box>
                </div>
            )}

            {/* Danh sách Thẻ Đơn Hàng */}
            <div className="w-full max-w-4xl space-y-5 mt-6 pb-12">
                {totalOrdersCount === 0 ? (
                    /* EMPTY STATE KHI CHƯA CÓ ĐƠN HÀNG NÀO */
                    <div className="my-10 p-10 bg-gradient-to-b from-gray-900/90 to-gray-950 border border-gray-800 rounded-3xl text-center max-w-xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 shadow-xl shadow-pink-500/10">
                            <ShoppingBagIcon sx={{ fontSize: 44 }} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-100 tracking-wide mb-2">
                            Bạn chưa có đơn hàng nào
                        </h2>
                        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed mb-6">
                            Khám phá hàng trăm món ăn thơm ngon từ các nhà hàng nổi tiếng và đặt ngay bữa ăn yêu thích của bạn!
                        </p>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/")}
                            startIcon={<RestaurantMenuIcon />}
                            sx={{
                                bgcolor: '#ec4899',
                                '&:hover': { bgcolor: '#db2777' },
                                fontWeight: 600,
                                borderRadius: '12px',
                                px: 3,
                                py: 1.1,
                                textTransform: 'none',
                                fontSize: '0.875rem'
                            }}
                        >
                            Khám phá thực đơn ngay
                        </Button>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    /* EMPTY STATE KHI TÌM KIẾM KHÔNG RA ĐƠN */
                    <div className="py-16 text-center bg-gray-900/40 border border-gray-800 rounded-2xl max-w-xl mx-auto my-6 space-y-4">
                        <ShoppingBagIcon sx={{ fontSize: 44, color: '#6b7280' }} />
                        <div>
                            <p className="text-gray-300 font-semibold text-base">
                                Không tìm thấy đơn hàng nào phù hợp
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                Thử kiểm tra lại mã đơn hoặc từ khóa tìm kiếm đang nhập
                            </p>
                        </div>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleResetFilters}
                            sx={{
                                color: '#ec4899',
                                borderColor: 'rgba(236, 72, 153, 0.4)',
                                textTransform: 'none',
                                borderRadius: '10px',
                                fontSize: '0.8rem',
                                '&:hover': { borderColor: '#ec4899', bgcolor: 'rgba(236, 72, 153, 0.08)' }
                            }}
                        >
                            Đặt lại bộ lọc
                        </Button>
                    </div>
                ) : (
                    filteredOrders.map((orderItem) => (
                        <OrderCard key={orderItem.id} order={orderItem} />
                    ))
                )}
            </div>
        </div>
    );
};