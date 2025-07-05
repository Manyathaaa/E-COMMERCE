import JWT from "jsonwebtoken";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    console.log("Decoded JWT:", decode); // Add this line
    req.user = decode;
    next();
  } catch (error) {
    console.log("requireSignIn error:", error); // Log the actual error
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }
};
