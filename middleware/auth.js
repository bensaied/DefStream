const jwt = require("jsonwebtoken");
const { JWTSECRET } = require("../config/config");

function credentialToken(req, res, next) {
  // Get token from header
  const credentialToken = req.header("x-auth-token");
  // console.log("credentialToken:",credentialToken);
  // check if there is no token
  if (!credentialToken) {
    return res.status(401);
    //.json({ msg: "No credentialToken, authorization denied" });
  }
  // Verify credentialToken
  try {
    const decoded = jwt.verify(credentialToken, JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "credentialToken is not valid" });
  }
}

module.exports = {
  token: credentialToken,
};
