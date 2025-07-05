import JWT from "jsonwebtoken";

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .send({ success: false, message: "No token provided" });
    }
    // If using "Bearer <token>", split and get the token part
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decode);
    req.user = decode;
    next();
  } catch (error) {
    console.log("requireSignIn error:", error);
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }
};
