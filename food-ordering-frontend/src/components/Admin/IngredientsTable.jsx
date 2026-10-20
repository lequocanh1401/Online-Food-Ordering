import React, { useState, useEffect } from 'react';
import { 
    Box, Card, CardHeader, IconButton, Paper, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Button, Modal, 
    TextField, FormControl, InputLabel, Select, MenuItem, Dialog, 
    DialogTitle, DialogContent, DialogContentText, DialogActions, 
    Chip, Tabs, Tab, Typography, Tooltip, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import HistoryIcon from '@mui/icons-material/History';
import Inventory2Icon from '@mui/icons-material/Inventory2';

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

    const [activeTab, setActiveTab] = useState(0);

    // Edit modal states
    const [editOpen, setEditOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [editName, setEditName] = useState("");
    const [editCategoryId, setEditCategoryId] = useState("");
    const [editQuantity, setEditQuantity] = useState(50);
    const [editUnit, setEditUnit] = useState("phần");
    const [editMinThreshold, setEditMinThreshold] = useState(10);

    // Import stock modal states
    const [importOpen, setImportOpen] = useState(false);
    const [importItem, setImportItem] = useState(null);
    const [importQuantity, setImportQuantity] = useState(20);
    const [importNote, setImportNote] = useState("Nhập hàng từ nhà cung cấp");

    // Custom confirm delete modal states
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteIngredientId, setDeleteIngredientId] = useState(null);

    useEffect(() => {
        if (restaurantId && activeTab === 1) {
            dispatch(fetchInventoryLogsAction({ restaurantId, jwt }));
        }
    }, [dispatch, restaurantId, activeTab, jwt]);

    const handleUpdateStock = (id) => {
        dispatch(updateStockOfIngredient({ id, jwt }));
    };

    const handleEditClick = (item) => {
        setEditItem(item);
        setEditName(item.name || "");
        setEditCategoryId(item.category?.id || "");
        setEditQuantity(item.quantity != null ? item.quantity : 50);
        setEditUnit(item.unit || "phần");
        setEditMinThreshold(item.minThreshold != null ? item.minThreshold : 10);
        setEditOpen(true);
    };

    const handleImportClick = (item) => {
        setImportItem(item);
        setImportQuantity(20);
        setImportNote("Nhập thêm hàng từ nhà cung cấp");
        setImportOpen(true);
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        if (importItem && importQuantity > 0) {
            dispatch(importIngredientStockAction({
                id: importItem.id,
                additionalQuantity: Number(importQuantity),
                note: importNote,
                jwt,
                restaurantId
            }));
            setImportOpen(false);
            setImportItem(null);
        }
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

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: editName,
            categoryId: editCategoryId,
            quantity: Number(editQuantity),
            unit: editUnit,
            minThreshold: Number(editMinThreshold),
            restaurantId
        };
        dispatch(updateIngredientAction({ id: editItem.id, data, jwt, restaurantId }));
        setEditOpen(false);
        setEditItem(null);
    };

    const items = ingredients.ingredients || [];
    const outOfStockList = items.filter(i => (i.quantity != null ? i.quantity : 50) <= 0);
    const lowStockList = items.filter(i => {
        const q = i.quantity != null ? i.quantity : 50;
        const min = i.minThreshold != null ? i.minThreshold : 10;
        return q > 0 && q <= min;
    });

    const logs = ingredients.inventoryLogs || [];

    return (
        <Box className="space-y-4">
            {/* Tabs Điều Hướng */}
            <Paper sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={(e, val) => setActiveTab(val)}
                    textColor="secondary"
                    indicatorColor="secondary"
                    sx={{
                        '& .MuiTab-root': { color: '#9ca3af', textTransform: 'none', fontWeight: 600 },
                        '& .Mui-selected': { color: '#ec4899 !important' }
                    }}
                >
                    <Tab icon={<Inventory2Icon />} iconPosition="start" label="Kho Nguyên Liệu & Cảnh Báo" />
                    <Tab icon={<HistoryIcon />} iconPosition="start" label="Nhật Ký Trừ / Nhập Kho Tự Động (Audit Ledger)" />
                </Tabs>
            </Paper>

            {/* TAB 0: KHO NGUYÊN LIỆU */}
            {activeTab === 0 && (
                <div className="space-y-4">
                    {/* Cảnh báo cạn kho thông minh */}
                    {(outOfStockList.length > 0 || lowStockList.length > 0) && (
                        <div className="space-y-2">
                            {outOfStockList.length > 0 && (
                                <Alert 
                                    severity="error" 
                                    sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                    icon={<ErrorOutlineIcon sx={{ color: '#ef4444' }} />}
                                >
                                    <strong>CẢNH BÁO CẠN KHO:</strong> Có <strong>{outOfStockList.length}</strong> nguyên liệu đã hết hàng ({outOfStockList.map(i => i.name).join(", ")}). Khách hàng không thể đặt các món có nguyên liệu này.
                                </Alert>
                            )}
                            {lowStockList.length > 0 && (
                                <Alert 
                                    severity="warning" 
                                    sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fde68a', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                                    icon={<WarningIcon sx={{ color: '#f59e0b' }} />}
                                >
                                    <strong>CẢNH BÁO SẮP HẾT:</strong> Có <strong>{lowStockList.length}</strong> nguyên liệu dưới ngưỡng an toàn ({lowStockList.map(i => `${i.name} (còn ${i.quantity} ${i.unit || 'phần'})`).join(", ")}). Hãy nhập thêm hàng!
                                </Alert>
                            )}
                        </div>
                    )}

                    <Card className='mt-1' sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2 }}>
                        <CardHeader 
                            action={
                                <IconButton onClick={handleOpen} sx={{ color: '#ec4899', bgcolor: 'rgba(236, 72, 153, 0.1)', '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.2)' } }} title="Thêm nguyên liệu">
                                    <AddIcon />
                                </IconButton>
                            } 
                            title={
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-50 text-lg">Quản Lý Tồn Kho Nguyên Liệu</span>
                                    <Chip 
                                        label={`${items.length} mục trong kho`} 
                                        size="small" 
                                        sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#d1d5db', fontWeight: 600, fontSize: '0.75rem' }} 
                                    />
                                </div>
                            } 
                            sx={{ pt: 2, alignItems: "center" }} 
                        />
                        <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                            <Table sx={{ minWidth: 700 }} aria-label="inventory table">
                                <TableHead>
                                    <TableRow sx={{ '& th': { color: '#9ca3af', borderBottom: '1px solid #374151', fontWeight: 600 } }}>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Tên nguyên liệu</TableCell>
                                        <TableCell>Danh mục</TableCell>
                                        <TableCell align="center">Tồn kho hiện tại</TableCell>
                                        <TableCell align="center">Ngưỡng an toàn</TableCell>
                                        <TableCell align="center">Tình trạng kho</TableCell>
                                        <TableCell align="right">Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item) => {
                                        const qty = item.quantity != null ? item.quantity : 50;
                                        const min = item.minThreshold != null ? item.minThreshold : 10;
                                        const unit = item.unit || "phần";
                                        const isOut = qty <= 0;
                                        const isLow = qty > 0 && qty <= min;

                                        return (
                                            <TableRow key={item.id} sx={{ '& td': { color: '#f3f4f6', borderBottom: '1px solid #1f2937' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                                <TableCell component="th" scope="row" className="font-mono text-gray-500">#{item.id}</TableCell>
                                                <TableCell className="font-semibold text-gray-200">{item.name}</TableCell>
                                                <TableCell>{item.category?.name || "Chưa phân loại"}</TableCell>
                                                <TableCell align="center">
                                                    <span className={`font-bold font-mono text-sm ${isOut ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                        {qty} {unit}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center" className="text-gray-400 text-xs">
                                                    {min} {unit}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {isOut ? (
                                                        <Chip 
                                                            label="Cạn kho (0)" 
                                                            size="small" 
                                                            sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)', fontWeight: 'bold', fontSize: '0.72rem' }} 
                                                        />
                                                    ) : isLow ? (
                                                        <Chip 
                                                            label="Sắp hết! (Cần nhập)" 
                                                            size="small" 
                                                            sx={{ bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', fontWeight: 'bold', fontSize: '0.72rem' }} 
                                                        />
                                                    ) : (
                                                        <Chip 
                                                            label="Đủ tồn kho" 
                                                            size="small" 
                                                            sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', fontWeight: 'bold', fontSize: '0.72rem' }} 
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box className="flex justify-end items-center gap-1.5">
                                                        <Tooltip title="Nhập thêm hàng vào kho bếp">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => handleImportClick(item)}
                                                                startIcon={<AddBusinessIcon sx={{ fontSize: 16 }} />}
                                                                sx={{
                                                                    borderColor: 'rgba(16, 185, 129, 0.4)',
                                                                    color: '#34d399',
                                                                    textTransform: 'none',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.75rem',
                                                                    py: 0.25,
                                                                    px: 1,
                                                                    '&:hover': { borderColor: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.1)' }
                                                                }}
                                                            >
                                                                Nhập kho
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip title="Chỉnh sửa thông số">
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleEditClick(item)}
                                                                sx={{ color: '#60a5fa', '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.1)' } }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Xóa nguyên liệu">
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
                                    {items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" className="text-gray-500 py-6">
                                                Chưa có nguyên liệu nào. Nhấn biểu tượng (+) ở góc trên để tạo mới.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </div>
            )}

            {/* TAB 1: SỔ NHẬT KÝ XUẤT / NHẬP KHO TỰ ĐỘNG */}
            {activeTab === 1 && (
                <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 2 }}>
                    <CardHeader 
                        title={
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <HistoryIcon sx={{ color: '#ec4899' }} />
                                    <span className="font-bold text-gray-50 text-lg">Sổ Nhật Ký Xuất / Nhập Kho Tự Động (Inventory Audit Trail)</span>
                                </div>
                                <Typography variant="caption" className="text-gray-400">
                                    Ghi nhận tự động biến động tồn kho khi có đơn hàng hoặc nhập kho
                                </Typography>
                            </div>
                        }
                        sx={{ pt: 2 }}
                    />
                    <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                        <Table sx={{ minWidth: 800 }} aria-label="audit trail table">
                            <TableHead>
                                <TableRow sx={{ '& th': { color: '#9ca3af', borderBottom: '1px solid #374151', fontWeight: 600 } }}>
                                    <TableCell>Thời gian</TableCell>
                                    <TableCell>Loại biến động</TableCell>
                                    <TableCell>Nguyên liệu</TableCell>
                                    <TableCell align="center">Thay đổi</TableCell>
                                    <TableCell align="center">Tồn sau thay đổi</TableCell>
                                    <TableCell>Diễn giải chi tiết</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((log) => {
                                    const isMinus = (log.changeAmount || 0) < 0;
                                    const isAuto = log.actionType === "AUTO_DEPLETION";
                                    const isRestore = log.actionType === "AUTO_RESTORE";

                                    return (
                                        <TableRow key={log.id} sx={{ '& td': { color: '#f3f4f6', borderBottom: '1px solid #1f2937' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                            <TableCell className="text-xs text-gray-400">
                                                {log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : "Mới đây"}
                                            </TableCell>
                                            <TableCell>
                                                {isAuto ? (
                                                    <Chip 
                                                        label={`Tự động xuất kho ${log.orderId ? `(#${log.orderId})` : ''}`} 
                                                        size="small" 
                                                        sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: 'bold', fontSize: '0.7rem' }} 
                                                    />
                                                ) : isRestore ? (
                                                    <Chip 
                                                        label={`Hoàn kho hủy đơn ${log.orderId ? `(#${log.orderId})` : ''}`} 
                                                        size="small" 
                                                        sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 'bold', fontSize: '0.7rem' }} 
                                                    />
                                                ) : (
                                                    <Chip 
                                                        label="Nhập kho bếp" 
                                                        size="small" 
                                                        sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 'bold', fontSize: '0.7rem' }} 
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell className="font-semibold text-gray-200">{log.ingredientName}</TableCell>
                                            <TableCell align="center">
                                                <span className={`font-mono font-bold ${isMinus ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                    {isMinus ? '' : '+'}{log.changeAmount} {log.unit}
                                                </span>
                                            </TableCell>
                                            <TableCell align="center" className="font-mono font-bold text-gray-300">
                                                {log.remainingQuantity} {log.unit}
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-400">
                                                {log.note || "Giao dịch hệ thống"}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {logs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" className="text-gray-500 py-6">
                                            Chưa có nhật ký biến động kho nào được ghi nhận.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {/* Modal Tạo Mới Nguyên Liệu */}
            <CreateIngredientForm open={open} handleClose={handleClose} />

            {/* Modal Nhập Thêm Kho */}
            <Modal open={importOpen} onClose={() => setImportOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 420, bgcolor: '#1f2937', color: 'white', outline: 'none', boxShadow: 24, p: 4, borderRadius: '12px' }}>
                    <form onSubmit={handleImportSubmit}>
                        <h2 className='text-white font-bold text-center text-xl pb-2'>NHẬP HÀNG VÀO KHO BẾP</h2>
                        <p className="text-xs text-gray-400 text-center mb-5">
                            Nguyên liệu: <strong className="text-pink-400">{importItem?.name}</strong> (Hiện có: {importItem?.quantity} {importItem?.unit || 'phần'})
                        </p>
                        
                        <TextField 
                            fullWidth 
                            label={`Số lượng nhập thêm (${importItem?.unit || 'phần'})`} 
                            type="number" 
                            variant="outlined" 
                            value={importQuantity} 
                            onChange={(e) => setImportQuantity(e.target.value)} 
                            sx={{ mb: 2.5 }} 
                            required 
                        />

                        <TextField 
                            fullWidth 
                            label="Ghi chú nguồn hàng / Nhà cung cấp" 
                            variant="outlined" 
                            value={importNote} 
                            onChange={(e) => setImportNote(e.target.value)} 
                            sx={{ mb: 3 }} 
                        />

                        <div className="flex gap-2">
                            <Button variant="outlined" onClick={() => setImportOpen(false)} fullWidth sx={{ color: '#9ca3af', borderColor: '#4b5563' }}>
                                Hủy
                            </Button>
                            <Button variant="contained" color="success" type="submit" fullWidth sx={{ fontWeight: 'bold' }}>
                                Xác Nhận Nhập
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Modal Chỉnh Sửa Nguyên Liệu */}
            <Modal open={editOpen} onClose={() => setEditOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 440, bgcolor: '#1f2937', color: 'white', outline: 'none', boxShadow: 24, p: 4, borderRadius: '12px' }}>
                    <form onSubmit={handleEditSubmit}>
                        <h1 className='text-white font-bold text-center text-xl pb-6'>CẬP NHẬT NGUYÊN LIỆU</h1>
                        <TextField fullWidth label="Tên nguyên liệu" variant="outlined" value={editName} onChange={(e) => setEditName(e.target.value)} sx={{ mb: 2.5 }} required />
                        
                        <FormControl fullWidth sx={{ mb: 2.5 }}>
                            <InputLabel id="edit-category-label">Danh mục</InputLabel>
                            <Select labelId="edit-category-label" value={editCategoryId} label="Danh mục" onChange={(e) => setEditCategoryId(e.target.value)} required>
                                {ingredients.category?.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <div className="grid grid-cols-2 gap-3 mb-2.5">
                            <TextField 
                                fullWidth 
                                label="Số lượng tồn kho" 
                                type="number" 
                                variant="outlined" 
                                value={editQuantity} 
                                onChange={(e) => setEditQuantity(e.target.value)} 
                            />
                            <TextField 
                                fullWidth 
                                label="Đơn vị tính" 
                                variant="outlined" 
                                value={editUnit} 
                                onChange={(e) => setEditUnit(e.target.value)} 
                            />
                        </div>

                        <TextField 
                            fullWidth 
                            label="Ngưỡng cảnh báo an toàn" 
                            type="number" 
                            variant="outlined" 
                            value={editMinThreshold} 
                            onChange={(e) => setEditMinThreshold(e.target.value)} 
                            sx={{ mb: 3 }} 
                        />

                        <Button variant="contained" color="primary" type="submit" fullWidth size='large'>Lưu Thay Đổi</Button>
                    </form>
                </Box>
            </Modal>

            {/* Custom confirm delete Dialog */}
            <Dialog 
                open={confirmOpen} 
                onClose={() => setConfirmOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#1f2937',
                        color: 'white',
                        borderRadius: '12px',
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
                        Bạn có chắc chắn muốn xóa nguyên liệu này không? Các công thức món ăn chứa nguyên liệu này sẽ bị ảnh hưởng.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={() => setConfirmOpen(false)} 
                        sx={{ color: '#9ca3af', '&:hover': { bgcolor: 'rgba(156, 163, 175, 0.1)' } }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        variant="contained" 
                        color="error"
                        sx={{ borderRadius: '6px', fontWeight: 'bold' }}
                    >
                        Xác nhận xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};