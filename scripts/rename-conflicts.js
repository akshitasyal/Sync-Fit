const fs = require('fs');
const path = require('path');

// Legacy routes identified for removal
const targets = [
    path.join(__dirname, '..', 'src', 'app', '(authenticated)', 'dashboard'),
    path.join(__dirname, '..', 'src', 'app', '(authenticated)', 'today')
];

console.log('--- Consolidation Cleanup ---');

targets.forEach(target => {
    if (fs.existsSync(target)) {
        console.log(`Targeting legacy route: ${target}`);
        try {
            // Using recursive rmSync (native Node.js, Windows-safe)
            fs.rmSync(target, { recursive: true, force: true });
            console.log(`Successfully deleted: ${path.basename(target)}`);
        } catch (err) {
            console.error(`Error deleting ${path.basename(target)}:`, err.message);
            console.log('TIP: Stop the dev server (npm run dev) to release file locks.');
        }
    } else {
        console.log(`Legacy route already removed: ${path.basename(target)}`);
    }
});
