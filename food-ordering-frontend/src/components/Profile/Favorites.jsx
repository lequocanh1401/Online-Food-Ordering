import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Button, Chip, IconButton, InputAdornment, 
    TextField, Tooltip, Alert, Snackbar, MenuItem, Select, FormControl 
} from '@mui/material';

// Icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TuneIcon from '@mui/icons-material/Tune';

import { RestaurantCard } from '../Restaurant/RestaurantCard';
import { getAllRestaurantsAction } from '../../State/Restaurant/Action';

export const Favorites = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    const auth = useSelector(store => store.auth);
    const restaurant = useSelector(store => store.restaurant);

    const recommendationsRef = useRef(null);

    // State cho tìm kiếm, lọc và sắp xếp
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL"); // "ALL" | "OPEN" | "TOP_RATED"
    const [selectedCity, setSelectedCity] = useState("ALL");
    const [sortBy, setSortBy] = useState("DEFAULT"); // "DEFAULT" | "RATING_DESC" | "NAME_ASC"

    // Toast phản hồi
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Tự động tải danh sách toàn bộ nhà hàng nếu chưa nạp (để đồng bộ trạng thái mở cửa, đánh giá, địa chỉ và gợi ý)
    useEffect(() => {
        if (!restaurant.restaurants || restaurant.restaurants.length === 0) {
            dispatch(getAllRestaurantsAction(jwt));
        }
    }, [dispatch, jwt, restaurant.restaurants]);

    // Lắng nghe thay đổi từ auth.success khi thêm/xóa yêu thích
    useEffect(() => {
        if (auth.success) {
            setSnackbar({ open: true, message: auth.success, severity: 'success' });
        }
    }, [auth.success]);

    // Đồng bộ và làm giàu thông tin danh sách yêu thích từ store.restaurant.restaurants
    const enrichedFavorites = useMemo(() => {
        const rawFavorites = auth.favorites || auth.user?.favorites || [];
        const allRestaurants = restaurant.restaurants || [];

        return rawFavorites.map(fav => {
            const matched = allRestaurants.find(r => r.id === fav.id);
            if (matched) {
                return {
                    ...matched,
                    ...fav,
                    open: matched.open,
                    address: matched.address || fav.address,
                    averageRating: matched.averageRating,
                    totalReviews: matched.totalReviews,
                    cuisineType: matched.cuisineType,
                    openingHours: matched.openingHours,
                };
            }
            return fav;
        });
    }, [auth.favorites, auth.user?.favorites, restaurant.restaurants]);

    // Các thành phố có trong danh sách quán yêu thích
    const availableCities = useMemo(() => {
        const cities = new Set();
        enrichedFavorites.forEach(item => {
            if (item.address?.city) cities.add(item.address.city);
        });
        return Array.from(cities);
    }, [enrichedFavorites]);

    // Thống kê nhanh
    const totalCount = enrichedFavorites.length;
    const openCount = enrichedFavorites.filter(item => item.open === true).length;
    const topRatedCount = enrichedFavorites.filter(item => (item.averageRating || 0) >= 4.5).length;

    // Danh sách quán yêu thích sau khi áp dụng tìm kiếm, lọc và sắp xếp
    const filteredFavorites = useMemo(() => {
        let result = [...enrichedFavorites];

        // Lọc từ khóa tìm kiếm (tên quán, mô tả, thành phố, loại món)
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase().trim();
            result = result.filter(item => {
                const name = (item.name || item.title || '').toLowerCase();
                const desc = (item.description || '').toLowerCase();
                const city = (item.address?.city || '').toLowerCase();
                const cuisine = (item.cuisineType || '').toLowerCase();
                return name.includes(q) || desc.includes(q) || city.includes(q) || cuisine.includes(q);
            });
        }

        // Lọc theo trạng thái hoạt động / đánh giá
        if (filterStatus === "OPEN") {
            result = result.filter(item => item.open === true);
        } else if (filterStatus === "TOP_RATED") {
            result = result.filter(item => (item.averageRating || 0) >= 4.5);
        }

        // Lọc theo thành phố
        if (selectedCity !== "ALL") {
            result = result.filter(item => (item.address?.city || '').toLowerCase() === selectedCity.toLowerCase());
        }

        // Sắp xếp
        if (sortBy === "RATING_DESC") {
            result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        } else if (sortBy === "NAME_ASC") {
            result.sort((a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || ''));
        }

        return result;
    }, [enrichedFavorites, searchTerm, filterStatus, selectedCity, sortBy]);

    // Danh sách quán ăn thông minh gợi ý cho người dùng (lấy từ các quán chưa được thả tim)
    const recommendedRestaurants = useMemo(() => {
        const favIds = new Set((auth.favorites || auth.user?.favorites || []).map(f => f.id));
        const candidates = (restaurant.restaurants || []).filter(r => !favIds.has(r.id));

        // Ưu tiên quán đang mở cửa và điểm đánh giá cao
        return [...candidates].sort((a, b) => {
            if (a.open !== b.open) return a.open ? -1 : 1;
            return (b.averageRating || 0) - (a.averageRating || 0);
        }).slice(0, 6);
    }, [restaurant.restaurants, auth.favorites, auth.user?.favorites]);

    // Cuộn mượt tới phần gợi ý
    const handleScrollToRecommendations = () => {
        recommendationsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Đặt lại toàn bộ bộ lọc
    const handleResetFilters = () => {
        setSearchTerm("");
        setFilterStatus("ALL");
        setSelectedCity("ALL");
        setSortBy("DEFAULT");
    };

    return (
        <div className="pb-16 px-4 lg:px-8 flex flex-col items-center w-full min-h-screen">
            {/* Header Trang Yêu Thích */}
            <div className="w-full max-w-6xl py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800">
                <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 shadow-sm shadow-rose-500/10">
                        <FavoriteIcon sx={{ fontSize: '1.85rem' }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-2xl font-bold text-gray-100 tracking-wide">
                                NHÀ HÀNG YÊU THÍCH
                            </h1>
                            <span className="text-xs bg-rose-500/20 text-rose-400 font-bold px-3 py-0.5 rounded-full border border-rose-500/30">
                                {totalCount} quán đã lưu
                            </span>
                            {openCount > 0 && (
                                <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    {openCount} quán đang mở
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Bộ sưu tập các quán ăn ruột của bạn. Theo dõi tình trạng nhận đơn và gọi món nhanh chóng bất kỳ lúc nào.
                        </p>
                    </div>
                </div>
            </div>

            {/* THANH ĐIỀU KHIỂN & BỘ LỌC (CHỈ HIỆN KHI CÓ QUÁN HOẶC ĐANG TÌM KIẾM) */}
            {totalCount > 0 && (
                <div className="w-full max-w-6xl mt-6 p-4 bg-gray-900/70 border border-gray-800 rounded-2xl shadow-lg backdrop-blur-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                    {/* Ô Tìm Kiếm Nhanh */}
                    <div className="w-full lg:w-72">
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Tìm quán, món, địa chỉ..."
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
                                    fontSize: '0.875rem',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#374151',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#f43f5e',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#f43f5e',
                                    }
                                }
                            }}
                        />
                    </div>

                    {/* Bộ lọc Chips Trạng Thái */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <button
                            onClick={() => setFilterStatus("ALL")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                filterStatus === "ALL"
                                    ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/20'
                                    : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:text-white hover:border-gray-600'
                            }`}
                        >
                            Tất cả ({totalCount})
                        </button>

                        <button
                            onClick={() => setFilterStatus(filterStatus === "OPEN" ? "ALL" : "OPEN")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                                filterStatus === "OPEN"
                                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/20'
                                    : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:text-white hover:border-gray-600'
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Đang mở cửa ({openCount})
                        </button>

                        <button
                            onClick={() => setFilterStatus(filterStatus === "TOP_RATED" ? "ALL" : "TOP_RATED")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                                filterStatus === "TOP_RATED"
                                    ? 'bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-600/20'
                                    : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:text-white hover:border-gray-600'
                            }`}
                        >
                            <StarIcon sx={{ fontSize: '0.95rem', color: '#fef08a' }} />
                            Đánh giá cao ({topRatedCount})
                        </button>
                    </div>

                    {/* Bộ lọc Thành phố & Sắp xếp */}
                    <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
                        {availableCities.length > 1 && (
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    sx={{
                                        bgcolor: '#111827',
                                        borderRadius: '12px',
                                        color: '#d1d5db',
                                        fontSize: '0.8rem',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4b5563' },
                                        '& .MuiSvgIcon-root': { color: '#9ca3af' }
                                    }}
                                >
                                    <MenuItem value="ALL" sx={{ fontSize: '0.825rem' }}>Toàn quốc</MenuItem>
                                    {availableCities.map(city => (
                                        <MenuItem key={city} value={city} sx={{ fontSize: '0.825rem' }}>
                                            {city}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <FormControl size="small" sx={{ minWidth: 145 }}>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                sx={{
                                    bgcolor: '#111827',
                                    borderRadius: '12px',
                                    color: '#d1d5db',
                                    fontSize: '0.8rem',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4b5563' },
                                    '& .MuiSvgIcon-root': { color: '#9ca3af' }
                                }}
                            >
                                <MenuItem value="DEFAULT" sx={{ fontSize: '0.825rem' }}>Mới lưu gần đây</MenuItem>
                                <MenuItem value="RATING_DESC" sx={{ fontSize: '0.825rem' }}>⭐ Đánh giá cao nhất</MenuItem>
                                <MenuItem value="NAME_ASC" sx={{ fontSize: '0.825rem' }}>🔤 Tên quán (A - Z)</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            )}

            {/* DANH SÁCH QUÁN ĂN YÊU THÍCH */}
            <div className="w-full max-w-6xl mt-6">
                {totalCount === 0 ? (
                    /* EMPTY STATE KHI CHƯA THẢ TIM QUÁN NÀO */
                    <div className="my-8 p-10 bg-gradient-to-b from-gray-900/90 to-gray-950 border border-gray-800 rounded-3xl text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-md">
                        {/* Hiệu ứng hào quang nền */}
                        <div className="absolute -top-16 -left-16 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        {/* Icon Trái Tim Nhịp Đập */}
                        <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-tr from-rose-500/20 to-pink-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-500/10 transition-transform duration-300 hover:scale-110">
                            <FavoriteBorderIcon sx={{ fontSize: 44, color: '#f43f5e' }} />
                        </div>

                        <h2 className="text-xl font-bold text-gray-100 tracking-wide mb-2">
                            Bạn chưa có nhà hàng yêu thích nào
                        </h2>
                        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed mb-6">
                            Thả tim các quán ăn bạn tâm đắc khi khám phá thực đơn. Danh sách sẽ được lưu tại đây để bạn tiện theo dõi giờ mở cửa và đặt món nhanh chóng!
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {recommendedRestaurants.length > 0 && (
                                <Button
                                    variant="contained"
                                    onClick={handleScrollToRecommendations}
                                    startIcon={<AutoAwesomeIcon sx={{ color: '#fef08a' }} />}
                                    sx={{
                                        bgcolor: '#e11d48',
                                        '&:hover': { bgcolor: '#be123c' },
                                        fontWeight: 600,
                                        borderRadius: '12px',
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Xem các quán gợi ý bên dưới
                                </Button>
                            )}

                            <Button
                                variant="outlined"
                                onClick={() => navigate("/")}
                                sx={{
                                    color: '#d1d5db',
                                    borderColor: '#374151',
                                    '&:hover': { borderColor: '#9ca3af', color: 'white' },
                                    fontWeight: 500,
                                    borderRadius: '12px',
                                    px: 3,
                                    py: 1,
                                    textTransform: 'none',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Về trang chủ khám phá
                            </Button>
                        </div>
                    </div>
                ) : filteredFavorites.length === 0 ? (
                    /* EMPTY STATE KHI TÌM KIẾM HOẶC LỌC KHÔNG CÓ KẾT QUẢ */
                    <div className="py-16 text-center bg-gray-900/40 border border-gray-800 rounded-2xl max-w-xl mx-auto my-6 space-y-4">
                        <StorefrontIcon sx={{ fontSize: 48, color: '#6b7280' }} />
                        <div>
                            <p className="text-gray-300 font-semibold text-base">
                                Không tìm thấy quán ăn nào phù hợp với bộ lọc
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                Thử xóa từ khóa hoặc nới lỏng các tiêu chí lọc đang chọn
                            </p>
                        </div>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleResetFilters}
                            sx={{
                                color: '#f43f5e',
                                borderColor: 'rgba(244, 63, 94, 0.4)',
                                textTransform: 'none',
                                borderRadius: '10px',
                                fontSize: '0.8rem',
                                '&:hover': { borderColor: '#f43f5e', bgcolor: 'rgba(244, 63, 94, 0.08)' }
                            }}
                        >
                            Đặt lại toàn bộ bộ lọc
                        </Button>
                    </div>
                ) : (
                    /* GRID HIỂN THỊ DANH SÁCH QUÁN YÊU THÍCH */
                    <div>
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2 px-1">
                            <span>
                                Hiển thị <strong className="text-rose-400">{filteredFavorites.length}</strong> / {totalCount} quán yêu thích
                            </span>
                            {(searchTerm || filterStatus !== "ALL" || selectedCity !== "ALL" || sortBy !== "DEFAULT") && (
                                <button
                                    onClick={handleResetFilters}
                                    className="text-rose-400 hover:text-rose-300 underline font-medium"
                                >
                                    Đặt lại bộ lọc
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {filteredFavorites.map((item) => (
                                <RestaurantCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MỤC GỢI Ý THÔNG MINH: QUÁN ĂN ĐƯỢC ĐÁNH GIÁ CAO DÀNH CHO BẠN */}
            {recommendedRestaurants.length > 0 && (
                <div ref={recommendationsRef} className="w-full max-w-6xl mt-14 pt-8 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <LocalFireDepartmentIcon sx={{ color: '#f97316', fontSize: '1.5rem' }} />
                                <h2 className="text-xl font-bold text-gray-100 tracking-wide">
                                    GỢI Ý QUÁN ĂN NỔI BẬT DÀNH CHO BẠN
                                </h2>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Các quán ăn được đánh giá cao nhất và đang sẵn sàng phục vụ. Bấm vào biểu tượng ❤️ trên thẻ để lưu ngay!
                            </p>
                        </div>
                        <Button
                            variant="text"
                            onClick={() => navigate("/")}
                            endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
                            sx={{
                                color: '#f43f5e',
                                textTransform: 'none',
                                fontSize: '0.825rem',
                                fontWeight: 600,
                                '&:hover': { color: '#fb7185', bgcolor: 'transparent' }
                            }}
                        >
                            Xem thêm trên thực đơn
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedRestaurants.map((item) => (
                            <RestaurantCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            )}

            {/* Toast Snackbar phản hồi */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{ width: '100%', borderRadius: '12px', bgcolor: '#111827', color: 'white', border: '1px solid #374151' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};