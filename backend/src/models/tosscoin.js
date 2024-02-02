import mongoose from "mongoose";

const tossCoinSchema = mongoose.Schema({
  id: { type: String },  
  userid: { type: String, required: true },
  email: { type: String, required: true},
  wager: { type: Number, required: true },
  headortail: { type: String, required: true },
  winorloss: { type: String },
  randomString: { type: String },
  updatedUserToken: { type: Number },
  bonusPayouts: { type: Number }
});

export default mongoose.model("TossCoin", tossCoinSchema);