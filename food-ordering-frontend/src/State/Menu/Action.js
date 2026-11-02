import axios from "axios";
import { API_URL } from "../../config/api";
import {
    CREATE_MENU_ITEM_FAILURE, CREATE_MENU_ITEM_REQUEST, CREATE_MENU_ITEM_SUCCESS,
    DELETE_MENU_ITEM_FAILURE, DELETE_MENU_ITEM_REQUEST, DELETE_MENU_ITEM_SUCCESS,
    GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST, GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS,
    UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE, UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST, UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS
} from "./ActionType";

export const createMenuItem = ({ menu, jwt }) => async (dispatch) => {
    dispatch({ type: CREATE_MENU_ITEM_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/api/admin/food`, menu, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        dispatch({ type: CREATE_MENU_ITEM_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: CREATE_MENU_ITEM_FAILURE, payload: error.message });
    }
};

export const getMenuItemsByRestaurantId = (reqData) => async (dispatch) => {
    dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST });
    try {
        const headers = reqData.jwt ? { Authorization: `Bearer ${reqData.jwt}` } : {};
        const { data } = await axios.get(`${API_URL}/api/food/restaurant/${reqData.restaurantId}`, {
            params: {
                vegetarian: reqData.vegetarian,
                nonveg: reqData.nonveg,
                seasonal: reqData.seasonal,
                food_category: reqData.foodCategory
            },
            headers
        });
        dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, payload: error.message });
    }
};

export const deleteFoodAction = ({ foodId, jwt }) => async (dispatch) => {
    dispatch({ type: DELETE_MENU_ITEM_REQUEST });
    try {
        await axios.delete(`${API_URL}/api/admin/food/${foodId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        dispatch({ type: DELETE_MENU_ITEM_SUCCESS, payload: foodId });
    } catch (error) {
        dispatch({ type: DELETE_MENU_ITEM_FAILURE, payload: error.message });
    }
};

export const updateMenuItemsAvailability = ({ foodId, jwt }) => async (dispatch) => {
    dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST });
    try {
        const { data } = await axios.put(`${API_URL}/api/admin/food/${foodId}`, {}, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE, payload: error.message });
    }
};

export const updateMenuItemAction = ({ foodId, menu, jwt, restaurantId }) => async (dispatch) => {
    try {
        await axios.put(`${API_URL}/api/admin/food/${foodId}/update`, menu, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Cập nhật món ăn thành công");
        dispatch(getMenuItemsByRestaurantId({
            jwt,
            restaurantId,
            vegetarian: false,
            nonveg: false,
            seasonal: false,
            foodCategory: ""
        }));
    } catch (error) {
        console.log("Lỗi cập nhật món ăn:", error.message);
    }
};