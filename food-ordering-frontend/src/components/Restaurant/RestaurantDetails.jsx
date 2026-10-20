import React, { useEffect, useState } from 'react';
import { Divider, FormControl, FormControlLabel, Radio, RadioGroup, Typography, Card, Avatar, Chip, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MenuCard } from './MenuCard';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantById, getRestaurantsCategory } from '../../State/Restaurant/Action';
import { getMenuItemsByRestaurantId } from '../../State/Menu/Action';
import { getRestaurantReviews, deleteReview } from '../../State/Review/Action';
import { ReviewModal } from './ReviewModal';

const foodTypes = [
    { label: "Tất cả", value: "all" },
    { label: "Món Chay", value: "vegetarian" },
    { label: "Món Mặn", value: "non_vegetarian" },
    { label: "Theo Mùa", value: "seasonal" }
];

export const RestaurantDetails = () => {
    const [foodType, setFoodType] = useState("all");
    const [foodCategory, setFoodCategory] = useState("");
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [selectedReviewToEdit, setSelectedReviewToEdit] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [reviewIdToDelete, setReviewIdToDelete] = useState(null);

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

    // Kéo thông tin chi tiết quán + danh mục món ăn + đánh giá
    useEffect(() => {
        if (id) {
            dispatch(getRestaurantById({ jwt, restaurantId: id }));
            dispatch(getRestaurantsCategory({ jwt, restaurantId: id }));
            dispatch(getRestaurantReviews({ restaurantId: id }));
        }
    }, [dispatch, jwt, id]);

    // Kéo danh sách món ăn mỗi khi khách chọn bộ lọc
    useEffect(() => {
        if (id) {
            dispatch(getMenuItemsByRestaurantId({
                jwt,
                restaurantId: id,
                vegetarian: foodType === "vegetarian",
                nonveg: foodType === "non_vegetarian",
                seasonal: foodType === "seasonal",
                foodCategory: foodCategory
            }));
        }
    }, [dispatch, jwt, id, foodType, foodCategory]);

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

    return (
        <div className='px-5 lg:px-20 text-white min-h-screen'>
            {/* Header: Ảnh bìa và Thông tin */}
            <section>
                <h3 className='text-gray-500 py-2 mt-5'>Home / {restaurant.restaurant?.address?.city} / {restaurant.restaurant?.name} / {id}</h3>
                <div>
                    <img
                        className='w-full h-[40vh] object-cover rounded-lg'
                        src={restaurant.restaurant?.images?.[0] || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"}
                        alt={restaurant.restaurant?.name || "Restaurant"}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200";
                        }}
                    />
                </div>
                <div className='pt-3 pb-5'>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className='text-4xl font-semibold flex flex-wrap items-center gap-3'>
                            {restaurant.restaurant?.name}
                            <span className="text-xl text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/30 flex items-center gap-1">
                                ⭐ {review.totalReviews > 0 ? review.averageRating : "Chưa có đánh giá"} 
                                {review.totalReviews > 0 && <span className="text-gray-400 text-sm font-normal">({review.totalReviews} đánh giá)</span>}
                            </span>
                        </h1>
                    </div>
                    <p className='text-gray-500 mt-1'>{restaurant.restaurant?.description}</p>
                    <div className='space-y-3 mt-3'>
                        <p className='text-gray-500 flex items-center gap-3'>
                            <LocationOnIcon /> <span>{restaurant.restaurant?.address?.streetAddress}, {restaurant.restaurant?.address?.city}</span>
                        </p>
                        <p className='text-gray-500 flex items-center gap-3'>
                            <CalendarTodayIcon /> <span>{restaurant.restaurant?.openingHours}</span>
                        </p>
                    </div>
                </div>
            </section>

            <Divider sx={{ bgcolor: "gray" }} />

            {/* Banner thông báo khi quán tạm ngưng nhận đơn */}
            {restaurant.restaurant && restaurant.restaurant.open === false && (
                <div className='my-4 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 flex items-center gap-3'>
                    <span className='text-2xl'>⚠️</span>
                    <div>
                        <p className='font-bold text-red-400'>Quán hiện đang tạm ngưng nhận đơn online</p>
                        <p className='text-sm text-red-300/80'>Bạn vẫn có thể tham khảo thực đơn và đánh giá, nhưng hiện tại quán không thể tiếp nhận đơn đặt hàng mới.</p>
                    </div>
                </div>
            )}

            {/* Phần thân: Bộ lọc và Danh sách Món ăn */}
            <section className='pt-[2rem] lg:flex relative'>
                {/* Cột trái: Bộ lọc */}
                <div className='space-y-10 lg:w-[20%] filter '>
                    <div className='box space-y-5 lg:sticky top-28'>
                        <div>
                            <Typography variant='h5' sx={{ paddingBottom: "1rem" }}>Loại Món</Typography>
                            <FormControl className='py-2 space-y-5' component={"fieldset"}>
                                <RadioGroup onChange={(e) => setFoodType(e.target.value)} name='food_type' value={foodType}>
                                    {foodTypes.map((item) => (
                                        <FormControlLabel key={item.value} value={item.value} control={<Radio sx={{ color: "gray" }} />} label={item.label} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <Divider sx={{ bgcolor: "gray" }} />
                        <div>
                            <Typography variant='h5' sx={{ paddingBottom: "1rem" }}>Danh Mục</Typography>
                            <FormControl className='py-2 space-y-5' component={"fieldset"}>
                                <RadioGroup onChange={(e) => setFoodCategory(e.target.value)} name='food_category' value={foodCategory}>
                                    <FormControlLabel value="" control={<Radio sx={{ color: "gray" }} />} label="Tất cả" />
                                    {/* Render danh mục thật từ quán */}
                                    {restaurant.categories?.map((item) => (
                                        <FormControlLabel key={item.id} value={item.name} control={<Radio sx={{ color: "gray" }} />} label={item.name} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Danh sách thực đơn */}
                <div className='space-y-5 lg:w-[80%] lg:pl-10 pb-10 mt-10 lg:mt-0'>
                    {menu.menuItems?.map((item) => (
                        <MenuCard 
                            key={item.id} 
                            item={item} 
                            restaurantId={id} 
                            isRestaurantOpen={restaurant.restaurant?.open !== false}
                            isHighlighted={Boolean(highlightFoodId && String(item.id) === String(highlightFoodId))}
                        />
                    ))}
                </div>
            </section>

            {/* Review Section */}
            <Divider sx={{ bgcolor: "gray", my: 5 }} />
            <section className="pb-20">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-50 flex items-center gap-2">
                            Đánh Giá & Nhận Xét từ Khách Hàng
                        </h2>
                        {review.totalReviews > 0 && (
                            <p className="text-gray-400 text-sm mt-1">
                                Đánh giá trung bình: {review.averageRating} / 5 ⭐ ({review.totalReviews} lượt đánh giá)
                            </p>
                        )}
                    </div>
                    <Button 
                        variant="contained" 
                        onClick={() => setOpenReviewModal(true)}
                        sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#ad1457' } }}
                    >
                        Viết đánh giá
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {review.reviews?.map((r) => (
                        <Card key={r.id} sx={{ bgcolor: '#111827', border: '1px solid #1f2937', color: 'white', borderRadius: 2 }} className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <Avatar sx={{ bgcolor: '#e91e63' }}>{r.customer?.fullName?.[0]}</Avatar>
                                    <div>
                                        <Typography className="font-semibold text-sm text-gray-200">{r.customer?.fullName}</Typography>
                                        <Typography variant="caption" className="text-gray-500">
                                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : ""}
                                        </Typography>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 text-yellow-500 text-sm font-semibold">
                                        ⭐ {r.rating}
                                    </div>
                                    {auth.user && r.customer?.id === auth.user.id && (
                                        <div className="flex gap-0.5">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleEditReviewClick(r)}
                                                sx={{ color: '#60a5fa', p: 0.5, '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.1)' } }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleDeleteReviewClick(r.id)}
                                                sx={{ color: '#f87171', p: 0.5, '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.1)' } }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {r.food && (
                                <Chip 
                                    label={`Món: ${r.food.name}`} 
                                    size="small" 
                                    sx={{ mt: 1.5, bgcolor: '#1f2937', color: '#ff9800', border: '1px solid rgba(255,152,0,0.2)' }} 
                                />
                            )}
                            <Typography className="text-gray-300 text-sm mt-3">{r.comment}</Typography>
                        </Card>
                    ))}
                    {(!review.reviews || review.reviews.length === 0) && (
                        <div className="col-span-2 text-center py-10 text-gray-500 border border-dashed border-gray-800 rounded-lg">
                            Chưa có đánh giá nào cho nhà hàng này. Hãy trở thành người đầu tiên đánh giá!
                        </div>
                    )}
                </div>
            </section>

            <ReviewModal 
                open={openReviewModal} 
                handleClose={handleCloseReviewModal} 
                restaurantId={id} 
                reviewToEdit={selectedReviewToEdit}
                onSuccess={() => {
                    dispatch(getRestaurantReviews({ restaurantId: id }));
                    dispatch(getRestaurantById({ jwt, restaurantId: id }));
                }} 
            />

            {/* Dialog xác nhận xóa đánh giá thiết kế đẹp mắt */}
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
        </div>
    );
};