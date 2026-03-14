const axios = require('axios');
const api = axios.create({ baseURL: 'http://127.0.0.1:5001/api' });

async function run() {
    try {
        console.log("1. Logging in as Admin...");
        const loginRes = await api.post('/auth/login', {
            email: 'admin_req@example.com',
            password: 'password123',
            role: 'administrator'
        });
        const token = loginRes.data.token;
        console.log("Admin token:", token);

        console.log("2. Fetching students...");
        const studentsRes = await api.get('/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const pending = studentsRes.data.find(s => s.status === 'Pending');
        
        if (!pending) {
            console.log("No pending students found! Registering one...");
            await api.post('/auth/register', { name: "Test Student", email: "pending_test@example.com", password: "password123", role: "student" });
            
            const newStudentsRes = await api.get('/users', { headers: { Authorization: `Bearer ${token}` } });
            const newPending = newStudentsRes.data.find(s => s.status === 'Pending');
            console.log("Found pending:", newPending._id);
            
            console.log("3. Approving student...");
            await api.put(`/users/${newPending._id}`, { status: 'Active' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Success!");
        } else {
            console.log("Found pending:", pending._id);
            console.log("3. Approving student...");
            await api.put(`/users/${pending._id}`, { status: 'Active' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Success!");
        }

    } catch (err) {
        console.log("ERROR RECEIVED:");
        console.log(err.response ? err.response.data : err.message);
    }
}
run();
