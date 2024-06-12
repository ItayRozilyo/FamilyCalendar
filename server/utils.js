const jwt = require("jsonwebtoken");

function getTokenFromReq(req) {
  const token = req.cookies.token;

  if (!token) {
    return null;
  }
  try {
    decodedToken = jwt.verify(token, "1234");
    return decodedToken;
  } catch (err) {
    console.error("invalid token", err);
    return null;
  }
}

module.exports = getTokenFromReq;
