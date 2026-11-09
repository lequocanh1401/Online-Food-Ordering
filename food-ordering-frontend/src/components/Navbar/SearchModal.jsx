import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Typography, Avatar, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/api';

const modalStyle = {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: { xs: '95%', sm: '600px', md: '700px' },
    bgcolor: '#111827',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 24,
    p: 4,
    borderRadius: '16px',
    outline: 'none',
    color: 'white',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column'
};

export const SearchModal = ({ open, handleClose }) => {
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        if (!query.trim()) {
            setRestaurants([]);
            setFoods([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            
            // 1. Tìm kiếm nhà hàng (Cần JWT vì /api/** được bảo vệ bởi Spring Security)
            try {
                const resResponse = await api.get(`/api/restaurants/search?keyword=${query}`, {
                    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
                });
                setRestaurants(resResponse.data || []);
            } catch (err) {
                console.error("Lỗi tìm kiếm nhà hàng:", err);
                setRestaurants([]);
            }

            // 2. Tìm kiếm món ăn
            try {
                const foodResponse = await api.get(`/api/food/search?name=${query}`, {
                    headers: (jwt && jwt !== "null" && jwt !== "undefined") ? { Authorization: `Bearer ${jwt}` } : {}
                });
                setFoods(foodResponse.data || []);
            } catch (err) {
                console.error("Lỗi tìm kiếm món ăn:", err);
                setFoods([]);
            }

            setLoading(false);
        }, 400); // Debounce 400ms

        return () => clearTimeout(delayDebounce);
    }, [query, jwt]);

    const handleSelectRestaurant = (res) => {
        const city = res.address?.city || "vietnam";
        const name = res.name || "restaurant";
        navigate(`/restaurant/${city}/${name}/${res.id}`);
        handleClose();
    };

    const handleSelectFood = (food) => {
        if (food.restaurant) {
            const city = food.restaurant.address?.city || "vietnam";
            const name = food.restaurant.name || "restaurant";
            navigate(`/restaurant/${city}/${name}/${food.restaurant.id}`);
            handleClose();
        }
    };

    return (
        <Modal 
            open={open} 
            onClose={handleClose}
            closeAfterTransition
            sx={{ backdropFilter: 'blur(8px)', bgcolor: 'rgba(0,0,0,0.4)' }}
        >
            <Box sx={modalStyle}>
                {/* Header */}
                <Box className="flex justify-between items-center pb-3">
                    <Typography variant="h6" className="font-bold flex items-center gap-2" sx={{ color: '#e91e63' }}>
                        <SearchIcon /> TÌM KIẾM TOÀN DIỆN
                    </Typography>
                    <IconButton onClick={handleClose} sx={{ color: 'gray', '&:hover': { color: 'white' } }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Input Search */}
                <Box className="my-3 relative">
                    <TextField
                        fullWidth
                        placeholder="Tìm tên nhà hàng hoặc món ăn ngon..."
                        variant="outlined"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                        InputProps={{
                            sx: {
                                color: 'white',
                                bgcolor: '#1f2937',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255,255,255,0.1)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#e91e63'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#e91e63'
                                }
                            }
                        }}
                    />
                </Box>

                {/* Results Section */}
                <Box className="overflow-y-auto flex-1 mt-4 space-y-6 pr-2">
                    {loading && (
                        <Box className="flex justify-center items-center py-10">
                            <CircularProgress sx={{ color: '#e91e63' }} />
                        </Box>
                    )}

                    {!loading && !query.trim() && (
                        <Typography align="center" sx={{ color: 'gray', py: 4 }}>
                            Hãy nhập từ khóa để tìm kiếm nhà hàng hoặc món ăn...
                        </Typography>
                    )}

                    {!loading && query.trim() && restaurants.length === 0 && foods.length === 0 && (
                        <Typography align="center" sx={{ color: 'gray', py: 4 }}>
                            Không tìm thấy kết quả phù hợp cho "{query}".
                        </Typography>
                    )}

                    {/* Restaurants List */}
                    {!loading && restaurants.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" className="flex items-center gap-2 text-emerald-400 font-bold mb-3">
                                <RestaurantIcon fontSize="small" /> NHÀ HÀNG ({restaurants.length})
                            </Typography>
                            <Box className="space-y-2">
                                {restaurants.map((res) => (
                                    <Box 
                                        key={res.id}
                                        onClick={() => handleSelectRestaurant(res)}
                                        className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/40 border border-gray-800/60 hover:bg-gray-800 hover:border-gray-700 cursor-pointer transition-all"
                                    >
                                        <Avatar 
                                            src={res.images?.[0]} 
                                            variant="rounded" 
                                            sx={{ width: 50, height: 50, border: '1px solid rgba(255,255,255,0.08)' }} 
                                        />
                                        <Box className="flex-1">
                                            <Typography variant="body1" className="font-bold text-gray-100">{res.name}</Typography>
                                            <Typography variant="caption" className="text-gray-400">{res.cuisineType}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Foods List */}
                    {!loading && foods.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" className="flex items-center gap-2 text-pink-400 font-bold mb-3">
                                <FastfoodIcon fontSize="small" /> MÓN ĂN ({foods.length})
                            </Typography>
                            <Box className="space-y-2">
                                {foods.map((food) => (
                                    <Box 
                                        key={food.id}
                                        onClick={() => handleSelectFood(food)}
                                        className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/40 border border-gray-800/60 hover:bg-gray-800 hover:border-gray-700 cursor-pointer transition-all"
                                    >
                                        <Avatar 
                                            src={food.images?.[0]} 
                                            variant="rounded" 
                                            sx={{ width: 50, height: 50, border: '1px solid rgba(255,255,255,0.08)' }} 
                                        />
                                        <Box className="flex-1">
                                            <Typography variant="body1" className="font-bold text-gray-100">{food.name}</Typography>
                                            <Typography variant="caption" className="text-gray-400">
                                                {food.price?.toLocaleString()} đ • Bán tại: {food.restaurant?.name || 'Nhà hàng'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};
