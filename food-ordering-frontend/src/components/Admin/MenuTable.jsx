import React, { useEffect, useState } from 'react';
import { Box, Card, CardHeader, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Button, Modal, TextField, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFoodAction, getMenuItemsByRestaurantId, updateMenuItemAction, updateMenuItemsAvailability } from '../../State/Menu/Action';
import { getIngredientsOfRestaurant } from '../../State/Ingredients/Action';
import { getRestaurantsCategory } from '../../State/Restaurant/Action';

export const MenuTable = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    const restaurant = useSelector(store => store.restaurant);
    const menu = useSelector(store => store.menu);
    const ingredients = useSelector(store => store.ingredients);

    const [editOpen, setEditOpen] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        foodCategoryObj: null,
        ingredients: [],
        vegetarian: false,
        seasonal: false,
        image: ""
    });

    // Custom confirm delete modal states
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteFoodId, setDeleteFoodId] = useState(null);

    const handleUpdateAvailability = (foodId) => {
        dispatch(updateMenuItemsAvailability({ foodId, jwt }));
    };

    // Kéo danh sách món ăn, danh mục, nguyên liệu khi load trang
    useEffect(() => {
        if (restaurant.usersRestaurant?.id) {
            dispatch(getMenuItemsByRestaurantId({
                jwt,
                restaurantId: restaurant.usersRestaurant.id,
                vegetarian: false,
                nonveg: false,
                seasonal: false,
                foodCategory: ""
            }));
            dispatch(getIngredientsOfRestaurant({ id: restaurant.usersRestaurant.id, jwt }));
            dispatch(getRestaurantsCategory({ restaurantId: restaurant.usersRestaurant.id, jwt }));
        }
    }, [dispatch, jwt, restaurant.usersRestaurant?.id]);

    const handleDeleteClick = (id) => {
        setDeleteFoodId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteFoodId) {
            dispatch(deleteFoodAction({ foodId: deleteFoodId, jwt }));
        }
        setConfirmOpen(false);
        setDeleteFoodId(null);
    };

    const handleEditClick = (item) => {
        setEditItemId(item.id);

        // Map food's ingredients to the matching reference in ingredients.ingredients so that MUI Select reference comparison works
        const matchedIngredients = (item.ingredients || []).map(ing => {
            const found = ingredients.ingredients?.find(i => i.id === ing.id);
            return found || ing;
        });

        setEditForm({
            name: item.name || "",
            price: item.price || "",
            description: item.description || "",
            category: item.foodCategory?.name || "",
            foodCategoryObj: item.foodCategory || null,
            ingredients: matchedIngredients,
            vegetarian: item.vegetarian || false,
            seasonal: item.seasonal || false,
            image: item.images?.[0] || ""
        });
        setEditOpen(true);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const selectedCategory = restaurant.categories?.find(cat => cat.name === editForm.category) || editForm.foodCategoryObj;
        const trimmedImage = (editForm.image || "").trim();
        const updatedData = {
            name: editForm.name,
            description: editForm.description,
            price: Number(editForm.price),
            category: selectedCategory,
            ingredients: editForm.ingredients,
            seasonal: Boolean(editForm.seasonal),
            vegetarian: Boolean(editForm.vegetarian),
            images: trimmedImage ? [trimmedImage] : [],
            restaurantId: restaurant.usersRestaurant?.id
        };
        dispatch(updateMenuItemAction({
            foodId: editItemId,
            menu: updatedData,
            jwt,
            restaurantId: restaurant.usersRestaurant?.id
        }));
        setEditOpen(false);
        setEditItemId(null);
    };

    return (
        <Box>
            <Card className='mt-1'>
                <CardHeader
                    action={
                        <IconButton 
                            onClick={() => navigate("/admin/restaurant/add-menu")} 
                            sx={{ color: '#ec4899', bgcolor: 'rgba(236, 72, 153, 0.1)', '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.2)' } }}
                            title="Thêm món ăn mới"
                        >
                            <AddIcon />
                        </IconButton>
                    }
                    title={"Danh Sách Thực Đơn"}
                    sx={{ pt: 2, alignItems: "center" }}
                />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Hình ảnh</TableCell>
                                <TableCell align="right">Tên món</TableCell>
                                <TableCell align="right">Nguyên liệu</TableCell>
                                <TableCell align="right">Giá</TableCell>
                                <TableCell align="right">Tình trạng</TableCell>
                                <TableCell align="right">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menu.menuItems?.map((item) => (
                                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Avatar src={item.images?.[0]} alt={item.name} />
                                    </TableCell>
                                    <TableCell align="right">{item.name}</TableCell>
                                    <TableCell align="right">
                                        {item.ingredients?.map((ing) => ing.name).join(", ")}
                                    </TableCell>
                                    <TableCell align="right">{item.price?.toLocaleString()} VND</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => handleUpdateAvailability(item.id)}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                py: 0.3,
                                                px: 1.5,
                                                bgcolor: item.available ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                                color: item.available ? '#34d399' : '#f87171',
                                                borderColor: item.available ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
                                                '&:hover': {
                                                    bgcolor: item.available ? 'rgba(239, 68, 68, 0.18)' : 'rgba(16, 185, 129, 0.18)',
                                                    borderColor: item.available ? '#ef4444' : '#10b981',
                                                    color: item.available ? '#fca5a5' : '#6ee7b7'
                                                }
                                            }}
                                            title="Bấm 1 chạm để đổi trạng thái Còn hàng / Tạm hết món"
                                        >
                                            {item.available ? "🟢 Đang bán" : "🔴 Tạm hết món"}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box className="flex justify-end gap-1">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditClick(item)}
                                                sx={{ color: '#60a5fa', mr: 1, '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.1)' } }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteClick(item.id)}
                                                sx={{ color: '#f87171', '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.1)' } }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Modal open={editOpen} onClose={() => setEditOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: '#1f2937', color: 'white', outline: 'none', boxShadow: 24, p: 4, borderRadius: '12px', maxHeight: '90vh', overflowY: 'auto' }}>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <h1 className='text-white font-bold text-center text-xl pb-4'>CẬP NHẬT MÓN ĂN</h1>
                        <TextField fullWidth label="Tên món ăn" name="name" value={editForm.name} onChange={handleEditChange} required />
                        <TextField fullWidth label="Giá tiền (VND)" name="price" type="number" value={editForm.price} onChange={handleEditChange} required />
                        <TextField fullWidth multiline rows={2} label="Mô tả chi tiết" name="description" value={editForm.description} onChange={handleEditChange} required />
                        <TextField fullWidth label="Link ảnh món ăn" name="image" value={editForm.image} onChange={handleEditChange} />

                        <FormControl fullWidth>
                            <InputLabel id="edit-menu-category-label">Danh mục</InputLabel>
                            <Select labelId="edit-menu-category-label" name="category" value={editForm.category} label="Danh mục" onChange={handleEditChange} required>
                                {restaurant.categories?.map((item) => (
                                    <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="edit-menu-ingredients-label">Nguyên liệu kèm theo</InputLabel>
                            <Select
                                labelId="edit-menu-ingredients-label"
                                multiple
                                name="ingredients"
                                value={editForm.ingredients}
                                onChange={handleEditChange}
                                input={<OutlinedInput label="Nguyên liệu kèm theo" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => <Chip key={value?.id || value} label={value?.name || value} />)}
                                    </Box>
                                )}
                            >
                                {ingredients.ingredients?.filter((item) => item.inStoke).map((item) => (
                                    <MenuItem key={item.id} value={item}>{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }} fullWidth size='large'>Cập nhật</Button>
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
                    Xác Nhận Xóa Món Ăn
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#d1d5db' }}>
                        Bạn có chắc chắn muốn xóa món ăn này khỏi thực đơn không? Hành động này không thể hoàn tác.
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