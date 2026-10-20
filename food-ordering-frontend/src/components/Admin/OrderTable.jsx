import React, { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, AvatarGroup, Button, Menu, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantsOrder, updateOrderStatus } from '../../State/RestaurantOrder/Action';

const orderStatusList = [
    { label: "Đang giao hàng", value: "OUT_FOR_DELIVERY" },
    { label: "Hoàn thành", value: "COMPLETED" }
];

const getStatusLabel = (status) => {
    switch (status) {
        case "PENDING": return "Chờ xử lý";
        case "PAID": return "Đã thanh toán";
        case "OUT_FOR_DELIVERY": return "Đang giao hàng";
        case "DELIVERED": return "Đã giao hàng";
        case "COMPLETED": return "Hoàn thành";
        default: return status;
    }
};

const getStatusClass = (status) => {
    switch (status) {
        case "PENDING": return "bg-amber-600 text-white";
        case "PAID": return "bg-indigo-600 text-white";
        case "OUT_FOR_DELIVERY": return "bg-blue-600 text-white";
        case "DELIVERED": return "bg-teal-600 text-white";
        case "COMPLETED": return "bg-emerald-600 text-white";
        default: return "bg-gray-600 text-white";
    }
};

export const OrderTable = ({ filterValue }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    // Rút kho Redux
    const restaurant = useSelector(store => store.restaurant);
    const restaurantOrder = useSelector(store => store.restaurantOrder);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const open = Boolean(anchorEl);

    // Kéo đơn hàng từ Java lên khi vào trang hoặc khi đổi bộ lọc
    useEffect(() => {
        if (restaurant.usersRestaurant?.id) {
            dispatch(fetchRestaurantsOrder({
                restaurantId: restaurant.usersRestaurant.id,
                orderStatus: "",
                jwt: jwt
            }));
        }
    }, [dispatch, jwt, restaurant.usersRestaurant?.id, filterValue]);

    const filteredOrders = restaurantOrder.orders?.filter((item) => {
        if (filterValue === "ALL") return true;
        if (filterValue === "PENDING") return item.orderStatus === "PENDING" || item.orderStatus === "PAID";
        if (filterValue === "OUT_FOR_DELIVERY") return item.orderStatus === "OUT_FOR_DELIVERY";
        if (filterValue === "COMPLETED") return item.orderStatus === "COMPLETED" || item.orderStatus === "DELIVERED";
        return item.orderStatus === filterValue;
    }) || [];

    const handleUpdateStatusClick = (event, orderId) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrderId(orderId);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedOrderId(null);
    };

    const handleUpdateOrder = (orderStatus) => {
        // Bắn API cập nhật trạng thái
        if (selectedOrderId) {
            dispatch(updateOrderStatus({ orderId: selectedOrderId, orderStatus, jwt }));
        }
        handleCloseMenu();
    };

    return (
        <Box className="mt-5">
            <Card className='mt-1'>
                <CardHeader title={"Tất Cả Đơn Hàng"} sx={{ pt: 2, alignItems: "center" }} />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã ĐH</TableCell>
                                <TableCell align="right">Hình ảnh</TableCell>
                                <TableCell align="right">Khách hàng</TableCell>
                                <TableCell align="right">Giá tiền</TableCell>
                                <TableCell align="right">Món ăn</TableCell>
                                <TableCell align="right">Trạng thái</TableCell>
                                <TableCell align="right">Cập nhật</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((item) => (
                                    <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">#{item.id}</TableCell>
                                        <TableCell align="right">
                                            <AvatarGroup max={4} sx={{ justifyContent: 'flex-end' }}>
                                                {item.items?.map((orderItem) => (
                                                    <Avatar key={orderItem.id} src={orderItem.food?.images?.[0]} />
                                                ))}
                                            </AvatarGroup>
                                        </TableCell>
                                        <TableCell align="right">{item.customer?.fullName || "Khách lẻ"}</TableCell>
                                        <TableCell align="right">{item.totalPrice?.toLocaleString()}đ</TableCell>
                                        <TableCell align="right">
                                            {item.items?.map((orderItem) => (
                                                <p key={orderItem.id}>
                                                    {orderItem.food?.name}
                                                    {orderItem.quantity > 1 && ` (x${orderItem.quantity})`}
                                                </p>
                                            ))}
                                        </TableCell>
                                        <TableCell align="right">
                                            <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusClass(item.orderStatus)}`}>
                                                {getStatusLabel(item.orderStatus)}
                                            </span>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button 
                                                variant="text" 
                                                size="small" 
                                                onClick={(e) => handleUpdateStatusClick(e, item.id)}
                                                sx={{ color: '#ec4899', fontWeight: 'bold' }}
                                            >
                                                CẬP NHẬT
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'gray' }}>
                                        Không có đơn hàng nào ở trạng thái này
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                >
                    {orderStatusList.map((status) => (
                        <MenuItem key={status.value} onClick={() => handleUpdateOrder(status.value)}>
                            {status.label}
                        </MenuItem>
                    ))}
                </Menu>
            </Card>
        </Box>
    );
};