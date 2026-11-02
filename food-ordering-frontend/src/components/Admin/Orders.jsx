import React, { useState } from 'react';
import { Card, FormControl, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';
import { OrderTable } from './OrderTable';

const orderStatus = [
    { label: "Tất cả", value: "ALL" },
    { label: "Chờ xử lý", value: "PENDING" },
    { label: "Đang giao", value: "OUT_FOR_DELIVERY" },
    { label: "Hoàn thành", value: "COMPLETED" },
    { label: "Đã hủy", value: "CANCELLED" }
];

export const Orders = () => {
    const [filterValue, setFilterValue] = useState("ALL");

    const handleFilter = (e) => {
        setFilterValue(e.target.value);
    };

    return (
        <div className='px-2'>
            <Card className='p-5'>
                <Typography sx={{ paddingBottom: "1rem" }} variant='h5'>
                    Lọc Trạng Thái Đơn Hàng
                </Typography>
                <FormControl>
                    <RadioGroup
                        row
                        name='orderStatus'
                        value={filterValue}
                        onChange={handleFilter}
                    >
                        {orderStatus.map((item) => (
                            <FormControlLabel
                                key={item.label}
                                value={item.value}
                                control={<Radio color="primary" />}
                                label={item.label}
                                sx={{ color: filterValue === item.value ? 'primary.main' : 'gray' }}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Card>

            {/* Gọi bảng ra và truyền trạng thái lọc xuống */}
            <OrderTable filterValue={filterValue} />
        </div>
    );
};