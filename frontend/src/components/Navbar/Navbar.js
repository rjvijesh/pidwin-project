import React, { useState, useEffect } from "react";
import { AppBar, Typography, Toolbar, Avatar, Button } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector  } from "react-redux";
import { jwtDecode } from "jwt-decode";
import * as actionType from "../../constants/actionTypes";
import { styles } from "./styles";

const Navbar = () => {
  const [user, setUser] = useState(
    localStorage.getItem("profile")
      ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token)
      : "null"
  );

  //get usertoken from localStorage
  const localUserToken = localStorage.getItem("usertoken") ? JSON.parse(localStorage.getItem("usertoken")) : "null";

  const dispatch = useDispatch();
  let location = useLocation();
  const history = useNavigate();
  const usertoken = useSelector(store => store?.login?.usertoken);
  
  const logout = () => {
    dispatch({ type: actionType.LOGOUT });
    history("/auth");
    setUser("null");
  };

  useEffect(() => {
    if (user !== "null" && user !== null) {
      if (user.exp * 1000 < new Date().getTime()) logout();
    }
    setUser(
      localStorage.getItem("profile")
        ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token)
        : "null"
    );
  }, [location]);
  
  return (
    <AppBar sx={styles.appBar} position="static" color="inherit">
      <div sx={styles.brandContainer}>
        <Typography
          component={Link}
          to="/"
          sx={styles.heading}
          variant="h5"
          align="center"
        >
          CoinToss
        </Typography>
      </div>
      <Toolbar sx={styles.toolbar}>
        {user !== "null" && user !== null ? (
          <div sx={styles.profile}>
            <Avatar sx={styles.purple} alt={user.name} src={user.picture}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography sx={styles.userName} variant="h6">
              {user.name} | Token-{(usertoken > 0) ? usertoken : localUserToken}
            </Typography>
            
            <Button
              variant="contained"
              sx={styles.logout}
              color="secondary"
              onClick={logout}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                history("/password");
              }}
            >
              Set Password
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
