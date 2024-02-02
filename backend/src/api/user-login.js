import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import TossCoin from "../models/tosscoin.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    
    //get last 10 toss history
    const tossHistoryDetailsFromDB = await TossCoin.find({ email }).limit(10).sort({_id: -1});
    
    let resultObject = {};
    tossHistoryDetailsFromDB.forEach((item) => {
      const { email, winorloss } = item;
      if (!resultObject[email]) {
        resultObject[email] = [];
      }
      resultObject[email].push({ tossResult: winorloss });
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User Does Not Exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    
    const token = jwt.sign(
      {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        password: existingUser.password,
        usertoken: existingUser.usertoken,
      },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, tossHistory: resultObject });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default login;