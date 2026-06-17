import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token =
      req.headers.authorization.split(" ")[1];

    try {
    const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);

req.user = {
  id: decoded.id,
};

      next();
    } catch {
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("No token");
  }
};

export default protect;