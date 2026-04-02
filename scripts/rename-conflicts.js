const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'src', 'app', '(authenticated)', 'dashboard');
console.log('Targeting legacy dashboard:', target);

if (fs.existsSync(target)) {
    try {
        fs.rmSync(target, { recursive: true, force: true });
        console.log('Successfully deleted legacy dashboard directory.');
    } catch (err) {
        console.error('Error deleting directory:', err.message);
    }
} else {
    console.log('Legacy dashboard already removed.');
}
