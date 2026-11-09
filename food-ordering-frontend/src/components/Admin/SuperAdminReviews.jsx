import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRestaurantsAction } from '../../State/Restaurant/Action';
import { getRestaurantReviews, deleteReview } from '../../State/Review/Action';
import { 
    Box, Typography, FormControl, InputLabel, Select, MenuItem, Card, 
    Rating, IconButton, Divider, CircularProgress, Dialog, DialogTitle, 
    DialogContent, DialogContentText, DialogActions, Button, Chip 
} from '@mui/material';
import { Delete as DeleteIcon, RateReview as RateReviewIcon } from '@mui/icons-material';

export const SuperAdminReviews = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { restaurant, review } = useSelector(store => store);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
    const [loadingReviews, setLoadingReviews] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    useEffect(() => {
        if (jwt) {
            dispatch(getAllRestaurantsAction(jwt));
        }
    }, [jwt, dispatch]);

    const handleRestaurantChange = (e) => {
        const id = e.target.value;
        setSelectedRestaurantId(id);
        if (id) {
            setLoadingReviews(true);
            dispatch(getRestaurantReviews({ restaurantId: id }))
                .finally(() => setLoadingReviews(false));
        }
    };

    const handleDeleteReview = (reviewId) => {
        setSelectedReviewId(reviewId);
        setOpenConfirm(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteReview({ reviewId: selectedReviewId, jwt }))
            .then(() => {
                // Refresh reviews list
                if (selectedRestaurantId) {
                    dispatch(getRestaurantReviews({ restaurantId: selectedRestaurantId }));
                }
                setOpenConfirm(false);
                setSelectedReviewId(null);
            })
            .catch(err => {
                alert("Lỗi khi xóa đánh giá: " + err.message);
                setOpenConfirm(false);
            });
    };

    return (
        <Box className='p-6'>
            <Box className='mb-6'>
                <Typography variant='h4' className='font-bold flex items-center gap-2 text-white'>
                    <RateReviewIcon fontSize='large' className='text-pink-500' />
                    Quản Lý Đánh Giá Toàn Sàn
                </Typography>
                <Typography variant='body2' className='text-gray-400 mt-1'>
                    Xem và quản lý các đánh giá của khách hàng gửi cho nhà hàng trên toàn hệ thống.
                </Typography>
            </Box>

            <Card className='p-6 bg-gray-800 border border-gray-700 mb-6'>
                <FormControl fullWidth className='bg-gray-900 border-gray-700 text-white rounded'>
                    <InputLabel id="restaurant-select-label" style={{ color: '#9ca3af' }}>Chọn nhà hàng cần xem</InputLabel>
                    <Select
                        labelId="restaurant-select-label"
                        id="restaurant-select"
                        value={selectedRestaurantId}
                        label="Chọn nhà hàng cần xem"
                        onChange={handleRestaurantChange}
                        sx={{
                            color: 'white',
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: '#374151',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#e91e63',
                            },
                            '.MuiSvgIcon-root': {
                                color: '#9ca3af',
                            }
                        }}
                    >
                        <MenuItem value="">
                            <em>-- Vui lòng chọn một nhà hàng --</em>
                        </MenuItem>
                        {restaurant.restaurants && restaurant.restaurants.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {item.name} (ID: {item.id})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Card>

            {selectedRestaurantId && (
                <Box>
                    {loadingReviews ? (
                        <Box className='flex justify-center p-12'>
                            <CircularProgress color="secondary" />
                        </Box>
                    ) : (
                        <Box>
                            {/* Summary stats */}
                            <Box className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                                <Card className='p-6 bg-gray-800 border border-gray-700 flex flex-col items-center justify-center'>
                                    <Typography variant='h3' className='text-pink-500 font-bold'>
                                        {review.averageRating || 0.0} / 5
                                    </Typography>
                                    <Rating 
                                        value={review.averageRating || 0} 
                                        precision={0.1} 
                                        readOnly 
                                        className='my-2'
                                    />
                                    <Typography variant='caption' className='text-gray-400'>
                                        Điểm đánh giá trung bình
                                    </Typography>
                                </Card>

                                <Card className='p-6 bg-gray-800 border border-gray-700 flex flex-col items-center justify-center'>
                                    <Typography variant='h3' className='text-pink-500 font-bold'>
                                        {review.totalReviews || 0}
                                    </Typography>
                                    <Typography variant='body1' className='text-gray-200 font-semibold my-2'>
                                        Đánh giá nhận được
                                    </Typography>
                                    <Typography variant='caption' className='text-gray-400'>
                                        Tổng số đánh giá của khách hàng
                                    </Typography>
                                </Card>
                            </Box>

                            {/* Reviews list */}
                            <Typography variant='h5' className='font-bold mb-4 text-white'>
                                Danh sách phản hồi
                            </Typography>

                            <Box className='space-y-4'>
                                {review.reviews && review.reviews.length > 0 ? (
                                    review.reviews.map((item) => (
                                        <Card key={item.id} className='p-5 bg-gray-800 border border-gray-700 flex justify-between items-start gap-4'>
                                            <Box className='flex-1'>
                                                <Box className='flex items-center gap-3 mb-2'>
                                                    <Typography variant='subtitle1' className='text-pink-400 font-semibold'>
                                                        {item.customer?.fullName}
                                                    </Typography>
                                                    <Typography variant='caption' className='text-gray-500'>
                                                        {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "N/A"}
                                                    </Typography>
                                                </Box>
                                                <Rating value={item.rating} readOnly size="small" className='mb-2' />
                                                <Typography variant='body2' className='text-gray-200 leading-relaxed bg-gray-900/40 p-3 rounded border border-gray-700/50'>
                                                    {item.comment}
                                                </Typography>
                                                {item.food && (
                                                    <Box className='mt-2 flex items-center gap-1.5'>
                                                        <Chip 
                                                            label={`Món ăn: ${item.food.name}`} 
                                                            size="small" 
                                                            className='bg-pink-900/45 text-pink-300 border border-pink-700/30' 
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                            <IconButton 
                                                onClick={() => handleDeleteReview(item.id)}
                                                className='text-red-500 hover:bg-red-500/10 self-start'
                                                title='Xóa đánh giá này'
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Card>
                                    ))
                                ) : (
                                    <Card className='p-8 bg-gray-800 border border-gray-700 text-center text-gray-500'>
                                        Nhà hàng này chưa nhận được đánh giá nào.
                                    </Card>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
            {/* Dialog xác nhận xóa đánh giá */}
            <Dialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                PaperProps={{
                    style: { backgroundColor: '#1f2937', color: 'white' }
                }}
            >
                <DialogTitle className='border-b border-gray-700'>Xác nhận xóa đánh giá?</DialogTitle>
                <DialogContent className='mt-4'>
                    <DialogContentText style={{ color: '#d1d5db' }}>
                        Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='p-4 border-t border-gray-700'>
                    <Button onClick={() => setOpenConfirm(false)} style={{ color: '#9ca3af' }}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDelete} variant='contained' color='error'>
                        Xác Nhận Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
