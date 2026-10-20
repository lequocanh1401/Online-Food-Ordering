import React, { useEffect, useState, useRef } from 'react';
import ReactSlick from "react-slick";
const Slider = ReactSlick.default || ReactSlick;

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { API_URL } from '../../config/api';
import { CarouselItem } from './CarouselItem';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const MultiItemCarousel = () => {
    const [popularFoods, setPopularFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/food/popular`);
                setPopularFoods(data || []);
            } catch (err) {
                console.error("Lỗi tải món bán chạy:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPopular();
    }, []);

    // Cấu hình chuyển động siêu mượt với cssEase và swipeToSlide
    const settings = {
        dots: false,
        arrows: false, // Tắt hoàn toàn nút mặc định của slick để tránh bị đè 2 mũi tên
        infinite: popularFoods.length > 4,
        speed: 550,
        cssEase: "cubic-bezier(0.25, 1, 0.5, 1)", // Easing tự nhiên, lướt êm ái không khựng
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        swipeToSlide: true,
        draggable: true,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: popularFoods.length > 3
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: popularFoods.length > 2
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: popularFoods.length > 1
                }
            }
        ]
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
                {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="h-[360px] bg-gray-900/60 rounded-2xl animate-pulse border border-gray-800"></div>
                ))}
            </div>
        );
    }

    if (!popularFoods.length) {
        return (
            <div className="py-8 text-center text-gray-500 border border-gray-900 rounded-2xl bg-gray-950/20">
                Đang cập nhật danh sách món ăn bán chạy...
            </div>
        );
    }

    return (
        <div className="relative group/carousel px-1">
            {/* CSS override triệt tiêu hoàn toàn pseudo icon mặc định của slick */}
            <style dangerouslySetInnerHTML={{ __html: `
                .slick-prev:before, .slick-next:before {
                    display: none !important;
                    content: '' !important;
                }
                .slick-track {
                    display: flex !important;
                    align-items: stretch;
                }
                .slick-slide {
                    height: inherit !important;
                }
                .slick-slide > div {
                    height: 100%;
                }
            ` }} />

            {/* Nút Prev thiết kế chuẩn Glassmorphism đơn, không đè icon */}
            <button
                type="button"
                onClick={() => sliderRef.current?.slickPrev()}
                className="absolute -left-2 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#181822]/95 hover:bg-pink-600 border border-gray-700/80 hover:border-pink-500 text-gray-300 hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.7)] hover:shadow-[0_0_20px_rgba(233,30,99,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
                aria-label="Previous slide"
            >
                <ArrowBackIosNewIcon sx={{ fontSize: 16, mr: '2px' }} />
            </button>

            {/* Carousel Slider */}
            <Slider ref={sliderRef} {...settings}>
                {popularFoods.map((item) => (
                    <CarouselItem key={item.id} item={item} />
                ))}
            </Slider>

            {/* Nút Next thiết kế chuẩn Glassmorphism đơn, không đè icon */}
            <button
                type="button"
                onClick={() => sliderRef.current?.slickNext()}
                className="absolute -right-2 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#181822]/95 hover:bg-pink-600 border border-gray-700/80 hover:border-pink-500 text-gray-300 hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.7)] hover:shadow-[0_0_20px_rgba(233,30,99,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
                aria-label="Next slide"
            >
                <ArrowForwardIosIcon sx={{ fontSize: 16, ml: '2px' }} />
            </button>
        </div>
    );
};