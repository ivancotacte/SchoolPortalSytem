const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  studentNum: {
    type: String,
    required: true,
    unique: true,
    default: () => {
      const school = "ICCT";
      const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
      return `${school}${randomDigits}`;
    },
  },
  role: {
    type: String,
    enum: ["admin", "student"],
    default: "student",
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  suffix: {
    type: String,
  },
  contactNum: {
    type: String,
    required: true,
  },
  campus: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  schoolyear: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);