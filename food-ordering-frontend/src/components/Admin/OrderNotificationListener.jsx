import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { playOrderChime } from '../../util/soundAlert';
import { fetchRestaurantsOrder } from '../../State/RestaurantOrder/Action';
import { getIngredientsOfRestaurant, fetchInventoryLogsAction } from '../../State/Ingredients/Action';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';

export const OrderNotificationListener = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");
    const restaurant = useSelector(store => store.restaurant);
    const restaurantId = restaurant.usersRestaurant?.id;

    const [alert, setAlert] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const wsRef = useRef(null);
    const alertTimeoutRef = useRef(null);

    useEffect(() => {
        if (!restaurantId) return;

        let socket = null;
        let pingInterval = null;
        let reconnectTimeout = null;
        let isUnmounted = false;

        const connect = () => {
            try {
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                // Backend runs on port 5454
                const wsUrl = `${protocol}//${window.location.hostname}:5454/ws/orders`;
                
                socket = new WebSocket(wsUrl);
                wsRef.current = socket;

                socket.onopen = () => {
                    if (isUnmounted) return;
                    setIsConnected(true);
                    console.log("[WebSocket] Kết nối thành công tới máy chủ Real-time Order!");

                    // Đăng ký nhận sự kiện cho nhà hàng này
                    socket.send(JSON.stringify({
                        type: "SUBSCRIBE_RESTAURANT",
                        restaurantId: restaurantId
                    }));

                    // Ping định kỳ 25s duy trì kết nối
                    pingInterval = setInterval(() => {
                        if (socket.readyState === WebSocket.OPEN) {
                            socket.send(JSON.stringify({ type: "PING" }));
                        }
                    }, 25000);
                };

                socket.onmessage = (event) => {
                    if (isUnmounted) return;
                    try {
                        const data = JSON.parse(event.data);
                        console.log("[WebSocket] Nhận bản tin real-time:", data);

                        if (data.type === "NEW_ORDER") {
                            // Phát chuông báo âm thanh nếu bật
                            if (soundEnabled) {
                                playOrderChime();
                            }

                            // Hiển thị toast thông báo nổi
                            setAlert(data);

                            // Tự động đóng toast sau 15 giây
                            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
                            alertTimeoutRef.current = setTimeout(() => {
                                setAlert(null);
                            }, 15000);

                            // Tự động làm mới danh sách đơn hàng Redux
                            dispatch(fetchRestaurantsOrder({ restaurantId, jwt }));

                            // Tự động cập nhật lại kho & sổ kiểm toán nguyên liệu
                            dispatch(getIngredientsOfRestaurant({ id: restaurantId, jwt }));
                            dispatch(fetchInventoryLogsAction({ restaurantId, jwt }));
                        } else if (data.type === "ORDER_CANCELLED") {
                            setAlert({
                                type: "ORDER_CANCELLED",
                                orderId: data.orderId,
                                message: `Đơn hàng #${data.orderId} đã bị hủy bởi khách hàng.`
                            });

                            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
                            alertTimeoutRef.current = setTimeout(() => {
                                setAlert(null);
                            }, 8000);

                            dispatch(fetchRestaurantsOrder({ restaurantId, jwt }));
                            dispatch(getIngredientsOfRestaurant({ id: restaurantId, jwt }));
                            dispatch(fetchInventoryLogsAction({ restaurantId, jwt }));
                        } else if (data.type === "ORDER_STATUS_CHANGED") {
                            dispatch(fetchRestaurantsOrder({ restaurantId, jwt }));
                        }
                    } catch (err) {
                        console.warn("[WebSocket] Lỗi giải mã JSON:", err);
                    }
                };

                socket.onclose = () => {
                    if (isUnmounted) return;
                    setIsConnected(false);
                    clearInterval(pingInterval);
                    console.log("[WebSocket] Mất kết nối. Đang tự động kết nối lại sau 3 giây...");
                    reconnectTimeout = setTimeout(connect, 3000);
                };

                socket.onerror = (err) => {
                    console.warn("[WebSocket] Lỗi kết nối:", err);
                    socket.close();
                };
            } catch (err) {
                console.error("[WebSocket] Exception:", err);
                reconnectTimeout = setTimeout(connect, 4000);
            }
        };

        connect();

        return () => {
            isUnmounted = true;
            clearInterval(pingInterval);
            clearTimeout(reconnectTimeout);
            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
            if (socket) socket.close();
        };
    }, [restaurantId, jwt, dispatch, soundEnabled]);

    const handleViewOrder = () => {
        setAlert(null);
        navigate("/admin/restaurant/orders");
    };

    return (
        <>
            {/* Thanh trạng thái Real-time WebSocket nhỏ gọn ở góc dưới */}
            <div className="fixed bottom-3 right-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs text-gray-300 shadow-lg">
                {isConnected ? (
                    <>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <WifiIcon sx={{ fontSize: 14 }} className="text-emerald-400" />
                        <span className="font-medium text-emerald-400">Real-time Connected</span>
                    </>
                ) : (
                    <>
                        <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                        <WifiOffIcon sx={{ fontSize: 14 }} className="text-rose-400" />
                        <span className="font-medium text-rose-400">Reconnecting...</span>
                    </>
                )}
                <span className="text-gray-500">|</span>
                <button
                    onClick={() => {
                        setSoundEnabled(!soundEnabled);
                        if (!soundEnabled) playOrderChime();
                    }}
                    title={soundEnabled ? "Tắt âm thanh chuông báo" : "Bật âm thanh chuông báo"}
                    className={`hover:text-white transition-colors ${soundEnabled ? 'text-amber-400' : 'text-gray-500 line-through'}`}
                >
                    <VolumeUpIcon sx={{ fontSize: 16 }} />
                </button>
                <span className="text-gray-500">|</span>
                <button
                    id="btn-test-order-alert"
                    onClick={() => {
                        playOrderChime();
                        setAlert({
                            type: "NEW_ORDER",
                            orderId: 1506,
                            customerName: "Nguyễn Văn Minh (Hội Đồng Bảo Vệ)",
                            totalAmount: 180000,
                            itemsSummary: ["2x Phở Bò Tái", "1x Quẩy Nóng", "1x Trà Đá"]
                        });
                        if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
                        alertTimeoutRef.current = setTimeout(() => { setAlert(null); }, 15000);
                    }}
                    title="Mô phỏng chuông & popup đơn hàng mới để thuyết trình đồ án"
                    className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium text-[11px] transition-all hover:scale-105 border border-amber-500/30"
                >
                    🔔 Demo Alert
                </button>
            </div>

            {/* Floating Glassmorphic Notification Toast khi có đơn hàng mới */}
            {alert && (
                <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-bounce-short">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-amber-500/70 p-5 shadow-2xl shadow-amber-500/20 text-white">
                        
                        {/* Thanh tiến trình tự động biến mất */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 animate-pulse" />

                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center animate-pulse">
                                    <NotificationsActiveIcon sx={{ fontSize: 28 }} />
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                                        {alert.type === "NEW_ORDER" ? "Có đơn hàng mới!" : "Thông báo đơn hàng"}
                                    </span>
                                    <h4 className="text-lg font-bold text-white mt-1">
                                        Đơn #{alert.orderId}
                                    </h4>
                                </div>
                            </div>
                            <button
                                onClick={() => setAlert(null)}
                                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <CloseIcon sx={{ fontSize: 20 }} />
                            </button>
                        </div>

                        {alert.type === "NEW_ORDER" ? (
                            <div className="mt-3 space-y-2 text-sm text-gray-300">
                                <div className="flex justify-between items-center py-1 border-b border-white/10">
                                    <span className="text-gray-400">Khách hàng:</span>
                                    <span className="font-semibold text-white">{alert.customerName || "Khách hàng"}</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-white/10">
                                    <span className="text-gray-400">Tổng thanh toán:</span>
                                    <span className="font-bold text-emerald-400 text-base">
                                        {new Intl.NumberFormat('vi-VN').format(alert.totalAmount || 0)} đ
                                    </span>
                                </div>
                                {alert.itemsSummary && alert.itemsSummary.length > 0 && (
                                    <div className="py-1">
                                        <span className="text-gray-400 text-xs block mb-1">Món ăn:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {alert.itemsSummary.map((item, idx) => (
                                                <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-gray-200">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="pt-2 flex justify-end">
                                    <button
                                        onClick={handleViewOrder}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
                                    >
                                        <span>Xem đơn hàng ngay</span>
                                        <ArrowForwardIcon sx={{ fontSize: 16 }} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 text-sm text-gray-300">
                                <p>{alert.message}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
