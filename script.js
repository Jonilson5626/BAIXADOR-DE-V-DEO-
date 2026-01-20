const videoUrl = document.getElementById('videoUrl');
const analyzeBtn = document.getElementById('analyzeBtn');
const loader = document.getElementById('loader');
const errorEl = document.getElementById('error');
const videoCard = document.getElementById('videoCard');
const statusSection = document.getElementById('statusSection');

analyzeBtn.addEventListener('click', analyzeVideo);
videoUrl.addEventListener('keypress', (e) => { if (e.key === 'Enter') analyzeVideo(); });

async function analyzeVideo() {
    const url = videoUrl.value.trim();
    if (!url) return showError('Insira um link válido');
    
    hideAll();
    showLoader();
    
    try {
        const response = await fetch('/api/video/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        const data = await response.json();
        
        if (!data.success) throw new Error(data.error || 'Erro no processamento');
        
        showVideoInfo(data.video);
        if (data.jobId) pollStatus(data.jobId);
    } catch (err) {
        showError(err.message);
    }
}

function showVideoInfo(video) {
    document.getElementById('thumbnail').src = video.thumbnail;
    document.getElementById('title').textContent = video.title;
    document.getElementById('platform').textContent = `Plataforma: ${video.platform}`;
    videoCard.classList.remove('hidden');
    
    document.querySelector('.download-btn.low').onclick = () => downloadQuality(video.downloads.low);
    document.querySelector('.download-btn.medium').onclick = () => downloadQuality(video.downloads.medium);
    document.querySelector('.download-btn.high').onclick = () => downloadQuality(video.downloads.high);
}

async function downloadQuality(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    a.click();
}

async function pollStatus(jobId) {
    const interval = setInterval(async () => {
        try {
            const res = await fetch(`/api/video/status/${jobId}`);
            const data = await res.json();
            updateStatus(data);
            if (data.completed) clearInterval(interval);
        } catch {}
    }, 2000);
}

function updateStatus(status) {
    statusSection.innerHTML = `<div class="status-item">Status: ${status.status}</div>`;
    statusSection.classList.remove('hidden');
}

function showLoader() { loader.classList.remove('hidden'); }
function hideAll() { loader.classList.add('hidden'); videoCard.classList.add('hidden'); errorEl.classList.add('hidden'); statusSection.classList.add('hidden'); }
function showError(msg) { errorEl.textContent = msg; errorEl.classList.remove('hidden'); }
