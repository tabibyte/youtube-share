document.getElementById('video-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const videoUrl = document.getElementById('video-url').value;
    const response = await fetch('/fetch-video-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl }),
    });
    if (response.ok) {
        const videoData = await response.json();
        displayVideoData(videoData);
    } else {
        console.error('Failed to fetch video data');
    }
});

function displayVideoData(data) {
    document.getElementById('thumbnail').src = data.thumbnail;
    document.getElementById('title').textContent = data.title;
    document.getElementById('accountName').textContent = `By: ${data.accountName}`;
    document.getElementById('views').textContent = `Views: ${data.views}`;
    document.getElementById('date').textContent = `Date: ${new Date(data.date).toLocaleDateString()}`;

    // Remove the hidden class to display the card and export button
    document.getElementById('video-card').classList.remove('hidden');
    document.getElementById('export-btn').classList.remove('hidden');
}

document.getElementById('export-btn').addEventListener('click', () => {
    const node = document.getElementById('video-card');
    domtoimage.toPng(node)
        .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'video-card.png';
            link.href = dataUrl;
            link.click();
        })
        .catch((error) => {
            console.error('Failed to export image', error);
        });
});