import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, Modal, Box, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateRestaurantAction } from '../../State/Restaurant/Action';
import { CUISINE_OPTIONS, ALL_CUISINE_DROPDOWN_OPTIONS, OTHER_CUISINE_OPTION } from '../../config/cuisineConfig';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
    outline: 'none'
};

export const RestaurantDetails = () => {
    const { restaurant } = useSelector(store => store);
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    const [editOpen, setEditOpen] = useState(false);
    const [selectedCuisine, setSelectedCuisine] = useState("");
    const [customCuisine, setCustomCuisine] = useState("");
    const [formState, setFormState] = useState({
        name: "",
        description: "",
        cuisineType: "",
        openingHours: "",
        streetAddress: "",
        city: "",
        postalCode: "",
        country: "",
        stateProvince: "",
        email: "",
        mobile: "",
        instagram: "",
        twitter: "",
        imagesText: ""
    });


    const handleEditClick = () => {
        const res = restaurant.usersRestaurant;
        const currentCuisine = res?.cuisineType || "";
        if (currentCuisine && !CUISINE_OPTIONS.includes(currentCuisine)) {
            setSelectedCuisine(OTHER_CUISINE_OPTION);
            setCustomCuisine(currentCuisine);
        } else {
            setSelectedCuisine(currentCuisine);
            setCustomCuisine("");
        }

        setFormState({
            name: res?.name || "",
            description: res?.description || "",
            cuisineType: currentCuisine,
            openingHours: res?.openingHours || "",
            streetAddress: res?.address?.streetAddress || "",
            city: res?.address?.city || "",
            postalCode: res?.address?.postalCode || "",
            country: res?.address?.country || "",
            stateProvince: res?.address?.stateProvince || "",
            email: res?.contactInformation?.email || "",
            mobile: res?.contactInformation?.mobile || "",
            instagram: res?.contactInformation?.instagram || "",
            twitter: res?.contactInformation?.twitter || "",
            imagesText: res?.images ? res.images.join("\n") : ""
        });
        setEditOpen(true);
    };

    const handleFormChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleCuisineSelectChange = (e) => {
        const val = e.target.value;
        setSelectedCuisine(val);
        if (val === OTHER_CUISINE_OPTION) {
            setFormState(prev => ({ ...prev, cuisineType: customCuisine }));
        } else {
            setFormState(prev => ({ ...prev, cuisineType: val }));
        }
    };

    const handleCustomCuisineChange = (e) => {
        const val = e.target.value;
        setCustomCuisine(val);
        setFormState(prev => ({ ...prev, cuisineType: val }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalCuisine = selectedCuisine === OTHER_CUISINE_OPTION 
            ? customCuisine.trim() 
            : (formState.cuisineType || selectedCuisine);

        if (!finalCuisine) {
            alert("Vui lòng chọn hoặc nhập loại ẩm thực!");
            return;
        }

        const reqData = {
            name: formState.name,
            description: formState.description,
            cuisineType: finalCuisine,
            openingHours: formState.openingHours,
            address: {
                streetAddress: formState.streetAddress,
                city: formState.city,
                postalCode: formState.postalCode,
                country: formState.country,
                stateProvince: formState.stateProvince
            },
            contactInformation: {
                email: formState.email,
                mobile: formState.mobile,
                instagram: formState.instagram,
                twitter: formState.twitter
            },
            images: formState.imagesText.split("\n").map(img => img.trim()).filter(img => img !== "")
        };

        dispatch(updateRestaurantAction({
            restaurantId: restaurant.usersRestaurant?.id,
            reqData,
            jwt
        }));
        setEditOpen(false);
    };

    return (
        <div className='px-2 lg:px-20 pb-10 text-white'>
            <div className='py-5 flex justify-between items-center m-2'>
                <h1 className='text-2xl lg:text-5xl font-bold'>
                    {restaurant.usersRestaurant?.name}
                </h1>
                <div>
                    <Button
                        variant='contained'
                        onClick={handleEditClick}
                        size='large'
                        sx={{ backgroundColor: '#e91e63', '&:hover': { backgroundColor: '#c2185b' }, py: '0.85rem', px: '2rem', fontWeight: 600, borderRadius: '8px' }}
                    >
                        Chỉnh Sửa Thông Tin
                    </Button>
                </div>
            </div>
            <Grid container spacing={2} className='px-2'>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title={<span className='text-gray-400'>Chi Tiết Nhà Hàng</span>} />
                        <CardContent>
                            <div className='space-y-4 text-gray-200'>
                                <div className='flex items-center'>
                                    <p className='w-48 font-semibold text-gray-400'>Chủ sở hữu</p>
                                    <p>{restaurant.usersRestaurant?.owner?.fullName}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-48 font-semibold text-gray-400'>Tên Nhà Hàng</p>
                                    <p>{restaurant.usersRestaurant?.name}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-48 font-semibold text-gray-400'>Loại Ẩm Thực</p>
                                    <p>{restaurant.usersRestaurant?.cuisineType}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-48 font-semibold text-gray-400'>Giờ Mở Cửa</p>
                                    <p>{restaurant.usersRestaurant?.openingHours || "Chưa cập nhật"}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-48 font-semibold text-gray-400'>Mô Tả</p>
                                    <p>{restaurant.usersRestaurant?.description || "Chưa có mô tả"}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-48 font-semibold text-gray-400'>Nhận Đơn Online</p>
                                    <p>
                                        {restaurant.usersRestaurant?.open ? (
                                            <span className='px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold'>
                                                ● Đang nhận đơn
                                            </span>
                                        ) : (
                                            <span className='px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold'>
                                                ● Tạm ngưng nhận đơn
                                            </span>
                                        )}
                                    </p>
                                </div>
                                {restaurant.usersRestaurant?.images && restaurant.usersRestaurant.images.length > 0 && (
                                    <div className='flex flex-col gap-2 mt-4'>
                                        <p className='font-semibold text-gray-400'>Hình Ảnh Nhà Hàng</p>
                                        <div className='flex flex-wrap gap-3 mt-1'>
                                            {restaurant.usersRestaurant.images.map((imgUrl, i) => (
                                                <img key={i} src={imgUrl} alt="restaurant" className='w-32 h-24 object-cover rounded-md border border-gray-700' />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardHeader title={<span className='text-gray-400'>Địa Chỉ</span>} />
                        <CardContent>
                            <div className='space-y-4 text-gray-200'>
                                <div className='flex'>
                                    <p className='w-48 font-semibold text-gray-400'>Quốc Gia</p>
                                    <p>{restaurant.usersRestaurant?.address?.country}</p>
                                </div>
                                <div className='flex'>
                                    <p className='w-48 font-semibold text-gray-400'>Tỉnh / Thành Phố</p>
                                    <p>{restaurant.usersRestaurant?.address?.city}</p>
                                </div>
                                <div className='flex'>
                                    <p className='w-48 font-semibold text-gray-400'>Quận / Huyện</p>
                                    <p>{restaurant.usersRestaurant?.address?.stateProvince}</p>
                                </div>
                                <div className='flex'>
                                    <p className='w-48 font-semibold text-gray-400'>Mã Bưu Điện</p>
                                    <p>{restaurant.usersRestaurant?.address?.postalCode}</p>
                                </div>
                                <div className='flex'>
                                    <p className='w-48 font-semibold text-gray-400'>Địa Chỉ Chi Tiết</p>
                                    <p>{restaurant.usersRestaurant?.address?.streetAddress}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardHeader title={<span className='text-gray-400'>Thông Tin Liên Hệ</span>} />
                        <CardContent>
                            <div className='space-y-4 text-gray-200'>
                                <div className='flex'>
                                    <p className='w-48 font-semibold text-gray-400'>Email</p>
                                    <p>{restaurant.usersRestaurant?.contactInformation?.email}</p>
                                </div>
                                <div className='flex'>
                                    <p className='w-48 font-semibold text-gray-400'>Số Điện Thoại</p>
                                    <p>{restaurant.usersRestaurant?.contactInformation?.mobile}</p>
                                </div>
                                <div className='flex'>
                                    <p className='w-48 font-semibold text-gray-400'>Instagram</p>
                                    <p>{restaurant.usersRestaurant?.contactInformation?.instagram}</p>
                                </div>
                                <div className='flex'>
                                    <p className='w-48 font-semibold text-gray-400'>Facebook / Fanpage</p>
                                    <p>{restaurant.usersRestaurant?.contactInformation?.twitter}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Modal open={editOpen} onClose={() => setEditOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography id="edit-details-title" variant="h5" component="h2" align="center" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                        CẬP NHẬT THÔNG TIN NHÀ HÀNG
                    </Typography>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#10b981', mb: 2 }}>
                                THÔNG TIN CHUNG
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Tên nhà hàng" name="name" value={formState.name} onChange={handleFormChange} required />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel id="edit-cuisine-type-label">Loại ẩm thực</InputLabel>
                                        <Select
                                            labelId="edit-cuisine-type-label"
                                            id="edit-cuisine-type-select"
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
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Nhập loại ẩm thực cụ thể"
                                            placeholder="Ví dụ: Món Hàn Quốc, Món Thái, Đặc sản Tây Bắc..."
                                            value={customCuisine}
                                            onChange={handleCustomCuisineChange}
                                            helperText="Nhập tên loại ẩm thực nếu quán của bạn thuộc danh mục đặc biệt"
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Giờ mở cửa (VD: 9:00 AM - 10:00 PM)" name="openingHours" value={formState.openingHours} onChange={handleFormChange} required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth multiline rows={2} label="Mô tả" name="description" value={formState.description} onChange={handleFormChange} required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth multiline rows={3} label="Link ảnh nhà hàng (mỗi ảnh 1 dòng)" name="imagesText" value={formState.imagesText} onChange={handleFormChange} helperText="Dán các đường dẫn URL ảnh, cách nhau bằng dòng mới" />
                                </Grid>
                            </Grid>
                        </div>

                        <div>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#10b981', mb: 2 }}>
                                ĐỊA CHỈ
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Quốc gia" name="country" value={formState.country} onChange={handleFormChange} required />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Tỉnh / Thành phố" name="city" value={formState.city} onChange={handleFormChange} required />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Quận / Huyện" name="stateProvince" value={formState.stateProvince} onChange={handleFormChange} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Mã bưu điện" name="postalCode" value={formState.postalCode} onChange={handleFormChange} required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Địa chỉ chi tiết (Đường, số nhà)" name="streetAddress" value={formState.streetAddress} onChange={handleFormChange} required />
                                </Grid>
                            </Grid>
                        </div>

                        <div>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#10b981', mb: 2 }}>
                                THÔNG TIN LIÊN HỆ
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Email liên hệ" name="email" value={formState.email} onChange={handleFormChange} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Số điện thoại" name="mobile" value={formState.mobile} onChange={handleFormChange} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Instagram URL" name="instagram" value={formState.instagram} onChange={handleFormChange} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Facebook / Fanpage URL" name="twitter" value={formState.twitter} onChange={handleFormChange} />
                                </Grid>
                            </Grid>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <Button variant="outlined" fullWidth onClick={() => setEditOpen(false)} size="large">
                                Hủy bỏ
                            </Button>
                            <Button variant="contained" color="primary" type="submit" fullWidth size="large" sx={{ backgroundColor: '#e91e63', '&:hover': { backgroundColor: '#c2185b' } }}>
                                Lưu Thay Đổi
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};