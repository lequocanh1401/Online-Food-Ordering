import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRestaurantsAction } from '../../State/Restaurant/Action';
import { RestaurantCard } from '../Restaurant/RestaurantCard';
import { MultiItemCarousel } from './MultiItemCarousel';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { HOME_CUISINE_FILTERS } from '../../config/cuisineConfig';

export const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    const restaurant = useSelector(store => store.restaurant);
    const cart = useSelector(store => store.cart);
    const hasCartItems = (cart.cart?.item?.length || cart.cartItems?.length || 0) > 0;

    const [selectedCity, setSelectedCity] = useState("ALL");
    const [selectedCuisine, setSelectedCuisine] = useState("ALL");
    const [promos, setPromos] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/coupons`);
            // Chỉ lấy các coupon đang active
            const activeCoupons = data.filter(c => c.active);
            setPromos(activeCoupons);
        } catch (error) {
            console.error("Lỗi khi tải mã giảm giá:", error);
        }
    };

    useEffect(() => {
        dispatch(getAllRestaurantsAction(jwt));
        fetchCoupons();
    }, [dispatch, jwt]);

    // Kích hoạt mã giảm giá 1-click dẫn luồng đặt món mượt mà
    const handleUseCoupon = (promo) => {
        const isRestaurantCoupon = Boolean(promo.restaurant && promo.restaurant.id);
        const restName = promo.restaurant?.name || "nhà hàng";

        try {
            localStorage.setItem("pending_coupon", JSON.stringify({
                code: promo.code,
                restaurantId: promo.restaurant?.id || null,
                restName: restName,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.error("Lỗi lưu pending_coupon:", e);
        }

        if (isRestaurantCoupon) {
            setSnackbarMessage(`Đã kích hoạt mã "${promo.code}"! Đang mở thực đơn ${restName}...`);
            setSnackbarOpen(true);
            const city = promo.restaurant.address?.city || "vietnam";
            const name = promo.restaurant.name || "restaurant";
            const id = promo.restaurant.id;
            setTimeout(() => {
                navigate(`/restaurant/${city}/${name}/${id}`);
            }, 500);
        } else {
            if (hasCartItems) {
                setSnackbarMessage(`Đã kích hoạt mã toàn sàn "${promo.code}"! Đang chuyển đến giỏ hàng...`);
                setSnackbarOpen(true);
                setTimeout(() => {
                    navigate("/cart");
                }, 500);
            } else {
                setSnackbarMessage(`Đã kích hoạt mã toàn sàn "${promo.code}"! Hãy chọn quán ăn bên dưới để áp dụng.`);
                setSnackbarOpen(true);
                const restaurantSection = document.getElementById("restaurants-discovery-section");
                if (restaurantSection) {
                    restaurantSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    const cities = [
        { label: "Tất cả", value: "ALL" },
        { label: "Hà Nội", value: "Hà Nội" },
        { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
        { label: "Quảng Nam", value: "Quảng Nam" }
    ];

    const cuisines = HOME_CUISINE_FILTERS;

    // Lọc nhà hàng theo bộ lọc pill
    const filteredRestaurants = restaurant.restaurants?.filter(item => {
        const matchesCity = selectedCity === "ALL" ? true : (
            item.address?.city?.toLowerCase() === selectedCity.toLowerCase() ||
            (selectedCity === "Hồ Chí Minh" && (
                item.address?.city?.toLowerCase() === "hồ chí minh" || 
                item.address?.city?.toLowerCase() === "tphcm" || 
                item.address?.city?.toLowerCase() === "hcm" ||
                item.address?.city?.toLowerCase() === "ho chi minh"
            ))
        );

        const matchesCuisine = selectedCuisine === "ALL" ? true : (
            item.cuisineType?.toLowerCase() === selectedCuisine.toLowerCase()
        );

        return matchesCity && matchesCuisine;
    });

    return (
        <div className='pb-10 bg-black min-h-screen text-white'>
            {/* Banner */}
            <section
                className='relative flex flex-col justify-center items-center'
                style={{
                    backgroundImage: "url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '60vh'
                }}
            >
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 z-0'></div>

                <div className='w-[90vw] lg:w-[60vw] z-10 text-center flex flex-col items-center justify-center space-y-6'>
                    <div className='space-y-3'>
                        <h1 className='text-4xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500'>
                            Online Food Ordering
                        </h1>
                        <p className='text-gray-300 text-lg lg:text-2xl font-light'>Hương vị tuyệt hảo từ những đầu bếp hàng đầu, giao ngay tận cửa!</p>
                    </div>

                    {/* Glassmorphic Search Bar */}
                    <div 
                        onClick={() => navigate("/search")}
                        className='w-full max-w-2xl bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/20 shadow-2xl flex items-center px-5 cursor-pointer hover:bg-white/15 transition-all duration-300'
                    >
                        <SearchIcon className='text-gray-300 mr-3' />
                        <input
                            type="text"
                            placeholder="Tìm kiếm món ăn, nhà hàng, ẩm thực..."
                            readOnly
                            className='bg-transparent text-white placeholder-gray-400 border-none outline-none w-full py-1 text-lg cursor-pointer'
                        />
                    </div>
                </div>
            </section>

            {/* Carousel phần "Hôm nay ăn gì - Món ăn bán chạy nhất" */}
            <section className='py-12 bg-[#09090b] border-b border-gray-900'>
                <div className='max-w-[1400px] mx-auto px-5 lg:px-20'>
                    <div className='flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3 border-b border-gray-800/60 pb-4'>
                        <div>
                            <div className='flex items-center gap-2 mb-2'>
                                <span className='text-xl'>🔥</span>
                                <h2 className='text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-pink-200 to-gray-400'>
                                    Hôm Nay Ăn Gì? Món Bán Chạy Nhất
                                </h2>
                            </div>
                            <p className='text-gray-400 text-sm'>
                                Gợi ý các món ngon được thực khách đặt nhiều nhất tuần này — Bấm để đặt món trực tiếp tại quán!
                            </p>
                        </div>
                        <div className='text-xs text-pink-400/90 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full font-medium w-fit'>
                            ⚡ Cập nhật theo thời gian thực
                        </div>
                    </div>
                    <MultiItemCarousel />
                </div>
            </section>

            {/* Khuyến Mãi Hot */}
            <section className='py-12 bg-black'>
                <div className='max-w-[1400px] mx-auto px-5 lg:px-20'>
                    <div className='flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3 border-b border-gray-900 pb-5'>
                        <div>
                            <div className='flex items-center gap-2 mb-2'>
                                <ConfirmationNumberIcon className='text-pink-500' sx={{ fontSize: 24 }} />
                                <h2 className='text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400'>
                                    Ưu Đãi Đặc Biệt Dành Cho Bạn
                                </h2>
                            </div>
                            <p className='text-gray-400 text-sm'>
                                Kích hoạt trực tiếp mã giảm giá siêu hot và đặt món ngay không cần sao chép!
                            </p>
                        </div>
                        <div className='text-xs text-gray-500 font-medium'>
                            {promos.length} mã ưu đãi sẵn sàng áp dụng
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {promos.length > 0 ? (
                            promos.map((promo, index) => {
                                const isRestaurantPromo = Boolean(promo.restaurant && promo.restaurant.id);
                                const colors = [
                                    "from-pink-500 to-rose-500",
                                    "from-purple-500 to-indigo-500",
                                    "from-emerald-500 to-teal-500",
                                    "from-amber-500 to-orange-500"
                                ];
                                const color = colors[index % colors.length];
                                const restName = promo.restaurant ? promo.restaurant.name : "Toàn Hệ Thống";
                                const discountText = promo.discountType === "PERCENTAGE" 
                                    ? `GIẢM ${promo.discountValue}%` 
                                    : `GIẢM ${promo.discountValue?.toLocaleString('vi-VN')}đ`;
                                const description = promo.restaurant 
                                    ? `Áp dụng riêng cho đơn đặt tại ${promo.restaurant.name}.`
                                    : "Áp dụng cho mọi đơn hàng của bất kỳ nhà hàng nào trên toàn hệ thống.";

                                return (
                                    <div 
                                        key={promo.id} 
                                        className='bg-gradient-to-br from-[#121216] to-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-pink-500/40 transition-all duration-300 hover:shadow-[0_12px_28px_rgba(233,30,99,0.15)] group relative overflow-hidden'
                                    >
                                        {/* Hiệu ứng hào quang */}
                                        <div className={`absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br ${color} opacity-15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
                                        
                                        <div>
                                            <div className='flex justify-between items-center mb-3 gap-2'>
                                                <div className='flex items-center gap-1.5 min-w-0'>
                                                    {isRestaurantPromo ? (
                                                        <StorefrontIcon sx={{ fontSize: 16 }} className='text-pink-400 shrink-0' />
                                                    ) : (
                                                        <LocalOfferIcon sx={{ fontSize: 16 }} className='text-indigo-400 shrink-0' />
                                                    )}
                                                    <span 
                                                        className={`text-xs font-bold tracking-wider truncate ${isRestaurantPromo ? 'text-pink-400' : 'text-indigo-300'}`} 
                                                        title={restName}
                                                    >
                                                        {isRestaurantPromo ? restName.toUpperCase() : "ƯU ĐÃI TOÀN SÀN"}
                                                    </span>
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${color} text-white shadow-sm shrink-0`}>
                                                    HOT
                                                </span>
                                            </div>

                                            <h3 className='text-2xl font-black text-white tracking-tight mb-2'>
                                                {discountText}
                                            </h3>

                                            <p className='text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2'>
                                                {description}
                                            </p>

                                            {promo.minimumOrderValue ? (
                                                <div className='inline-block text-[11px] font-medium text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md mb-2'>
                                                    Đơn tối thiểu: {promo.minimumOrderValue.toLocaleString('vi-VN')} đ
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className='mt-4 pt-3.5 border-t border-gray-800/80 flex items-center justify-between gap-2'>
                                            {/* Tem mã voucher phong cách thẻ ưu đãi */}
                                            <div className='bg-gray-900/90 border border-dashed border-pink-500/30 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-pink-400 flex items-center gap-1 shadow-inner shrink-0'>
                                                <ConfirmationNumberIcon sx={{ fontSize: 14 }} className='text-pink-500' />
                                                <span>{promo.code}</span>
                                            </div>

                                            {/* Nút 1-Click dẫn luồng */}
                                            <Button
                                                size="small"
                                                onClick={() => handleUseCoupon(promo)}
                                                variant="contained"
                                                sx={{ 
                                                    background: 'linear-gradient(to right, #ec4899, #f43f5e)',
                                                    color: '#ffffff',
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.75rem',
                                                    borderRadius: '0.65rem',
                                                    padding: '5px 12px',
                                                    boxShadow: '0 4px 12px rgba(236,72,153,0.25)',
                                                    whiteSpace: 'nowrap',
                                                    '&:hover': {
                                                        background: 'linear-gradient(to right, #db2777, #e11d48)',
                                                        boxShadow: '0 6px 16px rgba(236,72,153,0.35)',
                                                    }
                                                }}
                                                endIcon={isRestaurantPromo ? <ArrowForwardIcon sx={{ fontSize: 14 }} /> : <RestaurantMenuIcon sx={{ fontSize: 14 }} />}
                                            >
                                                {isRestaurantPromo ? "Đến quán" : "Dùng ngay"}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className='col-span-full py-8 text-center text-gray-500 bg-gray-950/20 border border-gray-900 rounded-2xl'>
                                Hiện tại chưa có mã giảm giá nào đang diễn ra. Quay lại sau bạn nhé!
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Danh sách nhà hàng khám phá */}
            <section id="restaurants-discovery-section" className='py-12 bg-[#09090b] border-t border-gray-900 scroll-mt-6'>
                <div className='max-w-[1400px] mx-auto px-5 lg:px-20'>
                    <div className='flex flex-col lg:flex-row lg:justify-between lg:items-end border-b border-gray-800 pb-5 mb-8 space-y-4 lg:space-y-0'>
                        <div>
                            <h2 className='text-xl lg:text-2xl font-bold text-white mb-2'>
                                Khám Phá Nhà Hàng
                            </h2>
                            <p className='text-gray-500 text-sm'>
                                {filteredRestaurants?.length || 0} nhà hàng phù hợp với lựa chọn của bạn
                            </p>
                        </div>

                        {/* Bộ lọc Thành phố */}
                        <div className='flex flex-wrap gap-2 items-center'>
                            <span className='text-gray-400 text-xs font-bold mr-2 uppercase tracking-wider'>Thành phố:</span>
                            {cities.map((city) => (
                                <button
                                    key={city.value}
                                    onClick={() => setSelectedCity(city.value)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                                        selectedCity === city.value 
                                            ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20' 
                                            : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                                    }`}
                                >
                                    {city.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bộ lọc Loại món ăn */}
                    <div className='flex flex-wrap gap-2 items-center mb-10 pb-5 border-b border-gray-900/50'>
                        <span className='text-gray-400 text-xs font-bold mr-2 uppercase tracking-wider'>Ẩm thực:</span>
                        {cuisines.map((cuisine) => (
                            <button
                                key={cuisine.value}
                                onClick={() => setSelectedCuisine(cuisine.value)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                                    selectedCuisine === cuisine.value 
                                        ? 'bg-pink-500 border-pink-500 text-white' 
                                        : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                                }`}
                            >
                                {cuisine.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid Nhà Hàng - Đồng bộ 4 cột với Carousel và Mã Giảm Giá */}
                    {filteredRestaurants && filteredRestaurants.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8'>
                            {filteredRestaurants.map((item) => (
                                <RestaurantCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className='py-20 text-center flex flex-col items-center justify-center space-y-4'>
                            <p className='text-gray-500 text-lg'>Không tìm thấy nhà hàng nào phù hợp với bộ lọc.</p>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                onClick={() => {
                                    setSearchKeyword("");
                                    setSelectedCity("ALL");
                                    setSelectedCuisine("ALL");
                                }}
                                sx={{ textTransform: 'none' }}
                            >
                                Thiết lập lại bộ lọc
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Dịch vụ nổi bật */}
            <section className='py-16 bg-black border-t border-gray-900'>
                <div className='max-w-[1400px] mx-auto px-5 lg:px-20'>
                    <div className='text-center max-w-xl mx-auto mb-12'>
                        <h2 className='text-xl lg:text-2xl font-bold text-white mb-3'>
                            Dịch Vụ Chất Lượng Hàng Đầu
                        </h2>
                        <p className='text-gray-500 text-sm'>
                            Chúng tôi luôn nỗ lực hết mình để đem lại những bữa ăn trọn vẹn nhất cho bạn
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='bg-gray-950/40 border border-gray-900 rounded-2xl p-6 text-center hover:border-pink-500/20 hover:bg-gray-950/60 transition-all duration-300 flex flex-col items-center space-y-4'>
                            <div className='w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 mb-2'>
                                <LocalShippingIcon sx={{ fontSize: 32 }} />
                            </div>
                            <h3 className='text-lg font-bold text-white'>Giao Hàng Siêu Tốc</h3>
                            <p className='text-gray-400 text-sm leading-relaxed max-w-xs'>
                                Cam kết đồ ăn được giao nhanh chóng, nóng hổi và nguyên vẹn trong vòng 30 phút.
                            </p>
                        </div>

                        <div className='bg-gray-950/40 border border-gray-900 rounded-2xl p-6 text-center hover:border-pink-500/20 hover:bg-gray-950/60 transition-all duration-300 flex flex-col items-center space-y-4'>
                            <div className='w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 mb-2'>
                                <VerifiedIcon sx={{ fontSize: 32 }} />
                            </div>
                            <h3 className='text-lg font-bold text-white'>Vệ Sinh & Chất Lượng</h3>
                            <p className='text-gray-400 text-sm leading-relaxed max-w-xs'>
                                Mọi đối tác nhà hàng đều được kiểm duyệt vệ sinh an toàn thực phẩm cực kỳ khắt khe.
                            </p>
                        </div>

                        <div className='bg-gray-950/40 border border-gray-900 rounded-2xl p-6 text-center hover:border-pink-500/20 hover:bg-gray-950/60 transition-all duration-300 flex flex-col items-center space-y-4'>
                            <div className='w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 mb-2'>
                                <SupportAgentIcon sx={{ fontSize: 32 }} />
                            </div>
                            <h3 className='text-lg font-bold text-white'>Hỗ Trợ 24/7</h3>
                            <p className='text-gray-400 text-sm leading-relaxed max-w-xs'>
                                Đội ngũ chăm sóc khách hàng thân thiện luôn túc trực hỗ trợ bạn mọi lúc, mọi nơi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Snackbar thông báo khi kích hoạt mã ưu đãi */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{
                        width: '100%',
                        bgcolor: '#10b981',
                        color: '#fff',
                        fontWeight: 600,
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};