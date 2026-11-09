import axios from "axios";
import { api, API_URL } from "../../config/api";
import {
    GET_ALL_RESTAURANTS_FAILURE, GET_ALL_RESTAURANTS_REQUEST, GET_ALL_RESTAURANTS_SUCCESS,
    GET_RESTAURANT_BY_ID_FAILURE, GET_RESTAURANT_BY_ID_REQUEST, GET_RESTAURANT_BY_ID_SUCCESS,
    CREATE_RESTAURANT_REQUEST, CREATE_RESTAURANT_SUCCESS, CREATE_RESTAURANT_FAILURE,
    GET_RESTAURANT_BY_USER_ID_REQUEST, GET_RESTAURANT_BY_USER_ID_SUCCESS, GET_RESTAURANT_BY_USER_ID_FAILURE,
    UPDATE_RESTAURANT_STATUS_REQUEST, UPDATE_RESTAURANT_STATUS_SUCCESS, UPDATE_RESTAURANT_STATUS_FAILURE,
    CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, CREATE_CATEGORY_FAILURE,
    GET_RESTAURANTS_CATEGORY_REQUEST, GET_RESTAURANTS_CATEGORY_SUCCESS, GET_RESTAURANTS_CATEGORY_FAILURE,
    CREATE_EVENT_REQUEST, CREATE_EVENT_SUCCESS, CREATE_EVENT_FAILURE,
    CREATE_EVENTS_REQUEST, CREATE_EVENTS_SUCCESS, CREATE_EVENTS_FAILURE,
    GET_RESTAURANTS_EVENTS_REQUEST, GET_RESTAURANTS_EVENTS_SUCCESS, GET_RESTAURANTS_EVENTS_FAILURE,
    DELETE_EVENT_REQUEST, DELETE_EVENT_SUCCESS, DELETE_EVENT_FAILURE,
    GET_ALL_EVENTS_REQUEST, GET_ALL_EVENTS_SUCCESS, GET_ALL_EVENTS_FAILURE
} from "./ActionType";

// ================= CÁC HÀM DÀNH CHO KHÁCH HÀNG =================
export const getAllRestaurantsAction = (token) => async (dispatch) => {
    dispatch({
        type: GET_ALL_RESTAURANTS_REQUEST
    });
    try {
        console.log("4. Bắt đầu gọi Axios lấy danh sách nhà hàng...");

        const headers = (token && token !== "null" && token !== "undefined")
            ? { Authorization: `Bearer ${token}` }
            : {};

        const { data } = await axios.get(`${API_URL}/api/restaurants`, { headers });

        console.log("5. Đã nhận dữ liệu từ Java về:", data);

        dispatch({
            type: GET_ALL_RESTAURANTS_SUCCESS,
            payload: data
        });
    } catch (error) {
        console.error("5. LỖI RỒI! Bị chặn tại Axios:", error);
        dispatch({
            type: GET_ALL_RESTAURANTS_FAILURE,
            payload: error.message
        });
    }
};

export const getRestaurantById = (reqData) => async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_BY_ID_REQUEST });
    try {
        const headers = reqData.jwt ? { Authorization: `Bearer ${reqData.jwt}` } : {};
        const { data } = await axios.get(`${API_URL}/api/restaurants/${reqData.restaurantId}`, { headers });
        dispatch({ type: GET_RESTAURANT_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_RESTAURANT_BY_ID_FAILURE, payload: error.message });
    }
};

// ================= CÁC HÀM DÀNH CHO ADMIN =================
export const getRestaurantByUserId = (jwt) => async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_BY_USER_ID_REQUEST });
    try {
        const { data } = await axios.get(`${API_URL}/api/admin/restaurants/user`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: GET_RESTAURANT_BY_USER_ID_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_RESTAURANT_BY_USER_ID_FAILURE, payload: error.message });
    }
};

export const updateRestaurantStatus = ({ restaurantId, jwt }) => async (dispatch) => {
    dispatch({ type: UPDATE_RESTAURANT_STATUS_REQUEST });
    try {
        const { data } = await axios.put(`${API_URL}/api/admin/restaurants/${restaurantId}/status`, {}, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: UPDATE_RESTAURANT_STATUS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UPDATE_RESTAURANT_STATUS_FAILURE, payload: error.message });
    }
};

export const createRestaurant = (reqData) => async (dispatch) => {
    dispatch({ type: CREATE_RESTAURANT_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/api/admin/restaurants`, reqData.data, {
            headers: {
                Authorization: `Bearer ${reqData.token}`
            }
        });
        dispatch({ type: CREATE_RESTAURANT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: CREATE_RESTAURANT_FAILURE, payload: error.message });
    }
};

export const getRestaurantsCategory = ({ jwt, restaurantId }) => async (dispatch) => {
    dispatch({ type: GET_RESTAURANTS_CATEGORY_REQUEST });
    try {
        const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};
        const { data } = await axios.get(`${API_URL}/api/category/restaurant/${restaurantId}`, { headers });
        dispatch({ type: GET_RESTAURANTS_CATEGORY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_RESTAURANTS_CATEGORY_FAILURE, payload: error.message });
    }
};

export const createCategoryAction = ({ reqData, jwt }) => async (dispatch) => {
    dispatch({ type: CREATE_CATEGORY_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/api/admin/category`, reqData, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: CREATE_CATEGORY_FAILURE, payload: error.message });
    }
};

export const createEventAction = ({ data, jwt, restaurantId }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_EVENTS_REQUEST });
        try {
            // Chú ý: Dấu backtick (`) để lấy đúng restaurantId gắn vào link
            const res = await api.post(`/api/admin/events/restaurant/${restaurantId}`, data, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("Tạo sự kiện thành công:", res.data);
            dispatch({ type: CREATE_EVENTS_SUCCESS, payload: res.data });
        } catch (error) {
            console.log("Lỗi tạo sự kiện:", error);
            dispatch({ type: CREATE_EVENTS_FAILURE, payload: error });
        }
    };
};

export const getRestaurantsEvents = ({ restaurantId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: GET_RESTAURANTS_EVENTS_REQUEST });
        try {
            // Có thể backend của bạn không có /admin ở link GET này, hãy kiểm tra Java
            const res = await api.get(`/api/events/restaurant/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("Lấy sự kiện thành công:", res.data);
            dispatch({ type: GET_RESTAURANTS_EVENTS_SUCCESS, payload: res.data });
        } catch (error) {
            console.log("Lỗi lấy sự kiện:", error);
            dispatch({ type: GET_RESTAURANTS_EVENTS_FAILURE, payload: error });
        }
    };
};

export const deleteEventAction = ({ eventId, jwt }) => async (dispatch) => {
    dispatch({ type: DELETE_EVENT_REQUEST });
    try {
        await axios.delete(`${API_URL}/api/admin/events/${eventId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: DELETE_EVENT_SUCCESS, payload: eventId });
    } catch (error) {
        dispatch({ type: DELETE_EVENT_FAILURE, payload: error.message });
    }
};

export const getAllEventsAction = ({ jwt }) => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_EVENTS_REQUEST });
        try {
            const res = await api.get(`/api/events`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("Kéo dữ liệu sự kiện thành công:", res.data);
            dispatch({ type: GET_ALL_EVENTS_SUCCESS, payload: res.data });
        } catch (error) {
            console.log("Lỗi kéo sự kiện:", error);
            dispatch({ type: GET_ALL_EVENTS_FAILURE, payload: error });
        }
    };
};

export const updateCategoryAction = ({ categoryId, data, jwt, restaurantId }) => async (dispatch) => {
    try {
        await axios.put(`${API_URL}/api/admin/category/${categoryId}`, data, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Cập nhật danh mục thành công");
        dispatch(getRestaurantsCategory({ jwt, restaurantId }));
    } catch (error) {
        console.log("Lỗi cập nhật danh mục:", error.message);
    }
};

export const deleteCategoryAction = ({ categoryId, jwt, restaurantId }) => async (dispatch) => {
    try {
        await axios.delete(`${API_URL}/api/admin/category/${categoryId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Xóa danh mục thành công");
        dispatch(getRestaurantsCategory({ jwt, restaurantId }));
    } catch (error) {
        alert(error.response?.data?.message || error.response?.data || error.message);
        console.log("Lỗi xóa danh mục:", error.message);
    }
};

export const updateEventAction = ({ eventId, data, jwt, restaurantId }) => async (dispatch) => {
    try {
        await api.put(`/api/admin/events/${eventId}`, data, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Cập nhật sự kiện thành công");
        dispatch(getRestaurantsEvents({ restaurantId, jwt }));
    } catch (error) {
        console.log("Lỗi cập nhật sự kiện:", error.message);
    }
};

export const updateRestaurantAction = ({ restaurantId, reqData, jwt }) => async (dispatch) => {
    try {
        const { data } = await axios.put(`${API_URL}/api/admin/restaurants/${restaurantId}`, reqData, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        console.log("Cập nhật thông tin nhà hàng thành công");
        dispatch({ type: GET_RESTAURANT_BY_USER_ID_SUCCESS, payload: data });
    } catch (error) {
        console.log("Lỗi cập nhật thông tin nhà hàng:", error.message);
        alert(error.response?.data?.message || error.response?.data || error.message);
    }
};