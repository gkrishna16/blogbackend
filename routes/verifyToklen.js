const jwt = require(`jsonwebtoken`);

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(` `)[1];

  jwt.verify(token, `jwtsecret`, function (err, res) {
    if (err) {
      res.status(501).json(`Token is not valid.`);
    }
    res.data = res;
    next();
  });
}
