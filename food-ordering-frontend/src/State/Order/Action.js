import { api } from "../../config/api";
import {
    CREATE_ORDER_FAILURE,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    GET_USERS_ORDERS_FAILURE,
    GET_USERS_ORDERS_REQUEST,
    GET_USERS_ORDERS_SUCCESS,
    COMPLETE_PAYMENT_REQUEST,
    COMPLETE_PAYMENT_SUCCESS,
    COMPLETE_PAYMENT_FAILURE
} from "./ActionType";

export const createOrder = ({ reqData, jwt, navigate, paymentMethod = "STRIPE" }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_ORDER_REQUEST });
        try {
            const { data } = await api.post('/api/order', reqData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            console.log("Tạo đơn hàng thành công: ", data);
            dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });

            // Nếu người dùng chọn thanh toán trực tuyến qua Stripe và Backend trả về link thanh toán
            if (paymentMethod === "STRIPE" && data.payment_url) {
                window.location.href = data.payment_url;
            } else if (navigate) {
                navigate("/my-profile/orders");
            }
        } catch (error) {
            console.log("Lỗi tạo đơn hàng rồi: ", error);
            dispatch({ type: CREATE_ORDER_FAILURE, payload: error });
        }
    };
};

export const getUsersOrders = (jwt) => {
    return async (dispatch) => {
        dispatch({ type: GET_USERS_ORDERS_REQUEST });
        try {
            const { data } = await api.get('/api/order/user', {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("Kéo lịch sử đơn hàng thành công: ", data);
            dispatch({ type: GET_USERS_ORDERS_SUCCESS, payload: data });
        } catch (error) {
            console.log("Lỗi kéo lịch sử đơn hàng: ", error);
            dispatch({ type: GET_USERS_ORDERS_FAILURE, payload: error });
        }
    };
};

export const completePayment = ({ orderId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: COMPLETE_PAYMENT_REQUEST });
        try {
            const { data } = await api.put(`/api/order/${orderId}/complete-payment`, {}, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("Cập nhật thanh toán thành công: ", data);
            dispatch({ type: COMPLETE_PAYMENT_SUCCESS, payload: data });
        } catch (error) {
            console.log("Lỗi cập nhật thanh toán: ", error);
            dispatch({ type: COMPLETE_PAYMENT_FAILURE, payload: error });
        }
    };
};

export const cancelOrder = ({ orderId, jwt }) => {
    return async (dispatch) => {
        try {
            await api.delete(`/api/order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("Hủy đơn hàng thành công");
            dispatch(getUsersOrders(jwt));
        } catch (error) {
            console.log("Lỗi hủy đơn hàng: ", error.response?.data || error.message);
        }
    };
};