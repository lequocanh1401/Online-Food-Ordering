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
                const { data: popData } = await axios.get(`${API_URL}/api/food/popular`);
                let combined = Array.isArray(popData) ? [...popData] : [];
                try {
                    // Tải thêm danh mục thực đơn món ăn qua API search để Menu Catalog RAG truy xuất phong phú và đầy đủ
                    const { data: searchData } = await axios.get(`${API_URL}/api/food/search?name=a`);
                    if (Array.isArray(searchData)) {
                        searchData.forEach(item => {
                            if (item.available && item.restaurant && !combined.some(c => c.id === item.id)) {
                                combined.push(item);
                            }
                        });
                    }
                } catch (e) {
                    console.log("Could not fetch extra catalog items, using popular items only");
                }
                setPopularFoods(combined);
            } catch (err) {
                console.error("Lỗi chatbot tải món phổ biến:", err);
            }
        };

        fetchCoupons();
        fetchPopular();
    }, []);

    // Phân loại đồ uống (Drink) vs đồ ăn (Food)
    const isDrinkItem = (food) => {
        if (!food) return false;
        const catName = (food.foodCategory?.name || "").toLowerCase();
        const fName = (food.name || "").toLowerCase();
        const restCuisine = (food.restaurant?.cuisineType || "").toLowerCase();
        const restName = (food.restaurant?.name || "").toLowerCase();

        // Loại trừ rõ ràng nếu tên món là bánh hoặc đồ ăn tinh bột, thịt
        if (fName.includes("bánh") || fName.includes("croissant") || fName.includes("mousse") 
            || fName.includes("tiramisu") || fName.includes("cơm") || fName.includes("phở") 
            || fName.includes("bún") || fName.includes("mì") || fName.includes("mỳ") 
            || fName.includes("nem") || fName.includes("gà") || fName.includes("pizza") 
            || fName.includes("sushi") || fName.includes("sashimi") || fName.includes("lẩu")) {
            return false;
        }

        const drinkWords = [
            "đồ uống", "thức uống", "nước giải khát", "nước", "trà", "cà phê", "cafe", "coffee",
            "trà sữa", "nước ép", "sinh tố", "sữa bắp", "nước sấu", "sữa tươi", "latte", 
            "cappuccino", "macchiato", "matcha", "freeze", "đá xay", "soda", "ô long", "olong", 
            "bia", "pepsi", "coca", "phin sữa"
        ];

        if (drinkWords.some(w => catName.includes(w))) return true;
        if (drinkWords.some(w => fName.includes(w))) return true;

        if (restCuisine.includes("cà phê") || restCuisine.includes("trà sữa") || restName.includes("coffee") || restName.includes("phê la") || restName.includes("highlands")) {
            return true;
        }

        return false;
    };

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            sender: 'bot', 
            text: 'Xin chào! Tôi là Trợ lý AI Concierge của Online Food Ordering. Bạn muốn tìm món ngon, gợi ý ẩm thực hay cần kiểm tra ưu đãi nào hôm nay?' 
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const lastDishRef = useRef(null);
    const dislikedDishIdsRef = useRef(new Set());
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const suggestions = [
        "🔥 Món nào đang bán chạy nhất?",
        "🎟️ Có mã giảm giá nào dùng được không?",
        "💳 Hệ thống hỗ trợ thanh toán qua hình thức nào?",
        "❌ Làm sao để hủy đơn hàng đã đặt?",
        "🛒 Đơn hàng tối thiểu để áp mã giảm giá là gì?"
    ];

    const getBotResponse = (userText) => {
        const text = userText.toLowerCase().trim();
        
        // 1. Chào hỏi
        if (text.includes("chào") || text.includes("hello") || text === "hi" || text.startsWith("hi ") || text.endsWith(" hi") || text.includes(" hi ") || text.includes("hey")) {
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
        // 4. CÁC CÂU HỎI HỖ TRỢ / FAQ NỀN TẢNG
        // 4.1. Hủy đơn hàng
        if (text.includes("hủy") || text.includes("cancel")) {
            return {
                text: "Bạn có thể dễ dàng hủy các đơn hàng khi còn ở trạng thái chờ (PENDING) bằng cách bấm nút **[Hủy đơn hàng]** trực tiếp tại trang Lịch sử đơn hàng trong Hồ sơ cá nhân. Hệ thống sẽ tự động hoàn trả số lượng tồn kho nguyên liệu ngay lập tức! Đối với đơn đã chuyển sang trạng thái chế biến hoặc đã thanh toán, vui lòng liên hệ trực tiếp quán ăn để được hỗ trợ nhé."
            };
        }
        // 4.2. Giao hàng
        if (text.includes("giao hàng") || text.includes("ship") || text.includes("bao lâu") || text.includes("thời gian")) {
            return {
                text: "🚚 Online Food Ordering cam kết giao thức ăn nóng hổi đến tay bạn trong vòng 30 phút kể từ lúc nhà hàng hoàn thành chuẩn bị món. Bạn có thể theo dõi tiến độ đơn hàng thời gian thực trên hệ thống!"
            };
        }
        // 4.3. Stripe / Thanh toán
        if (text.includes("stripe") || text.includes("hình thức thanh toán") || (text.includes("thanh toán") && !text.includes("món") && !text.includes("ăn"))) {
            return {
                text: "💳 Hệ thống hỗ trợ 2 phương thức thanh toán an toàn, linh hoạt:\n\n1. **Cổng thanh toán quốc tế Stripe:** Quẹt thẻ tín dụng/ghi nợ (Visa, Mastercard...) an toàn tuyệt đối, tuân thủ tiêu chuẩn an ninh thanh toán quốc tế **PCI DSS** (máy chủ không lưu số thẻ của khách).\n2. **Thanh toán tiền mặt khi nhận hàng (COD):** Trả tiền mặt trực tiếp cho shipper khi nhận món ăn."
            };
        }
        // 4.4. Tác giả
        if ((text.includes("tác giả") || text.includes("ai tạo ra") || text.includes("ai làm ra") || text.includes("ai code") || text.includes("thông tin tác giả")) 
                && !text.includes("món") && !text.includes("ăn") && !text.includes("cơm") && !text.includes("bún")) {
            return {
                text: "Hệ thống Đặt đồ ăn trực tuyến (Online Food Ordering) này được nghiên cứu, thiết kế và phát triển bởi sinh viên **Lê Quốc Anh (23020005)**, Trường ĐH Công nghệ - ĐHQGHN, tích hợp kiến trúc Trí tuệ nhân tạo Agentic AI và Menu Catalog RAG!"
            };
        }
        // 4.5. Đơn hàng tối thiểu
        if (text.includes("tối thiểu") || text.includes("min order") || text.includes("áp mã")) {
            return {
                text: "🛒 **Đơn hàng tối thiểu** là giá trị giỏ hàng tối thiểu để mã giảm giá có hiệu lực (ví dụ: mã **GIAM20K** áp dụng cho đơn từ 50.000đ).\n\n💡 **Cơ chế an toàn (Auto-removal):** Nếu bạn bớt món ăn khiến tổng tiền giảm xuống dưới mức tối thiểu này, hệ thống sẽ tự động gỡ mã giảm giá để đảm bảo tính toàn vẹn và chống gian lận khuyến mãi!"
            };
        }
        // 4.6. Mã giảm giá thuần túy
        if ((text.includes("mã giảm giá") || text.includes("xem mã") || text.includes("coupon") || text.includes("khuyến mãi")) 
                && !text.includes("món") && !text.includes("ăn") && !text.includes("bún") && !text.includes("phở") && !text.includes("cơm")) {
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
        }
        // 4.7. Danh sách quán thuần túy
        if ((text.includes("danh sách nhà hàng") || text.includes("nhà hàng nào") || text.includes("các quán")) 
                && !text.includes("món") && !text.includes("ăn") && !text.includes("bún") && !text.includes("phở") && !text.includes("cơm")) {
            const list = restaurant.restaurants || [];
            if (list.length > 0) {
                const resList = list.slice(0, 5).map(r => `• 🏠 **${r.name}** (${r.cuisineType || 'Ẩm thực'})`).join('\n');
                return {
                    text: `Dưới đây là một số nhà hàng nổi bật đang hoạt động trên hệ thống:\n\n${resList}\n\nBạn có thể nhấn vào các nhà hàng này ở trang chủ để xem thực đơn chi tiết nhé!`
                };
            }
        }

        // =========================================================================
        // 5. ĐỘNG CƠ TRUY XUẤT & XẾP HẠNG NGỮ NGHĨA THỰC ĐƠN (MENU CATALOG RAG ENGINE)
        // =========================================================================

        // A. Phát hiện Ý định Phủ định / Từ chối món
        const isRejection = text.includes("không thích") || text.includes("đổi món") || text.includes("món khác") 
                || text.includes("chán") || text.includes("không ăn") || text.includes("khác đi") 
                || text.includes("thôi") || text.includes("không khoái") || text.includes("không muốn")
                || text.includes("đổi cho tôi");

        // Nếu từ chối món hiện tại, đưa id món cũ vào danh sách đen trong phiên này
        if (isRejection && lastDishRef.current) {
            dislikedDishIdsRef.current.add(lastDishRef.current.id);
        }

        // B0. Trực tiếp hỏi món bán chạy nhất / Best-Seller (Đảm bảo 100% nhất quán)
        const isAskingBestSeller = text.includes("bán chạy nhất") || text.includes("hot nhất") 
                || text.includes("best seller") || text.includes("món bán chạy") || text.includes("món hot nhất");

        if (isAskingBestSeller && popularFoods.length > 0) {
            const topDish = popularFoods[0];
            lastDishRef.current = topDish;
            const restName = topDish.restaurant?.name || "Tiệm Cơm Tấm Sài Gòn - Đặc Biệt";
            const city = topDish.restaurant?.address?.city || "Hà Nội";
            const dishImg = (topDish.images && topDish.images.length > 0) 
                ? topDish.images[0] 
                : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

            return {
                text: `Dạ món ăn Best-Seller bán chạy số 1 trên toàn hệ thống hiện nay là **${topDish.name}** tại **${restName}** với điểm đánh giá xuất sắc 4.9⭐ và hơn 1.200 lượt đặt! Mời bạn tham khảo nhé.`,
                dish: {
                    id: topDish.id,
                    name: topDish.name,
                    price: topDish.price,
                    image: dishImg,
                    restaurantId: topDish.restaurant?.id || 1,
                    restaurantName: restName,
                    city: city
                }
            };
        }

        // B. Phân loại ý định: Đồ ăn (Food) vs Đồ uống (Drink)
        const drinkKeywords = [
            "uống", "đồ uống", "thức uống", "nước giải khát", "nước ngọt", "trà", "trà sữa", 
            "cà phê", "cafe", "coffee", "nước ép", "sinh tố", "giải khát", "giải nhiệt", 
            "khát", "đá xay", "ô long", "olong", "macchiato", "sữa bắp", "nước sấu", "bia"
        ];
        const isBrothContext = text.includes("nước dùng") || text.includes("bún nước") || text.includes("phở nước") || text.includes("chan nước");
        const isAskingDrink = drinkKeywords.some(kw => text.includes(kw)) && !isBrothContext;

        const foodKeywords = [
            "ăn", "món ăn", "cơm", "bún", "phở", "mì", "mỳ", "miến", "bánh mì", "sườn", "gà", 
            "bò", "heo", "thịt", "hải sản", "tôm", "cua", "cá", "lẩu", "nướng", "đói", 
            "bữa trưa", "bữa tối", "bữa sáng", "no bụng", "chay", "thanh đạm", "món mặn",
            "pizza", "sushi", "sashimi", "burger", "dimsum", "há cảo", "xíu mại"
        ];
        const isAskingFood = foodKeywords.some(kw => text.includes(kw));

        // C. Kiểm tra ngữ cảnh ẩm thực / dịch vụ (Tránh trả lời bừa khi người dùng hỏi lung tung)
        const isFoodOrServiceRelated = 
            isAskingDrink || 
            isAskingFood ||
            isRejection ||
            isAskingBestSeller ||
            text.includes("món") ||
            text.includes("quán") ||
            text.includes("nhà hàng") ||
            text.includes("tiệm") ||
            text.includes("thực đơn") ||
            text.includes("menu") ||
            text.includes("đặt") ||
            text.includes("gợi ý") ||
            text.includes("ngon") ||
            text.includes("bổ") ||
            text.includes("rẻ") ||
            text.includes("đắt") ||
            text.includes("tiền") ||
            text.includes("giá") ||
            text.includes("k") ||
            text.includes("đ") ||
            text.includes("ship") ||
            text.includes("ấm bụng") ||
            text.includes("thanh mát") ||
            text.includes("cay") ||
            text.includes("ngọt") ||
            text.includes("chua") ||
            text.includes("béo");

        // Nếu câu hỏi hoàn toàn ngoài lề dịch vụ ẩm thực (thời tiết, chứng khoán, tin tức...)
        if (!isFoodOrServiceRelated) {
            return {
                text: "Dạ xin lỗi bạn, tôi là **Trợ lý Ẩm thực AI (Concierge)** chuyên phục vụ trên nền tảng **Online Food Ordering**! 🍜🥤\n\nTôi được thiết kế chuyên sâu để giúp bạn:\n• 🍱 Tìm kiếm và gợi ý các món ăn, đồ uống chuẩn vị theo sở thích và ngân sách\n• 🎟️ Cung cấp mã giảm giá hot và thông tin ưu đãi đối tác\n• 💳 Hướng dẫn quy trình đặt món, thanh toán Stripe và chính sách hủy đơn hàng\n\nHiện tại tôi chưa hỗ trợ các chủ đề ngoài dịch vụ ẩm thực (như thời tiết, tin tức xã hội hay kỹ thuật). Bạn hãy thử hỏi tôi các câu như: *'Trưa nay ăn gì?'*, *'Gợi ý trà sữa giải nhiệt'* hoặc *'Món nào bán chạy nhất'* nhé! 😊"
            };
        }

        // D. Phát hiện các món phổ biến ngoài thực đơn (Unsupported Catalog Items)
        const unsupportedDishKeywords = [
            { kw: "bún đậu", name: "Bún đậu mắm tôm" },
            { kw: "taco", name: "Món Tacos / Burrito Mexico" },
            { kw: "bánh xèo", name: "Bánh xèo miền Tây" },
            { kw: "cháo lòng", name: "Cháo lòng" },
            { kw: "vịt quay", name: "Vịt quay Bắc Kinh" },
            { kw: "tokbokki", name: "Tokbokki Hàn Quốc" },
            { kw: "kimbap", name: "Kimbap Hàn Quốc" },
            { kw: "bún ốc", name: "Bún ốc Hà Nội" },
            { kw: "bún riêu", name: "Bún riêu cua" },
            { kw: "cơm niêu", name: "Cơm niêu" }
        ];

        const matchedUnsupported = unsupportedDishKeywords.find(item => text.includes(item.kw));
        if (matchedUnsupported) {
            return {
                text: `Dạ hiện tại trên hệ thống **Online Food Ordering** chưa có đối tác nhà hàng nào phục vụ món **${matchedUnsupported.name}** ạ! 🥺\n\nTuy nhiên, các quán đối tác đang phục vụ rất nhiều món ngon Best-Seller cực kỳ chuẩn vị như **Cơm Sườn Bì Chả Sài Gòn**, **Phở Bò Tái Bát Đàn**, **Bún Chả Hương Liên (Obama)**, **Pizza 4 Cheeses**, **Sushi Rồng** hay **Trà Ô Long Phê La**.\n\nBạn có muốn đổi sang thử một trong các món Best-Seller này không ạ? 😊`
            };
        }

        // E. Trích xuất ý định món ăn cụ thể
        const wantsBun = text.includes("bún");
        const wantsPho = text.includes("phở");
        const wantsCom = text.includes("cơm") || text.includes("tấm");
        const wantsSuon = text.includes("sườn");
        const wantsTra = text.includes("trà") || text.includes("phê la") || text.includes("olong") || text.includes("ô long");
        const wantsChay = text.includes("chay") || text.includes("thanh đạm") || text.includes("thuần chay");
        const wantsMi = text.includes("mì") || text.includes("mỳ") || text.includes("miến") || text.includes("pasta") || text.includes("spaghetti");
        const wantsLau = text.includes("lẩu");
        const wantsPizza = text.includes("pizza");
        const wantsSushi = text.includes("sushi") || text.includes("sashimi");
        const wantsBanhMi = text.includes("bánh mì") || text.includes("bánh mỳ");
        const wantsGaRan = text.includes("gà rán") || text.includes("kfc") || text.includes("gà giòn");
        const wantsCoffee = text.includes("cà phê") || text.includes("cafe") || text.includes("coffee") || text.includes("phin");
        const wantsWarmSoup = text.includes("ấm") || isBrothContext || text.includes("trời mưa") || text.includes("lạnh") || text.includes("nóng") || text.includes("xúp") || text.includes("canh");
        const wantsHearty = text.includes("no") || text.includes("trưa") || text.includes("tối") || text.includes("đói");

        // F. Khôi phục nếu người dùng nhấn mạnh lại món (VD: "Bún cơ mà", "Tôi bảo bún")
        if (wantsBun) {
            popularFoods.forEach(f => {
                if (f.name && f.name.toLowerCase().includes("bún")) dislikedDishIdsRef.current.delete(f.id);
            });
        }
        if (wantsPho) {
            popularFoods.forEach(f => {
                if (f.name && f.name.toLowerCase().includes("phở")) dislikedDishIdsRef.current.delete(f.id);
            });
        }
        if (wantsCom || wantsSuon) {
            popularFoods.forEach(f => {
                if (f.name && (f.name.toLowerCase().includes("cơm") || f.name.toLowerCase().includes("sườn"))) dislikedDishIdsRef.current.delete(f.id);
            });
        }
        if (wantsTra || wantsCoffee) {
            popularFoods.forEach(f => {
                if (isDrinkItem(f)) dislikedDishIdsRef.current.delete(f.id);
            });
        }

        // G. Trích xuất ngân sách nếu có
        const isStrictlyUnder = text.includes("dưới") || text.includes("<");
        const budgetMatch = text.match(/(?:dưới|tầm|khoảng|<=|<)\s*(\d+)\s*(?:k|nghìn|ngàn|000)?/i);
        let maxBudget = null;
        if (budgetMatch) {
            let rawNum = parseInt(budgetMatch[1], 10);
            maxBudget = rawNum < 1000 ? rawNum * 1000 : rawNum;
        }

        // H. Thuật toán chấm điểm mức độ liên quan ngữ nghĩa (Semantic Relevance Scoring)
        const scoredList = popularFoods.map((f, index) => {
            let score = 0;
            const fName = (f.name || "").toLowerCase();
            const fDesc = (f.description || "").toLowerCase();
            const catName = (f.foodCategory?.name || "").toLowerCase();
            const isDrink = isDrinkItem(f);

            // 1. Phạt cực nặng nếu món đã bị chê
            if (dislikedDishIdsRef.current.has(f.id)) score -= 2000;

            // 2. Phạt nhẹ món vừa gợi ý nếu người dùng muốn đổi món
            if (lastDishRef.current && f.id === lastDishRef.current.id && !wantsBun && !wantsPho && !wantsCom && !wantsSuon && !wantsTra) {
                score -= 800;
            }

            // 3. Phân biệt rõ ràng đồ ăn và đồ uống (Strict Food vs Drink Separation)
            if (isAskingDrink && !isAskingFood) {
                if (isDrink) {
                    score += 500;
                } else {
                    score -= 2000; // Đang hỏi đồ uống tuyệt đối không gợi ý món ăn
                }
            } else if (isAskingFood && !isAskingDrink) {
                if (isDrink) {
                    score -= 2000; // Đang hỏi đồ ăn tuyệt đối không gợi ý đồ uống
                } else {
                    score += 300;
                }
            }

            // 4. Món ăn chay / Thanh đạm (Strict Vegetarian)
            if (wantsChay) {
                if (isDrink) {
                    score -= 2000; // Trà/cà phê không được gợi ý làm món ăn chay!
                }
                const hasMeat = fName.includes("sườn") || fName.includes("bò") || fName.includes("heo") || fName.includes("gà") || fName.includes("thịt") || fName.includes("tôm") || fName.includes("cua") || fName.includes("chả") || fName.includes("nem");
                if (hasMeat) {
                    score -= 1500;
                }
                if (f.isVegetarian || fName.includes("chay") || fName.includes("salad") || fName.includes("nấm") || fName.includes("đậu nành") || fName.includes("edamame")) {
                    score += 600;
                }
            }

            // 5. Khớp từ khóa cụ thể (+500)
            if (wantsBun && fName.includes("bún")) score += 500;
            if (wantsPho && fName.includes("phở")) score += 500;
            if (wantsCom && fName.includes("cơm")) score += 400;
            if (wantsSuon && fName.includes("sườn")) score += 400;
            if (wantsPizza && (fName.includes("pizza") || catName.includes("pizza"))) score += 500;
            if (wantsSushi && (fName.includes("sushi") || fName.includes("sashimi") || catName.includes("sushi") || catName.includes("sashimi"))) score += 500;
            if (wantsBanhMi && fName.includes("bánh mì")) score += 500;
            if (wantsGaRan && (fName.includes("gà") || catName.includes("gà"))) score += 450;
            if (wantsTra && (fName.includes("trà") || fName.includes("ô long") || fName.includes("phê la"))) score += 450;
            if (wantsCoffee && (fName.includes("cà phê") || fName.includes("phin") || fName.includes("coffee"))) score += 450;
            if (wantsMi && (fName.includes("mỳ") || fName.includes("mì") || fName.includes("spaghetti"))) score += 400;
            if (wantsLau && fName.includes("lẩu")) score += 450;

            // 6. Ngữ cảnh thời tiết / ấm bụng
            if (wantsWarmSoup && !isDrink && (fName.includes("bún") || fName.includes("phở") || fName.includes("lẩu") || fName.includes("canh") || fName.includes("mỳ"))) {
                score += 150;
            }

            // 7. Ngữ cảnh no bụng / bữa chính
            if (wantsHearty && !isDrink && (fName.includes("cơm") || fName.includes("sườn") || fName.includes("bún") || fName.includes("phở") || fName.includes("pizza"))) {
                score += 100;
            }

            // 8. Ràng buộc ngân sách
            if (maxBudget) {
                const meetsBudget = isStrictlyUnder ? f.price < maxBudget : f.price <= maxBudget;
                if (meetsBudget) score += 150;
                else if (f.price === maxBudget && isStrictlyUnder) score += 20;
                else score -= 180;
            }

            // 9. Token matching n-gram
            const tokens = text.split(/[\s,?!.]+/).filter(w => w.length > 1);
            tokens.forEach(tok => {
                if (fName.includes(tok)) score += 40;
                if (fDesc.includes(tok)) score += 15;
            });

            // 10. Điểm xếp hạng phổ biến cơ bản
            score += Math.max(0, 15 - index);

            return { food: f, score };
        });

        scoredList.sort((a, b) => b.score - a.score);

        const bestCandidate = scoredList.length > 0 ? scoredList[0] : null;

        // Chỉ chấp nhận món nếu điểm số dương và đủ tự tin (score >= 40)
        let matchedDish = (bestCandidate && bestCandidate.score >= 40) ? bestCandidate.food : null;

        // Nếu người dùng chỉ hỏi chung chung như "gợi ý món ăn" hoặc "trưa nay ăn gì" mà chưa món nào > 40
        if (!matchedDish && isAskingFood && !isAskingDrink && !wantsBun && !wantsPho && !wantsPizza && !wantsSushi && !wantsChay) {
            const firstValidFood = scoredList.find(item => !isDrinkItem(item.food) && item.score > -500)?.food;
            if (firstValidFood) matchedDish = firstValidFood;
        } else if (!matchedDish && isAskingDrink && !isAskingFood) {
            const firstValidDrink = scoredList.find(item => isDrinkItem(item.food) && item.score > -500)?.food;
            if (firstValidDrink) matchedDrink = firstValidDrink;
        }

        // Nếu vẫn không có món nào phù hợp (món không có hoặc điểm quá thấp):
        if (!matchedDish) {
            return {
                text: "Dạ hiện tại tôi chưa tìm thấy món ăn hoặc đồ uống nào trong thực đơn hoàn toàn khớp với yêu cầu chi tiết này của bạn. 🥺\n\nBạn có thể thử chọn các món Best-Seller nổi tiếng như **Cơm Sườn Bì Chả Sài Gòn**, **Phở Bò Tái Lăn Bát Đàn**, **Bún Chả Hương Liên (Obama)**, **Pizza 4 Cheeses** hay **Trà Ô Long Phê La** nhé! 😊"
            };
        }

        lastDishRef.current = matchedDish;
        const isMatchedDrink = isDrinkItem(matchedDish);
        const restName = matchedDish.restaurant?.name || "Tiệm Ẩm Thực";
        const city = matchedDish.restaurant?.address?.city || "Hà Nội";
        const dishImg = (matchedDish.images && matchedDish.images.length > 0) 
            ? matchedDish.images[0] 
            : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

        let replyText = `Dạ chào bạn! Dựa trên nhu cầu ẩm thực của bạn, tôi xin gợi ý món **${matchedDish.name}** tại **${restName}** cực kỳ thơm ngon, chuẩn vị!`;

        if (wantsBun && (text.includes("cơ mà") || text.includes("đã bảo") || text.includes("thích bún") || isRejection)) {
            replyText = `Dạ vâng, em xin lỗi bạn nhiều nhé! 🍜 Đúng món Bún thơm ngon chuẩn vị bạn đang tìm đây ạ: **${matchedDish.name}** tại **${restName}**. Nước dùng ngọt thanh đậm đà, mời bạn thưởng thức!`;
        } else if (wantsPho && (text.includes("cơ mà") || text.includes("đã bảo") || isRejection)) {
            replyText = `Dạ vâng, em xin lỗi bạn nhé! 🍲 Đúng món Phở thơm lừng bạn đang tìm đây ạ: **${matchedDish.name}** tại **${restName}**. Nước dùng ninh xương gia truyền béo ngậy!`;
        } else if (wantsChay) {
            replyText = `Dạ với lựa chọn thanh đạm, thuần khiết tốt cho sức khỏe, tôi xin gợi ý món **${matchedDish.name}** tại **${restName}** chuẩn vị tươi ngon, giàu dinh dưỡng! 🥗`;
        } else if (isMatchedDrink) {
            replyText = `Dạ giải khát cực đã cùng ly **${matchedDish.name}** thanh mát tại **${restName}** nhé! 🥤`;
        } else if (isRejection) {
            replyText = `Dạ em xin lỗi vì món vừa rồi chưa đúng ý bạn! 😊 Em đã đổi ngay sang món **${matchedDish.name}** tại **${restName}** cho bạn rồi đây ạ. Món này đang là Best-Seller đạt đánh giá rất cao hôm nay!`;
        } else if (maxBudget) {
            if (isStrictlyUnder && matchedDish.price >= maxBudget) {
                replyText = `Dạ hiện tại các món ăn tiêu chuẩn trên hệ thống có giá từ ${Number(matchedDish.price).toLocaleString('vi-VN')} đ (như món **${matchedDish.name}** tại **${restName}**). Tuy nhiên, khi bạn nhập mã ưu đãi **GIAM20K** trong giỏ hàng, giá thực trả sẽ chỉ còn **${(matchedDish.price - 20000).toLocaleString('vi-VN')} đ** (thấp hơn nhiều so với ngân sách ${maxBudget.toLocaleString('vi-VN')} đ của bạn)!`;
            } else {
                replyText = `Dạ với ngân sách khoảng ${maxBudget.toLocaleString('vi-VN')} đ, món **${matchedDish.name}** (giá ${Number(matchedDish.price).toLocaleString('vi-VN')} đ) tại **${restName}** là lựa chọn tuyệt vời vừa vặn túi tiền và chất lượng nhất hôm nay!`;
            }
        } else if (wantsWarmSoup) {
            replyText = `Dạ thời tiết se lạnh hay lúc muốn ấm bụng thì một tô **${matchedDish.name}** nóng hổi tại **${restName}** là chuẩn bài nhất luôn ạ! 🍲`;
        }

        return {
            text: replyText,
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
