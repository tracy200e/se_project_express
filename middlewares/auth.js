const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_ERROR } = require("../utils/errors");

module.exports = (req, res, next) => {
    // get authorization from the header
    const { authorization } = req.headers;

    // check if the header exists and starts with "Bearer "
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res
            .status(UNAUTHORIZED_ERROR)
            .send({ message: "Authorization required"});
    };

    // get the token
    const token = authorization.replace("Bearer ", "");

    // verify the token
    let payload;
    
    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res
            .status(UNAUTHORIZED_ERROR)
            .send({ message: "Authorization required"});
    }

    req.user = payload;

    return next();
};