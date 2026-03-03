
let currentLang = 'pt'; // 'pt' ou 'en'

function getSources(tmdbId) {
  return [
    { name: 'SuperEmbed',  url: (s, e) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}` },
    { name: 'VidSrc PRO',  url: (s, e) => `https://vidsrc.pro/embed/tv/${tmdbId}/${s}/${e}` },
    { name: 'VidSrc CC',   url: (s, e) => `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${s}/${e}` },
    { name: 'Embed SU',    url: (s, e) => `https://embed.su/embed/tv/${tmdbId}/${s}/${e}` },
    { name: 'VidSrc ICU',  url: (s, e) => `https://vidsrc.icu/embed/tv/${tmdbId}/${s}/${e}` },
    { name: '2Embed',      url: (s, e) => `https://www.2embed.skin/embedtv/${tmdbId}&s=${s}&e=${e}` },
    { name: 'NontonGo',    url: (s, e) => `https://www.NontonGo.win/embed/tv/${tmdbId}/${s}/${e}` },
    { name: 'VidSrc NL',   url: (s, e) => `https://player.vidsrc.nl/embed/tv/${tmdbId}/${s}/${e}` },
  ];
}

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`lang-${lang}`).classList.add('active');
  updateLangHint();
}

function updateLangHint() {
  const hint = document.getElementById('langHint');
  if (currentLang === 'pt') {
    hint.innerHTML = '⚙️ Dentro do player: clique em <b>CC</b>, <b>Legendas</b> ou no ícone de <b>engrenagem ⚙️</b> e selecione <b>Portuguese</b>';
  } else {
    hint.innerHTML = '⚙️ Inside the player: click <b>CC</b>, <b>Subtitles</b> or the <b>gear icon ⚙️</b> and select <b>English</b>';
  }
}

let currentSources = [];
let currentSourceIdx = 0;
let currentS = 1;
let currentE = 1;
let currentTmdbId = 0;
let failedSources = new Set();

function renderSourceBar() {
  const bar = document.getElementById('sourceBar');
  bar.innerHTML = '<span class="label">Fontes:</span>';
  currentSources.forEach((src, i) => {
    const btn = document.createElement('button');
    btn.className = 'src-btn' + (i === currentSourceIdx ? ' active' : '') + (failedSources.has(i) ? ' error' : '');
    btn.textContent = src.name;
    btn.onclick = () => switchSource(i);
    bar.appendChild(btn);
  });
}

function switchSource(idx) {
  currentSourceIdx = idx;
  const iframe = document.getElementById('player');
  iframe.src = currentSources[idx].url(currentS, currentE);
  renderSourceBar();
  document.getElementById('status').textContent = `Fonte: ${currentSources[idx].name}`;
}

function tryNextSource() {
  failedSources.add(currentSourceIdx);
  // Find next source that hasn't failed
  for (let i = 0; i < currentSources.length; i++) {
    const next = (currentSourceIdx + 1 + i) % currentSources.length;
    if (!failedSources.has(next)) {
      document.getElementById('status').textContent = `${currentSources[currentSourceIdx].name} falhou. Tentando ${currentSources[next].name}...`;
      switchSource(next);
      return;
    }
  }
  document.getElementById('status').textContent = 'Nenhuma fonte disponível. Tente novamente mais tarde.';
  renderSourceBar();
}

function loadEmbed(tmdbId, s, e) {
  currentTmdbId = tmdbId;
  currentS = s;
  currentE = e;
  currentSourceIdx = 0;
  failedSources.clear();
  currentSources = getSources(tmdbId);

  const iframe = document.getElementById('player');

  // Detect iframe load errors via timeout
  let loadTimer = null;
  iframe.onload = () => {
    clearTimeout(loadTimer);
    document.getElementById('status').textContent = `Reproduzindo via ${currentSources[currentSourceIdx].name}`;
  };
  iframe.onerror = () => {
    clearTimeout(loadTimer);
    tryNextSource();
  };

  renderSourceBar();
  switchSource(0);
}

// Exemplo de uso: TMDB ID 100, Temporada 1, Episódio 1
loadEmbed(60625, 1, 1);
