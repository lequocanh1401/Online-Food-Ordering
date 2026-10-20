import React, { useState, useEffect } from 'react';
import { 
    Avatar, Button, Modal, Box, TextField, Typography, 
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Chip,
    CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUserProfile } from '../../State/Authentication/Action';
import { useNavigate } from 'react-router-dom';
import { uploadImageToCloudinary } from '../util/uploadToCloudinary';

const editModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 440,
    maxWidth: '90vw',
    bgcolor: '#111827',
    border: '1px solid #1f2937',
    color: 'white',
    boxShadow: 24,
    p: 4,
    borderRadius: '16px',
    outline: 'none'
};

export const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    const auth = useSelector(store => store.auth);

    // States for Edit Profile modal
    const [openEditModal, setOpenEditModal] = useState(false);
    const [fullName, setFullName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    // States for Logout confirm dialog
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

    useEffect(() => {
        if (auth.user) {
            setFullName(auth.user.fullName || "");
            setAvatar(auth.user.avatar || "");
        }
    }, [auth.user]);

    const handleOpenEdit = () => {
        setFullName(auth.user?.fullName || "");
        setAvatar(auth.user?.avatar || "");
        setOpenEditModal(true);
    };

    const handleCloseEdit = () => {
        setOpenEditModal(false);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadingImage(true);
            try {
                const url = await uploadImageToCloudinary(file);
                setAvatar(url);
            } catch (error) {
                console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
            } finally {
                setUploadingImage(false);
            }
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateUserProfile({
                reqData: {
                    fullName,
                    avatar
                },
                jwt
            }));
            setOpenEditModal(false);
        } catch (err) {
            console.error("Lỗi khi cập nhật hồ sơ:", err);
        }
    };

    const handleConfirmLogout = () => {
        setOpenLogoutConfirm(false);
        dispatch(logout());
        navigate("/");
    };

    return (
        <div className='min-h-[80vh] flex flex-col justify-center items-center text-center px-4'>
            <div className='flex flex-col items-center justify-center p-8 bg-gray-900/60 border border-gray-800 rounded-2xl max-w-md w-full shadow-2xl backdrop-blur-sm'>
                {/* Avatar lớn nổi bật */}
                <div className='mb-4'>
                    <Avatar
                        src={auth.user?.avatar}
                        sx={{ 
                            width: 130, 
                            height: 130, 
                            fontSize: "3.5rem", 
                            bgcolor: "rgba(233, 30, 99, 0.15)", 
                            color: "#e91e63",
                            border: "3px solid #e91e63",
                            boxShadow: "0 0 25px rgba(233, 30, 99, 0.25)"
                        }}
                    >
                        {auth.user?.fullName?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                </div>

                <h1 className='text-2xl font-bold text-gray-50 flex items-center gap-2'>
                    {auth.user?.fullName || "Khách hàng"}
                </h1>

                <p className='text-gray-400 mt-1 text-sm'>{auth.user?.email || "Chưa cập nhật"}</p>
                
                <div className='mt-3 mb-6'>
                    <Chip 
                        label={auth.user?.role === "ROLE_RESTAURANT_OWNER" ? "Chủ nhà hàng" : auth.user?.role === "ROLE_ADMIN" ? "Quản trị viên" : "Khách hàng"}
                        size="small"
                        sx={{ 
                            bgcolor: 'rgba(233, 30, 99, 0.1)', 
                            color: '#f472b6', 
                            border: '1px solid rgba(233, 30, 99, 0.3)',
                            fontWeight: 600,
                            px: 1.5
                        }}
                    />
                </div>

                {/* 2 Nút Thao Tác: Chỉnh Sửa Hồ Sơ & Đăng Xuất */}
                <div className='flex items-center gap-3 w-full'>
                    <Button
                        onClick={handleOpenEdit}
                        variant='outlined'
                        startIcon={<EditIcon />}
                        fullWidth
                        sx={{ 
                            py: "0.75rem", 
                            color: '#ec4899', 
                            borderColor: 'rgba(236, 72, 153, 0.5)', 
                            fontWeight: 600,
                            borderRadius: '10px',
                            '&:hover': { 
                                borderColor: '#ec4899', 
                                bgcolor: 'rgba(236, 72, 153, 0.08)' 
                            } 
                        }}
                    >
                        Sửa Hồ Sơ
                    </Button>

                    <Button
                        onClick={() => setOpenLogoutConfirm(true)}
                        variant='contained'
                        startIcon={<LogoutIcon />}
                        fullWidth
                        sx={{ 
                            py: "0.75rem", 
                            backgroundColor: "#e91e63", 
                            fontWeight: 600,
                            borderRadius: '10px',
                            '&:hover': { backgroundColor: "#c2185b" } 
                        }}
                    >
                        Đăng Xuất
                    </Button>
                </div>
            </div>

            {/* Modal Chỉnh Sửa Hồ Sơ Cá Nhân */}
            <Modal open={openEditModal} onClose={handleCloseEdit}>
                <Box sx={editModalStyle}>
                    <Typography variant="h6" className="font-bold text-gray-100 mb-4 flex items-center gap-2">
                        <EditIcon sx={{ color: '#ec4899' }} /> Chỉnh Sửa Hồ Sơ Cá Nhân
                    </Typography>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        {/* Live Avatar Preview & Tải ảnh từ máy tính */}
                        <div className="flex flex-col items-center justify-center py-2 gap-2">
                            <div className="relative">
                                <Avatar
                                    src={avatar}
                                    sx={{ 
                                        width: 88, 
                                        height: 88, 
                                        border: '2px solid #ec4899',
                                        bgcolor: 'rgba(233,30,99,0.1)',
                                        color: '#ec4899',
                                        fontSize: '2.2rem',
                                        boxShadow: '0 0 15px rgba(236, 72, 153, 0.3)'
                                    }}
                                >
                                    {fullName?.[0]?.toUpperCase() || "U"}
                                </Avatar>
                                {uploadingImage && (
                                    <Box sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        borderRadius: '50%'
                                    }}>
                                        <CircularProgress size={30} sx={{ color: '#ec4899' }} />
                                    </Box>
                                )}
                            </div>

                            {/* Nút Chọn Ảnh từ Máy tính */}
                            <div>
                                <input
                                    accept="image/*"
                                    id="avatar-file-upload"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    disabled={uploadingImage}
                                />
                                <label htmlFor="avatar-file-upload">
                                    <Button
                                        component="span"
                                        variant="outlined"
                                        size="small"
                                        startIcon={uploadingImage ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                                        disabled={uploadingImage}
                                        sx={{
                                            color: '#ec4899',
                                            borderColor: 'rgba(236, 72, 153, 0.5)',
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontSize: '0.85rem',
                                            px: 2,
                                            '&:hover': {
                                                borderColor: '#ec4899',
                                                bgcolor: 'rgba(236, 72, 153, 0.08)'
                                            }
                                        }}
                                    >
                                        {uploadingImage ? "Đang tải ảnh lên..." : "Chọn ảnh từ máy tính"}
                                    </Button>
                                </label>
                            </div>
                            <Typography variant="caption" className="text-gray-400">
                                Hỗ trợ PNG, JPG, WEBP (Lưu trữ Cloudinary)
                            </Typography>
                        </div>

                        <TextField
                            label="Họ và Tên"
                            fullWidth
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#374151' },
                                    '&:hover fieldset': { borderColor: '#ec4899' },
                                    '&.Mui-focused fieldset': { borderColor: '#ec4899' }
                                },
                                '& .MuiInputLabel-root': { color: '#9ca3af' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#ec4899' }
                            }}
                        />

                        <TextField
                            label="Đường dẫn ảnh đại diện (URL)"
                            fullWidth
                            placeholder="https://..."
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            helperText="Tự động điền khi chọn ảnh từ máy hoặc bạn có thể dán link trực tiếp"
                            FormHelperTextProps={{ sx: { color: '#6b7280' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#374151' },
                                    '&:hover fieldset': { borderColor: '#ec4899' },
                                    '&.Mui-focused fieldset': { borderColor: '#ec4899' }
                                },
                                '& .MuiInputLabel-root': { color: '#9ca3af' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#ec4899' }
                            }}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                onClick={handleCloseEdit}
                                sx={{ color: '#9ca3af', '&:hover': { color: 'white' } }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={uploadingImage}
                                sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' }, fontWeight: 600, px: 3 }}
                            >
                                Lưu Thay Đổi
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Dialog Xác Nhận Đăng Xuất */}
            <Dialog
                open={openLogoutConfirm}
                onClose={() => setOpenLogoutConfirm(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#111827',
                        color: 'white',
                        border: '1px solid #1f2937',
                        borderRadius: '16px',
                        p: 1,
                        maxWidth: 400
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5, color: '#f87171' }}>
                    <WarningAmberIcon sx={{ color: '#ef4444' }} />
                    Xác Nhận Đăng Xuất
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#9ca3af' }}>
                        Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button 
                        onClick={() => setOpenLogoutConfirm(false)} 
                        sx={{ color: '#9ca3af', '&:hover': { color: 'white' } }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleConfirmLogout} 
                        variant="contained" 
                        sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, fontWeight: 600, px: 2.5 }}
                    >
                        Đăng Xuất
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};