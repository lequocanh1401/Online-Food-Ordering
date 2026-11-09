import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
    Box, Typography, Button, TextField, IconButton, CircularProgress, 
    Chip, Card, Avatar, Tooltip, Divider 
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StarIcon from '@mui/icons-material/Star';
import RefreshIcon from '@mui/icons-material/Refresh';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShieldIcon from '@mui/icons-material/Shield';
import BlockIcon from '@mui/icons-material/Block';

import axios from 'axios';
import { API_URL } from '../../config/api';

// Hàm render Markdown cơ bản nhưng rất đẹp cho AI Response
const SimpleMarkdown = ({ text }) => {
    if (!text) return null;

    const lines = text.split('\n');

    return (
        <div className="space-y-2 text-sm leading-relaxed text-gray-200">
            {lines.map((line, index) => {
                const trimmed = line.trim();

                if (!trimmed) {
                    return <div key={index} className="h-2"></div>;
                }

                // Heading 3: ###
                if (trimmed.startsWith('### ')) {
                    return (
                        <h3 key={index} className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mt-4 mb-2 pb-1 border-b border-gray-800 flex items-center gap-2">
                            {trimmed.replace('### ', '')}
                        </h3>
                    );
                }

                // Heading 4: ####
                if (trimmed.startsWith('#### ')) {
                    return (
                        <h4 key={index} className="text-base font-bold text-gray-100 mt-3 mb-1.5 flex items-center gap-1.5 text-pink-300">
                            {trimmed.replace('#### ', '')}
                        </h4>
                    );
                }

                // Blockquote: >
                if (trimmed.startsWith('> ')) {
                    return (
                        <blockquote key={index} className="border-l-4 border-pink-500 bg-pink-500/10 px-3.5 py-2 rounded-r-lg text-xs italic text-pink-200 my-2">
                            {trimmed.replace('> ', '')}
                        </blockquote>
                    );
                }

                // Divider: ---
                if (trimmed === '---') {
                    return <hr key={index} className="border-gray-800 my-3" />;
                }

                // Bullet point: - hoặc *
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const content = trimmed.substring(2);
                    return (
                        <div key={index} className="flex items-start gap-2 pl-2">
                            <span className="text-pink-500 mt-1 font-bold text-xs">•</span>
                            <div className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
                        </div>
                    );
                }

                // Numbered list: 1. 2. 3.
                if (/^\d+\.\s/.test(trimmed)) {
                    const match = trimmed.match(/^(\d+\.)\s(.*)/);
                    if (match) {
                        return (
                            <div key={index} className="flex items-start gap-2 pl-2 mt-1">
                                <span className="text-pink-400 font-bold text-xs shrink-0">{match[1]}</span>
                                <div className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(match[2]) }} />
                            </div>
                        );
                    }
                }

                // Đoạn văn thông thường
                return (
                    <p key={index} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
                );
            })}
        </div>
    );
};

// Format in đậm **text**, code `code`, và highlight
const formatInline = (str) => {
    return str
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-pink-300 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-700/60">$1</code>');
};

export const AiCopilot = () => {
    const jwt = localStorage.getItem("jwt");
    const { restaurant, auth } = useSelector(store => store);
    const usersRestaurant = restaurant.usersRestaurant;
    const isSuperAdmin = auth.user && auth.user.role === "ROLE_ADMIN";
    const restaurantId = isSuperAdmin ? null : usersRestaurant?.id;
    const restaurantName = usersRestaurant?.name || (isSuperAdmin ? "Toàn Hệ Thống" : "Nhà hàng");

    const [messages, setMessages] = useState([]);
    const [inputPrompt, setInputPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [metrics, setMetrics] = useState(null);
    const [executingAction, setExecutingAction] = useState(false);
    const [executedActionIds, setExecutedActionIds] = useState({});

    const superAdminDefaultPrompts = [
        "🏢 Đánh giá tổng quan hiệu quả vận hành & GMV toàn sàn F&B",
        "🛡️ Kiểm duyệt bình luận độc hại & Đánh giá vi phạm tiêu chuẩn sàn",
        "📈 Top các nhà hàng có doanh số cao nhất và quán có nguy cơ rủi ro",
        "⭐ Phân tích chất lượng phục vụ và phản hồi khách hàng toàn hệ thống"
    ];

    const ownerDefaultPrompts = [
        "📊 Đánh giá tổng quan hiệu quả kinh doanh của quán tuần này",
        "⚠️ Cảnh báo nguyên liệu sắp hết & rủi ro gián đoạn bếp",
        "💡 Đề xuất chiến lược tăng doanh thu & kích cầu món bán chậm",
        "🎁 Gợi ý chương trình khuyến mãi giờ vàng tối ưu"
    ];

    const [suggestedPrompts, setSuggestedPrompts] = useState(
        isSuperAdmin ? superAdminDefaultPrompts : ownerDefaultPrompts
    );
    const [copiedIndex, setCopiedIndex] = useState(null);

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const isFirstRender = useRef(true);

    const scrollToBottom = (smooth = true) => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    };

    useEffect(() => {
        // Khi vừa vào trang: giữ nguyên ở đỉnh trang, hiển thị trọn vẹn 4 thẻ KPI và tiêu đề
        if (isFirstRender.current) {
            isFirstRender.current = false;
            window.scrollTo({ top: 0, behavior: 'instant' });
            return;
        }

        // Khi người dùng trò chuyện hoặc AI đang phản hồi: chỉ cuộn nội bộ trong khung tin nhắn
        scrollToBottom(true);
    }, [messages, loading]);

    // Khi vào trang, tự động kích hoạt lời chào và phân tích nhanh khởi đầu
    useEffect(() => {
        const fetchInitialInsights = async () => {
            setLoading(true);
            try {
                const endpoint = restaurantId 
                    ? `${API_URL}/api/admin/ai/copilot/quick-insights/${restaurantId}`
                    : `${API_URL}/api/admin/ai/copilot/quick-insights/0`;

                const { data } = await axios.get(endpoint, {
                    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
                });

                if (data) {
                    setMetrics(data.metricsSummary);
                    if (data.suggestedPrompts?.length) {
                        setSuggestedPrompts(data.suggestedPrompts);
                    }
                    setMessages([
                        {
                            role: 'assistant',
                            content: data.reply,
                            agentAction: data.agentAction,
                            timestamp: new Date()
                        }
                    ]);
                }
            } catch (err) {
                console.error("Lỗi khởi tạo AI Copilot:", err);
                // Fallback tin nhắn khởi tạo
                const fallbackGreeting = isSuperAdmin ? (
                    `### 🏛️ Chào mừng Ban Quản Trị đến với Trợ Lý Vận Hành Toàn Sàn AI!\n\nTôi là **Platform Executive AI Copilot** hỗ trợ giám sát và điều hành toàn bộ sàn giao dịch F&B trực tuyến.\n\nTôi có thể giúp Ban Quản Trị:\n- **Giám sát Tổng GMV toàn sàn & Khối lượng giao dịch** theo thời gian thực.\n- **Đánh giá sức khỏe mạng lưới đối tác nhà hàng** và tỷ lệ mở cửa hoạt động.\n- **Đo lường chỉ số hài lòng khách hàng (CSAT)** và phát hiện sớm các sự cố dịch vụ.\n- **Tư vấn chiến lược mở rộng thị trường, chính sách chiết khấu hoa hồng & phân bổ ngân sách Voucher toàn sàn**.\n\n*Hãy chọn câu hỏi gợi ý bên dưới hoặc nhập yêu cầu điều hành để bắt đầu!*`
                ) : (
                    `### 🤖 Chào mừng bạn đến với Trợ Lý Quản Trị Kinh Doanh AI!\n\nTôi là **F&B AI Business Copilot** được tích hợp sâu vào hệ thống quản lý của quán **${restaurantName}**.\n\nTôi có thể giúp bạn:\n- **Phân tích doanh thu & biên lợi nhuận** theo từng món ăn và thời gian thực.\n- **Cảnh báo tồn kho nguyên vật liệu** sắp cạn để tránh thiếu hụt khi bếp hoạt động.\n- **Đề xuất chiến lược giá, combo và mã giảm giá** vào khung giờ thấp điểm.\n\n*Hãy chọn một câu hỏi gợi ý bên dưới hoặc nhập câu hỏi cụ thể để bắt đầu!*`
                );

                setMessages([
                    {
                        role: 'assistant',
                        content: fallbackGreeting,
                        timestamp: new Date()
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialInsights();
    }, [restaurantId, jwt, restaurantName]);

    const handleExecuteAgentAction = async (action, msgIndex) => {
        if (!action || executingAction) return;
        setExecutingAction(true);
        try {
            if (action.type === 'LOCK_FOOD_AVAILABILITY') {
                await axios.put(`${API_URL}/api/admin/food/${action.foodId}`, {}, {
                    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
                });
                setExecutedActionIds(prev => ({ ...prev, [msgIndex]: true }));
            } else if (action.type === 'MODERATE_REVIEW') {
                await axios.delete(`${API_URL}/api/reviews/${action.reviewId}`, {
                    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
                });
                setExecutedActionIds(prev => ({ ...prev, [msgIndex]: true }));
            }
        } catch (err) {
            console.error("Lỗi thực thi Tác tử AI:", err);
            alert("Lỗi thực thi hành động: " + (err.response?.data?.message || err.message));
        } finally {
            setExecutingAction(false);
        }
    };

    const handleSendMessage = async (textToSend) => {
        const query = textToSend || inputPrompt;
        if (!query.trim() || loading) return;

        const newUserMessage = {
            role: 'user',
            content: query.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputPrompt("");
        setLoading(true);

        try {
            const { data } = await axios.post(
                `${API_URL}/api/admin/ai/copilot/chat`,
                {
                    restaurantId: restaurantId,
                    message: query.trim(),
                    conversationHistory: messages.map(m => `${m.role}: ${m.content}`).slice(-6)
                },
                {
                    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
                }
            );

            if (data) {
                if (data.metricsSummary) {
                    setMetrics(data.metricsSummary);
                }
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: data.reply,
                        agentAction: data.agentAction,
                        timestamp: new Date()
                    }
                ]);
            }
        } catch (err) {
            console.error("Lỗi gửi tin nhắn AI Copilot:", err);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: `⚠️ Rất tiếc, đã có lỗi kết nối tới dịch vụ AI. Tuy nhiên, hệ thống đã ghi nhận yêu cầu của bạn và bạn có thể thử lại sau giây lát!`,
                    timestamp: new Date()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyResponse = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleResetConversation = () => {
        setMessages([
            {
                role: 'assistant',
                content: isSuperAdmin
                    ? `Cuộc hội thoại điều hành sàn đã được làm mới. Tôi sẵn sàng hỗ trợ Ban Quản Trị phân tích các quyết sách vận hành và phát triển toàn hệ thống!`
                    : `Cuộc hội thoại đã được làm mới. Tôi sẵn sàng phân tích các vấn đề kinh doanh mới cho **${restaurantName}**!`,
                timestamp: new Date()
            }
        ]);
    };

    const formatVND = (val) => {
        if (!val && val !== 0) return "0 đ";
        return Number(val).toLocaleString('vi-VN') + " đ";
    };

    return (
        <div className="w-full min-h-[85vh] p-4 lg:p-8 flex flex-col gap-6 text-white max-w-7xl mx-auto">
            {/* Header Trợ lý AI */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-950 via-[#13111c] to-gray-950 p-6 rounded-3xl border border-pink-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-4 z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/30 ring-2 ring-pink-500/40">
                        <AutoAwesomeIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-rose-300 tracking-wide">
                                {isSuperAdmin ? "TRỢ LÝ VẬN HÀNH TOÀN SÀN AI (PLATFORM EXECUTIVE COPILOT)" : "TRỢ LÝ QUẢN TRỊ KINH DOANH AI (RESTAURANT COPILOT)"}
                            </h1>
                            <span className="text-[11px] font-bold bg-gradient-to-r from-pink-600 to-indigo-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                                🤖 Gemini Pro Engine
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span>{isSuperAdmin ? "Phạm vi quản trị:" : "Quản trị viên:"}</span>
                            <span className="text-pink-400 font-semibold">{isSuperAdmin ? "Ban Quản Trị Toàn Hệ Thống Sàn F&B" : restaurantName}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-medium">● Dữ liệu đồng bộ thời gian thực</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 z-10 self-end md:self-center">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleResetConversation}
                        startIcon={<RefreshIcon />}
                        sx={{
                            borderColor: 'rgba(255,255,255,0.15)',
                            color: '#9ca3af',
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            '&:hover': { borderColor: '#ec4899', color: '#fff', bgcolor: 'rgba(236,72,153,0.1)' }
                        }}
                    >
                        Làm mới hội thoại
                    </Button>
                </div>
            </div>

            {/* Quick KPI Cards Bar (Chỉ số tức thời từ DB) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Card 1: Doanh thu / GMV */}
                <div className="bg-[#111116] border border-gray-800/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-pink-500/30 transition-all">
                    <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                        <MonetizationOnIcon />
                    </div>
                    <div className="min-w-0">
                        <span className="text-[11px] text-gray-400 uppercase font-semibold block truncate">
                            {isSuperAdmin ? "Tổng GMV toàn sàn" : "Doanh thu tích lũy"}
                        </span>
                        <span className="text-base font-black text-white truncate block">
                            {metrics ? formatVND(metrics.totalRevenue) : "Đang đồng bộ..."}
                        </span>
                    </div>
                </div>

                {/* Card 2: Đối tác nhà hàng (Super Admin) HOẶC Đơn hoàn thành (Owner) */}
                {isSuperAdmin ? (
                    <div className="bg-[#111116] border border-gray-800/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-indigo-500/30 transition-all">
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                            <StorefrontIcon />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] text-gray-400 uppercase font-semibold block truncate">Đối tác nhà hàng</span>
                            <span className="text-base font-black text-white truncate block">
                                {metrics ? `${metrics.openRestaurants || 0} / ${metrics.totalRestaurants || 0}` : "Đang đồng bộ..."}
                                <span className="text-xs text-emerald-400 font-normal ml-1">đang mở</span>
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#111116] border border-gray-800/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-indigo-500/30 transition-all">
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                            <ShoppingBagIcon />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] text-gray-400 uppercase font-semibold block truncate">Đơn hoàn thành</span>
                            <span className="text-base font-black text-white truncate block">
                                {metrics ? `${metrics.completedOrders} / ${metrics.totalOrders}` : "Đang đồng bộ..."}
                                {metrics && <span className="text-xs text-gray-500 font-normal ml-1">({metrics.completionRate}%)</span>}
                            </span>
                        </div>
                    </div>
                )}

                {/* Card 3: Đơn toàn sàn (Super Admin) HOẶC Đánh giá quán (Owner) */}
                {isSuperAdmin ? (
                    <div className="bg-[#111116] border border-gray-800/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-purple-500/30 transition-all">
                        <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                            <ShoppingBagIcon />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] text-gray-400 uppercase font-semibold block truncate">Đơn toàn hệ thống</span>
                            <span className="text-base font-black text-white truncate block">
                                {metrics ? `${metrics.completedOrders} / ${metrics.totalOrders}` : "Đang đồng bộ..."}
                                {metrics && <span className="text-xs text-gray-500 font-normal ml-1">({metrics.completionRate}%)</span>}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#111116] border border-gray-800/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-yellow-500/30 transition-all">
                        <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center">
                            <StarIcon />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] text-gray-400 uppercase font-semibold block truncate">Đánh giá trung bình</span>
                            <span className="text-base font-black text-white truncate block">
                                {metrics ? `${metrics.averageRating} / 5.0 ⭐` : "5.0 ⭐"}
                                {metrics && <span className="text-xs text-gray-500 font-normal ml-1">({metrics.totalReviews})</span>}
                            </span>
                        </div>
                    </div>
                )}

                {/* Card 4: CSAT toàn sàn (Super Admin) HOẶC Nguyên liệu cạn kho (Owner) */}
                {isSuperAdmin ? (
                    <div className="bg-[#111116] border border-gray-800/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-amber-500/30 transition-all">
                        <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                            <StarIcon />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] text-gray-400 uppercase font-semibold block truncate">Độ hài lòng (CSAT)</span>
                            <span className="text-base font-black text-amber-400 truncate block">
                                {metrics ? `${metrics.averageRating} / 5.0 ⭐` : "5.0 ⭐"}
                                {metrics && <span className="text-xs text-gray-500 font-normal ml-1">({metrics.totalReviews} đánh giá)</span>}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#111116] border border-gray-800/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-rose-500/30 transition-all">
                        <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                            <WarningAmberIcon />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] text-gray-400 uppercase font-semibold block truncate">Topping tạm ngưng</span>
                            <span className="text-base font-black text-rose-400 truncate block">
                                {metrics ? `${metrics.outOfStockIngredients?.length || 0} mục` : "0 mục"}
                                <span className="text-xs text-gray-400 font-normal ml-1">đang tắt</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Khung Chat Trợ lý AI */}
            <div className="flex-1 bg-gradient-to-b from-[#0f0f14] to-[#0a0a0d] border border-gray-800/90 rounded-3xl p-5 lg:p-7 flex flex-col justify-between shadow-2xl min-h-[520px]">
                {/* Danh sách tin nhắn */}
                <div ref={chatContainerRef} className="space-y-6 overflow-y-auto max-h-[58vh] pr-2 no-scrollbar">
                    {messages.map((msg, index) => {
                        const isAi = msg.role === 'assistant';
                        return (
                            <div 
                                key={index} 
                                className={`flex gap-3.5 ${isAi ? 'justify-start' : 'justify-end'} group`}
                            >
                                {isAi && (
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-pink-500/20 ring-1 ring-pink-400/30 mt-1">
                                        <SmartToyIcon sx={{ fontSize: 18 }} />
                                    </div>
                                )}

                                <div className={`max-w-[85%] md:max-w-[78%] rounded-2xl p-4 relative ${
                                    isAi 
                                        ? 'bg-[#15151c] border border-gray-800/90 shadow-md text-gray-200' 
                                        : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium shadow-lg shadow-pink-600/20'
                                }`}>
                                    {isAi ? (
                                        <>
                                            <SimpleMarkdown text={msg.content} />

                                            {/* Tác tử AI Hành động (Agentic Action Interactive Card) */}
                                            {msg.agentAction && (
                                                <div className="mt-4 p-4 rounded-xl border border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-[#1a1520] to-gray-900 shadow-xl">
                                                    <div className="flex items-center gap-2 mb-2.5">
                                                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white flex items-center gap-1 shadow-sm">
                                                            <AutoAwesomeIcon sx={{ fontSize: 13 }} />
                                                            Tác tử AI Hành Động
                                                        </span>
                                                        <span className="text-xs font-bold text-rose-300">{msg.agentAction.title}</span>
                                                    </div>

                                                    {msg.agentAction.type === 'LOCK_FOOD_AVAILABILITY' && (
                                                        <div className="space-y-2 text-xs text-gray-300">
                                                            <div className="p-2.5 rounded-lg bg-black/40 border border-gray-800 flex items-center justify-between">
                                                                <div>
                                                                    <span className="text-gray-400 block text-[11px]">Món ăn bị ảnh hưởng tồn kho:</span>
                                                                    <span className="font-bold text-white text-sm">{msg.agentAction.foodName}</span>
                                                                </div>
                                                                <Chip 
                                                                    size="small" 
                                                                    label={executedActionIds[index] ? "🔴 Tạm hết món" : (msg.agentAction.currentAvailable ? "🟢 Đang mở bán" : "🔴 Đã tạm khóa")} 
                                                                    sx={{ 
                                                                        bgcolor: executedActionIds[index] ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', 
                                                                        color: executedActionIds[index] ? '#f87171' : '#34d399', 
                                                                        fontWeight: 'bold' 
                                                                    }}
                                                                />
                                                            </div>
                                                            <p className="text-gray-400 italic text-[11px] leading-relaxed">
                                                                ℹ️ {msg.agentAction.reason}
                                                            </p>
                                                            {executedActionIds[index] ? (
                                                                <div className="mt-2 py-2.5 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                                                                    <CheckIcon sx={{ fontSize: 18 }} />
                                                                    Tác tử AI đã tạm khóa món thành công! Thực đơn khách hàng đã cập nhật "Tạm hết món".
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleExecuteAgentAction(msg.agentAction, index)}
                                                                    disabled={executingAction}
                                                                    className="mt-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                                                                >
                                                                    {executingAction ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <BlockIcon sx={{ fontSize: 16 }} />}
                                                                    {msg.agentAction.buttonLabel}
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {msg.agentAction.type === 'MODERATE_REVIEW' && (
                                                        <div className="space-y-2 text-xs text-gray-300">
                                                            <div className="p-3 rounded-lg bg-black/40 border border-red-900/50">
                                                                <div className="flex items-center justify-between mb-1.5">
                                                                    <span className="font-bold text-rose-300">{msg.agentAction.customerName}</span>
                                                                    <span className="text-amber-400 font-bold">⭐ {msg.agentAction.rating} / 5.0</span>
                                                                </div>
                                                                <blockquote className="border-l-2 border-red-500 pl-2.5 text-xs italic text-gray-300 my-1">
                                                                    "{msg.agentAction.comment}"
                                                                </blockquote>
                                                                <span className="text-[10px] text-gray-400 block mt-1">
                                                                    Đối tác mục tiêu: <strong className="text-white">{msg.agentAction.restaurantName}</strong>
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-400 italic text-[11px] leading-relaxed">
                                                                ⚠️ {msg.agentAction.reason}
                                                            </p>
                                                            {executedActionIds[index] ? (
                                                                <div className="mt-2 py-2.5 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                                                                    <CheckIcon sx={{ fontSize: 18 }} />
                                                                    Đã gỡ bỏ đánh giá vi phạm khỏi sàn! Uy tín đối tác và CSAT sàn đã phục hồi.
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleExecuteAgentAction(msg.agentAction, index)}
                                                                    disabled={executingAction}
                                                                    className="mt-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                                                                >
                                                                    {executingAction ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <ShieldIcon sx={{ fontSize: 16 }} />}
                                                                    {msg.agentAction.buttonLabel}
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Nút copy câu trả lời */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Tooltip title={copiedIndex === index ? "Đã sao chép" : "Sao chép phản hồi"}>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleCopyResponse(msg.content, index)}
                                                        sx={{ color: copiedIndex === index ? '#10b981' : '#9ca3af', p: 0.5 }}
                                                    >
                                                        {copiedIndex === index ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    )}

                                    <div className={`text-[10px] mt-2 ${isAi ? 'text-gray-500' : 'text-pink-200'} text-right`}>
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </div>
                                </div>

                                {!isAi && (
                                    <div className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 shrink-0 mt-1">
                                        <PersonIcon sx={{ fontSize: 18 }} />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {loading && (
                        <div className="flex gap-3.5 items-center">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-600 to-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                                <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                            </div>
                            <div className="bg-[#15151c] border border-gray-800/90 rounded-2xl p-4 text-sm text-gray-400 flex items-center gap-3">
                                <CircularProgress size={16} sx={{ color: '#ec4899' }} />
                                <span>AI Copilot đang phân tích số liệu và chuẩn bị kế hoạch hành động...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Khu vực Gợi ý câu hỏi nhanh (Quick Prompts) */}
                <div className="mt-5 pt-4 border-t border-gray-800/80">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2.5 font-medium">
                        <LightbulbIcon sx={{ fontSize: 14 }} className="text-yellow-400" />
                        <span>Gợi ý câu hỏi quản trị nhanh cho chủ quán:</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {suggestedPrompts.map((prompt, idx) => (
                            <button
                                key={idx}
                                type="button"
                                disabled={loading}
                                onClick={() => handleSendMessage(prompt)}
                                className="text-xs bg-[#171720] hover:bg-pink-600/20 text-gray-300 hover:text-pink-300 border border-gray-800 hover:border-pink-500/50 px-3 py-1.5 rounded-xl transition-all duration-200 text-left disabled:opacity-50 active:scale-95 shadow-sm"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Thanh nhập câu hỏi */}
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="flex items-center gap-2.5 bg-gray-950/80 border border-gray-800 focus-within:border-pink-500 rounded-2xl p-1.5 pl-4 transition-all duration-200 shadow-inner"
                    >
                        <input
                            type="text"
                            value={inputPrompt}
                            onChange={(e) => setInputPrompt(e.target.value)}
                            disabled={loading}
                            placeholder="Hỏi AI về doanh thu, món ăn bán chậm, nguyên liệu tồn kho hoặc chiến lược tuần tới..."
                            className="w-full bg-transparent text-sm text-white placeholder-gray-500 border-none outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!inputPrompt.trim() || loading}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-40 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md shadow-pink-600/30 shrink-0"
                            aria-label="Send"
                        >
                            <SendIcon sx={{ fontSize: 16 }} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
