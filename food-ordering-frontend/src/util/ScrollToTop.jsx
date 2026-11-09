import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Tự động cuộn màn hình lên đầu trang (0, 0) mỗi khi người dùng chuyển trang (chuyển URL/Route)
 * Khắc phục hiện tượng giữ nguyên vị trí cuộn trang của Single Page Application (SPA)
 */
export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
