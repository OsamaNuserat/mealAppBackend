import userModel from "../../DB/model/User.model.js";
import { verifyToken } from "../Services/generateAndVerifyToken.js";
import { asyncHandler } from "../Services/errorHandling.js";

export const auth = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARERKEY)) {
      return next(new Error("invalid bearer key", { cause: 401 }));
    }

    const token = authorization.split(process.env.BEARERKEY)[1];
    if (!token) {
      return next(new Error("invalid token", { cause: 401 }));
    }

    const decoded = verifyToken(token, process.env.LOGINTOKEN);
    if (!decoded) {
      return next(new Error("invalid token", { cause: 401 }));
    }
    const user = await userModel
      .findById(decoded.id)
      .select("userName changepasswordtime");
    if (!user) {
      return next(new Error("Not Registered", { cause: 401 }));
    }

    if (
      parseInt(user.changepasswordtime?.getTime() / 1000) >
      parseInt(decoded.iat)
    ) {
      return next(new Error("Not Authorized", { cause: 400 }));
    }
    req.user = user;
    return next();
  });
};
