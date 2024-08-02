// middleware/auth.js
const auth = (req, res, next) => {
  req.user = { _id: "dummyUserId" };
  next();
};

module.exports = auth;
