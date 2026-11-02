import React, { useState, useMemo } from 'react';
import { 
    Box, Button, Modal, TextField, Chip, Typography, 
    IconButton, Alert, Divider 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createCategoryAction } from '../../State/Restaurant/Action';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 520 },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: '#0f172a',
    color: 'white',
    outline: 'none',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
    p: 3.5,
    borderRadius: '20px',
    border: '1px solid #1e293b'
};

// Danh sách các danh mục chuẩn hóa theo ngành F&B Việt Nam & Quốc tế
const STANDARD_CATEGORIES = [
    { name: "Cơm & Món chính", icon: "🍚" },
    { name: "Bún, Phở & Mì", icon: "🍜" },
    { name: "Khai vị & Ăn vặt", icon: "🍟" },
    { name: "Món xào, Canh & Lẩu", icon: "🍲" },
    { name: "Đồ uống & Trà sữa", icon: "🥤" },
    { name: "Tráng miệng & Chè", icon: "🍨" },
    { name: "Món chay thanh đạm", icon: "🥗" },
    { name: "Thức ăn nhanh (Fast Food)", icon: "🍔" },
    { name: "Nướng & Hải sản", icon: "🥩" },
    { name: "Combo & Suất ăn", icon: "🍱" }
];

export const CreateFoodCategoryForm = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { restaurant } = useSelector(store => store);

    const [categoryName, setCategoryName] = useState("");
    const [selectedQuickCategory, setSelectedQuickCategory] = useState(null);

    // Danh sách các tên danh mục hiện có của nhà hàng (chuyển chữ thường để so trùng)
    const existingCategories = useMemo(() => {
        return (restaurant.categories || []).map(c => (c.name || "").trim().toLowerCase());
    }, [restaurant.categories]);

    // Kiểm tra tên đang nhập có bị trùng lặp không
    const isDuplicate = useMemo(() => {
        const trimmed = categoryName.trim().toLowerCase();
        if (!trimmed) return false;
        return existingCategories.includes(trimmed);
    }, [categoryName, existingCategories]);

    // Chọn nhanh từ gợi ý
    const handleSelectQuickCategory = (item) => {
        setSelectedQuickCategory(item.name);
        setCategoryName(item.name);
    };

    // Chọn chế độ tự nhập
    const handleSelectCustom = () => {
        setSelectedQuickCategory("CUSTOM");
        setCategoryName("");
    };

    // Xử lý gửi tạo danh mục
    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = categoryName.trim();
        if (!trimmed || isDuplicate) return;

        const reqData = {
            name: trimmed,
            restaurantId: restaurant.usersRestaurant?.id
        };

        dispatch(createCategoryAction({ reqData, jwt }));

        // Reset và đóng form
        setCategoryName("");
        setSelectedQuickCategory(null);
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-food-category-title"
        >
            <Box sx={modalStyle}>
                {/* Header Modal */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-500">
                            <CategoryIcon sx={{ fontSize: 22 }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-100 tracking-wide">
                                THÊM DANH MỤC MÓN ĂN
                            </h2>
                            <p className="text-xs text-gray-400">
                                Chuẩn hóa thực đơn giúp khách hàng tìm món dễ dàng hơn
                            </p>
                        </div>
                    </div>
                    <IconButton 
                        onClick={handleClose} 
                        size="small" 
                        sx={{ color: '#94a3b8', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Phần 1: Gợi ý các danh mục chuẩn 1-chạm */}
                    <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-2 uppercase tracking-wider">
                            1. Chọn nhanh danh mục phổ biến:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {STANDARD_CATEGORIES.map((cat) => {
                                const alreadyExists = existingCategories.includes(cat.name.toLowerCase());
                                const isSelected = selectedQuickCategory === cat.name;

                                return (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        disabled={alreadyExists}
                                        onClick={() => handleSelectQuickCategory(cat)}
                                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-left transition-all border ${
                                            alreadyExists 
                                                ? 'bg-slate-900/40 border-slate-800/60 text-gray-500 cursor-not-allowed opacity-60' 
                                                : isSelected
                                                    ? 'bg-pink-500/15 border-pink-500 text-pink-300 shadow-sm shadow-pink-500/20'
                                                    : 'bg-slate-900/90 border-slate-800 text-gray-300 hover:border-slate-700 hover:text-white hover:bg-slate-850'
                                        }`}
                                    >
                                        <span className="text-base shrink-0">{cat.icon}</span>
                                        <span className="truncate flex-1">{cat.name}</span>
                                        {alreadyExists && (
                                            <span className="text-[10px] text-gray-500 shrink-0 font-mono">Đã có</span>
                                        )}
                                        {isSelected && !alreadyExists && (
                                            <CheckCircleIcon sx={{ fontSize: 14, color: '#ec4899', flexShrink: 0 }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Nút tùy chọn Tự nhập */}
                        <button
                            type="button"
                            onClick={handleSelectCustom}
                            className={`w-full mt-2 p-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                                selectedQuickCategory === "CUSTOM"
                                    ? 'bg-purple-500/15 border-purple-500 text-purple-300'
                                    : 'bg-slate-900/60 border-slate-800/80 text-gray-400 hover:border-slate-700 hover:text-gray-200'
                            }`}
                        >
                            <span>✏️</span>
                            <span>Khác... (Tự nhập tên danh mục theo phong cách riêng của quán)</span>
                        </button>
                    </div>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                    {/* Phần 2: Ô xác nhận & chỉnh sửa tên danh mục */}
                    <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1.5 uppercase tracking-wider">
                            2. Tên danh mục sẽ hiển thị:
                        </label>
                        <TextField
                            fullWidth
                            size="small"
                            id="categoryName"
                            name="categoryName"
                            placeholder="Nhập hoặc chọn tên danh mục ở trên..."
                            variant="outlined"
                            value={categoryName}
                            onChange={(e) => {
                                setCategoryName(e.target.value);
                                setSelectedQuickCategory("CUSTOM");
                            }}
                            error={isDuplicate}
                            helperText={
                                isDuplicate 
                                    ? "⚠️ Quán của bạn đã có danh mục này rồi! Vui lòng chọn hoặc nhập tên khác." 
                                    : "Tên danh mục sẽ xuất hiện trên thanh điều hướng thực đơn của khách hàng."
                            }
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#0b1120',
                                    color: 'white',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    '& fieldset': { borderColor: isDuplicate ? '#ef4444' : '#334155' },
                                    '&:hover fieldset': { borderColor: isDuplicate ? '#ef4444' : '#ec4899' },
                                    '&.Mui-focused fieldset': { borderColor: isDuplicate ? '#ef4444' : '#ec4899' },
                                },
                                '& .MuiFormHelperText-root': {
                                    color: isDuplicate ? '#f87171' : '#94a3b8',
                                    fontSize: '0.75rem',
                                    mt: 0.5
                                }
                            }}
                        />
                    </div>

                    {/* Nút hành động */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{
                                color: '#94a3b8',
                                borderColor: '#334155',
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 2.5,
                                '&:hover': { borderColor: '#475569', color: 'white' }
                            }}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={!categoryName.trim() || isDuplicate}
                            sx={{
                                bgcolor: '#ec4899',
                                '&:hover': { bgcolor: '#db2777' },
                                '&.Mui-disabled': { bgcolor: '#334155', color: '#64748b' },
                                color: 'white',
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3
                            }}
                        >
                            Tạo Danh Mục
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};