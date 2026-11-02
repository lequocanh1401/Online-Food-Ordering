import React, { useState } from 'react';
import { 
    Box, Card, CardHeader, IconButton, Paper, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Button, Modal, 
    TextField, FormControl, InputLabel, Select, MenuItem, Dialog, 
    DialogTitle, DialogContent, DialogContentText, DialogActions, 
    Chip, Typography, Tooltip, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StorefrontIcon from '@mui/icons-material/Storefront';

import { CreateIngredientForm } from './CreateIngredientForm';
import { useDispatch, useSelector } from 'react-redux';
import { 
    updateStockOfIngredient, 
    deleteIngredientAction, 
    updateIngredientAction
} from '../../State/Ingredients/Action';

export const IngredientsTable = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const restaurant = useSelector(store => store.restaurant);
    const { ingredients } = useSelector(store => store);
    const restaurantId = restaurant.usersRestaurant?.id;

    // Bộ lọc trạng thái & tìm kiếm
    const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'AVAILABLE' | 'OUT_OF_STOCK'
    const [searchQuery, setSearchQuery] = useState('');

    // Edit modal states
    const [editOpen, setEditOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [editName, setEditName] = useState("");
    const [editCategoryId, setEditCategoryId] = useState("");

    // Custom confirm delete modal states
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteIngredientId, setDeleteIngredientId] = useState(null);

    const isAvailable = (item) => item.inStoke !== false && item.inStock !== false;

    const handleUpdateStock = (id) => {
        dispatch(updateStockOfIngredient({ id, jwt }));
    };

    const handleEditClick = (item) => {
        setEditItem(item);
        setEditName(item.name || "");
        setEditCategoryId(item.category?.id || "");
        setEditOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: editName.trim(),
            categoryId: editCategoryId,
            quantity: 100,
            unit: "phần",
            minThreshold: 0,
            restaurantId
        };
        dispatch(updateIngredientAction({ id: editItem.id, data, jwt, restaurantId }));
        setEditOpen(false);
        setEditItem(null);
    };

    const handleDeleteClick = (id) => {
        setDeleteIngredientId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteIngredientId) {
            dispatch(deleteIngredientAction({ id: deleteIngredientId, jwt, restaurantId }));
        }
        setConfirmOpen(false);
        setDeleteIngredientId(null);
    };

    const items = ingredients.ingredients || [];
    const availableCount = items.filter(i => isAvailable(i)).length;
    const outOfStockCount = items.length - availableCount;

    // Áp dụng bộ lọc
    const filteredItems = items.filter((item) => {
        const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        const available = isAvailable(item);
        if (statusFilter === 'AVAILABLE') return available;
        if (statusFilter === 'OUT_OF_STOCK') return !available;
        return true;
    });

    return (
        <Box className="space-y-4">
            {/* Header Thống Kê & Chuẩn Hóa GrabFood / ShopeeFood */}
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                            <StorefrontIcon fontSize="small" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white tracking-wide">
                                QUẢN LÝ TOPPING & NGUYÊN LIỆU MÓN
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Gạt công tắc 1 chạm để thông báo Còn / Tạm hết món tức thời tới khách hàng
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Chip 
                        icon={<CheckCircleIcon sx={{ fontSize: '16px !important', color: '#10b981 !important' }} />}
                        label={`${availableCount} Đang phục vụ`} 
                        size="small" 
                        sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)', fontWeight: 'bold' }} 
                    />
                    <Chip 
                        icon={<CancelIcon sx={{ fontSize: '16px !important', color: '#ef4444 !important' }} />}
                        label={`${outOfStockCount} Tạm hết hôm nay`} 
                        size="small" 
                        sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)', fontWeight: 'bold' }} 
                    />
                </div>
            </div>

            {/* Bảng Dữ Liệu Chính */}
            <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2 }}>
                {/* Search & Filter Toolbar */}
                <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                        <Button 
                            size="small"
                            variant={statusFilter === 'ALL' ? 'contained' : 'outlined'}
                            onClick={() => setStatusFilter('ALL')}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                bgcolor: statusFilter === 'ALL' ? '#ec4899' : 'transparent',
                                color: statusFilter === 'ALL' ? '#fff' : '#9ca3af',
                                borderColor: '#374151',
                                '&:hover': { bgcolor: statusFilter === 'ALL' ? '#db2777' : 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            Tất cả ({items.length})
                        </Button>
                        <Button 
                            size="small"
                            variant={statusFilter === 'AVAILABLE' ? 'contained' : 'outlined'}
                            onClick={() => setStatusFilter('AVAILABLE')}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                bgcolor: statusFilter === 'AVAILABLE' ? '#10b981' : 'transparent',
                                color: statusFilter === 'AVAILABLE' ? '#fff' : '#9ca3af',
                                borderColor: '#374151',
                                '&:hover': { bgcolor: statusFilter === 'AVAILABLE' ? '#059669' : 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            🟢 Đang bán ({availableCount})
                        </Button>
                        <Button 
                            size="small"
                            variant={statusFilter === 'OUT_OF_STOCK' ? 'contained' : 'outlined'}
                            onClick={() => setStatusFilter('OUT_OF_STOCK')}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                bgcolor: statusFilter === 'OUT_OF_STOCK' ? '#ef4444' : 'transparent',
                                color: statusFilter === 'OUT_OF_STOCK' ? '#fff' : '#9ca3af',
                                borderColor: '#374151',
                                '&:hover': { bgcolor: statusFilter === 'OUT_OF_STOCK' ? '#dc2626' : 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            🔴 Tạm hết ({outOfStockCount})
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <TextField 
                            size="small"
                            placeholder="Tìm topping, nguyên liệu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#9ca3af', fontSize: 18 }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                width: { xs: '100%', sm: 240 },
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    color: '#fff'
                                }
                            }}
                        />
                        <IconButton 
                            onClick={handleOpen} 
                            sx={{ 
                                color: '#fff', 
                                bgcolor: '#ec4899', 
                                borderRadius: '8px',
                                '&:hover': { bgcolor: '#db2777' } 
                            }} 
                            title="Thêm Topping / Nguyên liệu mới"
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </div>
                </div>

                <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="toppings table">
                        <TableHead>
                            <TableRow sx={{ '& th': { color: '#9ca3af', borderBottom: '1px solid #1f2937', fontWeight: 600, fontSize: '0.8rem' } }}>
                                <TableCell>MÃ</TableCell>
                                <TableCell>TÊN TOPPING / NGUYÊN LIỆU</TableCell>
                                <TableCell>NHÓM PHÂN LOẠI</TableCell>
                                <TableCell align="center">TRẠNG THÁI PHỤC VỤ (1 CHẠM)</TableCell>
                                <TableCell align="right">THAO TÁC</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredItems.map((item) => {
                                const available = isAvailable(item);

                                return (
                                    <TableRow 
                                        key={item.id} 
                                        sx={{ 
                                            '& td': { color: '#f3f4f6', borderBottom: '1px solid #1f2937' }, 
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } 
                                        }}
                                    >
                                        <TableCell component="th" scope="row" className="font-mono text-gray-500 text-xs">
                                            #{item.id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${available ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                                                <span className={`font-bold ${available ? 'text-gray-100' : 'text-gray-400 line-through'}`}>
                                                    {item.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={item.category?.name || "Chưa phân loại"} 
                                                size="small"
                                                sx={{ 
                                                    bgcolor: 'rgba(255,255,255,0.05)', 
                                                    color: '#d1d5db', 
                                                    fontSize: '0.72rem',
                                                    border: '1px solid rgba(255,255,255,0.1)'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={available ? "Bấm để chuyển sang TẠM HẾT HÀNG (Khách không thể chọn)" : "Bấm để MỞ BÁN LẠI cho khách"}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleUpdateStock(item.id)}
                                                    startIcon={available ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <CancelIcon sx={{ fontSize: 16 }} />}
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontWeight: 'bold',
                                                        borderRadius: '20px',
                                                        fontSize: '0.78rem',
                                                        py: 0.4,
                                                        px: 2,
                                                        bgcolor: available ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                                        color: available ? '#34d399' : '#f87171',
                                                        borderColor: available ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
                                                        '&:hover': {
                                                            bgcolor: available ? 'rgba(239, 68, 68, 0.18)' : 'rgba(16, 185, 129, 0.18)',
                                                            borderColor: available ? '#ef4444' : '#10b981',
                                                            color: available ? '#fca5a5' : '#6ee7b7'
                                                        }
                                                    }}
                                                >
                                                    {available ? "🟢 Đang phục vụ (Bấm để tắt)" : "🔴 Tạm hết hôm nay (Bấm để bật)"}
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box className="flex justify-end items-center gap-1">
                                                <Tooltip title="Chỉnh sửa tên & nhóm">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleEditClick(item)}
                                                        sx={{ color: '#60a5fa', '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.1)' } }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa Topping">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleDeleteClick(item.id)}
                                                        sx={{ color: '#f87171', '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.1)' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredItems.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" className="text-gray-500 py-8">
                                        {searchQuery 
                                            ? `Không tìm thấy topping/nguyên liệu nào khớp với từ khóa "${searchQuery}"`
                                            : "Chưa có mục nào. Nhấn biểu tượng (+) ở góc trên để tạo mới."
                                        }
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Modal Tạo Mới Topping / Nguyên Liệu */}
            <CreateIngredientForm open={open} handleClose={handleClose} />

            {/* Modal Chỉnh Sửa Topping / Nguyên Liệu */}
            <Modal open={editOpen} onClose={() => setEditOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 440, bgcolor: '#111827', color: 'white', outline: 'none', boxShadow: 24, p: 4, borderRadius: '16px', border: '1px solid #1f2937' }}>
                    <form onSubmit={handleEditSubmit}>
                        <h2 className='text-white font-black text-center text-xl tracking-wide pb-2'>
                            CẬP NHẬT TOPPING / NGUYÊN LIỆU
                        </h2>
                        <p className="text-xs text-gray-400 text-center mb-6">
                            Chỉnh sửa tên hiển thị và nhóm danh mục phân loại
                        </p>

                        <TextField 
                            fullWidth 
                            label="Tên Topping / Nguyên liệu" 
                            variant="outlined" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)} 
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.03)' }
                            }} 
                            required 
                        />
                        
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <InputLabel id="edit-category-label">Nhóm phân loại</InputLabel>
                            <Select 
                                labelId="edit-category-label" 
                                value={editCategoryId} 
                                label="Nhóm phân loại" 
                                onChange={(e) => setEditCategoryId(e.target.value)} 
                                required
                                sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
                            >
                                {ingredients.category?.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <div className="flex gap-2">
                            <Button 
                                variant="outlined" 
                                onClick={() => setEditOpen(false)} 
                                fullWidth 
                                sx={{ color: '#9ca3af', borderColor: '#374151', textTransform: 'none', borderRadius: '10px' }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary" 
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
                                Lưu Thay Đổi
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Custom confirm delete Dialog */}
            <Dialog 
                open={confirmOpen} 
                onClose={() => setConfirmOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#111827',
                        color: 'white',
                        borderRadius: '16px',
                        border: '1px solid #1f2937',
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold' }}>
                    <WarningIcon sx={{ color: '#f87171' }} />
                    Xác Nhận Xóa Topping
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#d1d5db' }}>
                        Bạn có chắc chắn muốn xóa mục này khỏi danh sách không? Nếu có món ăn đang liên kết, hãy gỡ liên kết trước khi xóa.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={() => setConfirmOpen(false)} 
                        sx={{ color: '#9ca3af', textTransform: 'none' }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        variant="contained" 
                        color="error"
                        sx={{ borderRadius: '8px', fontWeight: 'bold', textTransform: 'none' }}
                    >
                        Xác nhận xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};