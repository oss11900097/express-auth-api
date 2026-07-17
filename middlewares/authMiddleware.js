//BOUNCER file
const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    //1. check if header exists
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Unauthorised: No token provided'});
    }
    //2. Extract token (remove "Bearer ' part)
    const token = authHeader.split(' ')[1];

    try {
        //3. Verify the token against our secret vault
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        //4.the express magic trick: we attach the decoded payload(which holds the user.id) directly to the request object!
        req.user = decoded;

        //5. open the door and let them pass to the controller
        next();
    } catch(error) {
        return res.status(401).json({ error: 'Unauthorised: Invalid or expired token'});
    }
};

module.exports = requireAuth;