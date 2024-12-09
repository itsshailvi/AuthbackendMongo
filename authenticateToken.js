const jwt = require('jsonwebtoken');
const SECRET_KEY = '123'; // Replace with your actual secret key

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Get the Authorization header
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token
  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify the token
    req.user = decoded; 
    if(decoded.exp > Math.floor(Date.now() / 1000)){
        next(); // Proceed to the next middleware or route handler
    }else{
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
