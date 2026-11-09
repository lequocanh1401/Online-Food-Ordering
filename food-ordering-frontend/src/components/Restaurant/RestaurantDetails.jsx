import React, { useEffect, useState, useMemo } from 'react';
import { 
    Divider, Typography, Card, Avatar, Chip, Button, 
    IconButton, Dialog, DialogActions, DialogContent, 
    DialogContentText, DialogTitle 
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CollectionsIcon from '@mui/icons-material/Collections';
import { MenuCard } from './MenuCard';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantById, getRestaurantsCategory } from '../../State/Restaurant/Action';
import { getMenuItemsByRestaurantId } from '../../State/Menu/Action';
import { getRestaurantReviews, deleteReview } from '../../State/Review/Action';
import { ReviewModal } from './ReviewModal';

export const RestaurantDetails = () => {
    // State bộ lọc danh mục do chính nhà hàng thêm vào
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // State Review và Modal
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [selectedReviewToEdit, setSelectedReviewToEdit] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [reviewIdToDelete, setReviewIdToDelete] = useState(null);
    const [reviewFilter, setReviewFilter] = useState("ALL"); // ALL, RESTAURANT, FOOD
    const [activeRestImgIdx, setActiveRestImgIdx] = useState(0);

    // Rút id nhà hàng từ thanh URL (VD: /restaurant/hanoi/zosh/1)
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const highlightFoodId = searchParams.get("foodId");
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    const auth = useSelector(store => store.auth);
    const restaurant = useSelector(store => store.restaurant);
    const menu = useSelector(store => store.menu);
    const review = useSelector(store => store.review);

    const handleEditReviewClick = (rev) => {
        setSelectedReviewToEdit(rev);
        setOpenReviewModal(true);
    };

    const handleDeleteReviewClick = (reviewId) => {
        setReviewIdToDelete(reviewId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDeleteReview = async () => {
        if (reviewIdToDelete) {
            try {
                await dispatch(deleteReview({ reviewId: reviewIdToDelete, jwt }));
                dispatch(getRestaurantReviews({ restaurantId: id }));
                dispatch(getRestaurantById({ jwt, restaurantId: id }));
            } catch (err) {
                console.error("Lỗi khi xóa đánh giá:", err);
            }
        }
        setDeleteConfirmOpen(false);
        setReviewIdToDelete(null);
    };

    const handleCancelDeleteReview = () => {
        setDeleteConfirmOpen(false);
        setReviewIdToDelete(null);
    };

    const handleCloseReviewModal = () => {
        setOpenReviewModal(false);
        setSelectedReviewToEdit(null);
    };

    // Kéo thông tin chi tiết quán + danh mục món ăn do quán thêm + đánh giá
    useEffect(() => {
        if (id) {
            if (!highlightFoodId) {
                window.scrollTo(0, 0);
            }
            dispatch(getRestaurantById({ jwt, restaurantId: id }));
            dispatch(getRestaurantsCategory({ jwt, restaurantId: id }));
            dispatch(getRestaurantReviews({ restaurantId: id }));
        }
    }, [dispatch, jwt, id, highlightFoodId]);

    // Kéo danh sách món ăn từ server theo danh mục quán chọn
    useEffect(() => {
        if (id) {
            dispatch(getMenuItemsByRestaurantId({
                jwt,
                restaurantId: id,
                vegetarian: false,
                nonveg: false,
                seasonal: false,
                foodCategory: selectedCategory === "all" ? "" : selectedCategory
            }));
        }
    }, [dispatch, jwt, id, selectedCategory]);

    // Tự động cuộn đến món ăn và làm nổi bật khi điều hướng từ trang chủ
    useEffect(() => {
        if (highlightFoodId && menu.menuItems?.length) {
            const timer = setTimeout(() => {
                const element = document.getElementById(`menu-item-${highlightFoodId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [highlightFoodId, menu.menuItems]);

    // Lọc tức thì theo từ khóa tìm kiếm món ăn tại quán
    const filteredMenuItems = useMemo(() => {
        let items = menu.menuItems || [];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            items = items.filter(item => 
                item.name?.toLowerCase().includes(q) ||
                item.description?.toLowerCase().includes(q) ||
                item.foodCategory?.name?.toLowerCase().includes(q)
            );
        }
        return items;
    }, [menu.menuItems, searchQuery]);

    const isRestaurantOpen = restaurant.restaurant?.open !== false;

    const restImages = useMemo(() => {
        if (restaurant.restaurant?.images && restaurant.restaurant.images.length > 0) {
            return restaurant.restaurant.images;
        }
        return ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"];
    }, [restaurant.restaurant?.images]);

    return (
        <div className='px-4 sm:px-6 lg:px-20 text-white min-h-screen pb-24'>
            {/* Breadcrumb điều hướng */}
            <nav className='flex items-center gap-2 text-xs sm:text-sm text-gray-400 py-4'>
                <Link to="/" className="hover:text-pink-400 transition-colors">Trang chủ</Link>
                <ArrowForwardIosIcon sx={{ fontSize: 10, color: '#6b7280' }} />
                <span>{restaurant.restaurant?.address?.city || "Việt Nam"}</span>
                <ArrowForwardIosIcon sx={{ fontSize: 10, color: '#6b7280' }} />
                <span className="text-gray-200 font-medium truncate max-w-[200px] sm:max-w-xs">
                    {restaurant.restaurant?.name || "Chi tiết quán"}
                </span>
            </nav>

            {/* HERO SECTION: BANNER & THÔNG TIN QUÁN CHUẨN GRABFOOD / SHOPEEFOOD */}
            <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 shadow-2xl mb-8">
                {/* Ảnh bìa & Album ảnh nhà hàng */}
                <div className="relative w-full h-[240px] sm:h-[320px] lg:h-[400px] overflow-hidden group/restbanner">
                    <img
                        className='w-full h-full object-cover transform hover:scale-105 transition-all duration-700'
                        src={restImages[activeRestImgIdx] || restImages[0]}
                        alt={restaurant.restaurant?.name || "Restaurant"}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />

                    {/* Mũi tên chuyển ảnh album nhà hàng nếu có > 1 ảnh */}
                    {restImages.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => setActiveRestImgIdx(prev => (prev === 0 ? restImages.length - 1 : prev - 1))}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg z-10"
                                title="Ảnh trước"
                            >
                                <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveRestImgIdx(prev => (prev === restImages.length - 1 ? 0 : prev + 1))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg z-10"
                                title="Ảnh tiếp theo"
                            >
                                <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                            </button>

                            {/* Badge Album ảnh ở góc */}
                            <div className="absolute top-4 left-4 z-10 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-lg">
                                <CollectionsIcon sx={{ fontSize: 16, color: '#ec4899' }} />
                                <span>Album quán: {activeRestImgIdx + 1} / {restImages.length}</span>
                            </div>

                            {/* Dải chấm tròn chuyển ảnh */}
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                {restImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveRestImgIdx(idx)}
                                        className={`h-2 rounded-full transition-all ${
                                            activeRestImgIdx === idx ? 'w-6 bg-pink-500' : 'w-2 bg-white/50 hover:bg-white'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Trạng thái mở cửa / nhận đơn */}
                    <div className="absolute top-4 right-4 z-10">
                        {isRestaurantOpen ? (
                            <div className="flex items-center gap-2 bg-emerald-950/85 text-emerald-400 px-3.5 py-1.5 rounded-full border border-emerald-500/40 backdrop-blur-md text-xs sm:text-sm font-semibold shadow-lg">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Đang mở cửa nhận đơn
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-rose-950/85 text-rose-300 px-3.5 py-1.5 rounded-full border border-rose-500/40 backdrop-blur-md text-xs sm:text-sm font-semibold shadow-lg">
                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                                Tạm ngưng nhận đơn
                            </div>
                        )}
                    </div>
                </div>

                {/* Khối thông tin quán */}
                <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 backdrop-blur-md bg-gray-950/80 rounded-b-3xl border-t border-gray-800/80">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2'>
                                    {restaurant.restaurant?.name}
                                    <VerifiedIcon sx={{ color: '#ec4899', fontSize: 24 }} titleAccess="Quán đối tác chính thức" />
                                </h1>
                            </div>
                            <p className='text-gray-400 text-sm sm:text-base max-w-3xl line-clamp-2 leading-relaxed'>
                                {restaurant.restaurant?.description || "Chào mừng bạn đến với nhà hàng! Hãy chọn món ăn yêu thích để thưởng thức trọn vẹn hương vị tuyệt vời."}
                            </p>
                        </div>

                        {/* Điểm đánh giá ⭐ */}
                        <div 
                            onClick={() => {
                                const el = document.getElementById("restaurant-reviews-section");
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-3 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 hover:from-amber-500/20 hover:to-yellow-500/15 border border-amber-500/30 px-4 py-2.5 rounded-2xl cursor-pointer transition-all self-start md:self-auto shrink-0"
                            title="Xem đánh giá từ khách hàng"
                        >
                            <span className="text-2xl">⭐</span>
                            <div>
                                <div className="text-lg font-black text-amber-400 leading-none">
                                    {review.totalReviews > 0 ? review.averageRating : "5.0"}
                                    <span className="text-xs text-gray-400 font-normal ml-1">/ 5</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                    {review.totalReviews > 0 ? `${review.totalReviews} lượt đánh giá` : "Mới tham gia"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Địa chỉ & Giờ mở cửa */}
                    <div className='flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-gray-400 mt-5 pt-4 border-t border-gray-800/80'>
                        <span className='flex items-center gap-2 text-gray-300'>
                            <LocationOnIcon sx={{ fontSize: 18, color: '#ec4899' }} /> 
                            <span>{restaurant.restaurant?.address?.streetAddress}, {restaurant.restaurant?.address?.city}</span>
                        </span>
                        <span className='flex items-center gap-2 text-gray-300'>
                            <AccessTimeIcon sx={{ fontSize: 18, color: '#ec4899' }} /> 
                            <span>{restaurant.restaurant?.openingHours || "08:00 - 22:00 hàng ngày"}</span>
                        </span>
                        {restaurant.restaurant?.cuisineType && (
                            <span className='bg-gray-800/80 text-pink-300 px-2.5 py-0.5 rounded-md border border-gray-700/60 font-medium'>
                                {restaurant.restaurant?.cuisineType}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Banner cảnh báo khi quán tạm ngưng nhận đơn */}
            {!isRestaurantOpen && (
                <div className='mb-8 p-4 sm:p-5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 flex items-start sm:items-center gap-3.5 shadow-lg'>
                    <span className='text-3xl shrink-0'>⚠️</span>
                    <div className="flex-1">
                        <p className='font-bold text-rose-300 text-base'>Quán hiện đang tạm ngưng nhận đơn online</p>
                        <p className='text-sm text-rose-200/80 mt-0.5'>
                            Bạn vẫn có thể xem thực đơn và đánh giá. Quán sẽ sớm mở lại để phục vụ quý khách!
                        </p>
                    </div>
                </div>
            )}

            {/* THANH BỘ LỌC DANH MỤC THỰC TẾ DO QUÁN THÊM VÀO (STICKY CATEGORY PILLS & SEARCH) */}
            <div className="sticky top-16 z-20 bg-gray-950/95 backdrop-blur-md py-3.5 border-y border-gray-800/80 -mx-4 sm:-mx-6 lg:-mx-20 px-4 sm:px-6 lg:px-20 mb-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
                    {/* Hàng Category Pills cuộn ngang: Tất cả + Các danh mục thực tế do quán tự tạo */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 flex-1 min-w-0">
                        {/* Nút Tất cả món */}
                        <button
                            type="button"
                            onClick={() => setSelectedCategory("all")}
                            className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                                selectedCategory === "all"
                                    ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30 ring-1 ring-pink-500/50"
                                    : "bg-gray-900/90 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                            }`}
                        >
                            <RestaurantMenuIcon sx={{ fontSize: 16 }} />
                            Tất cả món
                        </button>

                        {/* Các danh mục thực tế do quán thêm vào trong Quản trị nhà hàng */}
                        {restaurant.categories?.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                                    selectedCategory === cat.name
                                        ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30 ring-1 ring-pink-500/50"
                                        : "bg-gray-900/90 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Ô tìm kiếm món ăn tức thì trong quán */}
                    <div className="relative min-w-[240px] sm:w-72 shrink-0">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm món trong quán..."
                            className="w-full bg-gray-900/90 border border-gray-800 focus:border-pink-500 rounded-xl px-9 py-2 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all"
                        />
                        <SearchIcon 
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" 
                            sx={{ fontSize: 18 }} 
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <CloseIcon sx={{ fontSize: 16 }} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* DANH SÁCH THỰC ĐƠN PHÂN THEO DANH MỤC THỰC TẾ (SHOPEEFOOD / GRABFOOD STYLE) */}
            <section className="mb-16">
                {/* Khi tìm kiếm: hiển thị danh sách kết quả */}
                {searchQuery ? (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl sm:text-2xl font-black text-pink-400 tracking-tight">
                                Kết quả tìm kiếm cho "{searchQuery}" ({filteredMenuItems.length} món)
                            </h2>
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="text-xs text-pink-400 hover:underline flex items-center gap-1"
                            >
                                ✕ Xóa tìm kiếm
                            </button>
                        </div>
                        {filteredMenuItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                                {filteredMenuItems.map((item) => (
                                    <MenuCard 
                                        key={item.id} 
                                        item={item} 
                                        restaurantId={id} 
                                        isRestaurantOpen={isRestaurantOpen}
                                        isHighlighted={Boolean(highlightFoodId && String(item.id) === String(highlightFoodId))}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-4 bg-gray-900/40 rounded-3xl border border-dashed border-gray-800">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/60 flex items-center justify-center text-3xl">
                                    🔍
                                </div>
                                <h3 className="text-lg font-bold text-gray-200">Không tìm thấy món nào</h3>
                                <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
                                    Không có món ăn nào phù hợp với từ khóa "{searchQuery}". Hãy thử tìm kiếm với tên món khác.
                                </p>
                            </div>
                        )}
                    </div>
                ) : selectedCategory !== "all" ? (
                    /* Khi chọn 1 danh mục cụ thể */
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-xl sm:text-2xl font-black text-gray-100 tracking-tight">
                                    {selectedCategory}
                                </h2>
                                <span className="text-xs text-gray-400">
                                    ({filteredMenuItems.length} món)
                                </span>
                            </div>
                        </div>
                        {filteredMenuItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                                {filteredMenuItems.map((item) => (
                                    <MenuCard 
                                        key={item.id} 
                                        item={item} 
                                        restaurantId={id} 
                                        isRestaurantOpen={isRestaurantOpen}
                                        isHighlighted={Boolean(highlightFoodId && String(item.id) === String(highlightFoodId))}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-4 bg-gray-900/40 rounded-3xl border border-dashed border-gray-800">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/60 flex items-center justify-center text-3xl">
                                    🍽️
                                </div>
                                <h3 className="text-lg font-bold text-gray-200">Danh mục chưa có món</h3>
                                <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
                                    Hiện tại quán chưa có món ăn nào đang mở bán trong danh mục này.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Khi chọn "Tất cả món": Phân nhóm từng danh mục rõ ràng kiểu ShopeeFood */
                    <div>
                        {restaurant.categories && restaurant.categories.length > 0 ? (
                            restaurant.categories.map((cat) => {
                                const catDishes = filteredMenuItems.filter(
                                    (item) => item.foodCategory?.name === cat.name
                                );
                                if (catDishes.length === 0) return null;
                                return (
                                    <div key={cat.id} className="mb-10 last:mb-0">
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-100 tracking-tight">
                                                {cat.name}
                                            </h3>
                                            <span className="text-xs text-gray-400 font-medium">
                                                ({catDishes.length} món)
                                            </span>
                                            <div className="h-[1px] flex-1 bg-gray-800/80" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                                            {catDishes.map((item) => (
                                                <MenuCard 
                                                    key={item.id} 
                                                    item={item} 
                                                    restaurantId={id} 
                                                    isRestaurantOpen={isRestaurantOpen}
                                                    isHighlighted={Boolean(highlightFoodId && String(item.id) === String(highlightFoodId))}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : null}

                        {/* Các món chưa phân danh mục hoặc khi quán chưa tạo danh mục */}
                        {(() => {
                            const uncatDishes = filteredMenuItems.filter(
                                (item) => !item.foodCategory || !restaurant.categories?.some(c => c.name === item.foodCategory?.name)
                            );
                            if (uncatDishes.length === 0) return null;
                            return (
                                <div className="mb-10 last:mb-0">
                                    {restaurant.categories && restaurant.categories.length > 0 && (
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-100 tracking-tight">
                                                Món Khác
                                            </h3>
                                            <span className="text-xs text-gray-400 font-medium">
                                                ({uncatDishes.length} món)
                                            </span>
                                            <div className="h-[1px] flex-1 bg-gray-800/80" />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                                        {uncatDishes.map((item) => (
                                            <MenuCard 
                                                key={item.id} 
                                                item={item} 
                                                restaurantId={id} 
                                                isRestaurantOpen={isRestaurantOpen}
                                                isHighlighted={Boolean(highlightFoodId && String(item.id) === String(highlightFoodId))}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        {filteredMenuItems.length === 0 && (
                            <div className="text-center py-16 px-4 bg-gray-900/40 rounded-3xl border border-dashed border-gray-800">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/60 flex items-center justify-center text-3xl">
                                    🍽️
                                </div>
                                <h3 className="text-lg font-bold text-gray-200">Quán chưa có món ăn</h3>
                                <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
                                    Quán hiện chưa cập nhật món ăn lên thực đơn online.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* PHẦN ĐÁNH GIÁ & NHẬN XÉT KHÁCH HÀNG */}
            <Divider sx={{ bgcolor: "#1f2937", my: 6 }} />
            <section id="restaurant-reviews-section" className="pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 flex items-center gap-2">
                            Đánh Giá & Nhận Xét
                        </h2>
                        {review.totalReviews > 0 ? (
                            <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                Điểm trung bình: <span className="text-amber-400 font-bold">{review.averageRating} / 5 ⭐</span> ({review.totalReviews} lượt đánh giá)
                            </p>
                        ) : (
                            <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                Chưa có đánh giá nào cho quán này. Hãy trở thành người đầu tiên trải nghiệm và chia sẻ!
                            </p>
                        )}
                    </div>
                    <Button 
                        variant="contained" 
                        onClick={() => setOpenReviewModal(true)}
                        sx={{ 
                            bgcolor: '#ec4899', 
                            '&:hover': { bgcolor: '#db2777' },
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            px: 3,
                            py: 1
                        }}
                    >
                        Viết đánh giá
                    </Button>
                </div>

                {/* Thanh lọc nhận xét: Tất cả / Chung về quán / Theo món ăn */}
                {review.reviews && review.reviews.length > 0 && (
                    <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
                        <button
                            type="button"
                            onClick={() => setReviewFilter("ALL")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                reviewFilter === "ALL" 
                                    ? "bg-pink-500 text-white shadow-md shadow-pink-500/20" 
                                    : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
                            }`}
                        >
                            Tất cả ({review.reviews?.length || 0})
                        </button>
                        <button
                            type="button"
                            onClick={() => setReviewFilter("RESTAURANT")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                reviewFilter === "RESTAURANT" 
                                    ? "bg-pink-500 text-white shadow-md shadow-pink-500/20" 
                                    : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
                            }`}
                        >
                            🏪 Về quán ({review.reviews?.filter(r => !r.food).length || 0})
                        </button>
                        <button
                            type="button"
                            onClick={() => setReviewFilter("FOOD")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                reviewFilter === "FOOD" 
                                    ? "bg-pink-500 text-white shadow-md shadow-pink-500/20" 
                                    : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
                            }`}
                        >
                            🍛 Về món ăn ({review.reviews?.filter(r => r.food).length || 0})
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                        const displayedReviews = (review.reviews || []).filter(r => {
                            if (reviewFilter === "RESTAURANT") return !r.food;
                            if (reviewFilter === "FOOD") return Boolean(r.food);
                            return true;
                        });

                        if (displayedReviews.length === 0) {
                            return (
                                <div className="col-span-full text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-2xl">
                                    {reviewFilter === "FOOD" 
                                        ? "Chưa có đánh giá riêng cho món ăn nào." 
                                        : reviewFilter === "RESTAURANT" 
                                        ? "Chưa có đánh giá chung cho nhà hàng."
                                        : "Chưa có đánh giá nào cho nhà hàng này. Hãy trở thành người đầu tiên đánh giá!"}
                                </div>
                            );
                        }

                        return displayedReviews.map((r) => (
                            <Card 
                                key={r.id} 
                                sx={{ 
                                    bgcolor: '#111827', 
                                    border: '1px solid #1f2937', 
                                    color: 'white', 
                                    borderRadius: 3 
                                }} 
                                className="p-4 sm:p-5 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar sx={{ bgcolor: '#ec4899', width: 40, height: 40 }}>
                                                {r.customer?.fullName?.[0] || "U"}
                                            </Avatar>
                                            <div className="min-w-0">
                                                <Typography className="font-bold text-sm text-gray-200 truncate">
                                                    {r.customer?.fullName || "Khách hàng"}
                                                </Typography>
                                                <Typography variant="caption" className="text-gray-500">
                                                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : ""}
                                                </Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 text-amber-400 text-xs font-bold">
                                                ⭐ {r.rating}
                                            </div>
                                            {auth.user && r.customer?.id === auth.user.id && (
                                                <div className="flex gap-0.5">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleEditReviewClick(r)}
                                                        sx={{ color: '#60a5fa', p: 0.5, '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.1)' } }}
                                                        title="Sửa nhận xét"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleDeleteReviewClick(r.id)}
                                                        sx={{ color: '#f87171', p: 0.5, '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.1)' } }}
                                                        title="Xóa nhận xét"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tag món ăn nếu nhận xét cho món ăn cụ thể */}
                                    {r.food && (
                                        <div className="flex items-center gap-2 mt-3 bg-gray-950/70 p-1.5 px-2.5 rounded-xl border border-gray-800 w-fit">
                                            {r.food.images?.[0] && (
                                                <img src={r.food.images[0]} alt={r.food.name} className="w-6 h-6 rounded-md object-cover" />
                                            )}
                                            <span className="text-xs font-semibold text-pink-400">
                                                Món: {r.food.name}
                                            </span>
                                        </div>
                                    )}

                                    <Typography className="text-gray-300 text-sm mt-3 leading-relaxed">
                                        {r.comment}
                                    </Typography>
                                </div>
                            </Card>
                        ));
                    })()}
                </div>
            </section>

            {/* Modal viết / sửa đánh giá */}
            <ReviewModal 
                open={openReviewModal} 
                handleClose={handleCloseReviewModal} 
                restaurantId={id} 
                items={menu.menuItems?.map(f => ({ food: f }))}
                reviewToEdit={selectedReviewToEdit}
                onSuccess={() => {
                    dispatch(getRestaurantReviews({ restaurantId: id }));
                    dispatch(getRestaurantById({ jwt, restaurantId: id }));
                }} 
            />

            {/* Dialog xác nhận xóa đánh giá */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleCancelDeleteReview}
                PaperProps={{
                    style: {
                        backgroundColor: '#111827',
                        color: '#fff',
                        borderRadius: '20px',
                        border: '1px solid #1f2937',
                        padding: '10px',
                        maxWidth: '420px',
                        width: '100%',
                    },
                }}
            >
                <DialogTitle style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem' }}>
                    <DeleteIcon style={{ color: '#ef4444' }} />
                    Xác nhận xóa đánh giá
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ color: '#9ca3af', fontSize: '0.95rem', marginTop: '4px' }}>
                        Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ padding: '16px', gap: '8px' }}>
                    <Button 
                        onClick={handleCancelDeleteReview} 
                        sx={{ 
                            color: '#9ca3af', 
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 'medium',
                            px: 3,
                            py: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                color: '#fff'
                            }
                        }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleConfirmDeleteReview} 
                        variant="contained" 
                        sx={{ 
                            bgcolor: '#ef4444', 
                            color: '#fff',
                            fontWeight: 'bold',
                            borderRadius: '10px',
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            '&:hover': { 
                                bgcolor: '#dc2626' 
                            } 
                        }}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};