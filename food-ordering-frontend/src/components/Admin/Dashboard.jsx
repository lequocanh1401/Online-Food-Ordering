import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Card, CardContent, Typography, Box, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, 
    Switch, Chip 
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import KitchenIcon from '@mui/icons-material/Kitchen';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { updateRestaurantStatus } from '../../State/Restaurant/Action';
import { fetchRestaurantsOrder } from '../../State/RestaurantOrder/Action';
import { getIngredientsOfRestaurant } from '../../State/Ingredients/Action';
import { getMenuItemsByRestaurantId } from '../../State/Menu/Action';
import { 
    AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#e91e63', '#ff9800', '#3b82f6', '#8b5cf6', '#06b6d4'];

const getOrderStatusLabel = (status) => {
    switch (status) {
        case "PENDING": return "Chờ xử lý";
        case "PAID": return "Đã thanh toán";
        case "OUT_FOR_DELIVERY": return "Đang giao hàng";
        case "DELIVERED": return "Đã giao hàng";
        case "COMPLETED": return "Hoàn thành";
        default: return status;
    }
};

export const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");
    
    const { restaurant, restaurantOrder, menu, ingredients } = useSelector(store => store);
    const usersRestaurant = restaurant.usersRestaurant;

    useEffect(() => {
        if (usersRestaurant?.id) {
            dispatch(fetchRestaurantsOrder({
                restaurantId: usersRestaurant.id,
                orderStatus: "",
                jwt: jwt
            }));
            dispatch(getIngredientsOfRestaurant({ 
                id: usersRestaurant.id, 
                jwt 
            }));
            dispatch(getMenuItemsByRestaurantId({
                jwt,
                restaurantId: usersRestaurant.id,
                vegetarian: false,
                nonveg: false,
                seasonal: false,
                foodCategory: ""
            }));
        }
    }, [dispatch, jwt, usersRestaurant?.id]);

    const handleToggleOpenStatus = () => {
        if (usersRestaurant?.id) {
            dispatch(updateRestaurantStatus({ restaurantId: usersRestaurant.id, jwt }));
        }
    };

    if (!usersRestaurant) {
        return (
            <div className="flex items-center justify-center min-h-[80vh] text-gray-400 font-medium">
                Không tìm thấy thông tin nhà hàng...
            </div>
        );
    }

    // Tính toán số liệu thống kê
    const orders = restaurantOrder.orders || [];
    const completedOrders = orders.filter(o => o.orderStatus === "COMPLETED" || o.orderStatus === "DELIVERED");
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const pendingOrdersCount = orders.filter(o => o.orderStatus === "PENDING").length;

    // 1. Biểu đồ Doanh thu (7 ngày qua)
    const getLast7Days = () => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push({
                dateString: d.toISOString().split('T')[0], // YYYY-MM-DD
                label: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) // DD/MM
            });
        }
        return dates;
    };

    const last7DaysList = getLast7Days();
    const revenueChartData = last7DaysList.map(day => {
        const totalForDay = completedOrders
            .filter(order => {
                if (!order.createdAt) return false;
                const orderDate = new Date(order.createdAt);
                return orderDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) === day.label;
            })
            .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        
        return {
            name: day.label,
            "Doanh thu": totalForDay
        };
    });

    // 2. Tỷ lệ các món ăn bán chạy nhất (Top 5)
    const dishCounts = {};
    completedOrders.forEach(order => {
        order.items?.forEach(item => {
            if (item.food?.name) {
                const name = item.food.name;
                const qty = item.quantity || 1;
                dishCounts[name] = (dishCounts[name] || 0) + qty;
            }
        });
    });

    const topDishesData = Object.entries(dishCounts)
        .map(([name, count]) => ({ name, value: count }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // 3. Số lượng đơn hàng thành công / thất bại (Order Status Distribution)
    const successCount = orders.filter(o => o.orderStatus === "COMPLETED" || o.orderStatus === "DELIVERED").length;
    const pendingCount = orders.filter(o => o.orderStatus === "PENDING").length;
    const deliveryCount = orders.filter(o => o.orderStatus === "OUT_FOR_DELIVERY").length;
    const failedCount = orders.filter(o => !["COMPLETED", "DELIVERED", "PENDING", "OUT_FOR_DELIVERY"].includes(o.orderStatus)).length;

    const orderStatusData = [
        { name: "Thành công", value: successCount, color: "#10b981" },
        { name: "Đang chờ duyệt", value: pendingCount, color: "#f59e0b" },
        { name: "Đang giao hàng", value: deliveryCount, color: "#3b82f6" }
    ];
    if (failedCount > 0) {
        orderStatusData.push({ name: "Đã hủy/Thất bại", value: failedCount, color: "#ef4444" });
    }
    const activeStatusData = orderStatusData.filter(d => d.value > 0);

    const ingredientItems = ingredients.ingredients || [];
    const outOfStockCount = ingredientItems.filter(i => (i.quantity != null ? i.quantity : 50) <= 0).length;
    const lowStockCount = ingredientItems.filter(i => {
        const q = i.quantity != null ? i.quantity : 50;
        const min = i.minThreshold != null ? i.minThreshold : 10;
        return q > 0 && q <= min;
    }).length;

    const stats = [
        {
            title: "Doanh Thu (Hoàn thành/Đã giao)",
            value: `${totalRevenue.toLocaleString()}đ`,
            icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />,
            color: "from-emerald-500 to-green-600",
            subtitle: `Đã thanh toán cho ${completedOrders.length} đơn hàng`
        },
        {
            title: "Tổng Đơn Hàng",
            value: orders.length,
            icon: <ShoppingBagIcon sx={{ fontSize: 40 }} />,
            color: "from-blue-500 to-indigo-600",
            subtitle: `${pendingOrdersCount} đơn đang chờ xử lý`
        },
        {
            title: "Món Ăn Trong Thực Đơn",
            value: menu.menuItems?.length || 0,
            icon: <RestaurantMenuIcon sx={{ fontSize: 40 }} />,
            color: "from-amber-500 to-orange-600",
            subtitle: "Đang phục vụ khách hàng"
        },
        {
            title: "Tổng Số Nguyên Liệu",
            value: ingredientItems.length,
            icon: <KitchenIcon sx={{ fontSize: 40 }} />,
            color: outOfStockCount > 0 ? "from-rose-600 to-red-700" : lowStockCount > 0 ? "from-amber-500 to-yellow-600" : "from-pink-500 to-rose-600",
            subtitle: outOfStockCount > 0 
                ? `⚠️ CẢNH BÁO: ${outOfStockCount} mục cạn kho!` 
                : lowStockCount > 0 
                ? `⚡ ${lowStockCount} mục sắp chạm ngưỡng` 
                : "Tất cả nguyên liệu ổn định"
        }
    ];

    return (
        <div className="p-6 space-y-6 text-gray-100">
            {/* Header Dashboard */}
            <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2 }} className="p-6">
                <Box className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <Box>
                        <Typography variant="h4" className="font-bold text-gray-50 flex items-center gap-2">
                             Chào mừng trở lại, <span className="text-pink-500">{usersRestaurant.name}</span>!
                        </Typography>
                        <Typography variant="body2" className="text-gray-400 mt-1">
                            Tổng quan hoạt động kinh doanh của quán ăn hôm nay.
                        </Typography>
                    </Box>
                    <Box className="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                        <Typography className="font-semibold text-sm">
                            Nhận đơn Online:
                        </Typography>
                        <Chip 
                            label={usersRestaurant.open ? "Đang nhận đơn" : "Tạm ngưng nhận đơn"} 
                            color={usersRestaurant.open ? "success" : "error"} 
                            variant="outlined" 
                            size="small"
                            className="font-bold"
                        />
                        <Switch
                            checked={usersRestaurant.open}
                            onChange={handleToggleOpenStatus}
                            color="success"
                        />
                    </Box>
                </Box>
            </Card>

            {/* AI Business Copilot Quick Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-indigo-950/40 border border-pink-500/30 p-5 shadow-xl">
                <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 ring-2 ring-pink-400/40 shrink-0">
                            <AutoAwesomeIcon sx={{ fontSize: 28 }} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-rose-300">
                                    AI Business Copilot • Phân Tích Thông Minh
                                </h3>
                                <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded-full font-semibold">
                                    Gemini AI Engine
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 max-w-2xl">
                                Hệ thống tự động phân tích dữ liệu bán hàng, phát hiện rủi ro nguyên liệu cạn kho và đề xuất chiến lược tăng trưởng doanh thu theo thời gian thực.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/restaurant/ai-copilot')}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-pink-600/30 flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                        <span>Mở Trợ lý AI</span>
                        <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                    </button>
                </div>
            </div>

            {/* Grid 4 thẻ thống kê - Responsive 4 cột đều nhau */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, idx) => (
                    <Card key={idx} sx={{ height: '100%', bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                        <Box className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${item.color}`} />
                        <CardContent className="p-6">
                            <Box className="flex justify-between items-start">
                                <Box className="space-y-2">
                                    <Typography variant="body2" className="text-gray-400 font-medium uppercase tracking-wider">{item.title}</Typography>
                                    <Typography variant="h4" className="font-bold text-gray-50">{item.value}</Typography>
                                </Box>
                                <Box className="text-gray-400 bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                                    {item.icon}
                                </Box>
                            </Box>
                            <Typography variant="caption" className="text-gray-400 block mt-4 font-medium">
                                {item.subtitle}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Khu vực Biểu đồ Thống kê */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Biểu đồ doanh thu 7 ngày gần đây */}
                <div className="lg:col-span-6">
                    <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2, height: '100%' }} className="p-6">
                        <Typography variant="h6" className="font-bold text-gray-50 mb-4">
                            Biểu Đồ Doanh Thu (7 ngày qua)
                        </Typography>
                        <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={revenueChartData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#9ca3af"
                                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                                    />
                                    <YAxis 
                                        stroke="#9ca3af"
                                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                                        tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#1f2937', 
                                            borderColor: '#374151', 
                                            color: '#f3f4f6', 
                                            borderRadius: '8px' 
                                        }}
                                        formatter={(value) => [`${value.toLocaleString()}đ`, "Doanh thu"]}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="Doanh thu" 
                                        stroke="#10b981" 
                                        strokeWidth={2}
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </div>

                {/* 2. Biểu đồ tròn Món ăn bán chạy nhất */}
                <div className="sm:col-span-6 lg:col-span-3">
                    <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2, height: '100%' }} className="p-6 flex flex-col justify-between">
                        <Box>
                            <Typography variant="h6" className="font-bold text-gray-50 mb-1">
                                Món Ăn Bán Chạy
                            </Typography>
                            <Typography variant="caption" className="text-gray-400 block mb-4">
                                Tỷ lệ 5 món bán nhiều nhất
                            </Typography>
                        </Box>
                        <Box sx={{ width: '100%', height: 220 }} className="flex items-center justify-center relative">
                            {topDishesData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={topDishesData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {topDishesData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#1f2937', 
                                                borderColor: '#374151', 
                                                color: '#f3f4f6', 
                                                borderRadius: '8px',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value) => [`${value} phần`, "Số lượng"]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <Typography className="text-gray-500 text-sm text-center">Chưa có dữ liệu bán hàng</Typography>
                            )}
                        </Box>
                        {topDishesData.length > 0 && (
                            <Box className="mt-2 space-y-1">
                                {topDishesData.map((item, index) => (
                                    <Box key={item.name} className="flex justify-between items-center text-xs">
                                        <Box className="flex items-center gap-1.5 truncate mr-2" title={item.name}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length], flexShrink: 0 }} />
                                            <span className="text-gray-300 truncate max-w-[150px]">{item.name}</span>
                                        </Box>
                                        <span className="text-gray-400 font-semibold">{item.value}</span>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Card>
                </div>

                {/* 3. Biểu đồ tròn Trạng thái đơn hàng */}
                <div className="sm:col-span-6 lg:col-span-3">
                    <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2, height: '100%' }} className="p-6 flex flex-col justify-between">
                        <Box>
                            <Typography variant="h6" className="font-bold text-gray-50 mb-1">
                                Trạng Thái Đơn Hàng
                            </Typography>
                            <Typography variant="caption" className="text-gray-400 block mb-4">
                                Cơ cấu phân loại đơn hàng
                            </Typography>
                        </Box>
                        <Box sx={{ width: '100%', height: 220 }} className="flex items-center justify-center relative">
                            {activeStatusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={activeStatusData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            labelLine={false}
                                        >
                                            {activeStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#1f2937', 
                                                borderColor: '#374151', 
                                                color: '#f3f4f6', 
                                                borderRadius: '8px',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value) => [`${value} đơn`, "Số lượng"]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <Typography className="text-gray-500 text-sm text-center">Chưa có đơn hàng nào</Typography>
                            )}
                        </Box>
                        {activeStatusData.length > 0 && (
                            <Box className="mt-2 space-y-1">
                                {activeStatusData.map((item) => (
                                    <Box key={item.name} className="flex justify-between items-center text-xs">
                                        <Box className="flex items-center gap-1.5">
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                                            <span className="text-gray-300">{item.name}</span>
                                        </Box>
                                        <span className="text-gray-400 font-semibold">{item.value}</span>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Card>
                </div>
            </div>

            {/* Bảng đơn hàng gần đây và Tóm tắt món ăn */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Đơn hàng gần đây */}
                <div className="lg:col-span-8">
                    <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2 }} className="p-6">
                        <Box className="flex justify-between items-center mb-4">
                            <Typography variant="h6" className="font-bold text-gray-50">Đơn Hàng Gần Đây</Typography>
                            <Typography variant="caption" className="text-gray-400">Hiển thị tối đa 5 đơn mới nhất</Typography>
                        </Box>
                        <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                            <Table sx={{ minWidth: 600 }}>
                                <TableHead>
                                    <TableRow sx={{ '& th': { color: '#9ca3af', borderBottom: '1px solid #374151', fontWeight: 600 } }}>
                                        <TableCell>Mã ĐH</TableCell>
                                        <TableCell>Khách hàng</TableCell>
                                        <TableCell>Món ăn</TableCell>
                                        <TableCell align="right">Tổng tiền</TableCell>
                                        <TableCell align="center">Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.slice(0, 5).map((order) => (
                                        <TableRow key={order.id} sx={{ '& td': { color: '#f3f4f6', borderBottom: '1px solid #1f2937' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                            <TableCell className="font-mono">#{order.id}</TableCell>
                                            <TableCell>{order.customer?.fullName || "Khách lẻ"}</TableCell>
                                            <TableCell>
                                                <div className="max-w-[200px] truncate" title={order.items?.map(item => item.food?.name).filter(Boolean).join(", ")}>
                                                    {order.items?.map(item => item.food?.name).filter(Boolean).join(", ") || "Chưa có món"}
                                                </div>
                                            </TableCell>
                                            <TableCell align="right" className="font-semibold text-emerald-400">{(order.totalPrice || 0).toLocaleString()}đ</TableCell>
                                            <TableCell align="center">
                                                <Chip 
                                                    label={getOrderStatusLabel(order.orderStatus)} 
                                                    size="small" 
                                                    color={
                                                        order.orderStatus === "PENDING" ? "warning" : 
                                                        order.orderStatus === "COMPLETED" || order.orderStatus === "DELIVERED" ? "success" : 
                                                        "info"
                                                    }
                                                    className="font-bold text-xs"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {orders.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" className="text-gray-500 py-6">
                                                Chưa có đơn hàng nào được ghi nhận.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </div>

                {/* Món ăn nổi bật / Thực đơn thu nhỏ */}
                <div className="lg:col-span-4">
                    <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2 }} className="p-6">
                        <Typography variant="h6" className="font-bold text-gray-50 mb-4">Danh sách Món ăn mới</Typography>
                        <Box className="space-y-4">
                            {menu.menuItems?.slice(0, 4).map((food) => (
                                <Box key={food.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-800/40 border border-gray-700/60">
                                    <Box className="flex items-center gap-3">
                                        <Avatar src={food.images?.[0]} variant="rounded" sx={{ width: 45, height: 45 }} />
                                        <Box>
                                            <Typography className="font-semibold text-sm text-gray-200">{food.name}</Typography>
                                            <Typography variant="caption" className="text-gray-400">{(food.price || 0).toLocaleString()}đ</Typography>
                                        </Box>
                                    </Box>
                                    <Chip 
                                        label={food.available ? "Có sẵn" : "Hết món"} 
                                        size="small" 
                                        variant="outlined"
                                        color={food.available ? "success" : "error"}
                                        className="text-xs"
                                    />
                                </Box>
                            ))}
                            {(!menu.menuItems || menu.menuItems.length === 0) && (
                                <Typography className="text-center text-gray-500 py-6 text-sm">Chưa có món ăn trong thực đơn.</Typography>
                            )}
                        </Box>
                    </Card>
                </div>
            </div>
        </div>
    );
};