import { customAlphabet } from "nanoid";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import {
  generateToken,
  verifyToken,
} from "../../../Services/generateAndVerifyToken.js";
import { compare, hash } from "../../../Services/hashAndCompare.js";
import { sendEmail } from "../../../Services/sendEmail.js";


export const signup = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
   
    return next(new Error("email already exists"), { cause: 409 });
  }
  const token = generateToken({ email }, process.env.TOKEN_SIGNATURE, 60 * 5); // 5 minutes
  const refreshToken = generateToken(
    { email },
    process.env.TOKEN_SIGNATURE,
    60 * 60 * 24 * 7
  ); // 7 days

  const Rlink = `${req.protocol}://${req.headers.host}/auth/NewconfirmEmail/${refreshToken}`;
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;

  const html = `<a href="${link}">confirm email</a> <br><br><br> <a href="${Rlink}">send a new email</a>`;
  await sendEmail(email, "confirm email", html);

  const hashedPassword = hash(password);
  const createUser = await userModel.create({
    userName,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({ message: "success", user:createUser._id });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const decoded = verifyToken(token, process.env.TOKEN_SIGNATURE);

  if (!decoded?.email) {
    return next(new Error("invalid token"), { cause: 400 });
  }
  const user = await userModel.updateOne(
    { email: decoded.email },
    { confirmEmail: true }
  );

  if (user.modifiedCount) {
    return res.json({ message: "success" });
  } else {
    return next(
      new Error("not registered account or email is already verified "),
      { cause: 400 }
    );
  }
});

export const NewconfirmEmail = asyncHandler(async (req, res) => {
  let { token } = req.params;
  const { email } = verifyToken(token, process.env.TOKEN_SIGNATURE);

  if (!email) {
    return res.status(401).json({ message: "invalid token" });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "not found" });
  }
  if (user.confirmEmail) {
    return res.status(401).json({ message: "already confirmed" });
  }
  token = generateToken({ email }, process.env.TOKEN_SIGNATURE, 60 * 5); // 5 minutes

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const html = `<a href="${link}">confirm email</a>`;
  await sendEmail(email, "confirm email", html);
  return res.status(200).send(` <p>email sent to ${email} </p>`);
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("invalid login data"));
  } else {
    if (!user.confirmEmail) {
      return next(new Error("plz verify your email"));
    }
    const match = compare(password, user.password);
    if (!match) {
      return next(new Error("invalid login data"));
    } else {
      const token = generateToken(
        { id: user._id, role: user.role },
        process.env.LOGINTOKEN,
        "1h"
      );
      const refreshtoken = generateToken(
        { id: user._id, role: user.role },
        process.env.LOGINTOKEN,
        24 * 24 * 24 * 365
      );
      return res.status(200).json({ message: "success", token, refreshtoken , user });
    }
  }
});

export const sendcode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  let code = customAlphabet("1234567890", 5);
  code = code();

  const user = await userModel.findOneAndUpdate(
    { email },
    { resetPasswordToken: code }
  );
  const html = `<p>your reset password code is ${code}</p>`;
  await sendEmail(email, "reset password", html);
  return res.status(200).json({ message: "success" });
});

export const forgetpassword = asyncHandler(async (req, res, next) => {
  const {  code, password } = req.body;
  const {email} = req.params;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("not registered"), { cause: 400 });
  }
  if (user.resetPasswordToken != code) {
    return next(new Error("invalid code"), { cause: 400 });
  }
  user.password = hash(password);
  user.resetPasswordToken = null;
  user.changepasswordtime = Date.now();
  await user.save();
  return res.status(200).json({ message: "success" });
});
