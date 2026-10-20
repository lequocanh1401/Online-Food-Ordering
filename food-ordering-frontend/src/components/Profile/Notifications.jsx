import React, { useEffect, useState, useMemo } from 'react';
import { 
    Card, CardContent, Typography, Box, Divider, Button, 
    IconButton, Tabs, Tab, Badge, Chip, Tooltip, Snackbar, Alert 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsersOrders } from '../../State/Order/Action';
import { getAllEventsAction } from '../../State/Restaurant/Action';

// Icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InfoIcon from '@mui/icons-material/Info';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import CircleIcon from '@mui/icons-material/Circle';
import SecurityIcon from '@mui/icons-material/Security';

export const Notifications = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    const order = useSelector(store => store.order);
    const restaurant = useSelector(store => store.restaurant);

    // Tab bộ lọc: "ALL" | "UNREAD" | "ORDER" | "PROMO" | "SYSTEM"
    const [filterTab, setFilterTab] = useState("ALL");

    // Danh sách ID thông báo đã đọc
    const [readIds, setReadIds] = useState(() => {
        try {
            const saved = localStorage.getItem("read_notifications");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Danh sách ID thông báo đã xóa vĩnh viễn
    const [deletedIds, setDeletedIds] = useState(() => {
        try {
            const saved = localStorage.getItem("deleted_notifications");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Toast thông báo tương tác
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Tự động kéo lịch sử đơn hàng và sự kiện
    useEffect(() => {
        if (jwt) {
            dispatch(getUsersOrders(jwt));
            dispatch(getAllEventsAction({ jwt }));
        }
    }, [dispatch, jwt]);

    // Tổng hợp danh sách thông báo từ Orders, Events và System
    const rawNotifications = useMemo(() => {
        const list = [];

        // 1. Thông báo hệ thống chào mừng
        list.push({
            id: "system-welcome",
            category: "SYSTEM",
            type: "WELCOME",
            title: "Chào mừng bạn đến với Online Food Ordering!",
            content: "Cảm ơn bạn đã lựa chọn Online Food Ordering làm người bạn đồng hành ẩm thực. Khám phá hàng trăm món ngon và nhận ngập tràn voucher ưu đãi nhé!",
            time: "Hệ thống",
            timestamp: 1000,
            actionLink: "/",
            actionText: "Khám phá thực đơn",
        });

        // 2. Thông báo mẹo đặt hàng & địa chỉ
        list.push({
            id: "system-address-tip",
            category: "SYSTEM",
            type: "SECURITY",
            title: "Mẹo giao hàng nhanh & chính xác",
            content: "Hãy kiểm tra và cập nhật địa chỉ giao hàng kèm số điện thoại liên lạc tại mục Địa chỉ để tài xế giao món đúng giờ nhất.",
            time: "Hệ thống",
            timestamp: 2000,
            actionLink: "/my-profile/address",
            actionText: "Quản lý địa chỉ",
        });

        // 3. Thông báo từ Sự kiện & Mã giảm giá của Quán
        if (restaurant.events && restaurant.events.length > 0) {
            restaurant.events.forEach((ev) => {
                const restName = ev.restaurant?.name || "Hệ thống";
                const eventTime = ev.startedAt ? new Date(ev.startedAt).getTime() : 3000;
                const formattedTime = ev.startedAt 
                    ? new Date(ev.startedAt).toLocaleString('vi-VN') 
                    : "Mới cập nhật";

                const city = ev.restaurant?.address?.city || "vietnam";
                const rName = ev.restaurant?.name || "restaurant";
                const rId = ev.restaurant?.id;
                const restLink = rId ? `/restaurant/${city}/${rName}/${rId}` : "/my-profile/events";

                let promoDetail = `Chương trình "${ev.name}" đang diễn ra tại ${ev.location || 'khu vực của quán'}.`;
                if (ev.promoCode) {
                    promoDetail = `Nhập mã "${ev.promoCode}" nhận ưu đãi độc quyền từ ${restName}. Áp dụng ngay khi đặt món trực tuyến!`;
                }

                list.push({
                    id: `event-${ev.id}`,
                    category: "PROMO",
                    type: "PROMO",
                    title: `Ưu đãi mới từ ${restName}: ${ev.name}`,
                    content: promoDetail,
                    time: formattedTime,
                    timestamp: eventTime,
                    actionLink: restLink,
                    actionText: `Đặt món tại ${restName}`,
                    promoCode: ev.promoCode
                });
            });
        }

        // 4. Thông báo từ Đơn hàng thực tế
        if (order.orders && order.orders.length > 0) {
            order.orders.forEach((orderItem) => {
                const formattedTime = new Date(orderItem.createdAt).toLocaleString('vi-VN');
                const orderTimeMs = new Date(orderItem.createdAt).getTime();
                const restName = orderItem.restaurant?.name || 'Nhà hàng';

                // Đơn hàng đã đặt
                list.push({
                    id: `placed-${orderItem.id}`,
                    category: "ORDER",
                    type: "PLACED",
                    title: `Đơn hàng #${orderItem.id} đã được đặt thành công`,
                    content: `Bạn đã đặt đơn hàng thành công tại nhà hàng "${restName}". Tổng giá trị: ${orderItem.totalPrice?.toLocaleString()} đ.`,
                    time: formattedTime,
                    timestamp: orderTimeMs,
                    actionLink: "/my-profile/orders",
                    actionText: "Xem đơn hàng",
                });

                // Đơn hàng đã thanh toán
                const isPaid = ['PAID', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(orderItem.orderStatus);
                if (isPaid) {
                    list.push({
                        id: `paid-${orderItem.id}`,
                        category: "ORDER",
                        type: "PAID",
                        title: `Thanh toán thành công đơn hàng #${orderItem.id}`,
                        content: `Đơn hàng trị giá ${orderItem.totalPrice?.toLocaleString()} đ tại nhà hàng "${restName}" đã được thanh toán an toàn qua Stripe.`,
                        time: formattedTime,
                        timestamp: orderTimeMs + 500,
                        actionLink: "/my-profile/orders",
                        actionText: "Chi tiết hóa đơn",
                    });
                }

                // Cập nhật trạng thái giao hàng
                const isUpdated = ['OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(orderItem.orderStatus);
                if (isUpdated) {
                    let statusText = '';
                    let title = `Đơn hàng #${orderItem.id} thay đổi trạng thái`;
                    if (orderItem.orderStatus === 'OUT_FOR_DELIVERY') {
                        title = `Đơn hàng #${orderItem.id} đang trên đường giao`;
                        statusText = 'Tài xế đang giao món ăn đến địa chỉ của bạn. Bạn vui lòng chú ý điện thoại nhé!';
                    } else if (orderItem.orderStatus === 'DELIVERED') {
                        title = `Đơn hàng #${orderItem.id} đã giao thành công`;
                        statusText = 'Món ăn đã được giao đến tay bạn. Chúc bạn có một bữa ăn ngon miệng!';
                    } else if (orderItem.orderStatus === 'COMPLETED') {
                        title = `Đơn hàng #${orderItem.id} đã hoàn tất`;
                        statusText = 'Đơn hàng đã được hoàn thành. Cảm ơn bạn đã tin dùng dịch vụ!';
                    }

                    list.push({
                        id: `status-${orderItem.id}`,
                        category: "ORDER",
                        type: "STATUS",
                        title: title,
                        content: `${statusText} (Nhà hàng: ${restName})`,
                        time: formattedTime,
                        timestamp: orderTimeMs + 1000,
                        actionLink: "/my-profile/orders",
                        actionText: "Theo dõi đơn",
                    });
                }
            });
        }

        // Sắp xếp giảm dần theo thời gian (mới nhất lên trên)
        list.sort((a, b) => b.timestamp - a.timestamp);
        return list;
    }, [order.orders, restaurant.events]);

    // Lọc bỏ những thông báo mà người dùng đã bấm Xóa
    const activeNotifications = useMemo(() => {
        return rawNotifications.filter(item => !deletedIds.includes(item.id));
    }, [rawNotifications, deletedIds]);

    // Đếm số lượng thông báo chưa đọc
    const unreadCount = useMemo(() => {
        return activeNotifications.filter(item => !readIds.includes(item.id)).length;
    }, [activeNotifications, readIds]);

    // Đồng bộ số lượng thông báo chưa đọc ra LocalStorage & phát event để Navbar/Sidebar cập nhật
    useEffect(() => {
        try {
            localStorage.setItem("unread_notifications_count", String(unreadCount));
            window.dispatchEvent(new Event("notifications_count_changed"));
        } catch (e) {
            console.error("Lỗi đồng bộ unread count:", e);
        }
    }, [unreadCount]);

    // Lọc danh sách theo Tab hiện tại
    const filteredNotifications = useMemo(() => {
        return activeNotifications.filter(item => {
            const isRead = readIds.includes(item.id);
            if (filterTab === "UNREAD") return !isRead;
            if (filterTab === "ORDER") return item.category === "ORDER";
            if (filterTab === "PROMO") return item.category === "PROMO";
            if (filterTab === "SYSTEM") return item.category === "SYSTEM";
            return true; // "ALL"
        });
    }, [activeNotifications, filterTab, readIds]);

    // 1. Chuyển đổi trạng thái Đã đọc / Chưa đọc của 1 thông báo
    const handleToggleRead = (id, e) => {
        if (e) e.stopPropagation();
        let updated;
        const wasRead = readIds.includes(id);
        if (wasRead) {
            updated = readIds.filter(item => item !== id);
            setSnackbar({ open: true, message: 'Đã đánh dấu là chưa đọc', severity: 'info' });
        } else {
            updated = [...readIds, id];
            setSnackbar({ open: true, message: 'Đã đánh dấu là đã đọc', severity: 'success' });
        }
        setReadIds(updated);
        localStorage.setItem("read_notifications", JSON.stringify(updated));
    };

    // 2. Đánh dấu tất cả thông báo hiện có là ĐÃ ĐỌC
    const handleMarkAllAsRead = () => {
        const allIds = activeNotifications.map(n => n.id);
        const uniqueSet = Array.from(new Set([...readIds, ...allIds]));
        setReadIds(uniqueSet);
        localStorage.setItem("read_notifications", JSON.stringify(uniqueSet));
        setSnackbar({ open: true, message: 'Đã đánh dấu tất cả thông báo là đã đọc!', severity: 'success' });
    };

    // 3. Xóa một thông báo cụ thể (cho vào deletedIds)
    const handleDeleteNotification = (id, e) => {
        if (e) e.stopPropagation();
        const updated = [...deletedIds, id];
        setDeletedIds(updated);
        localStorage.setItem("deleted_notifications", JSON.stringify(updated));
        setSnackbar({ open: true, message: 'Đã xóa thông báo', severity: 'info' });
    };

    // 4. Xóa tất cả các thông báo ĐÃ ĐỌC (giữ lại thông báo chưa đọc)
    const handleClearAllRead = () => {
        const readNotificationIds = activeNotifications
            .filter(n => readIds.includes(n.id))
            .map(n => n.id);

        if (readNotificationIds.length === 0) {
            setSnackbar({ open: true, message: 'Không có thông báo đã đọc nào để dọn dẹp', severity: 'info' });
            return;
        }

        const updated = Array.from(new Set([...deletedIds, ...readNotificationIds]));
        setDeletedIds(updated);
        localStorage.setItem("deleted_notifications", JSON.stringify(updated));
        setSnackbar({ open: true, message: `Đã dọn dẹp ${readNotificationIds.length} thông báo đã đọc!`, severity: 'success' });
    };

    // 5. Khi người dùng click vào thẻ thông báo: Đánh dấu đã đọc + điều hướng nếu có link
    const handleClickNotification = (notif) => {
        if (!readIds.includes(notif.id)) {
            const updated = [...readIds, notif.id];
            setReadIds(updated);
            localStorage.setItem("read_notifications", JSON.stringify(updated));
        }

        if (notif.actionLink) {
            navigate(notif.actionLink);
        }
    };

    // Icon hiển thị theo từng loại thông báo
    const getIcon = (type) => {
        switch (type) {
            case 'PLACED':
                return <ShoppingBagIcon sx={{ fontSize: '1.25rem' }} />;
            case 'PAID':
                return <CheckCircleIcon sx={{ fontSize: '1.25rem' }} />;
            case 'STATUS':
                return <LocalShippingIcon sx={{ fontSize: '1.25rem' }} />;
            case 'PROMO':
                return <LocalOfferIcon sx={{ fontSize: '1.25rem' }} />;
            case 'SECURITY':
                return <SecurityIcon sx={{ fontSize: '1.25rem' }} />;
            default:
                return <InfoIcon sx={{ fontSize: '1.25rem' }} />;
        }
    };

    // Style màu sắc biểu tượng
    const getIconStyle = (type) => {
        switch (type) {
            case 'PLACED':
                return 'bg-blue-500/15 border-blue-500/30 text-blue-400';
            case 'PAID':
                return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
            case 'STATUS':
                return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
            case 'PROMO':
                return 'bg-pink-500/15 border-pink-500/30 text-pink-400';
            case 'SECURITY':
                return 'bg-purple-500/15 border-purple-500/30 text-purple-400';
            default:
                return 'bg-rose-500/15 border-rose-500/30 text-rose-400';
        }
    };

    // Đếm số lượng theo category để hiện badge trên Tabs
    const counts = useMemo(() => {
        return {
            ALL: activeNotifications.length,
            UNREAD: unreadCount,
            ORDER: activeNotifications.filter(n => n.category === "ORDER").length,
            PROMO: activeNotifications.filter(n => n.category === "PROMO").length,
            SYSTEM: activeNotifications.filter(n => n.category === "SYSTEM").length,
        };
    }, [activeNotifications, unreadCount]);

    return (
        <div className="pb-14 flex flex-col items-center w-full px-3 lg:px-8">
            {/* Tiêu đề & Nút thao tác nhanh */}
            <div className="w-full max-w-4xl py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-500 shadow-sm">
                        <NotificationsActiveIcon sx={{ fontSize: '1.75rem' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-100 tracking-wide flex items-center gap-2.5">
                            THÔNG BÁO CỦA BẠN
                            {unreadCount > 0 && (
                                <span className="text-xs bg-pink-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                                    {unreadCount} mới
                                </span>
                            )}
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Cập nhật tiến trình đơn hàng, mã giảm giá độc quyền và sự kiện ẩm thực
                        </p>
                    </div>
                </div>

                {/* Các nút hành động toàn cục */}
                <div className="flex items-center gap-2">
                    <Tooltip title="Đánh dấu tất cả thông báo là đã đọc" arrow>
                        <span>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DoneAllIcon sx={{ fontSize: '1.1rem' }} />}
                                disabled={unreadCount === 0}
                                onClick={handleMarkAllAsRead}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.8rem',
                                    borderRadius: '8px',
                                    color: unreadCount > 0 ? '#ec4899' : '#6b7280',
                                    borderColor: unreadCount > 0 ? 'rgba(236, 72, 153, 0.4)' : '#374151',
                                    '&:hover': {
                                        borderColor: '#ec4899',
                                        bgcolor: 'rgba(236, 72, 153, 0.1)'
                                    }
                                }}
                            >
                                Đọc tất cả
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Dọn dẹp các thông báo đã đọc khỏi danh sách" arrow>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DeleteSweepIcon sx={{ fontSize: '1.1rem' }} />}
                            onClick={handleClearAllRead}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                borderRadius: '8px',
                                color: '#9ca3af',
                                borderColor: 'rgba(156, 163, 175, 0.3)',
                                '&:hover': {
                                    borderColor: '#ef4444',
                                    color: '#ef4444',
                                    bgcolor: 'rgba(239, 68, 68, 0.1)'
                                }
                            }}
                        >
                            Dọn tin đã đọc
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {/* Thanh Tabs phân loại thông minh */}
            <div className="w-full max-w-4xl mt-4 mb-6">
                <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                    <Tabs
                        value={filterTab}
                        onChange={(e, val) => setFilterTab(val)}
                        textColor="inherit"
                        variant="scrollable"
                        scrollButtons="auto"
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
                                    <span>Tất cả</span>
                                    <Chip label={counts.ALL} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(255,255,255,0.1)', color: '#d1d5db' }} />
                                </Box>
                            } 
                        />
                        <Tab 
                            value="UNREAD" 
                            label={
                                <Box className="flex items-center gap-1.5">
                                    <span>Chưa đọc</span>
                                    {counts.UNREAD > 0 && (
                                        <Chip label={counts.UNREAD} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#ec4899', color: 'white', fontWeight: 'bold' }} />
                                    )}
                                </Box>
                            } 
                        />
                        <Tab 
                            value="ORDER" 
                            label={
                                <Box className="flex items-center gap-1.5">
                                    <span>Đơn hàng</span>
                                    <Chip label={counts.ORDER} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd' }} />
                                </Box>
                            } 
                        />
                        <Tab 
                            value="PROMO" 
                            label={
                                <Box className="flex items-center gap-1.5">
                                    <span>Ưu đãi & Sự kiện</span>
                                    <Chip label={counts.PROMO} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }} />
                                </Box>
                            } 
                        />
                        <Tab 
                            value="SYSTEM" 
                            label={
                                <Box className="flex items-center gap-1.5">
                                    <span>Hệ thống</span>
                                    <Chip label={counts.SYSTEM} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe' }} />
                                </Box>
                            } 
                        />
                    </Tabs>
                </Box>
            </div>

            {/* Danh sách thẻ thông báo */}
            <div className="space-y-3.5 w-full max-w-4xl">
                {filteredNotifications.length === 0 ? (
                    <Card className="bg-gray-900/80 text-white border border-gray-800/80 rounded-2xl shadow-xl py-14">
                        <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
                            <div className="p-4 bg-gray-800/60 rounded-full border border-gray-700/50 text-gray-500">
                                <NotificationsNoneIcon sx={{ fontSize: '3rem' }} />
                            </div>
                            <Typography variant="h6" className="font-semibold text-gray-300">
                                {filterTab === "UNREAD" ? "Tuyệt vời! Bạn không có thông báo chưa đọc nào." : "Không có thông báo nào trong danh mục này."}
                            </Typography>
                            <Typography variant="body2" className="text-gray-500 max-w-sm">
                                {filterTab === "UNREAD" 
                                    ? "Tất cả các cập nhật đơn hàng và khuyến mãi mới đều đã được bạn xem qua."
                                    : "Mọi hoạt động đặt hàng, tiến trình giao và sự kiện ưu đãi sẽ được hiển thị tại đây."}
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNotifications.map((notif) => {
                        const isRead = readIds.includes(notif.id);

                        return (
                            <Card 
                                key={notif.id}
                                onClick={() => handleClickNotification(notif)}
                                className={`transition-all duration-200 cursor-pointer rounded-2xl group ${
                                    isRead 
                                        ? 'bg-gray-900/40 border border-gray-800/60 hover:border-gray-700 hover:bg-gray-900/60' 
                                        : 'bg-gradient-to-r from-gray-900 via-gray-900 to-gray-850 border border-pink-500/40 shadow-lg shadow-pink-500/5 hover:border-pink-500'
                                }`}
                            >
                                <CardContent className="p-5 space-y-3">
                                    {/* Header Thẻ: Icon + Tiêu đề + Thời gian + Nút thao tác */}
                                    <Box className="flex justify-between items-start gap-3">
                                        <Box className="flex items-start gap-3 flex-1">
                                            {/* Icon loại thông báo */}
                                            <div className={`${getIconStyle(notif.type)} p-2 rounded-xl border mt-0.5 flex-shrink-0`}>
                                                {getIcon(notif.type)}
                                            </div>

                                            {/* Tiêu đề & Nhãn Chưa đọc */}
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {!isRead && (
                                                        <span className="flex items-center gap-1 text-[11px] font-bold text-pink-400 bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded-full">
                                                            <CircleIcon sx={{ fontSize: '0.45rem', color: '#ec4899' }} />
                                                            MỚI
                                                        </span>
                                                    )}
                                                    <Typography 
                                                        variant="subtitle1" 
                                                        className={`font-bold leading-snug ${isRead ? 'text-gray-300' : 'text-white'}`}
                                                    >
                                                        {notif.title}
                                                    </Typography>
                                                </div>

                                                <Typography variant="caption" className="text-gray-500 font-medium block">
                                                    {notif.time}
                                                </Typography>
                                            </div>
                                        </Box>

                                        {/* Các nút icon thao tác nhanh trên thẻ */}
                                        <Box className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <Tooltip title={isRead ? "Đánh dấu là chưa đọc" : "Đánh dấu là đã đọc"} arrow>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={(e) => handleToggleRead(notif.id, e)}
                                                    sx={{ 
                                                        color: isRead ? '#9ca3af' : '#ec4899', 
                                                        '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' } 
                                                    }}
                                                >
                                                    {isRead ? <MarkChatUnreadIcon sx={{ fontSize: '1.15rem' }} /> : <MarkChatReadIcon sx={{ fontSize: '1.15rem' }} />}
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Xóa thông báo này" arrow>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={(e) => handleDeleteNotification(notif.id, e)}
                                                    sx={{ 
                                                        color: '#6b7280', 
                                                        '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' } 
                                                    }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: '1.15rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ bgcolor: isRead ? 'rgba(255,255,255,0.04)' : 'rgba(236, 72, 153, 0.15)' }} />

                                    {/* Nội dung thông báo & Nút điều hướng */}
                                    <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-0.5">
                                        <Typography className={`text-sm leading-relaxed flex-1 ${isRead ? 'text-gray-400' : 'text-gray-200'}`}>
                                            {notif.content}
                                        </Typography>

                                        {/* Nút hành động trực tiếp */}
                                        {notif.actionLink && (
                                            <Button
                                                size="small"
                                                variant={isRead ? "outlined" : "contained"}
                                                endIcon={<ArrowForwardIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClickNotification(notif);
                                                }}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontSize: '0.78rem',
                                                    fontWeight: 600,
                                                    borderRadius: '8px',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    whiteSpace: 'nowrap',
                                                    bgcolor: isRead ? 'transparent' : '#e91e63',
                                                    color: isRead ? '#ec4899' : 'white',
                                                    borderColor: 'rgba(236, 72, 153, 0.3)',
                                                    '&:hover': {
                                                        bgcolor: isRead ? 'rgba(236, 72, 153, 0.1)' : '#c2185b',
                                                        borderColor: '#ec4899'
                                                    }
                                                }}
                                            >
                                                {notif.actionText || "Xem ngay"}
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Toast phản hồi nhanh */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2500}
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
