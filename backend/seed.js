const init = async () => {
    try {
        console.log('Registering admin...');
        const adminRes = await fetch('http://127.0.0.1:5001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Admin User',
                email: 'admin@library.com',
                password: 'password123',
                role: 'administrator'
            })
        });

        const adminText = await adminRes.text();
        let adminData;
        try {
            adminData = JSON.parse(adminText);
        } catch (e) {
            console.error('Failed to parse admin registration response as JSON. Raw text:', adminText);
            return;
        }

        let token = adminData.token;

        if (!adminRes.ok) {
            if (adminData.message === 'User already exists') {
                console.log('Admin already exists. Logging in...');
                const loginRes = await fetch('http://127.0.0.1:5001/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'admin@library.com',
                        password: 'password123',
                        role: 'administrator'
                    })
                });
                const loginData = await loginRes.json();
                token = loginData.token;
            } else {
                throw new Error(adminData.message);
            }
        }

        console.log('Admin registered/logged in. Token:', token.substring(0, 10) + '...');

        console.log('Seeding courses...');
        const seedRes = await fetch('http://127.0.0.1:5001/api/courses/seed', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!seedRes.ok) {
            console.error('Failed to seed:', await seedRes.text());
            return;
        }
        console.log('Courses seeded successfully!');

        console.log('Registering student...');
        const studentRes = await fetch('http://127.0.0.1:5001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Student User',
                email: 'student@library.com',
                password: 'password123',
                role: 'student'
            })
        });

        if (!studentRes.ok) {
            console.log('Note: student may already exist');
        } else {
            console.log('Student registered.');
        }

        console.log('All setup complete!');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

init();
