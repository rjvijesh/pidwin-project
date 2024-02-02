import React from "react";
import { TextField, Grid } from "@mui/material";

const Input = ({
  name,
  value,
  handleChange,
  label,
  half,
  autoFocus,
  type,
  error
}) => (
  <Grid item xs={12} sm={half ? 6 : 12}>
    <TextField
      name={name}
      onChange={handleChange}
      variant="outlined"
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      value={value}
      error={Boolean(error)}
      style = {{width: 300}}
    />
  </Grid>
);

export default Input;
