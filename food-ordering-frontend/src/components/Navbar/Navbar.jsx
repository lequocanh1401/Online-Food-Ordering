import React, { useState, useEffect } from 'react';
import { Avatar, Badge, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { findUserCart } from '../../State/Cart/Action';

export const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    // Kéo thông tin người dùng và giỏ hàng từ Redux để hiển thị số lượng món ăn
    const auth = useSelector(store => store.auth);
    const cart = useSelector(store => store.cart);

    // Tự động kéo giỏ hàng khi người dùng đã đăng nhập thành công
    useEffect(() => {
        if (jwt && auth.user) {
            dispatch(findUserCart(jwt));
        }
    }, [dispatch, jwt, auth.user]);

    // Tính tổng số lượng tất cả món ăn trong giỏ
    const getCartItemsCount = () => {
        const items = cart.cart?.item || cart.cart?.items || cart.cartItems || [];
        return items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    };

    const handleAvatarClick = () => {
        if (auth.user?.role === "ROLE_CUSTOMER") {
            navigate("/my-profile");
        } else if (auth.user?.role === "ROLE_RESTAURANT_OWNER") {
            navigate("/admin/restaurant");
        }
    };

    return (
        <Box className='px-5 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between sticky top-0'>
            {/* Logo Góc Trái */}
            <div className='lg:mr-10 cursor-pointer flex items-center space-x-4'>
                <li onClick={() => navigate("/")} className='logo font-semibold text-white text-2xl list-none'>
                    Online Food Ordering
                </li>
            </div>

            {/* Các Nút Chức Năng Góc Phải */}
            <div className='flex items-center space-x-2 lg:space-x-10'>
                <div className=''>
                    <IconButton onClick={() => navigate("/search")}>
                        <SearchIcon sx={{ fontSize: "1.5rem", color: "white" }} />
                    </IconButton>
                </div>

                <div className=''>
                    {auth.user ? (
                        <Avatar 
                            onClick={handleAvatarClick} 
                            src={auth.user?.avatar}
                            sx={{ bgcolor: "white", color: "#e91e63", cursor: "pointer" }}
                        >
                            {/* Lấy chữ cái đầu tiên của tên nếu chưa có Avatar */}
                            {auth.user?.fullName?.[0]?.toUpperCase()}
                        </Avatar>
                    ) : (
                        <IconButton onClick={() => navigate("/account/login")}>
                            <Avatar sx={{ bgcolor: "white", color: "#e91e63" }} />
                        </IconButton>
                    )}
                </div>

                <div className=''>
                    <IconButton onClick={() => navigate("/cart")}>
                        {/* Huy hiệu hiện tổng số lượng món trong giỏ */}
                        <Badge color="primary" badgeContent={getCartItemsCount()} max={99}>
                            <ShoppingCartIcon sx={{ fontSize: "1.5rem", color: "white" }} />
                        </Badge>
                    </IconButton>
                </div>
            </div>

        </Box>
    );
};