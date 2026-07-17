const supabase = require('../config/supabaseClient');

exports.getAllUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('id, username, email, "loginCount", "deviceLocation", timestamp')
        .order('id', { ascending: true});

    if (error) throw error;
    return data;
};

exports.getUserById = async (id) => {
    const { data, error} = await supabase
        .from('users')
        .select('id, username, email, "loginCount", "deviceLocation", timestamp')
        .eq('id', id)
        .single();
    
        if(error || !data) throw new Error('User not found');
        return data;
};

exports.updateUser = async (id, updateData) => {
    //whitelit the allowed fields
    const payload = {timestamp: new Date().toLocaleString() };
    if (updateData.username) payload.username =updateData.username;
    if (updateData.email) payload.email = updateData.email;
    if (updateData.deviceLocation) payload["deviceLocation"] = updateData.deviceLocation;
    
    const { data, error} = await supabase
        .from('users')
        .update(payload)
        .eq('id', id)
        .select('id, username, email, "loginCount", "deviceLocation", timestamp')
        .single();

    if (error) throw error;
    return data;
};

exports.deleteUser = async (id) => {
    const {error} = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    return true;
}
