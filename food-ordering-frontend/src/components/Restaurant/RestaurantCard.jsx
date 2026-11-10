import React from 'react';
import { Card, CardContent, IconButton, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites } from '../../State/Authentication/Action';

export const RestaurantCard = ({ item }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    // Lấy thông tin xác thực từ store
    const auth = useSelector(store => store.auth);
    const isFavorite = auth.favorites?.some(fav => fav.id === item.id);

    const name = item.name || item.title || "Nhà hàng";
    const city = item.address?.city || "vietnam";
    const isOpen = item.open !== undefined ? item.open : true;

    const handleNavigateToRestaurant = () => {
        navigate(`/restaurant/${city}/${name}/${item.id}`);
    };

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        if (jwt) {
            dispatch(addToFavorites({ jwt, restaurantId: item.id }));
        }
    };

    return (
        <Card className='w-full bg-gray-900 text-white rounded-xl overflow-hidden shadow-xl border border-gray-800 hover:border-pink-500/40 transition-all duration-300 relative group flex flex-col justify-between'>
            <div
                className='cursor-pointer relative h-[12rem] overflow-hidden'
                onClick={handleNavigateToRestaurant}
            >
                <img
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${!isOpen ? 'grayscale-[50%] opacity-85' : ''}`}
                    src={item.images?.[0] || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"}
                    alt={name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";
                    }}
                />
                <div className='absolute top-2 left-2'>
                    {item.open !== undefined ? (
                        <Chip
                            size="small"
                            className='font-semibold'
                            color={item.open ? "success" : "error"}
                            label={item.open ? "Đang nhận đơn" : "Tạm ngưng nhận đơn"}
                        />
                    ) : (
                        <Chip
                            size="small"
                            className='font-semibold'
                            color="primary"
                            label="Yêu thích"
                        />
                    )}
                </div>
            </div>

            <CardContent className='p-4'>
                <div className='flex justify-between items-start gap-2'>
                    <div className='space-y-1 cursor-pointer min-w-0 flex-1' onClick={handleNavigateToRestaurant}>
                        <h1 className='font-semibold text-lg text-gray-100 truncate'>{name}</h1>
                        <p className='text-gray-400 text-sm truncate'>{item.description || "Món ăn thơm ngon, chuẩn vị sạch sẽ!"}</p>
                        <div className="flex items-center gap-1 text-xs text-yellow-500 font-semibold mt-1">
                            <span>⭐ {item.totalReviews > 0 ? `${item.averageRating} (${item.totalReviews} đánh giá)` : "Chưa có đánh giá"}</span>
                        </div>
                    </div>
                    <div className='shrink-0'>
                        <IconButton onClick={handleToggleFavorite}>
                            {isFavorite ? (
                                <FavoriteIcon className='text-red-500' />
                            ) : (
                                <FavoriteBorderIcon className='text-red-500' />
                            )}
                        </IconButton>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};