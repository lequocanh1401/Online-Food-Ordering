import React, { useState, useEffect } from 'react';
import { CircularProgress, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../config/api';

export const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const jwt = localStorage.getItem("jwt");

    const [query, setQuery] = useState(searchParams.get("query") || "");
    const [loading, setLoading] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        const q = searchParams.get("query");
        if (q !== null) {
            setQuery(q);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!query.trim()) {
            setRestaurants([]);
            setFoods([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            
            // 1. Tìm kiếm nhà hàng
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
    };

    const handleSelectFood = (food) => {
        if (food.restaurant) {
            const city = food.restaurant.address?.city || "vietnam";
            const name = food.restaurant.name || "restaurant";
            navigate(`/restaurant/${city}/${name}/${food.restaurant.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Header / Search Bar */}
            <div className="sticky top-14 bg-black/80 backdrop-blur-md z-30 border-b border-gray-900 py-6 px-5 lg:px-20">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-4">
                    <button 
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors font-semibold self-start md:self-auto py-2"
                    >
                        <ArrowBackIcon /> Quay lại
                    </button>

                    {/* Full width Search Box */}
                    <div className="flex-1 bg-gray-900 border border-gray-800 focus-within:border-pink-500/80 rounded-2xl flex items-center px-4 py-2 shadow-2xl transition-all duration-300">
                        <SearchIcon className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tên nhà hàng hoặc món ăn ngon..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                            className="bg-transparent text-white placeholder-gray-500 border-none outline-none w-full py-2 text-lg"
                        />
                        {query && (
                            <button 
                                onClick={() => setQuery("")}
                                className="text-gray-500 hover:text-white p-1"
                            >
                                <CloseIcon />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-4xl mx-auto px-5 mt-10">
                {loading && (
                    <div className="flex flex-col justify-center items-center py-20 space-y-4">
                        <CircularProgress sx={{ color: '#e91e63' }} />
                        <span className="text-gray-500 text-sm">Đang tìm kiếm thông tin...</span>
                    </div>
                )}

                {!loading && !query.trim() && (
                    <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center text-gray-600 mb-2">
                            <SearchIcon sx={{ fontSize: 40 }} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-400">Tìm kiếm trên toàn hệ thống</h3>
                        <p className="text-gray-500 text-sm max-w-sm">Nhập tên món ăn như "Phở", "Pizza", "Gà rán", hoặc tên nhà hàng để tìm kiếm ngay lập tức.</p>
                    </div>
                )}

                {!loading && query.trim() && restaurants.length === 0 && foods.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                        <p className="text-gray-400 text-lg">Không tìm thấy kết quả phù hợp cho "{query}"</p>
                        <p className="text-gray-500 text-xs">Vui lòng kiểm tra lại chính tả hoặc thử một từ khóa khác.</p>
                    </div>
                )}

                {/* Grid Layout for Columns */}
                {!loading && (restaurants.length > 0 || foods.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Restaurant Column */}
                        {restaurants.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-sm font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2 border-b border-gray-900 pb-3">
                                    <RestaurantIcon fontSize="small" /> Nhà hàng ({restaurants.length})
                                </h2>
                                <div className="space-y-3">
                                    {restaurants.map((res) => (
                                        <div
                                            key={res.id}
                                            onClick={() => handleSelectRestaurant(res)}
                                            className="flex items-center gap-4 p-3 rounded-2xl bg-gray-950 border border-gray-900 hover:border-gray-800 hover:bg-gray-900/40 cursor-pointer transition-all duration-300 group shadow-md"
                                        >
                                            <Avatar
                                                src={res.images?.[0]}
                                                variant="rounded"
                                                sx={{ width: 60, height: 60, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                                                className="group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-200 group-hover:text-pink-500 transition-colors truncate">{res.name}</h4>
                                                <p className="text-xs text-gray-400 truncate mt-0.5">{res.cuisineType}</p>
                                                <p className="text-[10px] text-gray-500 truncate mt-1">📍 {res.address?.city || 'Việt Nam'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Foods Column */}
                        {foods.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-sm font-bold tracking-wider text-pink-400 uppercase flex items-center gap-2 border-b border-gray-900 pb-3">
                                    <FastfoodIcon fontSize="small" /> Món ăn ({foods.length})
                                </h2>
                                <div className="space-y-3">
                                    {foods.map((food) => (
                                        <div
                                            key={food.id}
                                            onClick={() => handleSelectFood(food)}
                                            className="flex items-center gap-4 p-3 rounded-2xl bg-gray-950 border border-gray-900 hover:border-gray-800 hover:bg-gray-900/40 cursor-pointer transition-all duration-300 group shadow-md"
                                        >
                                            <Avatar
                                                src={food.images?.[0]}
                                                variant="rounded"
                                                sx={{ width: 60, height: 60, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                                                className="group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-200 group-hover:text-pink-500 transition-colors truncate">{food.name}</h4>
                                                <p className="text-xs text-pink-500 font-semibold mt-0.5">{food.price?.toLocaleString()} đ</p>
                                                <p className="text-[10px] text-gray-500 truncate mt-1">🏠 Bán tại: {food.restaurant?.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
