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
import HistoryIcon from '@mui/icons-material/History';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { CreateIngredientForm } from './CreateIngredientForm';
import { useDispatch, useSelector } from 'react-redux';
import { 
    updateStockOfIngredient, 
    deleteIngredientAction, 
    updateIngredientAction,
    importIngredientStockAction,
    fetchInventoryLogsAction
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
    const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK'
    const [searchQuery, setSearchQuery] = useState('');

    // Edit modal states
    const [editOpen, setEditOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [editName, setEditName] = useState("");
    const [editCategoryId, setEditCategoryId] = useState("");
    const [editQuantity, setEditQuantity] = useState(0);
    const [editUnit, setEditUnit] = useState("phần");
    const [editMinThreshold, setEditMinThreshold] = useState(5);

    // Import modal states
    const [importOpen, setImportOpen] = useState(false);
    const [importItem, setImportItem] = useState(null);
    const [importQty, setImportQty] = useState(20);
    const [importNote, setImportNote] = useState("Nhập thêm nguyên liệu vào kho");

    // Inventory logs modal state
    const [logsOpen, setLogsOpen] = useState(false);

    // Custom confirm delete modal states
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteIngredientId, setDeleteIngredientId] = useState(null);

    const isAvailable = (item) => item.inStoke !== false && item.inStock !== false;

    const handleUpdateStock = (id) => {
        dispatch(updateStockOfIngredient({ id, jwt }));
    };

    const handleImportClick = (item) => {
        setImportItem(item);
        setImportQty(20);
        setImportNote("Nhập thêm hàng");
        setImportOpen(true);
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        if (importItem) {
            dispatch(importIngredientStockAction({
                id: importItem.id,
                additionalQuantity: Number(importQty),
                note: importNote,
                jwt,
                restaurantId
            }));
        }
        setImportOpen(false);
        setImportItem(null);
    };

    const handleOpenLogs = () => {
        if (restaurantId) {
            dispatch(fetchInventoryLogsAction({ restaurantId, jwt }));
        }
        setLogsOpen(true);
    };

    const handleEditClick = (item) => {
        setEditItem(item);
        setEditName(item.name || "");
        setEditCategoryId(item.category?.id || "");
        setEditQuantity(item.quantity != null ? item.quantity : 0);
        setEditUnit(item.unit || "phần");
        setEditMinThreshold(item.minThreshold != null ? item.minThreshold : 5);
        setEditOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: editName.trim(),
            categoryId: editCategoryId,
            quantity: Number(editQuantity),
            unit: editUnit.trim(),
            minThreshold: Number(editMinThreshold),
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
    const outOfStockCount = items.filter(i => !isAvailable(i) || (i.quantity != null && i.quantity <= 0)).length;
    const lowStockCount = items.filter(i => isAvailable(i) && (i.quantity != null && i.quantity > 0) && (i.minThreshold != null && i.quantity <= i.minThreshold)).length;
    const availableCount = items.length - outOfStockCount;

    // Áp dụng bộ lọc
    const filteredItems = items.filter((item) => {
        const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        const available = isAvailable(item) && (item.quantity == null || item.quantity > 0);
        const isLow = isAvailable(item) && (item.quantity != null && item.quantity > 0) && (item.minThreshold != null && item.quantity <= item.minThreshold);
        const isOut = !isAvailable(item) || (item.quantity != null && item.quantity <= 0);

        if (statusFilter === 'AVAILABLE') return available && !isLow;
        if (statusFilter === 'LOW_STOCK') return isLow;
        if (statusFilter === 'OUT_OF_STOCK') return isOut;
        return true;
    });

    return (
        <Box className="space-y-4">
            {/* Header Thống Kê & Chuẩn Hóa Quản Lý Kho Thông Minh */}
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                            <StorefrontIcon fontSize="small" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white tracking-wide">
                                QUẢN LÝ KHO NGUYÊN LIỆU & ĐỊNH LƯỢNG (BOM)
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Theo dõi tồn kho thời gian thực, tự động trừ kho khi có đơn và tự động hoàn trả khi hủy đơn
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<HistoryIcon sx={{ fontSize: 18 }} />}
                        onClick={handleOpenLogs}
                        sx={{
                            color: '#60a5fa',
                            borderColor: 'rgba(96, 165, 250, 0.4)',
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            py: 0.6,
                            px: 1.5,
                            bgcolor: 'rgba(96, 165, 250, 0.08)',
                            '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.18)', borderColor: '#60a5fa' }
                        }}
                    >
                        Lịch Sử Xuất Nhập Kho
                    </Button>
                    <Chip 
                        icon={<CheckCircleIcon sx={{ fontSize: '16px !important', color: '#10b981 !important' }} />}
                        label={`${availableCount} Đang phục vụ`} 
                        size="small" 
                        sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)', fontWeight: 'bold' }} 
                    />
                    <Chip 
                        icon={<WarningIcon sx={{ fontSize: '16px !important', color: '#f59e0b !important' }} />}
                        label={`${lowStockCount} Sắp hết hàng`} 
                        size="small" 
                        sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.25)', fontWeight: 'bold' }} 
                    />
                    <Chip 
                        icon={<CancelIcon sx={{ fontSize: '16px !important', color: '#ef4444 !important' }} />}
                        label={`${outOfStockCount} Hết hàng / Tạm dừng`} 
                        size="small" 
                        sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)', fontWeight: 'bold' }} 
                    />
                </div>
            </div>

            {/* Bảng Dữ Liệu Chính */}
            <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2 }}>
                {/* Search & Filter Toolbar */}
                <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 w-full sm:w-auto flex-wrap">
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
                            🟢 Đủ hàng ({availableCount - lowStockCount})
                        </Button>
                        <Button 
                            size="small"
                            variant={statusFilter === 'LOW_STOCK' ? 'contained' : 'outlined'}
                            onClick={() => setStatusFilter('LOW_STOCK')}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                bgcolor: statusFilter === 'LOW_STOCK' ? '#f59e0b' : 'transparent',
                                color: statusFilter === 'LOW_STOCK' ? '#fff' : '#9ca3af',
                                borderColor: '#374151',
                                '&:hover': { bgcolor: statusFilter === 'LOW_STOCK' ? '#d97706' : 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            ⚠️ Sắp hết ({lowStockCount})
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
                            🔴 Cạn kho ({outOfStockCount})
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <TextField 
                            size="small"
                            placeholder="Tìm nguyên liệu, topping..."
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
                                width: { xs: '100%', sm: 220 },
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
                    <Table sx={{ minWidth: 750 }} aria-label="ingredients table">
                        <TableHead>
                            <TableRow sx={{ '& th': { color: '#9ca3af', borderBottom: '1px solid #1f2937', fontWeight: 600, fontSize: '0.8rem' } }}>
                                <TableCell>MÃ</TableCell>
                                <TableCell>TÊN NGUYÊN LIỆU / TOPPING</TableCell>
                                <TableCell>NHÓM PHÂN LOẠI</TableCell>
                                <TableCell align="center">TỒN KHO THỰC TẾ</TableCell>
                                <TableCell align="center">TRẠNG THÁI PHỤC VỤ (1 CHẠM)</TableCell>
                                <TableCell align="right">THAO TÁC</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredItems.map((item) => {
                                const available = isAvailable(item);
                                const isDepleted = item.quantity != null && item.quantity <= 0;
                                const isLow = available && !isDepleted && item.minThreshold != null && item.quantity <= item.minThreshold;

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
                                                <span className={`w-2.5 h-2.5 rounded-full ${isDepleted || !available ? 'bg-rose-500' : isLow ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                                                <span className={`font-bold ${isDepleted || !available ? 'text-gray-400' : 'text-gray-100'}`}>
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
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex items-baseline gap-1">
                                                    <span className={`font-black text-base ${isDepleted ? 'text-rose-400' : isLow ? 'text-amber-300' : 'text-emerald-400'}`}>
                                                        {item.quantity != null ? item.quantity : 0}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        {item.unit || "phần"}
                                                    </span>
                                                </div>
                                                <div>
                                                    {isDepleted || !available ? (
                                                        <Chip 
                                                            label="🔴 Cạn kho (0)" 
                                                            size="small" 
                                                            sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.68rem', height: 20, fontWeight: 'bold' }} 
                                                        />
                                                    ) : isLow ? (
                                                        <Chip 
                                                            label={`⚠️ Sắp hết (Ngưỡng: ${item.minThreshold || 5})`} 
                                                            size="small" 
                                                            sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.68rem', height: 20, fontWeight: 'bold' }} 
                                                        />
                                                    ) : (
                                                        <Chip 
                                                            label="🟢 Đủ tồn kho" 
                                                            size="small" 
                                                            sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.68rem', height: 20 }} 
                                                        />
                                                    )}
                                                </div>
                                            </div>
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
                                                    {available ? "🟢 Đang phục vụ" : "🔴 Tạm hết món"}
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box className="flex justify-end items-center gap-1">
                                                <Tooltip title="Nhập thêm hàng vào kho (+)">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleImportClick(item)}
                                                        sx={{ color: '#34d399', bgcolor: 'rgba(52, 211, 153, 0.1)', '&:hover': { bgcolor: 'rgba(52, 211, 153, 0.2)' } }}
                                                    >
                                                        <AddShoppingCartIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Chỉnh sửa định lượng & nhóm">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleEditClick(item)}
                                                        sx={{ color: '#60a5fa', '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.1)' } }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa Nguyên liệu">
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
                                    <TableCell colSpan={6} align="center" className="text-gray-500 py-8">
                                        {searchQuery 
                                            ? `Không tìm thấy nguyên liệu nào khớp với từ khóa "${searchQuery}"`
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

            {/* Modal Nhập Thêm Hàng Vào Kho */}
            <Modal open={importOpen} onClose={() => setImportOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 440, bgcolor: '#111827', color: 'white', outline: 'none', boxShadow: 24, p: 4, borderRadius: '16px', border: '1px solid #1f2937' }}>
                    <form onSubmit={handleImportSubmit}>
                        <h2 className='text-white font-black text-center text-xl tracking-wide pb-1'>
                            NHẬP THÊM HÀNG VÀO KHO
                        </h2>
                        <p className="text-xs text-gray-400 text-center mb-5">
                            Cộng dồn số lượng vào kho và tự động ghi nhật ký xuất nhập tồn
                        </p>

                        <div className="bg-[#1f2937] p-3 rounded-xl mb-4 border border-gray-700">
                            <div className="text-xs text-gray-400">Nguyên liệu:</div>
                            <div className="text-base font-bold text-white">{importItem?.name}</div>
                            <div className="text-xs text-emerald-400 mt-1">
                                Tồn kho hiện tại: <span className="font-bold">{importItem?.quantity != null ? importItem.quantity : 0} {importItem?.unit}</span>
                            </div>
                        </div>

                        <TextField 
                            fullWidth 
                            label={`Số lượng nhập thêm (${importItem?.unit || 'phần'})`} 
                            variant="outlined" 
                            type="number"
                            value={importQty} 
                            onChange={(e) => setImportQty(e.target.value)} 
                            sx={{ mb: 3, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.03)' } }} 
                            inputProps={{ min: 0.1, step: 0.1 }}
                            required 
                        />

                        <TextField 
                            fullWidth 
                            label="Ghi chú nhập kho" 
                            variant="outlined" 
                            value={importNote} 
                            onChange={(e) => setImportNote(e.target.value)} 
                            sx={{ mb: 4, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.03)' } }} 
                            placeholder="VD: Nhập thêm hàng mới từ nhà cung cấp"
                        />

                        <div className="flex gap-2">
                            <Button 
                                variant="outlined" 
                                onClick={() => setImportOpen(false)} 
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
                                    bgcolor: '#10b981', 
                                    '&:hover': { bgcolor: '#059669' }, 
                                    fontWeight: 'bold', 
                                    textTransform: 'none',
                                    borderRadius: '10px'
                                }}
                            >
                                Xác Nhận Nhập Kho
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Modal Xem Nhật Ký Biến Động Kho (Inventory Logs) */}
            <Dialog
                open={logsOpen}
                onClose={() => setLogsOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#111827',
                        color: 'white',
                        borderRadius: '16px',
                        border: '1px solid #1f2937',
                        p: 2
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                    <div className="flex items-center gap-2">
                        <HistoryIcon sx={{ color: '#60a5fa' }} />
                        <span className="font-extrabold text-lg text-white">NHẬT KÝ BIẾN ĐỘNG KHO (INVENTORY LOGS)</span>
                    </div>
                    <IconButton size="small" onClick={() => setLogsOpen(false)} sx={{ color: '#9ca3af' }}>
                        <CancelIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ px: 2, py: 1 }}>
                    <p className="text-xs text-gray-400 mb-3">
                        Hệ thống tự động ghi nhận mọi biến động: trừ kho khi khách đặt món, hoàn kho khi hủy đơn, và nhập kho thủ công.
                    </p>
                    <TableContainer component={Paper} sx={{ bgcolor: '#1f2937', maxHeight: 420 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow sx={{ '& th': { bgcolor: '#0f172a', color: '#9ca3af', fontWeight: 'bold' } }}>
                                    <TableCell>THỜI GIAN</TableCell>
                                    <TableCell>NGUYÊN LIỆU</TableCell>
                                    <TableCell align="center">LOẠI BIẾN ĐỘNG</TableCell>
                                    <TableCell align="right">THAY ĐỔI</TableCell>
                                    <TableCell align="right">TỒN SAU ĐÓ</TableCell>
                                    <TableCell>GHI CHÚ CHI TIẾT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ingredients.inventoryLogs && ingredients.inventoryLogs.length > 0 ? (
                                    ingredients.inventoryLogs.map((log) => {
                                        const isDepletion = log.actionType === 'AUTO_DEPLETION';
                                        const isRestore = log.actionType === 'AUTO_RESTORE';
                                        const isImport = log.actionType === 'MANUAL_IMPORT';
                                        return (
                                            <TableRow key={log.id} sx={{ '& td': { color: '#e5e7eb', borderColor: '#374151' } }}>
                                                <TableCell className="text-xs text-gray-400 whitespace-nowrap">
                                                    {log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : '—'}
                                                </TableCell>
                                                <TableCell className="font-bold text-white text-xs">
                                                    {log.ingredientName || `#${log.ingredientId}`}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={isDepletion ? "Trừ kho tự động" : isRestore ? "Hoàn kho tự động" : isImport ? "Nhập hàng" : log.actionType}
                                                        size="small"
                                                        sx={{
                                                            fontSize: '0.68rem',
                                                            height: 20,
                                                            bgcolor: isDepletion ? 'rgba(239, 68, 68, 0.2)' : isRestore ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                                            color: isDepletion ? '#f87171' : isRestore ? '#34d399' : '#60a5fa',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right" className={`font-mono font-bold text-xs ${log.changeAmount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount} {log.unit}
                                                </TableCell>
                                                <TableCell align="right" className="font-mono text-xs text-gray-300">
                                                    {log.remainingQuantity} {log.unit}
                                                </TableCell>
                                                <TableCell className="text-xs text-gray-400">
                                                    {log.note || '—'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" className="text-gray-400 py-6 text-xs">
                                            Chưa có bản ghi biến động kho nào. Hãy thử đặt 1 đơn hàng hoặc hủy đơn để kiểm tra!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setLogsOpen(false)} variant="contained" sx={{ bgcolor: '#374151', textTransform: 'none' }}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Chỉnh Sửa Topping / Nguyên Liệu */}
            <Modal open={editOpen} onClose={() => setEditOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 460, bgcolor: '#111827', color: 'white', outline: 'none', boxShadow: 24, p: 4, borderRadius: '16px', border: '1px solid #1f2937' }}>
                    <form onSubmit={handleEditSubmit}>
                        <h2 className='text-white font-black text-center text-xl tracking-wide pb-1'>
                            CẬP NHẬT NGUYÊN LIỆU & TỒN KHO
                        </h2>
                        <p className="text-xs text-gray-400 text-center mb-5">
                            Chỉnh sửa thông số định lượng và ngưỡng cảnh báo an toàn
                        </p>

                        <TextField 
                            fullWidth 
                            label="Tên Nguyên liệu / Topping" 
                            variant="outlined" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)} 
                            sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.03)' } }} 
                            required 
                        />
                        
                        <FormControl fullWidth sx={{ mb: 2.5 }}>
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

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <TextField 
                                label="Số lượng tồn" 
                                variant="outlined" 
                                type="number"
                                value={editQuantity} 
                                onChange={(e) => setEditQuantity(e.target.value)} 
                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.03)' } }} 
                                required 
                            />
                            <TextField 
                                label="Đơn vị tính" 
                                variant="outlined" 
                                value={editUnit} 
                                onChange={(e) => setEditUnit(e.target.value)} 
                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.03)' } }} 
                                placeholder="kg, quả..."
                                required 
                            />
                            <TextField 
                                label="Ngưỡng báo" 
                                variant="outlined" 
                                type="number"
                                value={editMinThreshold} 
                                onChange={(e) => setEditMinThreshold(e.target.value)} 
                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.03)' } }} 
                                title="Khi tồn kho <= ngưỡng này, hệ thống sẽ cảnh báo màu vàng"
                                required 
                            />
                        </div>

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
                    Xác Nhận Xóa Nguyên Liệu
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
