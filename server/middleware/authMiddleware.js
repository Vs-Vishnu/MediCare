const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({
        message: "Auth failed: No token provided",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "Auth failed: Token formatting error",
        success: false,
      });
    }

    jwt.verify(token, process.env.JWT_KEY || "fallback_key", (err, decode) => {
      if (err) {
        return res.status(401).send({
          message: "Auth failed: Invalid or expired token",
          success: false,
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).send({
      message: "Internal Server Error in Auth Middleware",
      success: false,
    });
  }
};

module.exports = authMiddleware;
