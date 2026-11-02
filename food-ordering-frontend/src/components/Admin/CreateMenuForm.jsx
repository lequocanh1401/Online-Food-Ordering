import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, IconButton, CircularProgress, Box, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Chip } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImageToCloudinary } from '../util/uploadToCloudinary';
import { useDispatch, useSelector } from 'react-redux';
import { createMenuItem } from '../../State/Menu/Action';
import { getIngredientsOfRestaurant } from '../../State/Ingredients/Action';
import { getRestaurantsCategory } from '../../State/Restaurant/Action';

const initialValues = {
    name: "", description: "", price: "", category: "", ingredients: []
};

export const CreateMenuForm = () => {
    const navigate = useNavigate();
    const [uploadImage, setUploadImage] = useState(false);
    const [images, setImages] = useState([]);

    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    // 👇 Cách lấy dữ liệu chuẩn tránh lỗi màu vàng Redux
    const restaurant = useSelector(store => store.restaurant);
    const ingredients = useSelector(store => store.ingredients);

    useEffect(() => {
        if (restaurant.usersRestaurant?.id) {
            dispatch(getIngredientsOfRestaurant({ id: restaurant.usersRestaurant.id, jwt }));
            dispatch(getRestaurantsCategory({ restaurantId: restaurant.usersRestaurant.id, jwt }));
        }
    }, [dispatch, jwt, restaurant.usersRestaurant?.id]);

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            // 👇 Tự động tìm nguyên 1 Object danh mục khớp với tên bạn đã chọn
            const selectedCategory = restaurant.categories?.find(cat => cat.name === values.category);

            const reqData = {
                name: values.name,
                description: values.description,
                price: Number(values.price), // Ép chuẩn định dạng số cho Java
                category: selectedCategory, // Gửi nguyên Object danh mục xuống
                ingredients: values.ingredients,
                seasonal: false,
                vegetarian: false,
                images: images,
                restaurantId: restaurant.usersRestaurant?.id
            };
            console.log("Đang gửi API Tạo Món Ăn (Đã vá lỗi):", reqData);
            dispatch(createMenuItem({ menu: reqData, jwt }));
            formik.resetForm();
            setImages([]);
            navigate("/admin/restaurant/menu");
        }
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadImage(true);
            try {
                const url = await uploadImageToCloudinary(file);
                setImages((prev) => [...prev, url]);
            } catch (error) {
                console.error("Lỗi úp ảnh:", error);
            } finally {
                setUploadImage(false);
            }
        }
    };

    const handleRemoveImage = (index) => setImages(images.filter((_, i) => i !== index));

    return (
        <div className='py-10 px-5 lg:px-20 min-h-screen text-white'>
            <div className='max-w-3xl mx-auto bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl'>
                <h1 className='text-3xl font-bold text-center mb-8 text-gray-100'>Thêm Món Ăn Mới</h1>
                <form onSubmit={formik.handleSubmit} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Khối ảnh món */}
                        <div className='md:col-span-2 flex flex-wrap gap-5 items-center'>
                            <input accept='image/*' id='menuFileInput' style={{ display: 'none' }} type='file' onChange={handleImageChange} />
                            <label htmlFor='menuFileInput'>
                                <span className='w-24 h-24 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-md hover:border-gray-400 bg-gray-800 transition-colors'>
                                    {uploadImage ? <CircularProgress size={24} color="inherit" /> : <><AddPhotoAlternateIcon className='text-gray-400' /><span className='text-xs text-gray-400 mt-1'>Ảnh món</span></>}
                                </span>
                            </label>
                            <div className='flex flex-wrap gap-3'>
                                {images.map((imgUrl, index) => (
                                    <div key={index} className='relative w-24 h-24 border border-gray-700 rounded-md overflow-hidden'>
                                        <img src={imgUrl} alt="food" className='w-full h-full object-cover' />
                                        <IconButton size='small' onClick={() => handleRemoveImage(index)} sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tên món và Giá tiền */}
                        <div>
                            <TextField fullWidth label="Tên món ăn" name="name" value={formik.values.name} onChange={formik.handleChange} required />
                        </div>
                        <div>
                            <TextField fullWidth label="Giá tiền (VND)" name="price" type="number" value={formik.values.price} onChange={formik.handleChange} required />
                        </div>

                        {/* Danh mục món ăn do quán tự quản lý */}
                        <div className='md:col-span-2'>
                            <FormControl fullWidth required>
                                <InputLabel id="category-select-label">Danh mục món ăn</InputLabel>
                                <Select labelId="category-select-label" name="category" value={formik.values.category} label="Danh mục món ăn" onChange={formik.handleChange}>
                                    {restaurant.categories?.map((item) => (
                                        <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Mô tả chi tiết - Chiếm trọn 2 cột */}
                        <div className='md:col-span-2'>
                            <TextField fullWidth multiline rows={2} label="Mô tả chi tiết món ăn" name="description" value={formik.values.description} onChange={formik.handleChange} required />
                        </div>

                        {/* Nguyên liệu kèm theo - Chiếm trọn 2 cột để chứa chip thoải mái */}
                        <div className='md:col-span-2'>
                            <FormControl fullWidth>
                                <InputLabel id="ingredients-select-label">Nguyên liệu kèm theo (Topping / Định lượng)</InputLabel>
                                <Select
                                    labelId="ingredients-select-label"
                                    multiple
                                    name="ingredients"
                                    value={formik.values.ingredients}
                                    onChange={formik.handleChange}
                                    input={<OutlinedInput label="Nguyên liệu kèm theo (Topping / Định lượng)" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => <Chip key={value?.id || value} label={value?.name || value} sx={{ bgcolor: 'rgba(236, 72, 153, 0.2)', color: 'white' }} />)}
                                        </Box>
                                    )}
                                >
                                    {ingredients.ingredients?.filter((item) => item.inStoke).map((item) => (
                                        <MenuItem key={item.id} value={item}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className='pt-6 flex justify-center gap-4'>
                        <Button 
                            variant='outlined' 
                            size='large' 
                            onClick={() => navigate("/admin/restaurant/menu")}
                            sx={{ color: '#9ca3af', borderColor: '#4b5563', px: 4 }}
                        >
                            Quay lại Thực Đơn
                        </Button>
                        <Button 
                            variant='contained' 
                            type='submit' 
                            size='large' 
                            sx={{ bgcolor: '#ec4899', '&:hover': { bgcolor: '#db2777' }, px: 5, py: 1.5, fontWeight: 'bold' }}
                        >
                            Thêm Vào Thực Đơn
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};