import { LOGIN, LOGOUT, UPDATETOKEN } from "../constants/actionTypes";
import * as api from "../api";
import * as messages from "../messages";

export const signup = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: LOGIN, data });
    history("/");
    messages.success("Login Successful");
  } catch (error) {
    console.log("error", error);
    messages.error(error.response.data.message);
  }
};

export const login = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.login(formData);
    dispatch({ type: LOGIN, data });
    history("/");
    messages.success("Login Successful");
  } catch (error) {
    console.log("error", error);
    messages.error(error.response.data.message);
  }
};

export const changePassword = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.changePassword(formData);
    dispatch({ type: LOGOUT, data });
    messages.success("Password Change Was Successful");
    history("/");
  } catch (error) {
    messages.error(error.response.data.message);
  }
};

export const tossCoin = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.tossCoin(formData);
    dispatch({ type: UPDATETOKEN, data });
    console.log("data=", data);
    if(data.winorloss === "win"){
      
      messages.success("Congratulations! 🎉 You won the coin toss!");
      if(data.bonusPayouts > 0){
        messages.success(`Hurray! 🎉 You've earned an additional ${data.bonusPayouts} tokens as bonus points`);
      }
    }else if(data.winorloss === "loss"){
      messages.error(`Oops! Feel free to try your luck again.`);
    }else{
      messages.error(`${data.message}`);
    }
    history("/");
  } catch (error) {
    console.log("error", error);
    messages.error(error.response.data.message);
  }
};