import jwt from 'jsonwebtoken';

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).send({
        success: false,
        statusCode: 403,
        body: {
          text: 'Access denied',
        }
      });
    }
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      statusCode: 401,
      body: {
        text: 'Invalid token',
      }
    });
  }
};

export default verifyAdmin;