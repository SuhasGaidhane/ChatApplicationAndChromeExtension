document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('data-container');
    try {
        const response = await fetch('http://localhost:8000/get-tracking-data');
        if (!response.ok) {
            throw new Error('Failed to fetch tracking data');
        }
        const data = await response.json();
        container.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('div');
            row.innerText = `${item.url} - ${item.time_spent} seconds`;
            container.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        container.innerText = 'Failed to load data';
    }
});
