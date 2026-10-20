import React from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createIngredient } from '../../State/Ingredients/Action';

const style = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 420, bgcolor: '#1f2937', color: 'white', outline: 'none', boxShadow: 24, p: 4, borderRadius: '12px' };

export const CreateIngredientForm = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { restaurant, ingredients } = useSelector(store => store);

    const formik = useFormik({
        initialValues: { 
            name: "", 
            categoryId: "",
            quantity: 50,
            unit: "phần",
            minThreshold: 10
        },
        onSubmit: (values) => {
            const data = {
                name: values.name,
                categoryId: values.categoryId,
                quantity: Number(values.quantity) || 50,
                unit: values.unit || "phần",
                minThreshold: Number(values.minThreshold) || 10,
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
                    <h1 className='text-white font-bold text-center text-xl pb-6'>THÊM NGUYÊN LIỆU MỚI</h1>
                    <TextField fullWidth id="name" name="name" label="Tên nguyên liệu (VD: Thịt Bò, Bánh Phở...)" variant="outlined" onChange={formik.handleChange} value={formik.values.name} sx={{ mb: 2.5 }} required />
                    
                    <FormControl fullWidth sx={{ mb: 2.5 }}>
                        <InputLabel id="category-label">Danh mục</InputLabel>
                        <Select labelId="category-label" id="categoryId" name="categoryId" value={formik.values.categoryId} label="Danh mục" onChange={formik.handleChange} required>
                            {/* Lấy các Danh mục thật vừa tạo đắp vào Menu xổ xuống */}
                            {ingredients.category?.map((item) => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div className="grid grid-cols-2 gap-3 mb-2.5">
                        <TextField 
                            fullWidth 
                            id="quantity" 
                            name="quantity" 
                            label="Số lượng ban đầu" 
                            type="number" 
                            variant="outlined" 
                            onChange={formik.handleChange} 
                            value={formik.values.quantity} 
                        />
                        <TextField 
                            fullWidth 
                            id="unit" 
                            name="unit" 
                            label="Đơn vị tính (kg, g, phần...)" 
                            variant="outlined" 
                            onChange={formik.handleChange} 
                            value={formik.values.unit} 
                        />
                    </div>

                    <TextField 
                        fullWidth 
                        id="minThreshold" 
                        name="minThreshold" 
                        label="Ngưỡng cảnh báo an toàn tối thiểu" 
                        type="number" 
                        variant="outlined" 
                        helperText="Khi tồn kho <= ngưỡng này, hệ thống sẽ tự động phát cảnh báo cạn kho"
                        FormHelperTextProps={{ sx: { color: '#9ca3af', fontSize: '0.75rem' } }}
                        onChange={formik.handleChange} 
                        value={formik.values.minThreshold} 
                        sx={{ mb: 2 }} 
                    />

                    <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }} fullWidth size='large'>Tạo Nguyên Liệu</Button>
                </form>
            </Box>
        </Modal>
    );
};