import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Card, CardContent, Typography, Box, Divider, TextField, Button, 
    IconButton, Dialog, DialogActions, DialogContent, DialogContentText, 
    DialogTitle, Chip, Tooltip, FormControlLabel, Checkbox, Snackbar, Alert 
} from '@mui/material';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';

import { addUserAddress, deleteUserAddress, updateUserAddress } from '../../State/Authentication/Action';

export const Address = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    
    // Rút thông tin user từ Redux store
    const auth = useSelector(store => store.auth);
    const addresses = auth.user?.addresses || [];

    // State cho ID địa chỉ mặc định (lưu trữ đồng bộ LocalStorage)
    const [defaultAddressId, setDefaultAddressId] = useState(() => {
        try {
            const saved = localStorage.getItem("default_address_id");
            return saved ? Number(saved) : null;
        } catch {
            return null;
        }
    });

    // Metadata địa chỉ (Nhãn Nhà riêng / Văn phòng, Ghi chú giao hàng)
    const [addressMetadata, setAddressMetadata] = useState(() => {
        try {
            const saved = localStorage.getItem("address_metadata");
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    // Tự động gán địa chỉ đầu tiên làm mặc định nếu chưa thiết lập
    useEffect(() => {
        if (addresses.length > 0) {
            const exists = addresses.some(a => a.id === defaultAddressId);
            if (!defaultAddressId || !exists) {
                const firstId = addresses[0].id;
                setDefaultAddressId(firstId);
                localStorage.setItem("default_address_id", String(firstId));
            }
        }
    }, [addresses, defaultAddressId]);

    // State cho chế độ sửa địa chỉ
    const [editAddressId, setEditAddressId] = useState(null);

    // State cho Dialog xác nhận xóa
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [addressIdToDelete, setAddressIdToDelete] = useState(null);

    // Toast phản hồi
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // State cho Form nhập địa chỉ
    const [formData, setFormData] = useState({
        streetAddress: '',
        city: '',
        stateProvince: '',
        postalCode: '10000',
        country: 'Vietnam',
        label: 'HOME', // 'HOME' | 'OFFICE' | 'OTHER'
        deliveryNote: '',
        isDefault: false
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Chọn nhãn địa chỉ (Nhà riêng / Văn phòng / Khác)
    const handleSelectLabel = (lbl) => {
        setFormData(prev => ({ ...prev, label: lbl }));
    };

    // Thiết lập một địa chỉ làm Mặc định
    const handleSetDefaultAddress = (addressId, e) => {
        if (e) e.stopPropagation();
        setDefaultAddressId(addressId);
        try {
            localStorage.setItem("default_address_id", String(addressId));
            window.dispatchEvent(new Event("default_address_changed"));
        } catch (err) {
            console.error("Lỗi lưu default address:", err);
        }
        setSnackbar({ open: true, message: 'Đã đặt làm địa chỉ giao hàng mặc định!', severity: 'success' });
    };

    // Helper lấy nhãn hiển thị và icon
    const getAddressDisplayLabel = (addr, index) => {
        const meta = addressMetadata[addr.id];
        let labelType = meta?.label;

        // Fallback thông minh: địa chỉ đầu tiên là Nhà riêng, thứ hai là Văn phòng
        if (!labelType) {
            labelType = index === 0 ? 'HOME' : index === 1 ? 'OFFICE' : 'OTHER';
        }

        switch (labelType) {
            case 'HOME':
                return {
                    name: 'Nhà riêng',
                    icon: <HomeIcon fontSize="small" />,
                    chipColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                };
            case 'OFFICE':
                return {
                    name: 'Văn phòng / Công ty',
                    icon: <ApartmentIcon fontSize="small" />,
                    chipColor: 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                };
            default:
                return {
                    name: 'Địa chỉ khác',
                    icon: <LocationOnIcon fontSize="small" />,
                    chipColor: 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                };
        }
    };

    // Bấm nút sửa địa chỉ
    const handleEditClick = (addr, index) => {
        setEditAddressId(addr.id);
        const meta = addressMetadata[addr.id] || {};
        const fallbackLabel = index === 0 ? 'HOME' : index === 1 ? 'OFFICE' : 'OTHER';

        setFormData({
            streetAddress: addr.streetAddress || '',
            city: addr.city || '',
            stateProvince: addr.stateProvince || addr.state || '',
            postalCode: addr.postalCode || '10000',
            country: addr.country || 'Vietnam',
            label: meta.label || fallbackLabel,
            deliveryNote: meta.note || '',
            isDefault: addr.id === defaultAddressId
        });
    };

    const handleDeleteClick = (addressId) => {
        setAddressIdToDelete(addressId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (jwt && addressIdToDelete) {
            dispatch(deleteUserAddress({ jwt, addressId: addressIdToDelete }));
            
            // Xóa metadata tương ứng
            const updatedMeta = { ...addressMetadata };
            delete updatedMeta[addressIdToDelete];
            setAddressMetadata(updatedMeta);
            localStorage.setItem("address_metadata", JSON.stringify(updatedMeta));

            if (editAddressId === addressIdToDelete) {
                handleCancelEdit();
            }
            setSnackbar({ open: true, message: 'Đã xóa địa chỉ thành công', severity: 'info' });
        }
        setDeleteConfirmOpen(false);
        setAddressIdToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteConfirmOpen(false);
        setAddressIdToDelete(null);
    };

    const handleCancelEdit = () => {
        setEditAddressId(null);
        setFormData({
            streetAddress: '',
            city: '',
            stateProvince: '',
            postalCode: '10000',
            country: 'Vietnam',
            label: 'HOME',
            deliveryNote: '',
            isDefault: false
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jwt) return;

        const addressPayload = {
            streetAddress: formData.streetAddress,
            city: formData.city,
            stateProvince: formData.stateProvince,
            postalCode: formData.postalCode || '10000',
            country: 'Vietnam'
        };

        try {
            if (editAddressId) {
                await dispatch(updateUserAddress({ jwt, addressId: editAddressId, addressData: addressPayload }));
                
                // Cập nhật metadata
                const updatedMeta = {
                    ...addressMetadata,
                    [editAddressId]: {
                        label: formData.label,
                        note: formData.deliveryNote
                    }
                };
                setAddressMetadata(updatedMeta);
                localStorage.setItem("address_metadata", JSON.stringify(updatedMeta));

                if (formData.isDefault) {
                    setDefaultAddressId(editAddressId);
                    localStorage.setItem("default_address_id", String(editAddressId));
                    window.dispatchEvent(new Event("default_address_changed"));
                }

                setSnackbar({ open: true, message: 'Đã cập nhật địa chỉ thành công!', severity: 'success' });
                setEditAddressId(null);
            } else {
                await dispatch(addUserAddress({ jwt, addressData: addressPayload }));
                
                // Chờ nạp address mới vào store rồi gán metadata
                setTimeout(() => {
                    const latestUser = auth.user;
                    if (latestUser?.addresses?.length > 0) {
                        const newAddr = latestUser.addresses[latestUser.addresses.length - 1];
                        if (newAddr?.id) {
                            const updatedMeta = {
                                ...addressMetadata,
                                [newAddr.id]: {
                                    label: formData.label,
                                    note: formData.deliveryNote
                                }
                            };
                            setAddressMetadata(updatedMeta);
                            localStorage.setItem("address_metadata", JSON.stringify(updatedMeta));

                            if (formData.isDefault || addresses.length === 0) {
                                setDefaultAddressId(newAddr.id);
                                localStorage.setItem("default_address_id", String(newAddr.id));
                                window.dispatchEvent(new Event("default_address_changed"));
                            }
                        }
                    }
                }, 500);

                setSnackbar({ open: true, message: 'Đã thêm địa chỉ mới thành công!', severity: 'success' });
            }

            // Reset form
            setFormData({
                streetAddress: '',
                city: '',
                stateProvince: '',
                postalCode: '10000',
                country: 'Vietnam',
                label: 'HOME',
                deliveryNote: '',
                isDefault: false
            });
        } catch (error) {
            console.error("Lỗi lưu địa chỉ:", error);
            setSnackbar({ open: true, message: 'Có lỗi khi lưu địa chỉ. Vui lòng thử lại!', severity: 'error' });
        }
    };

    return (
        <div className="pb-16 px-4 lg:px-8 flex flex-col items-center w-full">
            {/* Header Trang */}
            <div className="w-full max-w-5xl py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-500 shadow-sm">
                        <HomeIcon sx={{ fontSize: '1.75rem' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-100 tracking-wide flex items-center gap-2">
                            ĐỊA CHỈ NHẬN HÀNG
                            <span className="text-xs bg-gray-800 text-gray-300 font-bold px-2.5 py-0.5 rounded-full border border-gray-700">
                                {addresses.length} địa chỉ
                            </span>
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Quản lý sổ địa chỉ giao món. Thiết lập địa chỉ mặc định để tự động điền khi thanh toán.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 mt-6">
                {/* CỘT TRÁI: DANH SÁCH ĐỊA CHỈ ĐÃ LƯU */}
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-base font-bold text-gray-300 flex items-center gap-2">
                            <LocationOnIcon className="text-emerald-500" sx={{ fontSize: '1.25rem' }} />
                            Danh sách địa chỉ của bạn
                        </h2>
                        <span className="text-xs text-gray-400">
                            (Bấm vào thẻ để chọn mặc định)
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.length > 0 ? (
                            addresses.map((addr, index) => {
                                const isDefault = addr.id === defaultAddressId;
                                const labelInfo = getAddressDisplayLabel(addr, index);
                                const meta = addressMetadata[addr.id];

                                return (
                                    <Card 
                                        key={addr.id || index} 
                                        onClick={() => handleSetDefaultAddress(addr.id)}
                                        className={`rounded-2xl transition-all duration-200 cursor-pointer group ${
                                            isDefault 
                                                ? 'bg-gradient-to-r from-gray-900 to-gray-850 border-2 border-emerald-500/70 shadow-lg shadow-emerald-500/10' 
                                                : 'bg-gray-900/60 border border-gray-800/80 hover:border-gray-700'
                                        }`}
                                    >
                                        <CardContent className="p-5 space-y-3.5">
                                            {/* Header Card: Nhãn (Nhà riêng/Văn phòng) + Badge Mặc định + Nút sửa/xóa */}
                                            <Box className="flex justify-between items-center">
                                                <Box className="flex items-center gap-2 flex-wrap">
                                                    {/* Nhãn gợi nhớ */}
                                                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${labelInfo.chipColor}`}>
                                                        {labelInfo.icon}
                                                        {labelInfo.name}
                                                    </span>

                                                    {/* Huy hiệu Mặc định */}
                                                    {isDefault && (
                                                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                                            <CheckCircleIcon sx={{ fontSize: '0.8rem' }} />
                                                            Mặc định
                                                        </span>
                                                    )}
                                                </Box>

                                                {/* Nút Sửa / Xóa */}
                                                <Box className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                                    <Tooltip title="Chỉnh sửa địa chỉ" arrow>
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => handleEditClick(addr, index)}
                                                            sx={{ color: '#60a5fa', '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.1)' } }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Xóa địa chỉ" arrow>
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => handleDeleteClick(addr.id)}
                                                            sx={{ color: '#f87171', '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.1)' } }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ bgcolor: isDefault ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)' }} />

                                            {/* Địa chỉ hoàn chỉnh, liền mạch, tự nhiên */}
                                            <div className="space-y-1.5">
                                                <p className="text-sm font-bold text-gray-100 leading-snug">
                                                    {addr.streetAddress}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {addr.stateProvince || addr.state ? `${addr.stateProvince || addr.state}, ` : ''}{addr.city}
                                                </p>
                                                
                                                {/* Ghi chú giao hàng nếu có */}
                                                {meta?.note && (
                                                    <div className="mt-2 p-2 bg-gray-800/40 rounded-lg border border-gray-700/50 flex items-start gap-1.5 text-xs text-gray-300">
                                                        <TwoWheelerIcon sx={{ fontSize: '0.95rem', color: '#10b981', mt: '1px' }} />
                                                        <span className="italic">Ghi chú: {meta.note}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Nút đặt mặc định nếu chưa phải mặc định */}
                                            {!isDefault && (
                                                <div className="pt-1">
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        startIcon={<StarBorderIcon sx={{ fontSize: '1rem' }} />}
                                                        onClick={(e) => handleSetDefaultAddress(addr.id, e)}
                                                        sx={{
                                                            color: '#9ca3af',
                                                            textTransform: 'none',
                                                            fontSize: '0.75rem',
                                                            p: 0,
                                                            '&:hover': { color: '#10b981' }
                                                        }}
                                                    >
                                                        Đặt làm mặc định
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-12 bg-gray-900/40 rounded-2xl border border-gray-800">
                                <LocationOnIcon sx={{ fontSize: '3rem', color: '#4b5563', mb: 1 }} />
                                <Typography className="text-gray-400 text-sm font-medium">
                                    Bạn chưa lưu địa chỉ nào. Hãy nhập thông tin bên phải để tạo địa chỉ giao món đầu tiên!
                                </Typography>
                            </div>
                        )}
                    </div>
                </div>

                {/* CỘT PHẢI: FORM THÊM HOẶC SỬA ĐỊA CHỈ */}
                <div className="w-full lg:w-[24rem]">
                    <Card className="bg-gray-900 text-white border border-gray-800 shadow-xl rounded-2xl sticky top-24">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-lg font-bold text-gray-200 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <AddLocationAltIcon className="text-pink-500" />
                                    {editAddressId ? "Chỉnh Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}
                                </span>
                                {editAddressId && (
                                    <IconButton size="small" onClick={handleCancelEdit} sx={{ color: 'gray' }}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </h2>
                            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Chọn nhãn địa chỉ gợi nhớ */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 mb-2 block">
                                        Nhãn gợi nhớ địa chỉ:
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div 
                                            onClick={() => handleSelectLabel('HOME')}
                                            className={`p-2 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center gap-1 ${
                                                formData.label === 'HOME'
                                                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold'
                                                    : 'bg-gray-800/40 border-gray-700/60 text-gray-400 hover:border-gray-600'
                                            }`}
                                        >
                                            <HomeIcon sx={{ fontSize: '1.2rem' }} />
                                            <span className="text-xs">Nhà riêng</span>
                                        </div>

                                        <div 
                                            onClick={() => handleSelectLabel('OFFICE')}
                                            className={`p-2 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center gap-1 ${
                                                formData.label === 'OFFICE'
                                                    ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-bold'
                                                    : 'bg-gray-800/40 border-gray-700/60 text-gray-400 hover:border-gray-600'
                                            }`}
                                        >
                                            <ApartmentIcon sx={{ fontSize: '1.2rem' }} />
                                            <span className="text-xs">Văn phòng</span>
                                        </div>

                                        <div 
                                            onClick={() => handleSelectLabel('OTHER')}
                                            className={`p-2 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center gap-1 ${
                                                formData.label === 'OTHER'
                                                    ? 'bg-purple-500/15 border-purple-500 text-purple-400 font-bold'
                                                    : 'bg-gray-800/40 border-gray-700/60 text-gray-400 hover:border-gray-600'
                                            }`}
                                        >
                                            <LocationOnIcon sx={{ fontSize: '1.2rem' }} />
                                            <span className="text-xs">Khác</span>
                                        </div>
                                    </div>
                                </div>

                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Số nhà, tên ngõ, tên đường *"
                                    name="streetAddress"
                                    placeholder="VD: 11 ngõ 45 Cẩm Thủy"
                                    value={formData.streetAddress}
                                    onChange={handleChange}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Quận / Huyện *"
                                        name="stateProvince"
                                        placeholder="VD: Cẩm Thủy"
                                        value={formData.stateProvince}
                                        onChange={handleChange}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Thành phố / Tỉnh *"
                                        name="city"
                                        placeholder="VD: Thanh Hóa"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </div>

                                {/* Ghi chú cho tài xế shipper */}
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Ghi chú giao món cho tài xế"
                                    name="deliveryNote"
                                    placeholder="VD: Gõ cửa phòng 402, gọi trước khi đến..."
                                    value={formData.deliveryNote}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />

                                {/* Checkbox đặt làm mặc định */}
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                            checked={formData.isDefault}
                                            onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                                            sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }}
                                        />
                                    }
                                    label={<span className="text-xs text-gray-300 font-medium">Đặt làm địa chỉ giao mặc định</span>}
                                />

                                <div className="pt-2 flex gap-2">
                                    {editAddressId && (
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={handleCancelEdit}
                                            sx={{
                                                borderColor: '#4b5563',
                                                color: '#9ca3af',
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Hủy
                                        </Button>
                                    )}
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                                        sx={{
                                            py: 1,
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            boxShadow: '0 4px 14px rgba(233, 30, 99, 0.3)'
                                        }}
                                    >
                                        {editAddressId ? "Cập Nhật Địa Chỉ" : "Lưu Địa Chỉ Mới"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* DIALOG XÁC NHẬN XÓA ĐỊA CHỈ */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleCancelDelete}
                PaperProps={{
                    style: { backgroundColor: '#111827', color: 'white', border: '1px solid #1f2937', borderRadius: '16px', maxWidth: 420 }
                }}
            >
                <DialogTitle className="border-b border-gray-800 text-pink-500 font-bold flex items-center gap-2">
                    Xác nhận xóa địa chỉ?
                </DialogTitle>
                <DialogContent className="mt-4">
                    <DialogContentText style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
                        Bạn có chắc chắn muốn xóa địa chỉ nhận hàng này khỏi sổ địa chỉ không? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="p-4 border-t border-gray-800 gap-2">
                    <Button onClick={handleCancelDelete} style={{ color: '#9ca3af', textTransform: 'none', fontWeight: 600 }}>
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        variant="contained" 
                        sx={{ 
                            bgcolor: '#ef4444', 
                            '&:hover': { bgcolor: '#dc2626' },
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            textTransform: 'none'
                        }}
                    >
                        Đồng Ý Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* TOAST PHẢN HỒI THAO TÁC */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2500}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: '10px', fontWeight: 600 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};
