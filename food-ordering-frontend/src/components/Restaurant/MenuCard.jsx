import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, clearCartAction } from '../../State/Cart/Action';
import { getFoodReviews, getRestaurantReviews, deleteReview } from '../../State/Review/Action';
import { ReviewModal } from './ReviewModal';

export const MenuCard = ({ item, restaurantId, isRestaurantOpen = true, isHighlighted = false }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [selectedReviewToEdit, setSelectedReviewToEdit] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [reviewIdToDelete, setReviewIdToDelete] = useState(null);
    const [switchRestaurantDialogOpen, setSwitchRestaurantDialogOpen] = useState(false);

    const auth = useSelector(store => store.auth);
    const cartData = useSelector(store => store.cart);
    const restaurantState = useSelector(store => store.restaurant);
    const reviewState = useSelector(store => store.review);
    const foodReviewData = reviewState.foodReviews[item.id] || { reviews: [], averageRating: 0, totalReviews: 0 };

    useEffect(() => {
        if (item.id) {
            dispatch(getFoodReviews({ foodId: item.id }));
        }
    }, [dispatch, item.id]);

    const handleEditReviewClick = (review) => {
        setSelectedReviewToEdit(review);
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
                dispatch(getFoodReviews({ foodId: item.id }));
                if (restaurantId) {
                    dispatch(getRestaurantReviews({ restaurantId }));
                }
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

    const handleAddItemToCart = (e) => {
        e.preventDefault();

        if (!isRestaurantOpen) return;

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
            quantity: 1,
            ingredients: []
        };

        dispatch(addItemToCart({ reqData, jwt }));
        console.log("Đang kích hoạt API thêm vào giỏ hàng:", reqData);
    };

    const handleConfirmSwitchRestaurant = async () => {
        setSwitchRestaurantDialogOpen(false);
        try {
            await dispatch(clearCartAction());
            const reqData = {
                foodId: item.id,
                quantity: 1,
                ingredients: []
            };
            dispatch(addItemToCart({ reqData, jwt }));
            localStorage.removeItem("pending_coupon");
        } catch (err) {
            console.error("Lỗi làm mới giỏ hàng:", err);
        }
    };

    return (
        <div 
            id={`menu-item-${item.id}`} 
            className={`transition-all duration-500 rounded-lg ${
                isHighlighted 
                    ? "ring-2 ring-pink-500 shadow-[0_0_25px_rgba(233,30,99,0.45)] scale-[1.01]" 
                    : ""
            }`}
        >
            <Accordion defaultExpanded={isHighlighted}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className='lg:flex items-center justify-between w-full'>
                    <div className='lg:flex items-center lg:gap-5'>
                        <img
                            className='w-[7rem] h-[7rem] object-cover rounded-md'
                            src={item.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"}
                            alt={item.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                            }}
                        />
                        <div className='space-y-1 lg:space-y-3 lg:max-w-2xl'>
                            <p className='font-semibold text-xl flex items-center gap-2'>
                                {item.name}
                                {foodReviewData.totalReviews > 0 && (
                                    <span className="text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                                        ⭐ {foodReviewData.averageRating} ({foodReviewData.totalReviews})
                                    </span>
                                )}
                            </p>
                            <p className='text-gray-400 font-semibold'>{item.price}đ</p>
                            <p className='text-gray-500 text-sm'>{item.description}</p>
                        </div>
                    </div>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <form onSubmit={handleAddItemToCart}>
                    <div className='pt-2'>
                        <Button
                            variant='contained'
                            color='primary'
                            disabled={!item.available || !isRestaurantOpen}
                            type='submit'
                        >
                            {!isRestaurantOpen ? "Quán tạm ngưng nhận đơn" : (item.available ? "Thêm vào giỏ hàng" : "Hết hàng")}
                        </Button>
                    </div>
                </form>

                {/* Phần đánh giá món ăn */}
                <div className='mt-6 border-t border-gray-800 pt-4'>
                    <div className="flex justify-between items-center mb-4">
                        <Typography className="font-semibold text-gray-200" variant="subtitle1">
                            Đánh Giá Món Ăn ({foodReviewData.totalReviews} nhận xét)
                        </Typography>
                        <Button 
                            size="small"
                            variant="outlined" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenReviewModal(true);
                            }}
                            sx={{ color: '#e91e63', borderColor: '#e91e63', '&:hover': { borderColor: '#ad1457', bgcolor: 'rgba(233,30,99,0.05)' } }}
                        >
                            Đánh giá món
                        </Button>
                    </div>

                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                        {foodReviewData.reviews?.map((r) => (
                            <div key={r.id} className="p-3 bg-gray-900/60 border border-gray-800 rounded-lg text-sm text-white">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-300">{r.customer?.fullName}</span>
                                        <span className="text-gray-500 text-xs mt-0.5">
                                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : ""}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-yellow-500 font-semibold mr-1">⭐ {r.rating}</span>
                                        {auth.user && r.customer?.id === auth.user.id && (
                                            <div className="flex gap-0.5">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditReviewClick(r);
                                                    }}
                                                    sx={{ color: '#60a5fa', p: 0.2, '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.1)' } }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteReviewClick(r.id);
                                                    }}
                                                    sx={{ color: '#f87171', p: 0.2, '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.1)' } }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-400 mt-1.5">{r.comment}</p>
                            </div>
                        ))}
                        {(!foodReviewData.reviews || foodReviewData.reviews.length === 0) && (
                            <p className="text-gray-500 text-xs text-center py-4">Chưa có đánh giá nào cho món ăn này.</p>
                        )}
                    </div>
                </div>

                <ReviewModal 
                    open={openReviewModal} 
                    handleClose={handleCloseReviewModal} 
                    restaurantId={restaurantId} 
                    foodId={item.id} 
                    foodName={item.name}
                    reviewToEdit={selectedReviewToEdit}
                    onSuccess={() => {
                        dispatch(getFoodReviews({ foodId: item.id }));
                        if (restaurantId) {
                            dispatch(getRestaurantReviews({ restaurantId }));
                        }
                    }}
                />

                {/* Dialog xác nhận xóa đánh giá món ăn thiết kế đẹp mắt */}
                <Dialog
                    open={deleteConfirmOpen}
                    onClose={handleCancelDeleteReview}
                    PaperProps={{
                        style: {
                            backgroundColor: '#111827',
                            color: '#fff',
                            borderRadius: '16px',
                            border: '1px solid #1f2937',
                            padding: '8px',
                            maxWidth: '400px',
                            width: '100%',
                        },
                    }}
                >
                    <DialogTitle style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem' }}>
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
                                borderRadius: '8px',
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
                                borderRadius: '8px',
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

                {/* Dialog xác nhận đổi quán khi thêm món (ShopeeFood / GrabFood style) */}
                <Dialog 
                    open={switchRestaurantDialogOpen} 
                    onClose={() => setSwitchRestaurantDialogOpen(false)}
                    PaperProps={{
                        sx: {
                            bgcolor: '#111827',
                            border: '1px solid #1f2937',
                            borderRadius: '16px',
                            color: 'white',
                            p: 1
                        }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 'bold', color: '#f43f5e' }}>
                        Tạo Giỏ Hàng Mới?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                            Giỏ hàng của bạn đang có món của quán <strong style={{ color: '#ec4899' }}>{cartData.cartItems?.[0]?.food?.restaurant?.name || cartData.cart?.item?.[0]?.food?.restaurant?.name || "nhà hàng khác"}</strong>.
                            <br /><br />
                            Mỗi đơn hàng chỉ áp dụng cho một nhà hàng để đảm bảo giao nhanh và đúng mã ưu đãi. Bạn có muốn <strong>xóa giỏ hàng hiện tại</strong> để bắt đầu đặt món tại <strong style={{ color: '#ec4899' }}>{item.restaurant?.name || restaurantState.restaurant?.name || "quán này"}</strong> không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
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
                                bgcolor: '#e91e63', 
                                '&:hover': { bgcolor: '#c2185b' }, 
                                fontWeight: 'bold', 
                                borderRadius: '8px', 
                                textTransform: 'none',
                                px: 2.5
                            }}
                        >
                            Tạo giỏ mới & Thêm món
                        </Button>
                    </DialogActions>
                </Dialog>
            </AccordionDetails>
        </Accordion>
        </div>
    );
};