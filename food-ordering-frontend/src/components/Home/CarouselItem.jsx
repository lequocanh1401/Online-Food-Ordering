import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const DEFAULT_FOOD_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

export const CarouselItem = ({ item }) => {
    const navigate = useNavigate();

    if (!item) return null;

    const initialImg = (item.images && item.images.length > 0 && !item.images[0].includes("link-anh"))
        ? item.images[0]
        : DEFAULT_FOOD_IMAGE;

    const [imgSrc, setImgSrc] = useState(initialImg);

    const restaurant = item.restaurant;
    const restName = restaurant?.name || "Nhà hàng đối tác";
    const city = restaurant?.address?.city || "vietnam";
    const restId = restaurant?.id;

    const handleClick = () => {
        if (restId) {
            navigate(`/restaurant/${encodeURIComponent(city)}/${encodeURIComponent(restName)}/${restId}?foodId=${item.id}`);
        }
    };

    return (
        <div className="px-2 py-3 select-none">
            <div 
                onClick={handleClick}
                className="bg-gradient-to-b from-[#141418] to-[#0c0c10] border border-gray-800/90 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_12px_28px_rgba(233,30,99,0.18)] group cursor-pointer flex flex-col justify-between h-[360px]"
            >
                {/* Phần ảnh món ăn */}
                <div className="relative w-full h-[185px] overflow-hidden bg-gray-900">
                    <img 
                        src={imgSrc} 
                        alt={item.name} 
                        onError={() => setImgSrc(DEFAULT_FOOD_IMAGE)}
                        className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-transparent to-black/30 pointer-events-none"></div>

                    {/* Tag Bán Chạy */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg shadow-rose-900/40">
                        <WhatshotIcon sx={{ fontSize: 13 }} />
                        <span>Bán chạy</span>
                    </div>

                    {/* Tag Chay nếu có */}
                    {item.isVegetarian && (
                        <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                            🌱 Chay
                        </div>
                    )}

                    {/* Tên Quán ghim trên ảnh */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1.5 text-xs text-gray-200 backdrop-blur-md bg-black/60 px-2.5 py-1 rounded-lg border border-white/10 truncate">
                        <StorefrontIcon sx={{ fontSize: 14 }} className="text-pink-400 shrink-0" />
                        <span className="truncate font-medium">{restName}</span>
                    </div>
                </div>

                {/* Phần thông tin món ăn */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                        <h3 
                            className="text-base font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-1 mb-1 tracking-tight"
                            title={item.name}
                        >
                            {item.name}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                            {item.description || "Món ngon đậm đà hương vị, được chế biến từ nguyên liệu tươi mới mỗi ngày."}
                        </p>
                    </div>

                    {/* Giá tiền & Nút Đặt món */}
                    <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] uppercase text-gray-400 font-bold block">Giá chỉ</span>
                            <span className="text-pink-400 font-black text-lg tracking-tight">
                                {Number(item.price).toLocaleString('vi-VN')} đ
                            </span>
                        </div>

                        <button 
                            type="button"
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md shadow-pink-600/25 flex items-center gap-1.5 transition-all group-hover:scale-105"
                        >
                            <span>Đặt món</span>
                            <ArrowForwardIcon sx={{ fontSize: 13 }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};