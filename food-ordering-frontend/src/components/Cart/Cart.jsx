import React, { useEffect, useState } from 'react';
import { 
    Box, Button, Card, Divider, Grid, TextField, IconButton, Typography, 
    Dialog, DialogTitle, DialogContent, DialogActions, Chip, Alert 
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentsIcon from '@mui/icons-material/Payments';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../State/Order/Action';
import { updateCartItem, removeCartItem, findUserCart } from '../../State/Cart/Action';
import { api } from '../../config/api';

export const Cart = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    const navigate = useNavigate();
    // Rút kho giỏ hàng ra
    const cartData = useSelector(store => store.cart);
    const auth = useSelector(store => store.auth);

    // Bộ lọc vét dữ liệu
    const cartItems = cartData.cartItems || cartData.cart?.item || cartData.cart?.items || [];
    const cartTotal = cartData.cart?.total || cartData.cart?.totalPrice || 0;

    // Coupon states
    const [promoCode, setPromoCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [promoError, setPromoError] = useState("");
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [openCouponModal, setOpenCouponModal] = useState(false);
    const [autoAppliedMsg, setAutoAppliedMsg] = useState("");

    // Phương thức thanh toán: "STRIPE" (Mặc định) hoặc "COD" (Tiền mặt)
    const [paymentMethod, setPaymentMethod] = useState("STRIPE");

    // Lấy danh sách tất cả các quán đang có món trong giỏ hàng
    const restaurantsInCart = Array.from(
        new Map(
            cartItems
                .filter(item => item.food?.restaurant?.id)
                .map(item => [item.food.restaurant.id, item.food.restaurant])
        ).values()
    );
    const restaurantIds = restaurantsInCart.map(r => r.id);
    const hasMultipleRestaurants = restaurantIds.length > 1;
    const restaurantName = restaurantsInCart.map(r => r.name).join(", ") || "quán ăn";

    // Tính tổng tiền các món thuộc phạm vi áp dụng của Coupon
    const getApplicableSubtotalForCoupon = (coupon) => {
        if (!coupon) return 0;
        if (coupon.restaurant?.id) {
            // Mã của Quán: Chỉ tính tổng tiền các món thuộc đúng quán đó
            return cartItems
                .filter(item => item.food?.restaurant?.id === coupon.restaurant.id)
                .reduce((acc, it) => acc + (it.food?.price || 0) * it.quantity, 0);
        }
        // Mã toàn sàn: Áp dụng trên toàn bộ giỏ hàng
        return cartTotal;
    };

    // Tải danh sách mã ưu đãi của các quán có món trong giỏ và mã toàn sàn
    useEffect(() => {
        const fetchAvailableCoupons = async () => {
            if (restaurantIds.length === 0) {
                setAvailableCoupons([]);
                return;
            }
            try {
                const { data } = await api.get('/api/coupons', {
                    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
                });
                if (data && Array.isArray(data)) {
                    // Lọc mã đang active: thuộc một trong các quán trong giỏ HOẶC mã toàn sàn (restaurant == null)
                    const filtered = data.filter(c => c.active && (!c.restaurant || restaurantIds.includes(c.restaurant?.id)));
                    setAvailableCoupons(filtered);
                }
            } catch (err) {
                console.error("Lỗi lấy danh sách mã giảm giá:", err);
            }
        };
        fetchAvailableCoupons();
    }, [restaurantIds.join(','), jwt]);

    // Hàm áp dụng mã giảm giá 1-Click
    const applyCouponByCode = async (codeToApply, restId = null, isAuto = false) => {
        if (!codeToApply || cartItems.length === 0) return;
        try {
            const targetRestId = restId || restaurantIds[0];
            const { data } = await api.get(`/api/coupons/validate?code=${encodeURIComponent(codeToApply.trim().toUpperCase())}&restaurantId=${targetRestId}`, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            if (data && data.active) {
                const applicableSubtotal = getApplicableSubtotalForCoupon(data);

                if (data.restaurant && applicableSubtotal === 0) {
                    if (!isAuto) setPromoError(`Mã này chỉ áp dụng cho món của ${data.restaurant.name}. Giỏ hàng chưa có món của quán này.`);
                    setAppliedCoupon(null);
                    return;
                }

                if (applicableSubtotal < (data.minimumOrderValue || 0)) {
                    if (!isAuto) {
                        setPromoError(data.restaurant 
                            ? `Tổng món của ${data.restaurant.name} (${applicableSubtotal.toLocaleString()} đ) chưa đạt tối thiểu ${(data.minimumOrderValue || 0).toLocaleString()} đ để dùng mã này.`
                            : `Đơn hàng tối thiểu từ ${(data.minimumOrderValue || 0).toLocaleString()} đ để áp dụng mã này.`
                        );
                    }
                    setAppliedCoupon(null);
                } else {
                    setAppliedCoupon(data);
                    setPromoCode(data.code);
                    setPromoError("");
                    if (isAuto) {
                        setAutoAppliedMsg(`Đã tự động áp dụng mã ưu đãi "${data.code}"!`);
                    }
                }
            } else {
                if (!isAuto) setPromoError("Mã giảm giá đã hết hiệu lực");
                setAppliedCoupon(null);
            }
        } catch (err) {
            if (!isAuto) setPromoError("Mã giảm giá không hợp lệ");
            setAppliedCoupon(null);
        }
    };

    // Tự động kiểm tra và áp dụng mã đã lưu từ trang Sự kiện (Auto-Apply)
    useEffect(() => {
        const pendingRaw = localStorage.getItem("pending_coupon");
        if (pendingRaw && cartItems.length > 0 && !appliedCoupon) {
            try {
                const pending = JSON.parse(pendingRaw);
                const isMatch = !pending.restaurantId || restaurantIds.includes(pending.restaurantId);
                const isFresh = Date.now() - pending.timestamp < 24 * 60 * 60 * 1000;
                if (isMatch && isFresh && pending.code) {
                    applyCouponByCode(pending.code, pending.restaurantId, true);
                    localStorage.removeItem("pending_coupon");
                }
            } catch (e) {
                console.error("Lỗi đọc pending_coupon:", e);
            }
        }
    }, [cartItems, cartTotal, restaurantIds.join(','), appliedCoupon]);

    const handleApplyPromo = () => {
        if (!promoCode.trim()) {
            setPromoError("Vui lòng nhập mã giảm giá");
            return;
        }
        applyCouponByCode(promoCode, null, false);
    };

    const handleRemovePromo = () => {
        setAppliedCoupon(null);
        setPromoCode("");
        setPromoError("");
        setAutoAppliedMsg("");
    };

    // Tính số tiền giảm giá CHỈ TRÊN CÁC MÓN THUỘC QUÁN ÁP DỤNG
    const getDiscountAmount = () => {
        if (!appliedCoupon) return 0;
        const applicableSubtotal = getApplicableSubtotalForCoupon(appliedCoupon);
        if (applicableSubtotal === 0) return 0;
        if (appliedCoupon.discountType === "PERCENTAGE") {
            return (applicableSubtotal * appliedCoupon.discountValue) / 100;
        }
        return Math.min(appliedCoupon.discountValue, applicableSubtotal);
    };

    const discount = getDiscountAmount();
    const finalTotal = Math.max(0, cartTotal - discount);

    useEffect(() => {
        if (jwt) {
            dispatch(findUserCart(jwt));
        }
    }, [dispatch, jwt]);

    // Kiểm tra gỡ mã nếu người dùng giảm bớt món ăn khiến tổng tiền quán đó không đủ điều kiện
    useEffect(() => {
        if (appliedCoupon) {
            const applicableSubtotal = getApplicableSubtotalForCoupon(appliedCoupon);
            if (applicableSubtotal < (appliedCoupon.minimumOrderValue || 0)) {
                setAppliedCoupon(null);
                setPromoError(`Mã giảm giá ${appliedCoupon.code} đã bị gỡ do món của quán chưa đạt giá trị tối thiểu ${(appliedCoupon.minimumOrderValue || 0).toLocaleString()} đ.`);
            }
        }
    }, [cartTotal, cartItems, appliedCoupon]);

    const formik = useFormik({
        initialValues: { streetAddress: "", state: "", pincode: "", city: "" },
        onSubmit: (values) => {
            const reqData = {
                deliveryAddress: {
                    streetAddress: values.streetAddress,
                    city: values.city,
                    stateProvince: values.state,
                    postalCode: values.pincode,
                    country: "Vietnam"
                },
                restaurantId: cartItems[0]?.food?.restaurant?.id,
                couponCode: appliedCoupon ? appliedCoupon.code : null
            };
            console.log("Đang gửi API Đặt Hàng:", reqData);
            dispatch(createOrder({ reqData, jwt, navigate, paymentMethod }));
            formik.resetForm();
            setAppliedCoupon(null);
            setPromoCode("");
        }
    });

    // Tự động điền địa chỉ mặc định vào form khi vào Giỏ hàng
    useEffect(() => {
        if (auth.user?.addresses && auth.user.addresses.length > 0) {
            // Chỉ điền nếu form đang trống
            if (!formik.values.streetAddress) {
                let defaultId = null;
                try {
                    const saved = localStorage.getItem("default_address_id");
                    if (saved) defaultId = Number(saved);
                } catch {}

                const defaultAddr = auth.user.addresses.find(a => a.id === defaultId) || auth.user.addresses[0];
                if (defaultAddr) {
                    formik.setValues({
                        streetAddress: defaultAddr.streetAddress || "",
                        state: defaultAddr.stateProvince || defaultAddr.state || "",
                        city: defaultAddr.city || "",
                        pincode: defaultAddr.postalCode || "10000"
                    });
                }
            }
        }
    }, [auth.user?.addresses]);

    const handleUpdateCartItem = (cartItemId, quantity) => {
        if (quantity === 0) {
            dispatch(removeCartItem({ cartItemId, jwt }));
        } else {
            dispatch(updateCartItem({ cartItemId, quantity, jwt }));
        }

        // Dùng setTimeout ép React chờ 300ms cho Backend tính toán xong 
        // rồi mới tự động kéo giỏ hàng mới về
        setTimeout(() => {
            dispatch(findUserCart(jwt));
        }, 300);
    };

    return (
        <div className='text-white min-h-screen p-5 lg:px-20'>
            <main className='lg:flex justify-between gap-10 mt-10'>

                {/* CỘT TRÁI: DANH SÁCH MÓN ĂN */}
                <section className='lg:w-[40%] space-y-4 pb-10'>
                    <h1 className='text-2xl font-semibold border-b border-gray-800 pb-3'>Giỏ Hàng Của Bạn</h1>

                    {/* Cảnh báo khi giỏ hàng có món của nhiều nhà hàng khác nhau */}
                    {hasMultipleRestaurants && (
                        <Alert 
                            severity="warning" 
                            sx={{ 
                                bgcolor: 'rgba(245, 158, 11, 0.1)', 
                                color: '#fbbf24', 
                                border: '1px solid rgba(245, 158, 11, 0.3)', 
                                borderRadius: '12px',
                                fontSize: '0.82rem'
                            }}
                        >
                            <strong>Lưu ý:</strong> Giỏ hàng đang có món từ <strong>{restaurantsInCart.length} quán khác nhau</strong>. Mã giảm giá của nhà hàng sẽ <strong>chỉ áp dụng trên các món thuộc nhà hàng đó</strong>.
                        </Alert>
                    )}

                    {cartItems.length === 0 ? (
                        <p className='text-gray-400 mt-5'>Giỏ hàng đang trống rỗng. Hãy quay lại chọn món nhé!</p>
                    ) : (
                        cartItems.map((item) => (
                            <Card key={item.id} className='p-5 bg-gray-950 border border-gray-800 flex justify-between items-center text-white'>
                                <div className='flex items-center gap-5'>
                                    <img className='w-[5rem] h-[5rem] object-cover rounded' src={item.food?.images?.[0]} alt="" />
                                    <div className='space-y-1'>
                                        <p className='font-semibold text-lg'>{item.food?.name}</p>
                                        <p className='text-xs text-pink-400 font-semibold'>
                                            Quán: {item.food?.restaurant?.name || "Nhà hàng"}
                                        </p>
                                        <p className='text-gray-400'>{item.food?.price * item.quantity} VND</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <IconButton onClick={() => handleUpdateCartItem(item.id, item.quantity - 1)} color="primary">
                                        <RemoveCircleIcon />
                                    </IconButton>
                                    <span className='font-semibold'>{item.quantity}</span>
                                    <IconButton onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)} color="primary">
                                        <AddCircleIcon />
                                    </IconButton>
                                </div>
                            </Card>
                        ))
                    )}
                    <Divider sx={{ bgcolor: "gray" }} />

                    {/* Ô nhập mã giảm giá (Promo Code) & Kho Voucher 1-Click */}
                    {cartItems.length > 0 && (
                        <Box className="p-4 bg-gray-950 border border-gray-800 rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                                <Typography className="text-gray-300 font-semibold text-sm flex items-center gap-1.5">
                                    <ConfirmationNumberIcon sx={{ fontSize: '1.1rem', color: '#ec4899' }} />
                                    Khuyến mãi / Mã giảm giá:
                                </Typography>
                                
                                {availableCoupons.length > 0 && (
                                    <Button
                                        size="small"
                                        onClick={() => setOpenCouponModal(true)}
                                        sx={{
                                            color: '#ec4899',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            textTransform: 'none',
                                            p: 0,
                                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                        }}
                                    >
                                        Xem mã khả dụng ({availableCoupons.length})
                                    </Button>
                                )}
                            </div>

                            {/* Thông báo tự động áp dụng mã từ sự kiện nếu có */}
                            {autoAppliedMsg && (
                                <Alert 
                                    severity="success" 
                                    onClose={() => setAutoAppliedMsg("")}
                                    sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', py: 0.5 }}
                                >
                                    {autoAppliedMsg}
                                </Alert>
                            )}

                            {!appliedCoupon ? (
                                <>
                                    <Box className="flex gap-2">
                                        <TextField
                                            size="small"
                                            label="Nhập mã (ví dụ: GIAM20K)"
                                            value={promoCode}
                                            onChange={(e) => {
                                                setPromoCode(e.target.value.toUpperCase());
                                                setPromoError("");
                                            }}
                                            error={Boolean(promoError)}
                                            helperText={promoError}
                                            fullWidth
                                            sx={{
                                                '& label.Mui-focused': { color: '#e91e63' },
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': { borderColor: '#e91e63' },
                                                }
                                            }}
                                        />
                                        <Button 
                                            onClick={handleApplyPromo}
                                            variant="contained" 
                                            sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' }, fontWeight: 'bold', px: 3 }}
                                        >
                                            Áp dụng
                                        </Button>
                                    </Box>

                                    {/* Gợi ý nhanh các mã voucher khả dụng (1-Click Apply) */}
                                    {availableCoupons.length > 0 && (
                                        <div className="pt-1">
                                            <p className="text-[11px] text-gray-400 mb-1.5 flex items-center gap-1">
                                                <LocalOfferIcon sx={{ fontSize: '0.85rem', color: '#ec4899' }} /> Gợi ý mã ưu đãi (Click để áp dụng):
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {availableCoupons.map((coupon) => {
                                                    const applicableSubtotal = getApplicableSubtotalForCoupon(coupon);
                                                    const hasItems = applicableSubtotal > 0;
                                                    const isEligible = hasItems && applicableSubtotal >= (coupon.minimumOrderValue || 0);
                                                    const discText = coupon.discountType === "PERCENTAGE" 
                                                        ? `-${coupon.discountValue}%` 
                                                        : `-${(Number(coupon.discountValue || 0) / 1000)}k`;
                                                    
                                                    return (
                                                        <Chip
                                                            key={coupon.id}
                                                            label={`${coupon.code} (${discText})`}
                                                            size="small"
                                                            onClick={() => {
                                                                if (isEligible) {
                                                                    applyCouponByCode(coupon.code, coupon.restaurant?.id);
                                                                } else if (!hasItems && coupon.restaurant) {
                                                                    setPromoError(`Mã ${coupon.code} chỉ áp dụng cho món của ${coupon.restaurant.name}`);
                                                                } else {
                                                                    setPromoError(`Món của quán cần tối thiểu ${(coupon.minimumOrderValue || 0).toLocaleString()} đ để dùng mã ${coupon.code}`);
                                                                }
                                                            }}
                                                            sx={{
                                                                bgcolor: isEligible ? 'rgba(233, 30, 99, 0.15)' : 'rgba(75, 85, 99, 0.2)',
                                                                color: isEligible ? '#f472b6' : '#9ca3af',
                                                                border: `1px dashed ${isEligible ? '#ec4899' : '#4b5563'}`,
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': {
                                                                    bgcolor: isEligible ? 'rgba(233, 30, 99, 0.3)' : 'rgba(75, 85, 99, 0.35)',
                                                                    transform: 'scale(1.03)'
                                                                }
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Box className="flex justify-between items-center bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30">
                                    <div>
                                        <Typography variant="subtitle2" className="text-emerald-400 font-bold flex items-center gap-1">
                                            <CheckCircleIcon sx={{ fontSize: '1rem' }} /> Đã áp dụng mã: {appliedCoupon.code}
                                        </Typography>
                                        <Typography variant="caption" className="text-gray-400">
                                            {appliedCoupon.discountType === "PERCENTAGE" 
                                                ? `Giảm ${appliedCoupon.discountValue}% trên tổng hóa đơn` 
                                                : `Giảm ${appliedCoupon.discountValue?.toLocaleString()} đ`}
                                        </Typography>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Button 
                                            onClick={() => setOpenCouponModal(true)}
                                            size="small"
                                            sx={{ color: '#60a5fa', textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
                                        >
                                            Đổi mã
                                        </Button>
                                        <Button 
                                            onClick={handleRemovePromo} 
                                            size="small" 
                                            color="error" 
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Gỡ bỏ
                                        </Button>
                                    </div>
                                </Box>
                            )}
                        </Box>
                    )}

                    <Divider sx={{ bgcolor: "gray" }} />
                    {appliedCoupon && (
                        <div className='space-y-2 mt-4 px-2 text-sm text-gray-400'>
                            <div className='flex justify-between'>
                                <p>Tạm tính:</p>
                                <p>{cartTotal?.toLocaleString()} VND</p>
                            </div>
                            <div className='flex justify-between text-emerald-400 font-semibold'>
                                <div>
                                    <p>Giảm giá ({appliedCoupon.code}):</p>
                                    {appliedCoupon.restaurant && (
                                        <p className='text-[11px] text-pink-400 font-normal'>
                                            (Chỉ áp dụng cho món của {appliedCoupon.restaurant.name})
                                        </p>
                                    )}
                                </div>
                                <p>-{discount?.toLocaleString()} VND</p>
                            </div>
                            <Divider sx={{ bgcolor: "gray" }} />
                        </div>
                    )}
                    <div className='flex justify-between font-semibold text-xl px-2 mt-2'>
                        <p>Tổng thanh toán:</p>
                        <p className='text-pink-500'>{finalTotal?.toLocaleString()} VND</p>
                    </div>
                </section>

                <Divider orientation='vertical' flexItem sx={{ bgcolor: "gray", display: { xs: 'none', lg: 'block' } }} />

                {/* CỘT PHẢI: ĐỊA CHỈ */}
                <section className='lg:w-[50%] space-y-6'>
                    <h1 className='text-2xl font-semibold border-b border-gray-800 pb-3'>Thông Tin Giao Hàng</h1>

                    {/* Chọn nhanh địa chỉ đã lưu với nhãn Nhà riêng / Văn phòng / Khác */}
                    {auth.user?.addresses && auth.user.addresses.length > 0 && (
                        <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 space-y-2.5">
                            <div className="flex justify-between items-center">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <LocationOnIcon sx={{ fontSize: '1rem', color: '#10b981' }} />
                                    Chọn nhanh địa chỉ đã lưu:
                                </p>
                                <Button 
                                    size="small" 
                                    onClick={() => navigate("/my-profile/address")} 
                                    sx={{ color: '#ec4899', fontSize: '0.72rem', textTransform: 'none', p: 0 }}
                                >
                                    + Quản lý địa chỉ
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {auth.user.addresses.map((addr, index) => {
                                    let defaultId = null;
                                    try {
                                        const saved = localStorage.getItem("default_address_id");
                                        if (saved) defaultId = Number(saved);
                                    } catch {}
                                    const isDefault = addr.id === defaultId || (!defaultId && index === 0);

                                    let meta = {};
                                    try {
                                        const savedMeta = localStorage.getItem("address_metadata");
                                        if (savedMeta) meta = JSON.parse(savedMeta)[addr.id] || {};
                                    } catch {}

                                    const labelType = meta.label || (index === 0 ? 'HOME' : index === 1 ? 'OFFICE' : 'OTHER');
                                    const labelName = labelType === 'HOME' ? 'Nhà riêng' : labelType === 'OFFICE' ? 'Văn phòng' : 'Khác';
                                    const LabelIcon = labelType === 'HOME' ? HomeIcon : labelType === 'OFFICE' ? ApartmentIcon : LocationOnIcon;
                                    const isSelected = formik.values.streetAddress === addr.streetAddress;

                                    return (
                                        <Button
                                            key={addr.id || index}
                                            variant={isSelected ? "contained" : "outlined"}
                                            size="small"
                                            startIcon={<LabelIcon sx={{ fontSize: '0.9rem !important' }} />}
                                            onClick={() => {
                                                formik.setValues({
                                                    streetAddress: addr.streetAddress || "",
                                                    state: addr.stateProvince || addr.state || "",
                                                    city: addr.city || "",
                                                    pincode: addr.postalCode || "10000"
                                                });
                                            }}
                                            sx={{
                                                bgcolor: isSelected ? 'rgba(233, 30, 99, 0.2)' : 'transparent',
                                                color: isSelected ? '#f472b6' : '#9ca3af',
                                                borderColor: isSelected ? '#ec4899' : 'rgba(75, 85, 99, 0.4)',
                                                textTransform: 'none',
                                                borderRadius: '10px',
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                py: 0.6,
                                                px: 1.5,
                                                '&:hover': {
                                                    borderColor: '#ec4899',
                                                    color: '#f472b6',
                                                    bgcolor: 'rgba(233, 30, 99, 0.08)'
                                                }
                                            }}
                                        >
                                            {labelName}: {addr.streetAddress} {isDefault ? "(Mặc định)" : ""}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className='space-y-5 bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-xl'>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Địa chỉ nhà (Số nhà, tên đường)" name="streetAddress" value={formik.values.streetAddress} onChange={formik.handleChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Quận / Huyện" name="state" value={formik.values.state} onChange={formik.handleChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Thành phố" name="city" value={formik.values.city} onChange={formik.handleChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Mã Bưu Điện" name="pincode" value={formik.values.pincode} onChange={formik.handleChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <div className="space-y-2 pt-1">
                                    <Typography variant="subtitle2" className="font-semibold text-gray-300">
                                        Phương Thức Thanh Toán:
                                    </Typography>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Lựa chọn 1: Stripe */}
                                        <div 
                                            onClick={() => setPaymentMethod("STRIPE")}
                                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                                paymentMethod === "STRIPE"
                                                    ? 'bg-emerald-500/10 border-emerald-500 shadow-md shadow-emerald-500/10'
                                                    : 'bg-gray-800/40 border-gray-700/60 hover:border-gray-600'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <CreditCardIcon sx={{ color: paymentMethod === "STRIPE" ? '#10b981' : '#9ca3af' }} />
                                                <div>
                                                    <p className={`text-sm font-bold ${paymentMethod === "STRIPE" ? 'text-emerald-400' : 'text-gray-200'}`}>
                                                        Thanh toán Online (Stripe)
                                                    </p>
                                                    <p className="text-[11px] text-gray-400">Thẻ Visa, Mastercard, ATM</p>
                                                </div>
                                            </div>
                                            {paymentMethod === "STRIPE" && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                            )}
                                        </div>

                                        {/* Lựa chọn 2: COD */}
                                        <div 
                                            onClick={() => setPaymentMethod("COD")}
                                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                                paymentMethod === "COD"
                                                    ? 'bg-pink-500/10 border-pink-500 shadow-md shadow-pink-500/10'
                                                    : 'bg-gray-800/40 border-gray-700/60 hover:border-gray-600'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <PaymentsIcon sx={{ color: paymentMethod === "COD" ? '#ec4899' : '#9ca3af' }} />
                                                <div>
                                                    <p className={`text-sm font-bold ${paymentMethod === "COD" ? 'text-pink-400' : 'text-gray-200'}`}>
                                                        Tiền mặt (COD)
                                                    </p>
                                                    <p className="text-[11px] text-gray-400">Trả tiền khi nhận món</p>
                                                </div>
                                            </div>
                                            {paymentMethod === "COD" && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant='contained'
                                    type='submit'
                                    fullWidth
                                    size='large'
                                    disabled={cartItems.length === 0}
                                    sx={{
                                        bgcolor: paymentMethod === "STRIPE" ? '#10b981' : '#e91e63',
                                        '&:hover': { bgcolor: paymentMethod === "STRIPE" ? '#059669' : '#c2185b' },
                                        fontWeight: 'bold',
                                        py: 1.5,
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        boxShadow: paymentMethod === "STRIPE" ? '0 8px 20px rgba(16, 185, 129, 0.25)' : '0 8px 20px rgba(233, 30, 99, 0.25)'
                                    }}
                                >
                                    {paymentMethod === "STRIPE"
                                        ? `Thanh Toán Ngay Qua Stripe (${finalTotal.toLocaleString()} đ)`
                                        : `Xác Nhận Đặt Hàng COD (${finalTotal.toLocaleString()} đ)`}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </section>
            </main>

            {/* MODAL KHO VOUCHER KHẢ DỤNG CHO QUÁN VÀ TOÀN SÀN */}
            <Dialog 
                open={openCouponModal} 
                onClose={() => setOpenCouponModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#111827',
                        border: '1px solid #1f2937',
                        borderRadius: '20px',
                        color: 'white',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                    }
                }}
            >
                <DialogTitle sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937' }}>
                    <div>
                        <Typography variant="h6" className="font-bold text-gray-100 flex items-center gap-2">
                            <ConfirmationNumberIcon sx={{ color: '#ec4899' }} />
                            Chọn Mã Giảm Giá Khả Dụng
                        </Typography>
                        <Typography variant="caption" className="text-gray-400">
                            Ưu đãi áp dụng cho thực đơn {restaurantName}
                        </Typography>
                    </div>
                    <IconButton onClick={() => setOpenCouponModal(false)} sx={{ color: '#9ca3af' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    {availableCoupons.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <ConfirmationNumberIcon sx={{ fontSize: 48, color: '#4b5563', mb: 1 }} />
                            <p>Hiện chưa có mã giảm giá nào cho quán này.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-2">
                            {availableCoupons.map((coupon) => {
                                const isApplied = appliedCoupon?.code === coupon.code;
                                const applicableSubtotal = getApplicableSubtotalForCoupon(coupon);
                                const minOrder = coupon.minimumOrderValue || 0;
                                const hasItems = applicableSubtotal > 0;
                                const isEligible = hasItems && applicableSubtotal >= minOrder;
                                const missingAmount = minOrder - applicableSubtotal;
                                const isSystemCoupon = !coupon.restaurant?.name;

                                return (
                                    <div 
                                        key={coupon.id}
                                        className={`relative p-4 rounded-xl border transition-all ${
                                            isApplied 
                                                ? 'bg-emerald-950/30 border-emerald-500' 
                                                : isEligible
                                                    ? 'bg-gray-900/90 border-gray-800 hover:border-pink-500/60'
                                                    : 'bg-gray-900/40 border-gray-800 opacity-60'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-base tracking-wider text-pink-400">
                                                        {coupon.code}
                                                    </span>
                                                    <Chip 
                                                        label={isSystemCoupon ? "Mã Toàn Sàn" : `Quán: ${coupon.restaurant?.name || "Riêng"}`} 
                                                        size="small"
                                                        sx={{ 
                                                            height: 20, 
                                                            fontSize: '0.65rem', 
                                                            bgcolor: isSystemCoupon ? 'rgba(96, 165, 250, 0.15)' : 'rgba(233, 30, 99, 0.15)',
                                                            color: isSystemCoupon ? '#60a5fa' : '#f472b6'
                                                        }} 
                                                    />
                                                </div>
                                                <p className="text-sm font-semibold text-gray-200">
                                                    {coupon.discountType === "PERCENTAGE" 
                                                        ? `Giảm ${coupon.discountValue}% (${coupon.restaurant ? `cho món ${coupon.restaurant.name}` : "toàn đơn"})` 
                                                        : `Giảm ${Number(coupon.discountValue || 0).toLocaleString()} đ`}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Đơn tối thiểu: <strong className="text-gray-300">{minOrder.toLocaleString()} đ</strong>
                                                </p>
                                                
                                                {/* Dòng điều kiện thông minh */}
                                                {!hasItems && coupon.restaurant ? (
                                                    <p className="text-xs text-gray-400 flex items-center gap-1 pt-1">
                                                        <InfoOutlinedIcon sx={{ fontSize: '0.85rem' }} />
                                                        Giỏ hàng chưa có món của quán này
                                                    </p>
                                                ) : !isEligible ? (
                                                    <p className="text-xs text-amber-400 flex items-center gap-1 pt-1">
                                                        <InfoOutlinedIcon sx={{ fontSize: '0.85rem' }} />
                                                        Mua thêm {missingAmount.toLocaleString()} đ món của quán để dùng mã
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-emerald-400 flex items-center gap-1 pt-1">
                                                        <CheckCircleIcon sx={{ fontSize: '0.85rem' }} />
                                                        Đủ điều kiện {coupon.restaurant ? `(Món quán: ${applicableSubtotal.toLocaleString()} đ)` : "(Toàn đơn)"}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Nút bấm áp dụng 1-Click */}
                                            <div className="flex flex-col items-end justify-center">
                                                {isApplied ? (
                                                    <Button 
                                                        variant="outlined" 
                                                        color="success" 
                                                        size="small"
                                                        startIcon={<CheckCircleIcon />}
                                                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        Đang dùng
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        disabled={!isEligible}
                                                        onClick={() => {
                                                            applyCouponByCode(coupon.code, coupon.restaurant?.id);
                                                            setOpenCouponModal(false);
                                                        }}
                                                        sx={{
                                                            bgcolor: '#e91e63',
                                                            '&:hover': { bgcolor: '#c2185b' },
                                                            '&:disabled': { bgcolor: 'rgba(75, 85, 99, 0.3)', color: '#6b7280' },
                                                            borderRadius: '8px',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            px: 2
                                                        }}
                                                    >
                                                        Áp dụng
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: '1px solid #1f2937' }}>
                    <Button 
                        onClick={() => setOpenCouponModal(false)} 
                        sx={{ color: '#9ca3af', textTransform: 'none' }}
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};