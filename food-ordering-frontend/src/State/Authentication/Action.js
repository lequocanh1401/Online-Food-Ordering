import axios from "axios";
import { API_URL } from "../../config/api";
import {
    GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS,
    LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS,
    ADD_TO_FAVORITES_REQUEST, ADD_TO_FAVORITES_SUCCESS, ADD_TO_FAVORITES_FAILURE,
    UPDATE_USER_PROFILE_REQUEST, UPDATE_USER_PROFILE_SUCCESS, UPDATE_USER_PROFILE_FAILURE
} from "./ActionType";

export const registerUser = (reqData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData);
        if (data.jwt) localStorage.setItem("jwt", data.jwt);

        if (data.role === "ROLE_RESTAURANT_OWNER") {
            reqData.navigate("/admin/restaurant");
        } else {
            reqData.navigate("/");
        }
        dispatch({ type: REGISTER_SUCCESS, payload: data.jwt });
        console.log("Đăng ký thành công", data);
    } catch (error) {
        // Chỉ gửi chuỗi text báo lỗi, ngăn Redux bị nghẹn
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
        console.log("Lỗi đăng ký", errorMessage);
    }
};

export const loginUser = (reqData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/auth/signin`, reqData.userData);
        if (data.jwt) localStorage.setItem("jwt", data.jwt);

        if (data.role === "ROLE_RESTAURANT_OWNER") {
            reqData.navigate("/admin/restaurant");
        } else {
            reqData.navigate("/");
        }
        dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
        console.log("Đăng nhập thành công", data);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
        console.log("Lỗi đăng nhập", errorMessage);
    }
};

export const getUser = (jwt) => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
        const { data } = await axios.get(`${API_URL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: GET_USER_SUCCESS, payload: data });
        console.log("Lấy Profile thành công", data);
    } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.warn("Token đã hết hạn hoặc không hợp lệ, tự động dọn dẹp localStorage");
            localStorage.removeItem("jwt");
        }
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
        console.log("Lỗi lấy Profile", errorMessage);
    }
};

export const logout = () => async (dispatch) => {
    try {
        localStorage.clear();
        dispatch({ type: LOGOUT });
        console.log("Đăng xuất thành công");
    } catch (error) {
        console.log("Lỗi đăng xuất", error);
    }
};

export const addToFavorites = ({ jwt, restaurantId }) => async (dispatch) => {
    dispatch({ type: ADD_TO_FAVORITES_REQUEST });
    try {
        const { data } = await axios.put(`${API_URL}/api/restaurants/${restaurantId}/add-favorites`, {}, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: ADD_TO_FAVORITES_SUCCESS, payload: data });
        console.log("Đã cập nhật yêu thích", data);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ type: ADD_TO_FAVORITES_FAILURE, payload: errorMessage });
        console.log("Lỗi cập nhật yêu thích", errorMessage);
    }
};

export const addUserAddress = ({ jwt, addressData }) => async (dispatch) => {
    try {
        const { data } = await axios.put(`${API_URL}/api/users/profile/address`, addressData, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        // Tận dụng luôn GET_USER_SUCCESS để nạp đè User mới cập nhật vào Redux
        dispatch({ type: GET_USER_SUCCESS, payload: data });
        console.log("Thêm địa chỉ mới thành công:", data);
    } catch (error) {
        console.log("Lỗi thêm địa chỉ mới:", error.response?.data?.message || error.message);
    }
};

export const deleteUserAddress = ({ jwt, addressId }) => async (dispatch) => {
    try {
        const { data } = await axios.delete(`${API_URL}/api/users/profile/address/${addressId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: GET_USER_SUCCESS, payload: data });
        console.log("Xóa địa chỉ thành công:", data);
    } catch (error) {
        console.log("Lỗi xóa địa chỉ:", error.response?.data?.message || error.message);
    }
};

export const updateUserAddress = ({ jwt, addressId, addressData }) => async (dispatch) => {
    try {
        const { data } = await axios.put(`${API_URL}/api/users/profile/address/${addressId}`, addressData, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: GET_USER_SUCCESS, payload: data });
        console.log("Cập nhật địa chỉ thành công:", data);
    } catch (error) {
        console.log("Lỗi cập nhật địa chỉ:", error.response?.data?.message || error.message);
    }
};

export const socialLogin = ({ provider, token, navigate }) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/auth/${provider}`, { token });
        if (data.jwt) localStorage.setItem("jwt", data.jwt);

        if (data.role === "ROLE_RESTAURANT_OWNER") {
            navigate("/admin/restaurant");
        } else {
            navigate("/");
        }
        dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
        console.log(`Đăng nhập bằng ${provider} thành công`, data);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
        console.log(`Lỗi đăng nhập ${provider}`, errorMessage);
        alert(`Lỗi đăng nhập qua ${provider}: ` + errorMessage);
    }
};

export const updateUserProfile = ({ reqData, jwt }) => async (dispatch) => {
    dispatch({ type: UPDATE_USER_PROFILE_REQUEST });
    try {
        const { data } = await axios.put(`${API_URL}/api/users/profile`, reqData, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: UPDATE_USER_PROFILE_SUCCESS, payload: data });
        console.log("Cập nhật Profile thành công", data);
        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ type: UPDATE_USER_PROFILE_FAILURE, payload: errorMessage });
        console.log("Lỗi cập nhật Profile", errorMessage);
        throw error;
    }
};