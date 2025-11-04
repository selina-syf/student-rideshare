// Show/hide car details based on role selection
document.getElementById('role').addEventListener('change', function() {
    const carDetails = document.getElementById('carDetails');
    if (this.value === 'driver' || this.value === 'both') {
        carDetails.style.display = 'block';
    } else {
        carDetails.style.display = 'none';
    }
});

// Student Registration
async function registerStudent() {
    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        studentId: document.getElementById('studentId').value,
        program: document.getElementById('program').value,
        graduationYear: parseInt(document.getElementById('graduationYear').value),
        role: document.getElementById('role').value
    };

    // Add car details if driver
    if (userData.role === 'driver' || userData.role === 'both') {
        userData.carDetails = {
            make: document.getElementById('carMake').value,
            model: document.getElementById('carModel').value,
            year: parseInt(document.getElementById('carYear').value),
            color: document.getElementById('carColor').value,
            licensePlate: document.getElementById('licensePlate').value
        };
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        document.getElementById('api-response').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById('api-response').textContent = 'Error: ' + error.message;
    }
}

// Admin: Get all students
async function getAllStudents() {
    try {
        const response = await fetch('/api/admin/students');
        const data = await response.json();
        document.getElementById('admin-results').innerHTML = 
            '<h3>All Students:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
    } catch (error) {
        document.getElementById('admin-results').textContent = 'Error: ' + error.message;
    }
}

// Admin: Get statistics
async function getStats() {
    try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        document.getElementById('admin-results').innerHTML = 
            '<h3>Statistics:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
    } catch (error) {
        document.getElementById('admin-results').textContent = 'Error: ' + error.message;
    }
}