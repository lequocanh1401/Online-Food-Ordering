import { api } from "../../config/api";
import {
    CREATE_INGREDIENT_CATEGORY_SUCCESS,
    CREATE_INGREDIENT_SUCCESS,
    GET_INGREDIENTS,
    GET_INGREDIENT_CATEGORY_SUCCESS,
    UPDATE_STOCK
} from "./ActionType";

export const getIngredientsOfRestaurant = ({ id, jwt }) => {
    return async (dispatch) => {
        try {
            const response = await api.get(`/api/admin/ingredients/restaurant/${id}`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            dispatch({ type: GET_INGREDIENTS, payload: response.data });
        } catch (error) {
            console.log("Lỗi lấy danh sách nguyên liệu", error);
        }
    };
};

export const createIngredient = ({ data, jwt }) => {
    return async (dispatch) => {
        try {
            // Đảm bảo gửi đúng cục 'data' chuẩn xác vào API
            const response = await api.post(`/api/admin/ingredients`, data, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            dispatch({ type: CREATE_INGREDIENT_SUCCESS, payload: response.data });
        } catch (error) {
            console.log("Lỗi tạo nguyên liệu", error);
        }
    };
};

export const createIngredientCategory = ({ data, jwt }) => {
    return async (dispatch) => {
        try {
            const response = await api.post(`/api/admin/ingredients/category`, data, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            dispatch({ type: CREATE_INGREDIENT_CATEGORY_SUCCESS, payload: response.data });
        } catch (error) {
            console.log("Lỗi tạo nhóm nguyên liệu", error);
        }
    };
};

export const getIngredientCategory = ({ id, jwt }) => {
    return async (dispatch) => {
        try {
            const response = await api.get(`/api/admin/ingredients/restaurant/${id}/category`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            dispatch({ type: GET_INGREDIENT_CATEGORY_SUCCESS, payload: response.data });
        } catch (error) {
            console.log("Lỗi lấy nhóm nguyên liệu", error);
        }
    };
};

export const updateStockOfIngredient = ({ id, jwt }) => {
    return async (dispatch) => {
        try {
            // Chữ 'stock' đã được chuẩn hóa để không bị lỗi 404
            const { data } = await api.put(`/api/admin/ingredients/${id}/stock`, {}, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            dispatch({ type: UPDATE_STOCK, payload: data });
        } catch (error) {
            console.log("Lỗi cập nhật kho", error);
        }
    };
};

export const deleteIngredientAction = ({ id, jwt, restaurantId }) => async (dispatch) => {
    try {
        await api.delete(`/api/admin/ingredients/${id}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Xóa nguyên liệu thành công");
        dispatch(getIngredientsOfRestaurant({ id: restaurantId, jwt }));
    } catch (error) {
        alert(error.response?.data?.message || error.response?.data || error.message);
        console.log("Lỗi xóa nguyên liệu:", error.message);
    }
};

export const updateIngredientAction = ({ id, data, jwt, restaurantId }) => async (dispatch) => {
    try {
        await api.put(`/api/admin/ingredients/${id}`, data, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Cập nhật nguyên liệu thành công");
        dispatch(getIngredientsOfRestaurant({ id: restaurantId, jwt }));
    } catch (error) {
        console.log("Lỗi cập nhật nguyên liệu:", error.message);
    }
};

export const deleteIngredientCategoryAction = ({ id, jwt, restaurantId }) => async (dispatch) => {
    try {
        await api.delete(`/api/admin/ingredients/category/${id}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Xóa nhóm nguyên liệu thành công");
        dispatch(getIngredientCategory({ id: restaurantId, jwt }));
    } catch (error) {
        alert(error.response?.data?.message || error.response?.data || error.message);
        console.log("Lỗi xóa nhóm nguyên liệu:", error.message);
    }
};

export const updateIngredientCategoryAction = ({ id, data, jwt, restaurantId }) => async (dispatch) => {
    try {
        await api.put(`/api/admin/ingredients/category/${id}`, data, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Cập nhật nhóm nguyên liệu thành công");
        dispatch(getIngredientCategory({ id: restaurantId, jwt }));
    } catch (error) {
        console.log("Lỗi cập nhật nhóm nguyên liệu:", error.message);
    }
};

export const importIngredientStockAction = ({ id, additionalQuantity, note, jwt, restaurantId }) => async (dispatch) => {
    try {
        await api.post(`/api/admin/ingredients/${id}/import`, { additionalQuantity, note }, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        dispatch(getIngredientsOfRestaurant({ id: restaurantId, jwt }));
        if (restaurantId) {
            dispatch(fetchInventoryLogsAction({ restaurantId, jwt }));
        }
    } catch (error) {
        alert(error.response?.data?.message || error.response?.data || error.message);
        console.log("Lỗi nhập kho:", error.message);
    }
};

export const fetchInventoryLogsAction = ({ restaurantId, jwt }) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/admin/ingredients/restaurant/${restaurantId}/logs`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        dispatch({ type: "GET_INVENTORY_LOGS", payload: data });
    } catch (error) {
        console.log("Lỗi lấy lịch sử kho:", error.message);
    }
};