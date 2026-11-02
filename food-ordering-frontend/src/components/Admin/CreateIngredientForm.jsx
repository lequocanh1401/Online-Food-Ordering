import React from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createIngredient } from '../../State/Ingredients/Action';

const style = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 440, bgcolor: '#111827', color: 'white', outline: 'none', boxShadow: 24, p: 4, borderRadius: '16px', border: '1px solid #1f2937' };

export const CreateIngredientForm = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { restaurant, ingredients } = useSelector(store => store);

    const formik = useFormik({
        initialValues: { 
            name: "", 
            categoryId: ""
        },
        onSubmit: (values) => {
            const data = {
                name: values.name.trim(),
                categoryId: values.categoryId,
                quantity: 100,
                unit: "phần",
                minThreshold: 0,
                restaurantId: restaurant.usersRestaurant?.id
            };
            dispatch(createIngredient({ data, jwt }));
            formik.resetForm();
            handleClose();
        }
    });

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <form onSubmit={formik.handleSubmit}>
                    <h2 className='text-white font-black text-center text-xl tracking-wide'>
                        THÊM TOPPING / NGUYÊN LIỆU MỚI
                    </h2>
                    <p className="text-xs text-gray-400 text-center mt-1 mb-6">
                        Tạo tùy chọn ăn kèm hoặc nguyên liệu để khách tùy biến khi đặt món
                    </p>

                    <TextField 
                        fullWidth 
                        id="name" 
                        name="name" 
                        label="Tên Topping / Nguyên liệu (VD: Trứng ốp la, Phô mai, Bò tái...)" 
                        variant="outlined" 
                        onChange={formik.handleChange} 
                        value={formik.values.name} 
                        sx={{ 
                            mb: 3,
                            '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.03)' }
                        }} 
                        required 
                    />
                    
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="category-label">Nhóm phân loại</InputLabel>
                        <Select 
                            labelId="category-label" 
                            id="categoryId" 
                            name="categoryId" 
                            value={formik.values.categoryId} 
                            label="Nhóm phân loại" 
                            onChange={formik.handleChange} 
                            required
                            sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
                        >
                            {ingredients.category?.map((item) => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-6 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        <Typography variant="caption" className="text-emerald-300">
                            Trạng thái mặc định: <strong>Đang sẵn sàng phục vụ (Còn hàng)</strong>. Quán có thể gạt công tắc tắt/bật bất cứ lúc nào.
                        </Typography>
                    </div>

                    <div className="flex gap-2">
                        <Button 
                            variant="outlined" 
                            onClick={handleClose} 
                            fullWidth 
                            sx={{ color: '#9ca3af', borderColor: '#374151', textTransform: 'none', borderRadius: '10px' }}
                        >
                            Hủy bỏ
                        </Button>
                        <Button 
                            variant="contained" 
                            type="submit" 
                            fullWidth 
                            sx={{ 
                                bgcolor: '#ec4899', 
                                '&:hover': { bgcolor: '#db2777' }, 
                                fontWeight: 'bold', 
                                textTransform: 'none',
                                borderRadius: '10px'
                            }}
                        >
                            Tạo Topping
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};