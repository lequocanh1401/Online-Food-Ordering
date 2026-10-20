import React, { useEffect, useState } from 'react';
import { 
    Box, Typography, Card, Dialog, DialogTitle, DialogContent, 
    DialogContentText, DialogActions, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, 
    Chip, IconButton, CircularProgress, Rating 
} from '@mui/material';
import { 
    People as PeopleIcon, 
    Delete as DeleteIcon, 
    RateReview as RateReviewIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../../config/api';

export const SuperAdminUsers = () => {
    const jwt = localStorage.getItem("jwt");
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    
    // User deletion states
    const [openDeleteUserConfirm, setOpenDeleteUserConfirm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState("");

    // Reviews modal states
    const [openReviewsModal, setOpenReviewsModal] = useState(false);
    const [userReviews, setUserReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [activeReviewUserId, setActiveReviewUserId] = useState(null);
    const [activeReviewUserName, setActiveReviewUserName] = useState("");

    // Review deletion states
    const [openDeleteReviewConfirm, setOpenDeleteReviewConfirm] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    const fetchUsers = () => {
        setLoadingUsers(true);
        axios.get(`${API_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
        .then(res => {
            setUsers(res.data || []);
            setLoadingUsers(false);
        })
        .catch(err => {
            console.error("Lỗi tải danh sách người dùng:", err);
            setLoadingUsers(false);
        });
    };

    useEffect(() => {
        if (jwt) {
            fetchUsers();
        }
    }, [jwt]);

    // Handle Delete User
    const handleDeleteUserClick = (userId, fullName) => {
        setSelectedUserId(userId);
        setSelectedUserName(fullName);
        setOpenDeleteUserConfirm(true);
    };

    const handleConfirmDeleteUser = () => {
        axios.delete(`${API_URL}/api/admin/users/${selectedUserId}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
        .then(() => {
            fetchUsers(); // Tải lại danh sách
            setOpenDeleteUserConfirm(false);
            setSelectedUserId(null);
        })
        .catch(err => {
            alert("Lỗi khi xóa người dùng: " + (err.response?.data?.message || err.message));
            setOpenDeleteUserConfirm(false);
        });
    };

    // Handle View Reviews
    const handleViewReviewsClick = (userId, fullName) => {
        setActiveReviewUserId(userId);
        setActiveReviewUserName(fullName);
        setOpenReviewsModal(true);
        setLoadingReviews(true);

        axios.get(`${API_URL}/api/admin/users/${userId}/reviews`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
        .then(res => {
            setUserReviews(res.data || []);
            setLoadingReviews(false);
        })
        .catch(err => {
            console.error("Lỗi tải đánh giá của người dùng:", err);
            setLoadingReviews(false);
        });
    };

    // Handle Delete Review
    const handleDeleteReviewClick = (reviewId) => {
        setSelectedReviewId(reviewId);
        setOpenDeleteReviewConfirm(true);
    };

    const handleConfirmDeleteReview = () => {
        axios.delete(`${API_URL}/api/reviews/${selectedReviewId}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
        .then(() => {
            // Tải lại đánh giá của người dùng hiện tại
            axios.get(`${API_URL}/api/admin/users/${activeReviewUserId}/reviews`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
            .then(res => {
                setUserReviews(res.data || []);
            });
            setOpenDeleteReviewConfirm(false);
            setSelectedReviewId(null);
        })
        .catch(err => {
            alert("Lỗi khi xóa đánh giá: " + err.message);
            setOpenDeleteReviewConfirm(false);
        });
    };

    const getRoleChipColor = (role) => {
        switch (role) {
            case "ROLE_ADMIN":
                return "warning"; // gold/amber
            case "ROLE_RESTAURANT_OWNER":
                return "secondary"; // purple/pink
            case "ROLE_CUSTOMER":
            default:
                return "primary"; // blue
        }
    };

    const getRoleDisplayName = (role) => {
        switch (role) {
            case "ROLE_ADMIN":
                return "Admin";
            case "ROLE_RESTAURANT_OWNER":
                return "Chủ Nhà Hàng";
            case "ROLE_CUSTOMER":
            default:
                return "Khách Hàng";
        }
    };

    return (
        <Box className='p-6 text-gray-100 space-y-6'>
            {/* Header */}
            <Box className='flex justify-between items-center mb-6'>
                <Box>
                    <Typography variant='h4' className='font-bold flex items-center gap-2 text-white'>
                        <PeopleIcon fontSize='large' className='text-indigo-500' />
                        Quản Lý Khách Hàng Toàn Sàn
                    </Typography>
                    <Typography variant='body2' className='text-gray-400 mt-1'>
                        Quản lý tài khoản khách hàng, theo dõi và loại bỏ các đánh giá tục tĩu hoặc xóa khách hàng vi phạm.
                    </Typography>
                </Box>
            </Box>

            {/* Main Table */}
            <Card className='bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden p-6'>
                {loadingUsers ? (
                    <Box className='flex justify-center py-20'>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <TableContainer component={Paper} className='bg-gray-850 border border-gray-800 rounded-lg overflow-hidden shadow-inner'>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead className='bg-gray-950 border-b border-gray-800'>
                                <TableRow>
                                    <TableCell className='text-gray-400 font-bold'>ID</TableCell>
                                    <TableCell className='text-gray-400 font-bold'>Ảnh</TableCell>
                                    <TableCell className='text-gray-400 font-bold'>Họ và Tên</TableCell>
                                    <TableCell className='text-gray-400 font-bold'>Email</TableCell>
                                    <TableCell className='text-gray-400 font-bold' align='center'>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.length > 0 ? (
                                    users.map((row) => (
                                        <TableRow key={row.id} className='hover:bg-gray-850/50 transition border-b border-gray-850/40'>
                                            <TableCell className='text-gray-300 font-mono'>#{row.id}</TableCell>
                                            <TableCell>
                                                <Avatar className='bg-indigo-600 font-bold text-white shadow-md'>
                                                    {row.fullName ? row.fullName.charAt(0).toUpperCase() : "U"}
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className='text-white font-medium'>
                                                {row.fullName}
                                            </TableCell>
                                            <TableCell className='text-gray-300 font-mono'>
                                                {row.email}
                                            </TableCell>
                                            <TableCell align='center' className='space-x-2'>
                                                <Button 
                                                    variant='outlined' 
                                                    size='small'
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => handleViewReviewsClick(row.id, row.fullName)}
                                                    sx={{ 
                                                        color: '#6366f1', 
                                                        borderColor: '#6366f1',
                                                        '&:hover': {
                                                            borderColor: '#4f46e5',
                                                            backgroundColor: 'rgba(99, 102, 241, 0.08)'
                                                        }
                                                    }}
                                                >
                                                    Xem Review
                                                </Button>
                                                
                                                {row.role !== "ROLE_ADMIN" && (
                                                    <IconButton 
                                                        onClick={() => handleDeleteUserClick(row.id, row.fullName)}
                                                        className='text-red-500 hover:bg-red-500/10'
                                                        title='Xóa tài khoản này'
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align='center' className='text-gray-500 py-12'>
                                            Không tìm thấy khách hàng nào trong hệ thống.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card>

            {/* Modal hiển thị danh sách đánh giá của User */}
            <Dialog
                open={openReviewsModal}
                onClose={() => setOpenReviewsModal(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    style: { backgroundColor: '#111827', color: 'white', borderRadius: '12px' }
                }}
            >
                <DialogTitle className='border-b border-gray-800 flex justify-between items-center p-5'>
                    <Typography variant='h6' className='font-bold flex items-center gap-2'>
                        <RateReviewIcon className='text-pink-500' />
                        Đánh giá của: <span className='text-indigo-400'>{activeReviewUserName}</span>
                    </Typography>
                </DialogTitle>
                <DialogContent className='p-6 min-h-[300px] max-h-[500px] overflow-y-auto space-y-4'>
                    {loadingReviews ? (
                        <Box className='flex justify-center py-20'>
                            <CircularProgress color="secondary" />
                        </Box>
                    ) : (
                        <Box className='space-y-4 mt-2'>
                            {userReviews.length > 0 ? (
                                userReviews.map((item) => (
                                    <Card key={item.id} className='p-4 bg-gray-800 border border-gray-700 flex justify-between items-start gap-4'>
                                        <Box className='flex-1'>
                                            <Box className='flex items-center gap-3 mb-2'>
                                                <Typography variant='subtitle2' className='text-indigo-300 font-semibold'>
                                                    {item.restaurant?.name}
                                                </Typography>
                                                <Typography variant='caption' className='text-gray-500'>
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "N/A"}
                                                </Typography>
                                            </Box>
                                            <Rating value={item.rating} readOnly size="small" className='mb-2' />
                                            
                                            {item.food && (
                                                <Box className='mb-2'>
                                                    <Chip 
                                                        label={`Món ăn: ${item.food.name}`} 
                                                        size="small" 
                                                        className='bg-pink-900/30 text-pink-300 text-xs border border-pink-700/20' 
                                                    />
                                                </Box>
                                            )}

                                            <Typography variant='body2' className='text-gray-200 leading-relaxed bg-gray-900/50 p-3 rounded border border-gray-700/50'>
                                                {item.comment}
                                            </Typography>
                                        </Box>
                                        
                                        <IconButton 
                                            onClick={() => handleDeleteReviewClick(item.id)}
                                            className='text-red-500 hover:bg-red-500/10 self-start'
                                            title='Xóa đánh giá này'
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Card>
                                ))
                            ) : (
                                <Box className='text-center py-16 text-gray-500'>
                                    Thành viên này chưa viết đánh giá nào trên hệ thống.
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className='p-4 border-t border-gray-800'>
                    <Button onClick={() => setOpenReviewsModal(false)} variant='contained' sx={{ backgroundColor: '#4b5563', '&:hover': { backgroundColor: '#374151' } }}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog xác nhận xóa Người dùng */}
            <Dialog
                open={openDeleteUserConfirm}
                onClose={() => setOpenDeleteUserConfirm(false)}
                PaperProps={{
                    style: { backgroundColor: '#1f2937', color: 'white', borderRadius: '10px' }
                }}
            >
                <DialogTitle className='border-b border-gray-700 font-bold'>Xác nhận xóa tài khoản?</DialogTitle>
                <DialogContent className='mt-4'>
                    <DialogContentText style={{ color: '#d1d5db' }}>
                        Bạn có chắc chắn muốn xóa tài khoản của thành viên <span className='text-pink-400 font-bold'>{selectedUserName}</span> không? 
                        Hành động này sẽ xóa toàn bộ các đánh giá, giỏ hàng, thông tin tài khoản và nhà hàng liên quan (nếu có). Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='p-4 border-t border-gray-700'>
                    <Button onClick={() => setOpenDeleteUserConfirm(false)} style={{ color: '#9ca3af' }}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDeleteUser} variant='contained' color='error'>
                        Xác Nhận Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog xác nhận xóa Review */}
            <Dialog
                open={openDeleteReviewConfirm}
                onClose={() => setOpenDeleteReviewConfirm(false)}
                PaperProps={{
                    style: { backgroundColor: '#1f2937', color: 'white', borderRadius: '10px' }
                }}
            >
                <DialogTitle className='border-b border-gray-700 font-bold'>Xác nhận xóa đánh giá?</DialogTitle>
                <DialogContent className='mt-4'>
                    <DialogContentText style={{ color: '#d1d5db' }}>
                        Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='p-4 border-t border-gray-700'>
                    <Button onClick={() => setOpenDeleteReviewConfirm(false)} style={{ color: '#9ca3af' }}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDeleteReview} variant='contained' color='error'>
                        Xác Nhận Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
