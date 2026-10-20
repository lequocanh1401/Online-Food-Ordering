import React from 'react';
import { Box, Button, Modal, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createCategoryAction } from '../../State/Restaurant/Action'; // Cấu hình đường dẫn Action của Zosh

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 420,
    bgcolor: '#1f2937',
    color: 'white',
    outline: 'none',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px'
};

export const CreateFoodCategoryForm = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    // Lấy thông tin nhà hàng từ kho Redux để biết danh mục này thuộc về quán nào
    const { restaurant } = useSelector(store => store);

    const formik = useFormik({
        initialValues: {
            categoryName: "",
        },
        onSubmit: (values) => {
            const reqData = {
                name: values.categoryName,
                restaurantId: restaurant.usersRestaurant?.id
            };
            console.log("Đang gửi API tạo danh mục mới:", reqData);

            // Gọi Action gửi lên Spring Boot
            dispatch(createCategoryAction({ reqData, jwt }));

            formik.resetForm();
            handleClose();
        }
    });

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <form onSubmit={formik.handleSubmit}>
                    <h1 className='text-white font-bold text-center text-xl pb-6'>
                        THÊM DANH MỤC MỚI
                    </h1>
                    <TextField
                        fullWidth
                        id="categoryName"
                        name="categoryName"
                        label="Tên Danh Mục (VD: Tráng Miệng, Đồ Uống...)"
                        variant="outlined"
                        onChange={formik.handleChange}
                        value={formik.values.categoryName}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 3 }}
                        fullWidth
                        size='large'
                    >
                        Tạo Danh Mục
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};