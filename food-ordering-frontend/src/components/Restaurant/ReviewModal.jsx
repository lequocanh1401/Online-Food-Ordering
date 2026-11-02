import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, Rating, TextField, Box, Typography, Alert, Chip, Avatar
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useDispatch } from 'react-redux';
import { createReview, updateReview } from '../../State/Review/Action';

export const ReviewModal = ({ 
    open, 
    handleClose, 
    restaurantId, 
    foodId: initialFoodId, 
    foodName: initialFoodName, 
    items = [], 
    reviewToEdit, 
    onSuccess 
}) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    const [selectedFoodId, setSelectedFoodId] = useState(initialFoodId || null);
    const [selectedFoodName, setSelectedFoodName] = useState(initialFoodName || "");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Đồng bộ rating, comment, và food khi mở modal hoặc khi có review cần sửa
    useEffect(() => {
        if (reviewToEdit) {
            setRating(reviewToEdit.rating || 5);
            setComment(reviewToEdit.comment || "");
            setSelectedFoodId(reviewToEdit.food?.id || null);
            setSelectedFoodName(reviewToEdit.food?.name || "");
        } else {
            setRating(5);
            setComment("");
            setSelectedFoodId(initialFoodId || null);
            setSelectedFoodName(initialFoodName || "");
        }
        setError(null);
    }, [open, reviewToEdit, initialFoodId, initialFoodName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const reviewData = {
            rating: rating,
            comment: comment
        };

        try {
            if (reviewToEdit) {
                await dispatch(updateReview({ reviewId: reviewToEdit.id, reviewData, jwt }));
            } else {
                await dispatch(createReview({ 
                    reviewData, 
                    jwt, 
                    restaurantId, 
                    foodId: selectedFoodId 
                }));
            }
            setComment("");
            setRating(5);
            if (onSuccess) onSuccess();
            handleClose();
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi không xác định.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#111827',
                    border: '1px solid #1f2937',
                    borderRadius: 4,
                    color: 'white',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
                }
            }}
        >
            <DialogTitle sx={{ borderBottom: '1px solid #1f2937', pb: 2 }} className="font-bold flex items-center gap-2">
                {reviewToEdit ? (
                    'Chỉnh sửa đánh giá'
                ) : selectedFoodId ? (
                    <>
                        <RestaurantMenuIcon sx={{ color: '#ec4899' }} />
                        <span className="truncate">Đánh Giá Món: <span className="text-pink-400">{selectedFoodName}</span></span>
                    </>
                ) : (
                    <>
                        <StorefrontIcon sx={{ color: '#ec4899' }} />
                        <span>Đánh Giá Nhà Hàng</span>
                    </>
                )}
            </DialogTitle>
            
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {error && (
                        <Alert severity="error" sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            {error}
                        </Alert>
                    )}

                    {/* Lựa chọn đánh giá Quán hoặc từng Món cụ thể trong đơn hàng */}
                    {!reviewToEdit && items && items.length > 0 && (
                        <div className="space-y-2 bg-gray-950/70 p-3 rounded-2xl border border-gray-800">
                            <Typography className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Bạn muốn đánh giá cho:
                            </Typography>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <Chip
                                    icon={<StorefrontIcon sx={{ fontSize: 16 }} />}
                                    label="Chung về nhà hàng"
                                    onClick={() => {
                                        setSelectedFoodId(null);
                                        setSelectedFoodName("");
                                    }}
                                    sx={{
                                        cursor: 'pointer',
                                        bgcolor: selectedFoodId === null ? '#ec4899' : '#1f2937',
                                        color: selectedFoodId === null ? '#ffffff' : '#9ca3af',
                                        fontWeight: 600,
                                        '&:hover': { bgcolor: selectedFoodId === null ? '#db2777' : '#374151' }
                                    }}
                                />
                                {items.map((it) => {
                                    if (!it.food) return null;
                                    const isSelected = selectedFoodId === it.food.id;
                                    return (
                                        <Chip
                                            key={it.id || it.food.id}
                                            avatar={
                                                it.food.images?.[0] ? (
                                                    <Avatar src={it.food.images[0]} alt={it.food.name} />
                                                ) : undefined
                                            }
                                            label={it.food.name}
                                            onClick={() => {
                                                setSelectedFoodId(it.food.id);
                                                setSelectedFoodName(it.food.name);
                                            }}
                                            sx={{
                                                cursor: 'pointer',
                                                bgcolor: isSelected ? '#ec4899' : '#1f2937',
                                                color: isSelected ? '#ffffff' : '#9ca3af',
                                                fontWeight: 600,
                                                '&:hover': { bgcolor: isSelected ? '#db2777' : '#374151' }
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Chọn số sao */}
                    <Box className="flex flex-col items-center gap-2 pt-1">
                        <Typography className="text-gray-400 font-medium text-sm">
                            Mức độ hài lòng của bạn:
                        </Typography>
                        <Rating
                            name="rating-select"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue || 5);
                            }}
                            size="large"
                            sx={{
                                fontSize: '2.5rem',
                                '& .MuiRating-iconFilled': {
                                    color: '#facc15',
                                },
                                '& .MuiRating-iconEmpty': {
                                    color: '#374151',
                                }
                            }}
                        />
                        <span className="text-xs font-bold text-amber-400">
                            {rating === 5 ? "Tuyệt vời ⭐⭐⭐⭐⭐" : rating === 4 ? "Rất ngon ⭐⭐⭐⭐" : rating === 3 ? "Bình thường ⭐⭐⭐" : rating === 2 ? "Chưa hài lòng ⭐⭐" : "Kém ⭐"}
                        </span>
                    </Box>

                    {/* Bình luận text */}
                    <TextField
                        label={selectedFoodId ? `Chia sẻ cảm nhận của bạn về món ${selectedFoodName}...` : "Chia sẻ trải nghiệm của bạn về nhà hàng..."}
                        multiline
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        fullWidth
                        variant="outlined"
                        required
                        placeholder="Món ăn rất ngon, giao nhanh nóng hổi, sẽ ủng hộ tiếp..."
                        InputLabelProps={{
                            sx: { color: '#9ca3af', '&.Mui-focused': { color: '#ec4899' } }
                        }}
                        InputProps={{
                            sx: {
                                color: 'white',
                                bgcolor: '#1f2937',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4b5563' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ec4899' }
                            }
                        }}
                    />
                </DialogContent>
                
                <DialogActions sx={{ borderTop: '1px solid #1f2937', px: 3, py: 2.5 }}>
                    <Button 
                        onClick={handleClose} 
                        sx={{ color: '#9ca3af', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={submitting}
                        sx={{ 
                            bgcolor: '#ec4899', 
                            '&:hover': { bgcolor: '#db2777' },
                            '&.Mui-disabled': { bgcolor: '#880e4f', color: '#9ca3af' },
                            fontWeight: 700,
                            borderRadius: '10px',
                            px: 3.5,
                            textTransform: 'none'
                        }}
                    >
                        {submitting ? "Đang gửi..." : (reviewToEdit ? "Cập nhật" : "Gửi đánh giá")}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
