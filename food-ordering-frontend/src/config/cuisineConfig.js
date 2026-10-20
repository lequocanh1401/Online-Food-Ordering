/**
 * Danh sách chuẩn hóa các loại hình ẩm thực cho hệ thống Online Food Ordering.
 * Được dùng chung giữa:
 * 1. Form đăng ký mở nhà hàng (CreateRestaurantForm)
 * 2. Form chỉnh sửa thông tin nhà hàng của Chủ quán (RestaurantDetails)
 * 3. Bộ lọc phân loại ẩm thực trên Trang chủ Khách hàng (Home)
 */

export const CUISINE_OPTIONS = [
    "Phở & Bún",
    "Bún & Mì",
    "Cơm & Món Việt",
    "Bánh Mì & Đường Phố",
    "Pizza & Pasta",
    "Sushi & Sashimi",
    "Gà Rán & Fastfood",
    "Lẩu & Nướng",
    "Dimsum & Trung Hoa",
    "Steak & Wine",
    "Cà Phê & Bánh",
    "Đồ Ăn Vặt & Trà Sữa",
    "Món Chay"
];

export const OTHER_CUISINE_OPTION = "Khác...";

export const ALL_CUISINE_DROPDOWN_OPTIONS = [
    ...CUISINE_OPTIONS,
    OTHER_CUISINE_OPTION
];

export const HOME_CUISINE_FILTERS = [
    { label: "Tất cả món", value: "ALL" },
    ...CUISINE_OPTIONS.map(c => ({ label: c, value: c }))
];
