import React, { useState, useEffect } from 'react';
import { 
    Button, Typography, IconButton, Dialog, DialogActions, 
    DialogContent, DialogTitle, Chip, Checkbox, FormControlLabel, Box, Avatar 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RateReviewIcon from '@mui/icons-material/RateReview';

import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, clearCartAction } from '../../State/Cart/Action';
import { getFoodReviews } from '../../State/Review/Action';
import { ReviewModal } from './ReviewModal';

export const MenuCard = ({ item, restaurantId, isRestaurantOpen = true, isHighlighted = false }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [switchRestaurantDialogOpen, setSwitchRestaurantDialogOpen] = useState(false);
    const [activeImgIdx, setActiveImgIdx] = useState(0);
    const [modalTab, setModalTab] = useState(0); // 0: Chọn món & Topping, 1: Đánh giá món
    const [openFoodReviewModal, setOpenFoodReviewModal] = useState(false);

    const cartData = useSelector(store => store.cart);
    const restaurantState = useSelector(store => store.restaurant);
    const reviewState = useSelector(store => store.review);
    const foodReviewData = reviewState.foodReviews[item.id] || { reviews: [], averageRating: 0, totalReviews: 0 };

    const foodImages = (item.images && item.images.length > 0) 
        ? item.images 
        : ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"];

    useEffect(() => {
        if (item.id) {
            dispatch(getFoodReviews({ foodId: item.id }));
        }
    }, [dispatch, item.id]);

    // Khi mở modal, tự động tick các topping đang còn hàng và reset tab, index ảnh
    useEffect(() => {
        if (openDetailModal) {
            setActiveImgIdx(0);
            setModalTab(0);
            if (item.ingredients) {
                const availableNames = item.ingredients
                    .filter(ing => ing.inStoke !== false && ing.inStock !== false)
                    .map(ing => ing.name);
                setSelectedIngredients(availableNames);
            }
            setQuantity(1);
        }
    }, [openDetailModal, item.ingredients]);

    const handleOpenModal = () => {
        if (!isRestaurantOpen) return;
        setOpenDetailModal(true);
    };

    const handleCloseModal = () => {
        setOpenDetailModal(false);
    };

    const handleToggleIngredient = (name) => {
        setSelectedIngredients(prev => 
            prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
        );
    };

    const handleAddToCartSubmit = (e) => {
        if (e) e.preventDefault();
        if (!isRestaurantOpen || !item.available) return;

        const cartItems = cartData.cartItems || cartData.cart?.item || cartData.cart?.items || [];
        const currentRestId = item.restaurant?.id || restaurantId || restaurantState.restaurant?.id;
        const existingRestId = cartItems[0]?.food?.restaurant?.id;

        // Nếu giỏ hàng đã có món của quán khác, hỏi xác nhận đổi quán (ShopeeFood / GrabFood style)
        if (cartItems.length > 0 && existingRestId && currentRestId && String(existingRestId) !== String(currentRestId)) {
            setSwitchRestaurantDialogOpen(true);
            return;
        }

        const reqData = {
            foodId: item.id,
            quantity: quantity,
            ingredients: selectedIngredients
        };

        dispatch(addItemToCart({ reqData, jwt }));
        setOpenDetailModal(false);
    };

    const handleConfirmSwitchRestaurant = async () => {
        setSwitchRestaurantDialogOpen(false);
        try {
            await dispatch(clearCartAction());
            const reqData = {
                foodId: item.id,
                quantity: quantity,
                ingredients: selectedIngredients
            };
            dispatch(addItemToCart({ reqData, jwt }));
            localStorage.removeItem("pending_coupon");
            setOpenDetailModal(false);
        } catch (err) {
            console.error("Lỗi làm mới giỏ hàng:", err);
        }
    };

    return (
        <>
            {/* THẺ MÓN ĂN CHUẨN SHOPEEFOOD (FOOD CARD) */}
            <div 
                id={`menu-item-${item.id}`}
                onClick={handleOpenModal}
                className={`group bg-[#111827]/90 hover:bg-[#1f2937] border rounded-2xl p-4 transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer shadow-md hover:shadow-xl relative overflow-hidden ${
                    isHighlighted 
                        ? "border-pink-500 ring-2 ring-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.3)] scale-[1.01]" 
                        : "border-gray-800/80 hover:border-pink-500/40"
                }`}
            >
                {/* Thông tin món bên trái */}
                <div className="flex-1 min-w-0 pr-2 space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {item.foodCategory?.name && (
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-800/80 px-2 py-0.5 rounded-full border border-gray-700/60 uppercase tracking-wider">
                                {item.foodCategory.name}
                            </span>
                        )}
                        {item.vegetarian && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5">
                                🌱 Thuần Chay
                            </span>
                        )}
                        {!item.available && (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                                🔴 TẠM HẾT MÓN
                            </span>
                        )}
                    </div>

                    <h4 className={`text-base font-bold truncate transition-colors ${
                        item.available ? 'text-gray-100 group-hover:text-pink-400' : 'text-gray-400 line-through'
                    }`}>
                        {item.name}
                    </h4>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {item.description || "Món ăn ngon đậm đà hương vị, được chế biến nóng sốt từ đầu bếp."}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                            <span className="text-base font-black text-pink-400 font-mono tracking-tight">
                                {item.price?.toLocaleString()}đ
                            </span>
                            {foodReviewData.totalReviews > 0 && (
                                <span className="text-xs font-semibold text-amber-400 flex items-center gap-0.5">
                                    <StarIcon sx={{ fontSize: 13 }} /> {foodReviewData.averageRating}
                                    <span className="text-[10px] text-gray-400">({foodReviewData.totalReviews})</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ảnh món & Nút thêm bên phải */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-gray-800 bg-gray-900">
                    <img 
                        src={foodImages[0]} 
                        alt={item.name}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            !item.available ? 'opacity-40 grayscale' : ''
                        }`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                        }}
                    />

                    {foodImages.length > 1 && (
                        <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-white/10">
                            +{foodImages.length} ảnh
                        </div>
                    )}

                    {!item.available ? (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-1">
                            <span className="text-[10px] font-black text-rose-300 uppercase tracking-wider text-center bg-rose-950/80 px-2 py-1 rounded-md border border-rose-500/40">
                                Hết hàng
                            </span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModal();
                            }}
                            className="absolute bottom-2 right-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white p-1.5 sm:px-2.5 sm:py-1 rounded-xl shadow-lg shadow-pink-600/40 flex items-center gap-1 text-xs font-bold transition-all transform active:scale-95"
                            title="Chọn món & Topping"
                        >
                            <AddIcon sx={{ fontSize: 16 }} />
                            <span className="hidden sm:inline">Thêm</span>
                        </button>
                    )}
                </div>
            </div>

            {/* POPUP CHI TIẾT MÓN ĂN & ALBUM ẢNH & ĐÁNH GIÁ (SHOPEEFOOD FOOD MODAL) */}
            <Dialog
                open={openDetailModal}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#111827',
                        border: '1px solid #1f2937',
                        borderRadius: '24px',
                        color: 'white',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
                    }
                }}
            >
                {/* Ảnh bìa món ăn kèm Slider chuyển ảnh nếu có nhiều ảnh */}
                <div className="relative w-full h-64 sm:h-72 bg-gray-900 group/carousel">
                    <img 
                        src={foodImages[activeImgIdx] || foodImages[0]} 
                        alt={item.name}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${!item.available ? 'opacity-50 grayscale' : ''}`}
                    />
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: '#fff',
                            backdropFilter: 'blur(8px)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                            zIndex: 20
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>

                    {/* Mũi tên chuyển ảnh */}
                    {foodImages.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveImgIdx(prev => (prev === 0 ? foodImages.length - 1 : prev - 1));
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg z-10"
                                title="Ảnh trước"
                            >
                                <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveImgIdx(prev => (prev === foodImages.length - 1 ? 0 : prev + 1));
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg z-10"
                                title="Ảnh tiếp theo"
                            >
                                <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                            </button>

                            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 z-10">
                                📷 {activeImgIdx + 1} / {foodImages.length}
                            </div>
                        </>
                    )}

                    {!item.available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                            <span className="text-sm font-black text-rose-300 uppercase tracking-widest bg-rose-950/90 px-4 py-2 rounded-xl border border-rose-500/50">
                                Món ăn tạm hết hôm nay
                            </span>
                        </div>
                    )}
                </div>

                {/* Hàng ảnh nhỏ thumbnails bên dưới ảnh lớn */}
                {foodImages.length > 1 && (
                    <div className="flex gap-2 px-4 py-2 bg-gray-950 border-b border-gray-800/80 overflow-x-auto">
                        {foodImages.map((img, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveImgIdx(idx)}
                                className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                                    activeImgIdx === idx 
                                        ? 'border-pink-500 scale-105 shadow-md shadow-pink-500/30' 
                                        : 'border-gray-800 opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <DialogContent sx={{ p: 3 }} className="space-y-4">
                    {/* Tên món & Giá */}
                    <div>
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-2xl font-black text-white">{item.name}</h3>
                            <span className="text-2xl font-black text-pink-400 font-mono">
                                {item.price?.toLocaleString()}đ
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {item.description || "Món ăn nóng sốt, thơm ngon chuẩn vị của nhà hàng."}
                        </p>
                    </div>

                    {/* Tab chuyển đổi giữa "Món ăn & Topping" và "Nhận xét món ăn" */}
                    <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                        <button
                            type="button"
                            onClick={() => setModalTab(0)}
                            className={`text-xs font-bold py-1.5 px-3.5 rounded-xl transition-all ${
                                modalTab === 0 
                                    ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30' 
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Topping & Món ăn kèm
                        </button>
                        <button
                            type="button"
                            onClick={() => setModalTab(1)}
                            className={`text-xs font-bold py-1.5 px-3.5 rounded-xl transition-all flex items-center gap-1.5 ${
                                modalTab === 1 
                                    ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30' 
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <StarIcon sx={{ fontSize: 14, color: '#facc15' }} />
                            Đánh giá ({foodReviewData.totalReviews || 0})
                        </button>
                    </div>

                    {/* TAB 0: TOPPING & MÓN ĂN KÈM */}
                    {modalTab === 0 && (
                        <div>
                            {item.ingredients && item.ingredients.length > 0 ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                                            Danh sách Topping:
                                        </h5>
                                        <span className="text-[11px] text-gray-500">Tùy chọn kèm theo</span>
                                    </div>

                                    <div className="space-y-1 bg-gray-950/60 p-2.5 rounded-xl border border-gray-800/80 max-h-48 overflow-y-auto">
                                        {item.ingredients.map((ing) => {
                                            const isIngInStock = ing.inStoke !== false && ing.inStock !== false;
                                            const isChecked = selectedIngredients.includes(ing.name);

                                            return (
                                                <div 
                                                    key={ing.id}
                                                    onClick={() => isIngInStock && handleToggleIngredient(ing.name)}
                                                    className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                                                        !isIngInStock 
                                                            ? 'opacity-40 cursor-not-allowed' 
                                                            : isChecked ? 'bg-pink-500/10 border border-pink-500/30' : 'hover:bg-gray-900 border border-transparent'
                                                    }`}
                                                >
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox 
                                                                checked={isChecked}
                                                                disabled={!isIngInStock}
                                                                size="small"
                                                                sx={{
                                                                    color: '#6b7280',
                                                                    '&.Mui-checked': { color: '#ec4899' }
                                                                }}
                                                            />
                                                        }
                                                        label={
                                                            <span className={`text-sm ${isIngInStock ? 'text-gray-200' : 'text-gray-500 line-through'}`}>
                                                                {ing.name}
                                                            </span>
                                                        }
                                                        sx={{ m: 0 }}
                                                    />
                                                    {!isIngInStock ? (
                                                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                                            Tạm hết
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-medium text-emerald-400">
                                                            Có sẵn
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 py-3 text-center italic">
                                    Món ăn này không có topping bổ sung.
                                </p>
                            )}
                        </div>
                    )}

                    {/* TAB 1: NHẬN XÉT & ĐÁNH GIÁ CỦA MÓN ĂN */}
                    {modalTab === 1 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-gray-950/70 p-3 rounded-xl border border-gray-800">
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xl font-black text-amber-400">{foodReviewData.averageRating || 5.0}</span>
                                        <span className="text-xs text-gray-400 font-medium">/ 5 ⭐</span>
                                    </div>
                                    <span className="text-[11px] text-gray-500">({foodReviewData.totalReviews || 0} lượt khách hàng nhận xét)</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpenFoodReviewModal(true)}
                                    className="text-xs font-bold text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 px-3 py-1.5 rounded-xl border border-pink-500/30 transition-all flex items-center gap-1"
                                >
                                    <RateReviewIcon sx={{ fontSize: 15 }} />
                                    Viết nhận xét
                                </button>
                            </div>

                            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                {foodReviewData.reviews && foodReviewData.reviews.length > 0 ? (
                                    foodReviewData.reviews.map((rev) => (
                                        <div key={rev.id} className="bg-gray-950/50 p-2.5 rounded-xl border border-gray-800/70 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar sx={{ width: 22, height: 22, bgcolor: '#ec4899', fontSize: 10, fontWeight: 'bold' }}>
                                                        {rev.customer?.fullName?.[0] || 'U'}
                                                    </Avatar>
                                                    <span className="text-xs font-bold text-gray-200">
                                                        {rev.customer?.fullName || 'Khách hàng'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                                                    ⭐ {rev.rating}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-300 pl-7 leading-relaxed">
                                                {rev.comment}
                                            </p>
                                            <div className="text-[10px] text-gray-500 text-right">
                                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : ''}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-xs text-gray-500 border border-dashed border-gray-800 rounded-xl">
                                        Chưa có nhận xét nào cho món này. Hãy đặt thử và là người đầu tiên chia sẻ trải nghiệm nhé!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>

                {/* Footer Modal: Bộ đếm số lượng & Nút Thêm vào giỏ hàng */}
                <DialogActions sx={{ p: 3, pt: 0, flexDirection: 'column', gap: 2 }}>
                    <div className="w-full flex items-center justify-between bg-gray-950/70 p-2.5 rounded-xl border border-gray-800">
                        <span className="text-xs font-semibold text-gray-400">Số lượng phần ăn:</span>
                        <div className="flex items-center gap-3">
                            <IconButton 
                                size="small"
                                disabled={quantity <= 1 || !item.available}
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                sx={{ color: '#ec4899', bgcolor: 'rgba(236,72,153,0.1)', '&:hover': { bgcolor: 'rgba(236,72,153,0.2)' } }}
                            >
                                <RemoveIcon fontSize="small" />
                            </IconButton>
                            <span className="font-mono font-black text-base text-white w-6 text-center">
                                {quantity}
                            </span>
                            <IconButton 
                                size="small"
                                disabled={!item.available}
                                onClick={() => setQuantity(q => q + 1)}
                                sx={{ color: '#ec4899', bgcolor: 'rgba(236,72,153,0.1)', '&:hover': { bgcolor: 'rgba(236,72,153,0.2)' } }}
                            >
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </div>
                    </div>

                    <Button
                        fullWidth
                        variant="contained"
                        disabled={!item.available || !isRestaurantOpen}
                        onClick={handleAddToCartSubmit}
                        startIcon={<ShoppingBagIcon />}
                        sx={{
                            bgcolor: '#ec4899',
                            '&:hover': { bgcolor: '#db2777' },
                            py: 1.5,
                            borderRadius: '14px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
                        }}
                    >
                        Thêm vào giỏ hàng • {((item.price || 0) * quantity).toLocaleString()}đ
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal viết đánh giá cho riêng món ăn này */}
            <ReviewModal
                open={openFoodReviewModal}
                handleClose={() => setOpenFoodReviewModal(false)}
                restaurantId={item.restaurant?.id || restaurantId}
                foodId={item.id}
                foodName={item.name}
                onSuccess={() => {
                    dispatch(getFoodReviews({ foodId: item.id }));
                }}
            />

            {/* HỘP THOẠI XÁC NHẬN ĐỔI QUÁN ĂN */}
            <Dialog
                open={switchRestaurantDialogOpen}
                onClose={() => setSwitchRestaurantDialogOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#111827',
                        border: '1px solid #1f2937',
                        borderRadius: '20px',
                        color: 'white',
                        p: 1
                    }
                }}
            >
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="text-amber-400">⚠️</span> Tạo đơn hàng mới từ quán này?
                </DialogTitle>
                <DialogContent>
                    <Typography className="text-sm text-gray-300 leading-relaxed">
                        Giỏ hàng của bạn đang có món ăn từ quán khác. Bạn có muốn làm mới giỏ hàng để bắt đầu đặt món tại quán này không?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={() => setSwitchRestaurantDialogOpen(false)} 
                        sx={{ color: '#9ca3af', textTransform: 'none' }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button 
                        onClick={handleConfirmSwitchRestaurant} 
                        variant="contained"
                        sx={{ 
                            bgcolor: '#ec4899', 
                            '&:hover': { bgcolor: '#db2777' },
                            textTransform: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            px: 2.5
                        }}
                    >
                        Đồng ý đổi quán
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};