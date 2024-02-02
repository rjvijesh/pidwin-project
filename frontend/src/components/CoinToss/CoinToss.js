import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import Input from "./Input";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {tossCoin } from "../../actions/login";
import { styles } from "./styles";

const CoinToss = () => {
  const user = localStorage.getItem("profile")
    ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token)
    : "null";
  const formDataInitVal = {
    email: user.email,
    wager: 0,
    headortail: "head",
  };

  //get updated usertoken from localstorage
  const localUserToken = localStorage.getItem("usertoken")
    ? JSON.parse(localStorage.getItem("usertoken"))
    : "null";

  //get user toss history
  const localUserTossHistory = localStorage.getItem("tossHistory") ? JSON.parse(localStorage.getItem("tossHistory")) : "null";

  const [formData, setFormData] = useState(formDataInitVal);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const history = useNavigate();

  const handleSubmit = (e) => {
    if (!error) {
      e.preventDefault();
      dispatch(tossCoin(formData, history));
      e.target.reset();
    }
    
  };

  const handleChange = (e) => {
    // Check if input is a valid number greater than 0
    if(e.target.name === "wager" && !isNaN(e.target.value) && parseInt(e.target.value) > 0 && parseInt(e.target.value) <= localUserToken){
      setError('');
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }else if(e.target.name === "wager" && !isNaN(e.target.value) && (parseInt(e.target.value) === 0 || parseInt(e.target.value) < 0)){
      setError('Wager with a number greater than 0.');
    }else if(e.target.name === "wager" && isNaN(e.target.value)){
      setError('Wager with a appropriate number.');
    }else if(e.target.name === "wager" && !isNaN(e.target.value) && parseInt(e.target.value) > localUserToken){
      setError('Wager with a number less than or equal to available Token ');
    }
  };

  const TossHistory = () => {
    if(localUserTossHistory[user.email] !== undefined && localUserTossHistory[user.email].length > 0){
        return (
          <div style={{ height: 200, width: '100%', "overflowX": "auto", border: "2px solid #ddd", marginTop: "10px" }}>
            <Typography variant="h4" align="center" color="primary">
              Toss Results History
            </Typography>
            <table style={{"border-collapse": "collapse", width: "100%"}}>
                <thead>
                  <tr>
                    {Array.from({ length: localUserTossHistory[user.email].length }, (_, index) => (
                      <th key={index} style={{border: "1px solid #ddd",padding: "8px", "text-align": "left"}}>Result</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {localUserTossHistory[user.email].map((item, index) => (
                      <td key={index} style={{border: "1px solid #ddd",padding: "8px", "text-align": "left"}}>{item.tossResult}</td>
                    ))}
                  </tr>
                </tbody>
            </table>
          </div>
        )
    }else{
      return (
        <div style={{ "text-align": "center", color: "#777", "margin-top": "20px"}}>
          No toss results available
          </div>
      )
    }
  }

  if (user !== "null" && user !== null && localUserToken > 0) {
    return (
      <div>
        <Container component="main" maxWidth="xs">
          <Paper sx={styles.paper} elevation={3}>
            <form sx={styles.form} onSubmit={handleSubmit}>
              <Grid container direction={"column"} spacing={2}>
                  <>
                    <Input
                      name="wager"
                      label="Wager"
                      handleChange={handleChange}
                      autoFocus
                      half
                      error={error}
                    />
                    {error && (
                      <Typography variant="body2" color="error">
                        {error}
                      </Typography>
                    )}
                  <RadioGroup
                    row
                    aria-labelledby="demo-form-control-label-placement"
                    name="headortail"
                    defaultValue="head"
                    onChange={handleChange}
                  >
                    <FormControlLabel value="head" control={<Radio />} label="Head" />
                    <FormControlLabel value="tail" control={<Radio />} label="Tail" />
                  </RadioGroup>
                </>
              </Grid>
              <Button
                type="submit"
                sx={styles.submit}
                fullWidth
                variant="contained"
                color="primary"
                disabled={error ? true : false}
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Container>
        <TossHistory />
      </div>
    );
  }else{
    return (
      <Typography variant="h4" align="center" color="primary">
        Sorry! You currently do not possess a sufficient number of token coins to place a wager. Contact Administrator!
      </Typography>
    )
  }
};
export default CoinToss;
