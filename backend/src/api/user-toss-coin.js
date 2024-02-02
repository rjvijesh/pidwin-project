//import bcrypt from "bcryptjs";
import User from "../models/user.js";
import TossCoin from "../models/tosscoin.js";

const userConsecutiveWins = new Map();

const tossCoin = async (req, res) => {
  const { email, wager, headortail } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User Does Not Exist" });
    }

    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

    //get currentUserToken
    let currentUserToken = existingUser.usertoken;
    let userid = existingUser._id;

    //get usertoken by deducting wager
    if(currentUserToken < wager){
      return res.json({ message: "Wagering amount is greater than amount of user token", updatedUserToken:  currentUserToken});
    }
    let userTokenAfterWagering = currentUserToken - wager;

    //Randomly get the toss value
    var strings = ['head', 'tail'];
    var randomIndex = Math.floor(Math.random() * strings.length);
    var randomString = strings[randomIndex];
    
    //get the tossCoin game result
    let tossResult=0;
    if(headortail == "head" && randomString == "head"){
      tossResult = 1;
    }else if(headortail == "tail" && randomString == "tail"){
      tossResult = 1;
    }else if(headortail == "head" && randomString == "tail"){
      tossResult = 0;
    }else if(headortail == "tail" && randomString == "head"){
      tossResult = 0;
    }else{
      tossResult = 0;
    }

    //set user win count to 0 if user not present and toss history for the user
    if(!userConsecutiveWins.has(email)){
      userConsecutiveWins.set(email, 0);
    }

    //get usertoken after toss result
    let updatedUserToken = 0; 
    let winorloss;
    let bonusPayouts=0;
    if(tossResult){
      winorloss = "win";
      
      //incrementing user consecutive wins 
      userConsecutiveWins.set(email, userConsecutiveWins.get(email)+1);
    
      //calculate bonus Payouts
      if(userConsecutiveWins.get(email) === 3){
        updatedUserToken = (3* wager) + userTokenAfterWagering;
        bonusPayouts = 3* wager;
      }else if(userConsecutiveWins.get(email) === 5){
        updatedUserToken = (10* wager) + userTokenAfterWagering;
        bonusPayouts = 10* wager;
        userConsecutiveWins.set(email, 0); // reset consectuvie wins to 0
      }else {
        bonusPayouts = 0;
        updatedUserToken = (2* wager) + userTokenAfterWagering;
      }
    }else{
      winorloss = "loss";
      updatedUserToken = userTokenAfterWagering;
      userConsecutiveWins.set(email, 0); // reset consectuvie wins to 0 when lose
    }

    //updateUserToken in User collection 
    const updateUserToken = await User.findByIdAndUpdate(
      existingUser._id,
      { usertoken: updatedUserToken },
      { new: true }
    );

    const result = await TossCoin.create({
      userid,
      email,
      wager,
      headortail,
      winorloss,
      randomString,
      updatedUserToken,
      bonusPayouts
    });
    res.status(200).json(result);
  } catch (error) {
    console.log("error==", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default tossCoin;