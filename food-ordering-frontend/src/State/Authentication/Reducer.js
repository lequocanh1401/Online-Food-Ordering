import {
    GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS,
    LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS,
    ADD_TO_FAVORITES_REQUEST, ADD_TO_FAVORITES_SUCCESS, ADD_TO_FAVORITES_FAILURE,
    UPDATE_USER_PROFILE_REQUEST, UPDATE_USER_PROFILE_SUCCESS, UPDATE_USER_PROFILE_FAILURE
} from "./ActionType";

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    jwt: null,
    favorites: [],
    success: null
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case UPDATE_USER_PROFILE_REQUEST:
            return { ...state, isLoading: true, error: null, success: null };

        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            return { ...state, isLoading: false, jwt: action.payload, success: "Xác thực thành công" };

        case GET_USER_SUCCESS:
            return { 
                ...state, 
                isLoading: false, 
                user: action.payload,
                favorites: action.payload.favorites || []
            };

        case UPDATE_USER_PROFILE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: action.payload,
                success: "Cập nhật thông tin thành công"
            };

        case ADD_TO_FAVORITES_REQUEST:
            return { ...state, isLoading: true, error: null, success: null };

        case ADD_TO_FAVORITES_SUCCESS:
            const isFav = state.favorites.some(item => item.id === action.payload.id);
            const updatedFavorites = isFav 
                ? state.favorites.filter(item => item.id !== action.payload.id) 
                : [...state.favorites, action.payload];
            return {
                ...state,
                isLoading: false,
                favorites: updatedFavorites,
                user: state.user ? { ...state.user, favorites: updatedFavorites } : null,
                success: isFav ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích"
            };

        case ADD_TO_FAVORITES_FAILURE:
            return { ...state, isLoading: false, error: action.payload, success: null };

        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case GET_USER_FAILURE:
        case UPDATE_USER_PROFILE_FAILURE:
            return { ...state, isLoading: false, error: action.payload, success: null };

        case LOGOUT:
            return initialState; // Reset lại kho trống trơn

        default:
            return state;
    }
};