import mongoose, { Schema } from "mongoose";

//Jwt is an bearer token
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    docs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doc",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is Required!"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//These are middlewares
//!don't use arrow function as they don't have access to '.this', but we'll need a reference of the value insdie the userSchema */
userSchema.pre("save", async function (next) {
  //pass must be in string!
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

//! mongoose allows to add custom method "Schema.method"
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      username: this.username,
      fullname: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);
export { User };
