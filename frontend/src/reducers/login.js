import { LOGIN, LOGOUT, UPDATETOKEN } from '../constants/actionTypes';
import { jwtDecode } from "jwt-decode";

const loginReducer = (state = { authData: null, usertoken: null, tossHistory : {} }, action) => {

   switch (action.type) {
        case LOGIN:
            //get user details while login
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            const user = localStorage.getItem("profile") ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token) : "null";

            //setting usertoken while login
            localStorage.setItem('usertoken', JSON.stringify(user.usertoken ));

            //get user tosshistory while login
            localStorage.setItem('tossHistory', JSON.stringify({ ...action?.data.tossHistory }));

            return { ...state, authData: action?.data, usertoken: user.usertoken, tossHistory: {[user.email] : action?.data.tossHistory}} ;

        case LOGOUT:
            localStorage.clear();
            return { ...state, authData: null, usertoken: null,  tossHistory: null};

        case UPDATETOKEN:

            //get logged in user email details
            const userDetails = localStorage.getItem("profile") ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token) : "null";
            
            //get localstorage toss history
            let tossHistoryLocalStorage = localStorage.getItem("tossHistory") ? JSON.parse(localStorage.getItem("tossHistory")) : "null"
            // Update toss history for every last toss
            const userTossResult = { tossResult: action?.data?.winorloss};
            if(!tossHistoryLocalStorage[userDetails.email]){
                tossHistoryLocalStorage = {[userDetails.email] : []}
            }
            tossHistoryLocalStorage[userDetails.email].push(userTossResult);
            if (tossHistoryLocalStorage[userDetails.email].length > 10) {
                tossHistoryLocalStorage[userDetails.email].shift(); // Keep only the last 10 tosses
            }

            localStorage.setItem('tossHistory', JSON.stringify(tossHistoryLocalStorage));

            localStorage.setItem('usertoken', JSON.stringify(action?.data?.updatedUserToken ));
            console.log("action", action);
            
            return { ...state, usertoken: action?.data?.updatedUserToken, tossHistory: tossHistoryLocalStorage};

        default:
            return state;
    }
}
export default loginReducer;