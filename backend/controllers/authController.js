//Restaurant MANAGER
const authService = require('../services/authServices');

exports.register = async (req, res) =>{
    try{
        const {username, email, password, deviceLocation} = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({error: 'Missing fields (username, email, password)'});
        }
        const {user, token} = await authService.registerUser(req.body);
        console.log(`\n=== JWT TOKEN (REGISTER) ===\n ${token}`);
        res.status(201).json({message: 'Registration succesful!', token, user});
    } catch (error) {
        //if services throw an error, the controller catches it here
        const status = error.message.includes('already exists') ? 409 : 500;
        res.status(status).json({error: error.message});
    }
};

exports.login = async (req, res) => {
    try {
        const {credential, email, username, password } = req.body;
        const loginId = String(credential || email || username || '').trim();

        if (!loginId || !password) {
            return res.status(400).json({error: 'missing credentials'});
        }

        //hand the data to the service
        const{ user, token } = await authService.loginUser(loginId, password);
        console.log(`\n=== JWT TOKEN (LOGIN) ===\n ${token}`);
        res.status(200).json({ message: 'Login successful!', token, user});
    } catch(error) {
        res.status(401).json({ error: error.message});
    }
};
