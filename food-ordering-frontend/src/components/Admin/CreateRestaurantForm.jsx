import React, { useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Grid, IconButton, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImageToCloudinary } from '../util/uploadToCloudinary';
import { useDispatch } from 'react-redux';
import { createRestaurant } from '../../State/Restaurant/Action'; // Đảm bảo đường dẫn này chuẩn với máy bạn
import { ALL_CUISINE_DROPDOWN_OPTIONS, OTHER_CUISINE_OPTION } from '../../config/cuisineConfig';

const initialValues = {
    name: "", description: "", cuisineType: "", openingHours: "08:00 - 22:00",
    streetAddress: "", city: "", stateProvince: "", postalCode: "", country: "Vietnam",
    email: "", mobile: "", twitter: "", instagram: ""
};

export const CreateRestaurantForm = () => {
    const [uploadImage, setUploadImage] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState("");
    const [customCuisine, setCustomCuisine] = useState("");

    // Khai báo Redux và lấy Token
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            const finalCuisine = selectedCuisine === OTHER_CUISINE_OPTION 
                ? customCuisine.trim() 
                : (values.cuisineType || selectedCuisine);

            if (!finalCuisine) {
                alert("Vui lòng chọn hoặc nhập loại ẩm thực cho nhà hàng!");
                return;
            }

            const reqData = {
                name: values.name,
                description: values.description,
                cuisineType: finalCuisine,
                openingHours: values.openingHours,
                address: {
                    streetAddress: values.streetAddress, city: values.city, stateProvince: values.stateProvince, postalCode: values.postalCode, country: values.country
                },
                contactInformation: {
                    email: values.email, mobile: values.mobile, twitter: values.twitter, instagram: values.instagram
                },
                images: images
            };
            // Gọi API gửi dữ liệu xuống Backend
            console.log("Đang gửi API Tạo nhà hàng...");
            dispatch(createRestaurant({ data: reqData, token: jwt }));
        }
    });

    const handleCuisineSelectChange = (e) => {
        const val = e.target.value;
        setSelectedCuisine(val);
        if (val === OTHER_CUISINE_OPTION) {
            formik.setFieldValue("cuisineType", customCuisine.trim());
        } else {
            formik.setFieldValue("cuisineType", val);
        }
    };

    const handleCustomCuisineChange = (e) => {
        const val = e.target.value;
        setCustomCuisine(val);
        formik.setFieldValue("cuisineType", val);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadImage(true);
            try {
                const url = await uploadImageToCloudinary(file);
                setImages((prev) => [...prev, url]);
            } catch (error) {
                console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
            } finally {
                setUploadImage(false);
            }
        }
    };

    const handleRemoveImage = (index) => setImages(images.filter((_, i) => i !== index));

    return (
        <div className='py-10 px-5 lg:px-20 min-h-screen text-white'>
            <div className='max-w-3xl mx-auto bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-xl'>
                <h1 className='text-3xl font-bold text-center mb-8 text-gray-100'>Đăng Ký Mở Cửa Hàng Mới</h1>
                <form onSubmit={formik.handleSubmit} className='space-y-6'>
                    <Grid container spacing={3}>
                        <Grid item="true" xs={12} className='flex flex-wrap gap-5 items-center'>
                            <input accept='image/*' id='fileInput' style={{ display: 'none' }} type='file' onChange={handleImageChange} />
                            <label htmlFor='fileInput'>
                                <span className='w-24 h-24 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-md hover:border-gray-400 bg-gray-800 transition-colors'>
                                    {uploadImage ? <CircularProgress size={24} color="inherit" /> : <><AddPhotoAlternateIcon className='text-gray-400' /><span className='text-xs text-gray-400 mt-1'>Thêm ảnh</span></>}
                                </span>
                            </label>
                            <div className='flex flex-wrap gap-3'>
                                {images.map((imgUrl, index) => (
                                    <div key={index} className='relative w-24 h-24 border border-gray-700 rounded-md overflow-hidden'>
                                        <img src={imgUrl} alt="restaurant" className='w-full h-full object-cover' />
                                        <IconButton size='small' onClick={() => handleRemoveImage(index)} sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
                                    </div>
                                ))}
                            </div>
                        </Grid>
                        <Grid item="true" xs={12} lg={6}><TextField fullWidth label="Tên quán ăn" name="name" value={formik.values.name} onChange={formik.handleChange} /></Grid>
                        <Grid item="true" xs={12} lg={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="cuisine-type-label">Loại ẩm thực</InputLabel>
                                <Select
                                    labelId="cuisine-type-label"
                                    id="cuisine-type-select"
                                    value={selectedCuisine}
                                    label="Loại ẩm thực"
                                    onChange={handleCuisineSelectChange}
                                >
                                    {ALL_CUISINE_DROPDOWN_OPTIONS.map((cuisine) => (
                                        <MenuItem key={cuisine} value={cuisine}>
                                            {cuisine}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {selectedCuisine === OTHER_CUISINE_OPTION && (
                            <Grid item="true" xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Nhập loại ẩm thực cụ thể của quán"
                                    placeholder="Ví dụ: Món Hàn Quốc, Món Thái, Trà đạo..."
                                    value={customCuisine}
                                    onChange={handleCustomCuisineChange}
                                    helperText="Nhập tên loại ẩm thực nếu quán của bạn chưa có trong danh mục sẵn có"
                                />
                            </Grid>
                        )}
                        <Grid item="true" xs={12}><TextField fullWidth multiline rows={2} label="Mô tả quán" name="description" value={formik.values.description} onChange={formik.handleChange} /></Grid>
                        <Grid item="true" xs={12} lg={6}><TextField fullWidth label="Giờ hoạt động" name="openingHours" value={formik.values.openingHours} onChange={formik.handleChange} /></Grid>

                        <Grid item="true" xs={12} lg={6}><TextField fullWidth label="Đường / Phố" name="streetAddress" value={formik.values.streetAddress} onChange={formik.handleChange} /></Grid>
                        <Grid item="true" xs={12} lg={4}><TextField fullWidth label="Thành phố" name="city" value={formik.values.city} onChange={formik.handleChange} /></Grid>
                        <Grid item="true" xs={12} lg={4}><TextField fullWidth label="Tỉnh / Bang" name="stateProvince" value={formik.values.stateProvince} onChange={formik.handleChange} /></Grid>
                        <Grid item="true" xs={12} lg={4}><TextField fullWidth label="Mã bưu điện" name="postalCode" value={formik.values.postalCode} onChange={formik.handleChange} /></Grid>
                        <Grid item="true" xs={12}><TextField fullWidth label="Quốc gia" name="country" value={formik.values.country} onChange={formik.handleChange} /></Grid>

                        <Grid item="true" xs={12} lg={6}><TextField fullWidth label="Email liên hệ" name="email" value={formik.values.email} onChange={formik.handleChange} /></Grid>
                        <Grid item="true" xs={12} lg={6}><TextField fullWidth label="Số điện thoại" name="mobile" value={formik.values.mobile} onChange={formik.handleChange} /></Grid>
                        <Grid item="true" xs={12} lg={6}><TextField fullWidth label="Instagram Link" name="instagram" value={formik.values.instagram} onChange={formik.handleChange} /></Grid>
                        <Grid item="true" xs={12} lg={6}><TextField fullWidth label="Twitter Link" name="twitter" value={formik.values.twitter} onChange={formik.handleChange} /></Grid>
                    </Grid>
                    <div className='pt-4 text-center'>
                        <Button variant='contained' color='primary' type='submit' size='large' className='w-full lg:w-auto px-10 py-3 font-semibold text-lg'>Tạo Nhà Hàng</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};