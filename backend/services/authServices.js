//The CHEF
const supabase = require('../config/supabaseClient');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async (data) => {
    //1. checking if user already exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${data.email}, username.eq.${data.username}`)
        .single()
    if (existingUser) {
        throw new Error('Username or email already exists');
    }

    //2. insert into database
    const { data: newUser, error} = await supabase
        .from('users')
        .insert([{
            username: data.username,
            email: data.email,
            password: data.password,
            timestamp: new Date().toLocaleString(),
            deviceLocation: data.deviceLocation || "Unknown"
        }])
        .select()
        .single();
    if (error) throw error;

    //3.generate jwt token
    const token = jwt.sign({id: newUser.id}, JWT_SECRET, {expiresIn: '24h'});
    return {user: newUser, token};
}

exports.loginUser = async (credential, password) => {
    //1. Find user by email or username
    const { data: user} = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${credential}, username.eq.${credential}`)
        .single();
    if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
    }
    
    //2.Increment loginCount
    const newLoginCount = (user.loginCount || 0)+1;
    await supabase.from('users').update({loginCount: newLoginCount}). eq('id', user.id);
    user.loginCount = newLoginCount;

    //3. generate token
    const token = jwt.sign({ id: user.id}, JWT_SECRET, {expiresIn: '24h'});
    return {user, token};
}
