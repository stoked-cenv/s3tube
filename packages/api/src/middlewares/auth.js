const jwt = require("jsonwebtoken");
const { User } = require("../sequelize");

exports.protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next({
      message: "You need to be logged in to visit this route",
      statusCode: 401,
    });
  }

  const token = req.headers.authorization.replace("Bearer", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(JSON.stringify(decoded, null, 2));
    const user = await User.findOne({
      attributes: [
        "id",
        "firstname",
        "lastname",
        "username",
        "email",
        "avatar",
        "cover",
        "channelDescription",
        "isAdmin"
      ],
      where: {
        id: decoded.id,
      },
    });

    console.log(JSON.stringify(user, null, 2));

    req.user = user;
    next();
  } catch (err) {
    next({
      message: "You need to be logged in to visit this route",
      statusCode: 401,
    });
  }
};

exports.admin = async (req, res, next) => {
  if (req.user.isAdmin) {
    delete req.user;
    next();
  } else {
    return next({
      message: "Authorization denied, only admins can visit this route",
      statusCode: 401,
    });
  }
};
