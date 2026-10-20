import React, { useEffect, useState } from 'react';
import { Box, Card, CardHeader, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { CreateFoodCategoryForm } from './CreateFoodCategoryForm';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantsCategory, deleteCategoryAction, updateCategoryAction } from '../../State/Restaurant/Action';

const editModalStyle = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', width: 420,
    bgcolor: '#1f2937', color: 'white', boxShadow: 24, p: 4, borderRadius: '12px',
    outline: 'none'
};

export const FoodCategory = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { restaurant } = useSelector(store => store);

    const [editOpen, setEditOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [editName, setEditName] = useState("");

    // Custom confirm delete modal states
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);

    // Tự động gọi API lấy danh mục món ăn của quán khi tải trang
    useEffect(() => {
        if (restaurant.usersRestaurant?.id) {
            dispatch(getRestaurantsCategory({
                restaurantId: restaurant.usersRestaurant?.id,
                jwt
            }));
        }
    }, [restaurant.usersRestaurant?.id, dispatch, jwt]);

    const handleEditClick = (category) => {
        setEditCategory(category);
        setEditName(category.name);
        setEditOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteCategoryId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteCategoryId) {
            dispatch(deleteCategoryAction({ categoryId: deleteCategoryId, jwt, restaurantId: restaurant.usersRestaurant?.id }));
        }
        setConfirmOpen(false);
        setDeleteCategoryId(null);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: editName,
            restaurantId: restaurant.usersRestaurant?.id
        };
        dispatch(updateCategoryAction({ categoryId: editCategory.id, data, jwt, restaurantId: restaurant.usersRestaurant?.id }));
        setEditOpen(false);
        setEditCategory(null);
    };

    return (
        <div className='px-2'>
            <Box>
                <Card className='mt-1'>
                    <CardHeader
                        action={
                            <IconButton 
                                onClick={handleOpen} 
                                sx={{ color: '#ec4899', bgcolor: 'rgba(236, 72, 153, 0.1)', '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.2)' } }} 
                                title="Thêm danh mục mới"
                            >
                                <AddIcon />
                            </IconButton>
                        }
                        title={"Danh Mục Món Ăn"}
                        sx={{ pt: 2, alignItems: "center" }}
                    />
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell align="left">Tên Danh Mục</TableCell>
                                    <TableCell align="right">Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Duyệt qua mảng danh mục thật trả về từ Redux Store */}
                                {restaurant.categories?.map((item) => (
                                    <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">{item.id}</TableCell>
                                        <TableCell align="left">{item.name}</TableCell>
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
            </Box>

            <CreateFoodCategoryForm open={open} handleClose={handleClose} />

            <Modal open={editOpen} onClose={() => setEditOpen(false)}>
                <Box sx={editModalStyle}>
                    <form onSubmit={handleEditSubmit}>
                        <h1 className='text-white font-bold text-center text-xl pb-6'>CẬP NHẬT DANH MỤC</h1>
                        <TextField 
                            fullWidth 
                            label="Tên danh mục mới" 
                            variant="outlined" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)} 
                            sx={{ mb: 3 }} 
                            required 
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            type="submit" 
                            fullWidth 
                            size='large'
                        >
                            Cập nhật
                        </Button>
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
                    Xác Nhận Xóa Danh Mục
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#d1d5db' }}>
                        Bạn có chắc chắn muốn xóa danh mục này không? Các món ăn thuộc danh mục này sẽ bị ảnh hưởng.
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
        </div>
    );
};