import React, { useEffect, useState } from 'react';
import { 
    Box, Button, Grid, Modal, TextField, Card, CardMedia, CardContent, 
    Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, 
    DialogActions, FormControl, InputLabel, Select, MenuItem, Divider, Chip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createEventAction, getRestaurantsEvents, deleteEventAction, updateEventAction } from '../../State/Restaurant/Action';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const modalStyle = {
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)',
    width: 520, 
    maxWidth: '95vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: '#111827', 
    border: '1px solid #1f2937', 
    color: 'white', 
    outline: 'none', 
    boxShadow: 24, 
    p: 4, 
    borderRadius: '16px'
};

const initialValues = { 
    image: "", 
    location: "", 
    name: "", 
    startedAt: null, 
    endsAt: null,
    promoCode: "",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minimumOrderValue: 0
};

export const Events = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const restaurant = useSelector(store => store.restaurant);

    // Custom confirm delete modal states
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const handleDeleteClick = (id) => {
        setDeleteTargetId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteTargetId) {
            dispatch(deleteEventAction({ eventId: deleteTargetId, jwt }));
        }
        setConfirmOpen(false);
        setDeleteTargetId(null);
    };

    const [editOpen, setEditOpen] = useState(false);
    const [editEventId, setEditEventId] = useState(null);
    const [editForm, setEditForm] = useState({
        image: "",
        name: "",
        location: "",
        startedAt: null,
        endsAt: null,
        promoCode: "",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minimumOrderValue: 0
    });

    useEffect(() => {
        if (restaurant.usersRestaurant?.id) {
            dispatch(getRestaurantsEvents({
                restaurantId: restaurant.usersRestaurant.id,
                jwt: jwt
            }));
        }
    }, [dispatch, jwt, restaurant.usersRestaurant?.id]);

    const handleEditClick = (eventItem) => {
        setEditEventId(eventItem.id);
        setEditForm({
            image: eventItem.image || "",
            name: eventItem.name || "",
            location: eventItem.location || "",
            startedAt: eventItem.startedAt ? dayjs(eventItem.startedAt) : null,
            endsAt: eventItem.endsAt ? dayjs(eventItem.endsAt) : null,
            promoCode: eventItem.promoCode || "",
            discountType: eventItem.discountType || "PERCENTAGE",
            discountValue: eventItem.discountValue !== undefined ? eventItem.discountValue : 15,
            minimumOrderValue: eventItem.minimumOrderValue !== undefined ? eventItem.minimumOrderValue : 0
        });
        setEditOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const data = {
            image: editForm.image,
            name: editForm.name,
            location: editForm.location,
            startedAt: editForm.startedAt ? dayjs(editForm.startedAt).format("MMMM DD, YYYY hh:mm A") : "",
            endsAt: editForm.endsAt ? dayjs(editForm.endsAt).format("MMMM DD, YYYY hh:mm A") : "",
            promoCode: editForm.promoCode ? editForm.promoCode.trim().toUpperCase() : "",
            discountType: editForm.discountType || "PERCENTAGE",
            discountValue: Number(editForm.discountValue) || 0,
            minimumOrderValue: Number(editForm.minimumOrderValue) || 0
        };

        dispatch(updateEventAction({
            eventId: editEventId,
            data,
            jwt,
            restaurantId: restaurant.usersRestaurant?.id
        }));

        setEditOpen(false);
        setEditEventId(null);
    };

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            const data = {
                image: values.image,
                location: values.location,
                name: values.name,
                startedAt: values.startedAt ? dayjs(values.startedAt).format("MMMM DD, YYYY hh:mm A") : "",
                endsAt: values.endsAt ? dayjs(values.endsAt).format("MMMM DD, YYYY hh:mm A") : "",
                promoCode: values.promoCode ? values.promoCode.trim().toUpperCase() : "",
                discountType: values.discountType || "PERCENTAGE",
                discountValue: Number(values.discountValue) || 0,
                minimumOrderValue: Number(values.minimumOrderValue) || 0
            };

            dispatch(createEventAction({
                data,
                jwt,
                restaurantId: restaurant.usersRestaurant?.id
            }));

            formik.resetForm();
            handleClose();
        }
    });

    return (
        <div className='p-6 min-h-screen text-white'>
            <div className='flex justify-between items-center mb-6'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-100'>Quản Lý Sự Kiện & Khuyến Mãi</h1>
                    <p className='text-sm text-gray-400 mt-1'>Tạo các sự kiện ưu đãi trực tuyến kèm mã giảm giá độc quyền cho quán của bạn</p>
                </div>
                <Button 
                    onClick={handleOpen} 
                    variant='contained' 
                    startIcon={<LocalOfferIcon />}
                    sx={{ 
                        bgcolor: '#e91e63', 
                        '&:hover': { bgcolor: '#c2185b' }, 
                        fontWeight: 600, 
                        borderRadius: '10px',
                        px: 3,
                        py: 1
                    }}
                >
                    Tạo Sự Kiện & Mã Ưu Đãi
                </Button>
            </div>

            {/* Modal Tạo Sự Kiện Mới */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <form onSubmit={formik.handleSubmit}>
                        <h2 className='text-white font-bold text-center text-xl pb-2'>TẠO SỰ KIỆN & MÃ ƯU ĐÃI QUÁN</h2>
                        <p className='text-gray-400 text-xs text-center pb-5'>Sự kiện sẽ phát hành mã giảm giá online tương ứng cho khách đặt món tại quán</p>
                        
                        <Grid container spacing={2.5}>
                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth 
                                    label="Tên sự kiện / Chiến dịch" 
                                    name="name" 
                                    placeholder="VD: COMBO CƠM TẤM ƯU ĐÃI – GIẢM 15%"
                                    value={formik.values.name} 
                                    onChange={formik.handleChange} 
                                    required 
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth 
                                    label="Link ảnh banner sự kiện (URL)" 
                                    name="image" 
                                    placeholder="https://images.pexels.com/..."
                                    value={formik.values.image} 
                                    onChange={formik.handleChange} 
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth 
                                    label="Khu vực áp dụng / Giao hàng" 
                                    name="location" 
                                    placeholder="VD: Toàn chi nhánh Hà Nội hoặc Giao hàng trực tuyến"
                                    value={formik.values.location} 
                                    onChange={formik.handleChange} 
                                    required 
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker 
                                        label="Thời gian bắt đầu" 
                                        value={formik.values.startedAt} 
                                        onChange={(newValue) => formik.setFieldValue("startedAt", newValue)} 
                                        sx={{ width: '100%' }} 
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker 
                                        label="Thời gian kết thúc" 
                                        value={formik.values.endsAt} 
                                        onChange={(newValue) => formik.setFieldValue("endsAt", newValue)} 
                                        sx={{ width: '100%' }} 
                                    />
                                </LocalizationProvider>
                            </Grid>

                            {/* Khối Mã Giảm Giá Đính Kèm Sự Kiện */}
                            <Grid item xs={12}>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
                                <Typography variant="subtitle2" sx={{ color: '#ec4899', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ConfirmationNumberIcon fontSize="small" /> Mã giảm giá online đính kèm sự kiện
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Mã giảm giá (Tự tạo)"
                                    name="promoCode"
                                    placeholder="VD: COMTAM15"
                                    value={formik.values.promoCode}
                                    onChange={(e) => formik.setFieldValue("promoCode", e.target.value.toUpperCase())}
                                    helperText="Khách hàng sẽ dán mã này ở giỏ hàng"
                                    FormHelperTextProps={{ sx: { color: '#6b7280' } }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="create-discount-type">Loại giảm giá</InputLabel>
                                    <Select
                                        labelId="create-discount-type"
                                        label="Loại giảm giá"
                                        name="discountType"
                                        value={formik.values.discountType}
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="PERCENTAGE">Giảm theo %</MenuItem>
                                        <MenuItem value="FLAT">Giảm tiền mặt (VNĐ)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label={formik.values.discountType === "PERCENTAGE" ? "Mức giảm (%)" : "Mức giảm (VNĐ)"}
                                    name="discountValue"
                                    value={formik.values.discountValue}
                                    onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Đơn tối thiểu (VNĐ)"
                                    name="minimumOrderValue"
                                    placeholder="0"
                                    value={formik.values.minimumOrderValue}
                                    onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} className="pt-3">
                                <Button 
                                    variant="contained" 
                                    type="submit" 
                                    fullWidth 
                                    size='large'
                                    sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' }, fontWeight: 600, py: 1.2, borderRadius: '10px' }}
                                >
                                    Phát Hành Sự Kiện & Mã Ưu Đãi
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>

            {/* Modal Chỉnh Sửa Sự Kiện */}
            <Modal open={editOpen} onClose={() => setEditOpen(false)}>
                <Box sx={modalStyle}>
                    <form onSubmit={handleEditSubmit}>
                        <h2 className='text-white font-bold text-center text-xl pb-2'>CẬP NHẬT SỰ KIỆN & MÃ ƯU ĐÃI</h2>
                        <p className='text-gray-400 text-xs text-center pb-5'>Chỉnh sửa thông tin chiến dịch và mã giảm giá tương ứng</p>

                        <Grid container spacing={2.5}>
                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth 
                                    label="Tên sự kiện" 
                                    value={editForm.name} 
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                                    required 
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth 
                                    label="Link ảnh sự kiện (URL)" 
                                    value={editForm.image} 
                                    onChange={(e) => setEditForm({...editForm, image: e.target.value})} 
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth 
                                    label="Khu vực áp dụng" 
                                    value={editForm.location} 
                                    onChange={(e) => setEditForm({...editForm, location: e.target.value})} 
                                    required 
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker 
                                        label="Ngày bắt đầu" 
                                        value={editForm.startedAt} 
                                        onChange={(newValue) => setEditForm({...editForm, startedAt: newValue})} 
                                        sx={{ width: '100%' }} 
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker 
                                        label="Ngày kết thúc" 
                                        value={editForm.endsAt} 
                                        onChange={(newValue) => setEditForm({...editForm, endsAt: newValue})} 
                                        sx={{ width: '100%' }} 
                                    />
                                </LocalizationProvider>
                            </Grid>

                            {/* Khối Mã Giảm Giá Đính Kèm */}
                            <Grid item xs={12}>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
                                <Typography variant="subtitle2" sx={{ color: '#ec4899', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ConfirmationNumberIcon fontSize="small" /> Mã giảm giá online đính kèm
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Mã giảm giá"
                                    value={editForm.promoCode}
                                    onChange={(e) => setEditForm({...editForm, promoCode: e.target.value.toUpperCase()})}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="edit-discount-type">Loại giảm giá</InputLabel>
                                    <Select
                                        labelId="edit-discount-type"
                                        label="Loại giảm giá"
                                        value={editForm.discountType}
                                        onChange={(e) => setEditForm({...editForm, discountType: e.target.value})}
                                    >
                                        <MenuItem value="PERCENTAGE">Giảm theo %</MenuItem>
                                        <MenuItem value="FLAT">Giảm tiền mặt (VNĐ)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label={editForm.discountType === "PERCENTAGE" ? "Mức giảm (%)" : "Mức giảm (VNĐ)"}
                                    value={editForm.discountValue}
                                    onChange={(e) => setEditForm({...editForm, discountValue: e.target.value})}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Đơn tối thiểu (VNĐ)"
                                    value={editForm.minimumOrderValue}
                                    onChange={(e) => setEditForm({...editForm, minimumOrderValue: e.target.value})}
                                />
                            </Grid>

                            <Grid item xs={12} className="pt-3">
                                <Button 
                                    variant="contained" 
                                    type="submit" 
                                    fullWidth 
                                    size='large'
                                    sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' }, fontWeight: 600, py: 1.2, borderRadius: '10px' }}
                                >
                                    Lưu Thay Đổi
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>

            {/* Danh Sách Sự Kiện Hiện Tại Của Quán */}
            {restaurant.events && restaurant.events.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
                    {restaurant.events.map((item) => (
                        <Card 
                            key={item.id} 
                            sx={{ 
                                bgcolor: '#111827', 
                                border: '1px solid #1f2937', 
                                borderRadius: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}
                        >
                            <CardMedia 
                                sx={{ height: 160 }} 
                                image={item.image || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"} 
                                title={item.name} 
                            />
                            <CardContent className='flex-1 flex flex-col justify-between p-5 space-y-3'>
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <Typography variant="h6" className='text-gray-100 font-bold line-clamp-2' sx={{ lineHeight: 1.3 }}>
                                            {item.name}
                                        </Typography>
                                        <Box className="flex gap-1 ml-2">
                                            <IconButton onClick={() => handleEditClick(item)} sx={{ color: '#60a5fa' }} size="small">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(item.id)} color="error" size="small">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </div>

                                    {/* Khối Mã Ưu Đãi Đính Kèm */}
                                    {item.promoCode && (
                                        <div className='my-3 p-2.5 bg-gray-800/80 border border-dashed border-pink-500/60 rounded-xl flex items-center justify-between'>
                                            <div className='flex items-center gap-2'>
                                                <ConfirmationNumberIcon sx={{ fontSize: '1.1rem', color: '#ec4899' }} />
                                                <div>
                                                    <p className='text-xs font-bold text-pink-400 tracking-wider'>{item.promoCode}</p>
                                                    <p className='text-[11px] text-gray-400'>
                                                        {item.discountType === "PERCENTAGE" ? `Giảm ${item.discountValue}%` : `Giảm ${Number(item.discountValue || 0).toLocaleString()} đ`} (Đơn từ {Number(item.minimumOrderValue || 0).toLocaleString()} đ)
                                                    </p>
                                                </div>
                                            </div>
                                            <Chip label="Đang hoạt động" size="small" sx={{ bgcolor: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600, fontSize: '0.7rem' }} />
                                        </div>
                                    )}

                                    <Typography variant="body2" className='text-gray-400 text-xs'>
                                        <strong>Khu vực:</strong> {item.location}
                                    </Typography>
                                </div>

                                <div className='pt-2 border-t border-gray-800 text-xs text-gray-500 space-y-1'>
                                    <p>📅 Bắt đầu: {item.startedAt}</p>
                                    <p>⌛ Kết thúc: {item.endsAt}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Box className="flex flex-col items-center justify-center py-24 text-gray-400 bg-gray-900/30 border border-gray-800 rounded-2xl">
                    <EventAvailableIcon sx={{ fontSize: 72, color: '#4b5563', mb: 2 }} />
                    <Typography variant="h6" className="text-gray-300 font-semibold mb-1">
                        Quán chưa phát hành sự kiện hay mã ưu đãi nào
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 text-center max-w-md">
                        Bấm vào nút "Tạo Sự Kiện & Mã Ưu Đãi" ở trên để tạo chiến dịch giảm giá giúp thu hút khách đặt món online.
                    </Typography>
                </Box>
            )}

            {/* Custom confirm delete Dialog */}
            <Dialog 
                open={confirmOpen} 
                onClose={() => setConfirmOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#111827',
                        color: 'white',
                        border: '1px solid #1f2937',
                        borderRadius: '16px',
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold' }}>
                    <WarningIcon sx={{ color: '#f87171' }} />
                    Xác Nhận Xóa Sự Kiện
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#9ca3af' }}>
                        Bạn có chắc chắn muốn xóa sự kiện này không? Mã giảm giá đính kèm sự kiện cũng sẽ bị xóa.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button onClick={() => setConfirmOpen(false)} sx={{ color: '#9ca3af', '&:hover': { color: 'white' } }}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="contained" sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, fontWeight: 600 }}>
                        Xác Nhận Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};