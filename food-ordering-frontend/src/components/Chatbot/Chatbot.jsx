import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Paper, Typography, InputBase, Chip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Chatbot = () => {
    const navigate = useNavigate();
    const { restaurant } = useSelector(store => store);
    const [coupons, setCoupons] = useState([]);
    const [popularFoods, setPopularFoods] = useState([]);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/coupons`);
                setCoupons(data.filter(c => c.active) || []);
            } catch (err) {
                console.error("Lỗi chatbot tải coupon:", err);
            }
        };

        const fetchPopular = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/food/popular`);
                setPopularFoods(data || []);
            } catch (err) {
                console.error("Lỗi chatbot tải món phổ biến:", err);
            }
        };

        fetchCoupons();
        fetchPopular();
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            sender: 'bot', 
            text: 'Xin chào! Tôi là Trợ lý AI Concierge của Online Food Ordering. Bạn muốn tìm món ngon, gợi ý ẩm thực hay cần kiểm tra ưu đãi nào hôm nay?' 
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const suggestions = [
        "💡 Gợi ý cơm trưa ngon hôm nay",
        "🔥 Món bán chạy nhất",
        "🎟️ Xem mã giảm giá hot",
        "🚚 Thời gian & Phí giao hàng",
        "❌ Làm sao hủy đơn hàng?"
    ];

    const getBotResponse = (userText) => {
        const text = userText.toLowerCase().trim();
        
        // 1. Chào hỏi
        if (text.includes("chào") || text.includes("hello") || text.includes("hi") || text.includes("hey")) {
            return {
                text: "Xin chào! Chúc bạn một ngày tốt lành. Tôi có thể gợi ý món ngon, tìm quán gần bạn hoặc kiểm tra mã giảm giá giúp bạn nhé! 😊"
            };
        }
        // 2. Cảm ơn
        if (text.includes("cảm ơn") || text.includes("cám ơn") || text.includes("thanks") || text.includes("thank you")) {
            return {
                text: "Dạ không có chi! Được phục vụ bạn là niềm vinh hạnh của tôi. Chúc bạn có một bữa ăn ngon miệng nhé! ❤️"
            };
        }
        // 3. Tạm biệt
        if (text.includes("tạm biệt") || text.includes("bye") || text.includes("hẹn gặp lại") || text.includes("see you")) {
            return {
                text: "Tạm biệt bạn! Hẹn gặp lại bạn sớm nhất khi đói bụng nhé! 👋"
            };
        }
        // 4. MÓN ĂN & GỢI Ý ẨM THỰC (MENU CATALOG RAG)
        if (text.includes("món") || text.includes("ăn gì") || text.includes("gợi ý") || text.includes("cơm") || text.includes("sườn") 
                || text.includes("trưa") || text.includes("tối") || text.includes("hot") || text.includes("bán chạy") 
                || text.includes("trà sữa") || text.includes("phê la") || text.includes("bún bò") || text.includes("dưới 60k")) {
            
            let matchedDish = null;

            // Ưu tiên món theo từ khóa
            if (text.includes("trà sữa") || text.includes("phê la") || text.includes("olong") || text.includes("ô long")) {
                matchedDish = popularFoods.find(f => f.name.toLowerCase().includes("ô long") || f.name.toLowerCase().includes("trà") || f.name.toLowerCase().includes("phê la"));
            } else if (text.includes("bún bò") || text.includes("huế")) {
                matchedDish = popularFoods.find(f => f.name.toLowerCase().includes("bún bò"));
            } else if (text.includes("sườn") || text.includes("cơm") || text.includes("trưa") || text.includes("dưới 60k") || text.includes("gợi ý") || text.includes("ăn gì") || text.includes("hot") || text.includes("bán chạy")) {
                matchedDish = popularFoods.find(f => f.name.toLowerCase().includes("sườn cây") || f.name.toLowerCase().includes("sườn"));
            }

            // Fallback món phổ biến đầu tiên nếu chưa khớp
            if (!matchedDish && popularFoods.length > 0) {
                matchedDish = popularFoods[0];
            }

            if (matchedDish) {
                const restName = matchedDish.restaurant?.name || "Tiệm Cơm Tấm Sài Gòn - Cầu Giấy";
                const city = matchedDish.restaurant?.address?.city || "Hà Nội";
                const dishImg = (matchedDish.images && matchedDish.images.length > 0) 
                    ? matchedDish.images[0] 
                    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

                return {
                    text: `Dạ chào bạn! Dựa trên khẩu vị người dùng và các món ăn đạt điểm đánh giá cao nhất hôm nay, tôi xin đề xuất món **${matchedDish.name}** tại **${restName}** cực kỳ chuẩn vị!`,
                    dish: {
                        id: matchedDish.id,
                        name: matchedDish.name,
                        price: matchedDish.price,
                        image: dishImg,
                        restaurantId: matchedDish.restaurant?.id || 1,
                        restaurantName: restName,
                        city: city
                    }
                };
            }

            // Fallback nếu chưa tải được danh sách món
            return {
                text: `Dạ chào bạn! Món ăn được yêu thích nhất hôm nay là **Cơm Sườn Cây Nướng Mật Ong** tại Tiệm Cơm Tấm Sài Gòn. Sườn nướng mật ong thơm lừng, thịt mềm đậm đà ăn kèm chả trứng béo ngậy!`,
                dish: {
                    id: 1,
                    name: "Cơm Sườn Cây Nướng Mật Ong",
                    price: 55000,
                    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
                    restaurantId: 1,
                    restaurantName: "Tiệm Cơm Tấm Sài Gòn - Cầu Giấy",
                    city: "Hà Nội"
                }
            };
        }

        // 5. Nhà hàng
        if (text.includes("nhà hàng") || text.includes("quán") || text.includes("restaurant") || text.includes("cửa hàng")) {
            const list = restaurant.restaurants || [];
            if (list.length > 0) {
                const resList = list.slice(0, 5).map(r => `• 🏠 **${r.name}** (${r.cuisineType || 'Ẩm thực'})`).join('\n');
                return {
                    text: `Dưới đây là một số nhà hàng nổi bật đang hoạt động trên hệ thống:\n\n${resList}\n\nBạn có thể nhấn vào các nhà hàng này ở trang chủ để xem thực đơn chi tiết nhé!`
                };
            }
            return {
                text: "Hiện tại hệ thống đang cập nhật danh sách nhà hàng. Bạn vui lòng quay lại sau nhé!"
            };
        }

        // 6. Mã giảm giá / Coupon
        if (text.includes("mã") || text.includes("giảm giá") || text.includes("coupon") || text.includes("khuyến mãi")) {
            if (coupons.length > 0) {
                const couponList = coupons.map(c => {
                    const valueStr = c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `${c.discountValue?.toLocaleString()} đ`;
                    const minStr = c.minimumOrderValue ? ` (đơn tối thiểu từ ${c.minimumOrderValue.toLocaleString()} đ)` : "";
                    const scope = c.restaurant ? `quán ${c.restaurant.name}` : "toàn sàn";
                    return `• Mã: **${c.code}** - Giảm ${valueStr}${minStr} - Áp dụng: ${scope}`;
                }).join('\n');
                return {
                    text: `Dưới đây là danh sách các mã giảm giá đang hoạt động:\n\n${couponList}\n\n💡 Hãy nhập mã **GIAM20K** khi thanh toán trong Giỏ hàng để được giảm ngay 20.000đ nhé!`
                };
            }
            return {
                text: "Để áp dụng mã giảm giá, bạn vào Giỏ hàng, điền mã và bấm 'Áp dụng'. Bạn có thể thử mã **GIAM20K** cho đơn từ 50.000đ nhé!"
            };
        }

        // 7. Đơn hàng tối thiểu
        if (text.includes("tối thiểu") || text.includes("min order")) {
            return {
                text: "Đơn hàng tối thiểu là mức tiền tối thiểu bạn cần đạt được để áp dụng mã giảm giá thành công. Nếu bạn bớt món ăn khiến tổng tiền giảm xuống dưới mức này, mã giảm giá sẽ tự động được gỡ bỏ."
            };
        }

        // 8. Hủy đơn hàng
        if (text.includes("hủy") || text.includes("cancel")) {
            return {
                text: "Bạn có thể dễ dàng hủy các đơn hàng chưa thanh toán (PENDING) bằng cách bấm nút **[Hủy đơn hàng]** trực tiếp tại trang Lịch sử đơn hàng trong Hồ sơ cá nhân. Đối với đơn đã thanh toán hoặc đang chuẩn bị, vui lòng liên hệ trực tiếp quán ăn để được hỗ trợ nhé!"
            };
        }

        // 9. Giao hàng
        if (text.includes("giao hàng") || text.includes("ship") || text.includes("bao lâu") || text.includes("thời gian")) {
            return {
                text: "🚚 Online Food Ordering cam kết giao thức ăn nóng hổi đến tay bạn trong vòng 30 phút kể từ lúc nhà hàng hoàn thành chuẩn bị món. Bạn có thể theo dõi tiến độ đơn hàng thời gian thực trên hệ thống!"
            };
        }

        // 10. Stripe
        if (text.includes("stripe") || text.includes("thanh toán") || text.includes("thẻ") || text.includes("card")) {
            return {
                text: "💳 Hệ thống hỗ trợ cổng thanh toán quốc tế Stripe và COD. Sau khi đặt hàng, bạn sẽ được tự động chuyển sang cổng Stripe bảo mật cao cấp để quẹt thẻ thanh toán an toàn."
            };
        }

        // 11. Tác giả
        if (text.includes("tác giả") || text.includes("ai tạo ra") || text.includes("sinh viên") || text.includes("phát triển") || text.includes("code")) {
            return {
                text: "Hệ thống Đặt đồ ăn trực tuyến (Online Food Ordering) này được nghiên cứu, thiết kế và phát triển bởi sinh viên **Lê Quốc Anh** và cộng sự, xây dựng trên nền tảng Spring Boot, React và Kiến trúc Tác tử AI (Agentic AI)!"
            };
        }

        return {
            text: "Cảm ơn câu hỏi của bạn. Bạn có thể hỏi tôi về gợi ý món ăn, mã giảm giá hot, thời gian giao hàng hoặc chính sách hủy đơn nhé! 😊"
        };
    };

    const handleSendMessage = (text) => {
        if (!text.trim()) return;

        // 1. Thêm tin nhắn của User
        setMessages(prev => [...prev, { sender: 'user', text }]);
        
        // 2. Kích hoạt hiệu ứng đang gõ
        setIsTyping(true);

        setTimeout(() => {
            const response = getBotResponse(text);
            setMessages(prev => [
                ...prev, 
                { 
                    sender: 'bot', 
                    text: response.text,
                    dish: response.dish
                }
            ]);
            setIsTyping(false);
        }, 600);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSendMessage(inputValue);
        setInputValue('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Nút tròn nổi mở khung chat */}
            {!isOpen && (
                <IconButton 
                    onClick={() => setIsOpen(true)}
                    className="shadow-2xl hover:scale-110 transition-transform duration-300 ring-4 ring-pink-500/20"
                    sx={{
                        width: 60,
                        height: 60,
                        bgcolor: '#e91e63',
                        color: 'white',
                        '&:hover': { bgcolor: '#c2185b' }
                    }}
                >
                    <ChatIcon sx={{ fontSize: 30 }} />
                </IconButton>
            )}

            {/* Khung chat Drawer */}
            {isOpen && (
                <Paper 
                    elevation={24}
                    className="w-[360px] md:w-[400px] h-[550px] flex flex-col bg-gray-950/95 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-300 animate-slideUp"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 p-4 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white ring-1 ring-white/30">
                                <SmartToyIcon sx={{ fontSize: 20 }} />
                            </div>
                            <div>
                                <Typography variant="subtitle2" className="font-bold leading-tight flex items-center gap-1.5">
                                    Trợ Lý Ẩm Thực AI (Concierge)
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                </Typography>
                                <Typography variant="caption" className="text-pink-100 block text-[11px]">
                                    Gợi ý món thông minh • Menu RAG
                                </Typography>
                            </div>
                        </div>
                        <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950/60">
                        {messages.map((msg, index) => {
                            const isBot = msg.sender === 'bot';
                            return (
                                <div key={index} className={`flex items-start gap-2.5 ${!isBot ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm ${isBot ? 'bg-gradient-to-tr from-pink-600 to-rose-600' : 'bg-gradient-to-tr from-indigo-600 to-purple-600'}`}>
                                        {isBot ? <SmartToyIcon sx={{ fontSize: 16 }} /> : <PersonIcon sx={{ fontSize: 16 }} />}
                                    </div>
                                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-md ${
                                        isBot 
                                            ? 'bg-gray-900 text-gray-200 rounded-tl-none border border-gray-800' 
                                            : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-tr-none font-medium'
                                    }`}>
                                        <div className="whitespace-pre-line">{msg.text}</div>

                                        {/* Thẻ Gợi Ý Món Ăn Tương Tác (Menu Catalog RAG Card) */}
                                        {isBot && msg.dish && (
                                            <div className="mt-3 p-3 rounded-xl bg-black/60 border border-pink-500/30 overflow-hidden shadow-lg space-y-2.5">
                                                <div className="relative h-28 rounded-lg overflow-hidden group">
                                                    <img 
                                                        src={msg.dish.image} 
                                                        alt={msg.dish.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-1.5 left-1.5">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-600 text-white shadow">
                                                            🔥 Best Seller • ⭐ 4.9
                                                        </span>
                                                    </div>
                                                    <div className="absolute bottom-1.5 right-1.5">
                                                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-black/80 text-white backdrop-blur">
                                                            {Number(msg.dish.price).toLocaleString('vi-VN')} đ
                                                        </span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-bold text-white text-xs line-clamp-1">{msg.dish.name}</h4>
                                                    <span className="text-[11px] text-gray-400 block line-clamp-1">🏠 {msg.dish.restaurantName}</span>
                                                </div>

                                                {/* Mẹo mã giảm giá */}
                                                <div className="p-1.5 rounded-md bg-pink-500/10 border border-pink-500/20 text-[10px] text-pink-200">
                                                    🎟️ <strong>Mẹo:</strong> Nhập mã <strong>GIAM20K</strong> khi thanh toán để giảm 20.000đ!
                                                </div>

                                                {/* Nút Xem Quán & Đặt Ngay */}
                                                <button
                                                    onClick={() => {
                                                        const citySlug = encodeURIComponent(msg.dish.city || 'ha-noi');
                                                        const restNameSlug = encodeURIComponent(msg.dish.restaurantName || 'nha-hang');
                                                        navigate(`/restaurant/${citySlug}/${restNameSlug}/${msg.dish.restaurantId}?foodId=${msg.dish.id}`);
                                                        setIsOpen(false);
                                                    }}
                                                    className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                                                >
                                                    <RestaurantMenuIcon sx={{ fontSize: 16 }} />
                                                    Xem Quán & Đặt Món Ngay
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        
                        {isTyping && (
                            <div className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white shrink-0">
                                    <SmartToyIcon sx={{ fontSize: 16 }} />
                                </div>
                                <div className="bg-gray-900 text-gray-400 p-3 rounded-2xl rounded-tl-none border border-gray-800 text-xs flex gap-1.5 items-center">
                                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions Pills */}
                    <div className="p-2.5 border-t border-gray-900/80 flex flex-wrap gap-1.5 bg-gray-950/80">
                        {suggestions.map((sug, index) => (
                            <Chip
                                key={index}
                                label={sug}
                                onClick={() => handleSendMessage(sug)}
                                size="small"
                                className="text-[11px] bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800/60 cursor-pointer transition-all hover:border-pink-500/40"
                                sx={{ height: 24 }}
                            />
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleFormSubmit} className="p-3 border-t border-gray-900 flex gap-2 bg-gray-950">
                        <InputBase
                            fullWidth
                            placeholder="Hỏi AI gợi ý món, mã giảm giá..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            sx={{
                                color: 'white',
                                bgcolor: '#111827',
                                border: '1px solid #1f2937',
                                borderRadius: '12px',
                                px: 2,
                                py: 0.5,
                                fontSize: '0.85rem'
                            }}
                        />
                        <IconButton 
                            type="submit" 
                            sx={{ 
                                bgcolor: '#e91e63', 
                                color: 'white', 
                                '&:hover': { bgcolor: '#c2185b' }, 
                                borderRadius: '12px',
                                px: 1.5
                            }}
                        >
                            <SendIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </form>
                </Paper>
            )}
        </div>
    );
};
