export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>每日 AI 创作分享</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            color: #fff;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            text-align: center;
            padding: 40px 20px;
        }
        
        h1 {
            font-size: 2.5rem;
            font-weight: 300;
            background: linear-gradient(90deg, #00d9ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        
        .date {
            color: #888;
            font-size: 0.9rem;
        }
        
        .section {
            margin: 40px 0;
        }
        
        .section-title {
            font-size: 1.2rem;
            color: #00d9ff;
            margin-bottom: 20px;
            padding-left: 15px;
            border-left: 3px solid #00d9ff;
        }
        
        /* 图片画廊 */
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .gallery-item {
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            background: rgba(255,255,255,0.05);
        }
        
        .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,217,255,0.2);
        }
        
        .gallery-item img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            display: block;
        }
        
        .gallery-item .info {
            padding: 15px;
        }
        
        .gallery-item .filename {
            font-size: 0.85rem;
            color: #aaa;
        }
        
        /* 音乐播放器 */
        .music-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .music-item {
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 20px;
            transition: background 0.3s ease;
        }
        
        .music-item:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .music-item.playing {
            background: linear-gradient(135deg, rgba(0,217,255,0.2), rgba(0,255,136,0.1));
            border: 1px solid rgba(0,217,255,0.3);
        }
        
        .play-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00d9ff, #00ff88);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease;
            flex-shrink: 0;
        }
        
        .play-btn:hover {
            transform: scale(1.1);
        }
        
        .play-btn svg {
            width: 20px;
            height: 20px;
            fill: #1a1a2e;
        }
        
        .music-info {
            flex: 1;
        }
        
        .music-title {
            font-size: 1rem;
            margin-bottom: 5px;
        }
        
        .music-date {
            font-size: 0.8rem;
            color: #888;
        }
        
        .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            margin-top: 10px;
            overflow: hidden;
        }
        
        .progress {
            height: 100%;
            background: linear-gradient(90deg, #00d9ff, #00ff88);
            width: 0%;
            transition: width 0.1s linear;
        }
        
        .time {
            font-size: 0.75rem;
            color: #888;
            margin-top: 5px;
        }
        
        /* 音频元素 */
        audio {
            display: none;
        }
        
        /* 灯箱 */
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            cursor: pointer;
        }
        
        .lightbox.active {
            display: flex;
        }
        
        .lightbox img {
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 2rem;
            color: #fff;
            cursor: pointer;
        }
        
        /* 全局播放器（浮动在底部） */
        .global-player {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(26,26,46,0.95);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255,255,255,0.1);
            padding: 15px 20px;
            display: none;
            align-items: center;
            gap: 15px;
            z-index: 100;
        }
        
        .global-player.active {
            display: flex;
        }
        
        .global-player .now-playing {
            flex: 1;
            min-width: 0;
        }
        
        .global-player .now-playing-title {
            font-size: 0.9rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .global-player .now-playing-status {
            font-size: 0.75rem;
            color: #00d9ff;
        }
        
        .global-player .play-btn {
            width: 40px;
            height: 40px;
        }
        
        /* 响应式 */
        @media (max-width: 768px) {
            h1 {
                font-size: 1.8rem;
            }
            
            .gallery {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            }
            
            .music-item {
                padding: 15px;
            }
        }
        
        /* 空状态 */
        .empty {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }

        /* AI 新闻版块 */
        .news-list { display: flex; flex-direction: column; gap: 12px; }
        .news-item {
            background: rgba(255,255,255,0.05);
            border-radius: 12px; padding: 16px 20px;
            transition: background 0.3s ease, border-color 0.3s ease;
            border-left: 3px solid transparent;
        }
        .news-item:hover { background: rgba(255,255,255,0.09); border-left-color: #00ff88; }
        .news-item-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
        .news-category { font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; font-weight: 600; white-space: nowrap; }
        .cat-models   { background: rgba(0,217,255,0.15);  color: #00d9ff; }
        .cat-products { background: rgba(0,255,136,0.15);  color: #00ff88; }
        .cat-industry { background: rgba(255,200,0,0.15);  color: #ffc800; }
        .cat-paper    { background: rgba(180,100,255,0.15); color: #c864ff; }
        .cat-tip      { background: rgba(255,120,180,0.15); color: #ff78b4; }
        .news-source  { font-size: 0.75rem; color: #666; }
        .news-title   { font-size: 0.95rem; color: #e0e0e0; margin-bottom: 6px; line-height: 1.5; }
        .news-title a { color: inherit; text-decoration: none; }
        .news-title a:hover { color: #00d9ff; }
        .news-summary { font-size: 0.8rem; color: #888; line-height: 1.6; margin-bottom: 6px; }
        .news-meta    { font-size: 0.72rem; color: #555; }
        .news-loading { text-align: center; padding: 40px; color: #666; }
        .news-error   { text-align: center; padding: 30px; color: #ff6b6b; background: rgba(255,107,107,0.1); border-radius: 12px; }

    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎵 每日 AI 创作分享</h1>
            <p class="date" id="currentDate"></p>
        </header>
        
        <section class="section">
            <h2 class="section-title">🖼️ 今日美图</h2>
            <div class="gallery" id="gallery"></div>
        </section>
        
        <section class="section">
            <h2 class="section-title">🎶 今日音乐</h2>
            <div class="music-list" id="musicList"></div>
        </section>
    </div>
    
    <!-- 灯箱 -->
    <div class="lightbox" id="lightbox">
        <span class="lightbox-close">&times;</span>
        <img src="" alt="" id="lightboxImg">
    </div>
    
    <!-- 全局播放器 -->
    <div class="global-player" id="globalPlayer">
        <button class="play-btn" id="globalPlayBtn">
            <svg class="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <svg class="pause-icon" viewBox="0 0 24 24" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
        <div class="now-playing">
            <div class="now-playing-title" id="nowPlayingTitle">未选择</div>
            <div class="now-playing-status" id="nowPlayingStatus">点击播放</div>
        </div>
    </div>
    
    <script>
        // 音乐数据
        const musicFiles = [
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/music_2026-05-06-06-50-53.mp3', title: 'music 2026 05 06 06 50 53' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/song_145100_1.mp3', title: 'song 145100 1' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/song_2026-05-05_004.mp3', title: 'song 2026 05 05 004' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/song_2026-05-05_003.mp3', title: 'song 2026 05 05 003' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/song_2026-05-05_002.mp3', title: 'song 2026 05 05 002' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/song_2026-05-05_001.mp3', title: 'song 2026 05 05 001' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/song_2026-04-27_002.mp3', title: 'song 2026 04 27 002' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/song_2026-04-27_001.mp3', title: 'song 2026 04 27 001' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/song_152425_2.mp3', title: 'song 152425 2' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/song_152242_1.mp3', title: 'song 152242 1' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/song_145310_2.mp3', title: 'song 145310 2' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/song_144901_1.mp3', title: 'song 144901 1' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/music_2026-04-27-06-34-30.mp3', title: 'music 2026 04 27 06 34 30' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/music/music_2026-04-27-06-14-33.mp3', title: 'music 2026 04 27 06 14 33' }
    ];
        
        // 图片数据
        const imageFiles = [
                { file: 'https://raw.githubusercontent.com/Asali2021/daily-art-share/main/image/daily-art_2026-05-10.jpg', title: '\u5a5a\u60f3\98ce\u666f \u00b7 2026-05-10' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/image/img_2026-04-28_002.jpg', title: 'img 2026 04 28 002' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/image/img_2026-04-28_001.jpg', title: 'img 2026 04 28 001' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/image/image_001.jpg', title: 'image 001' },
        { file: 'https://pub-69f8b184e6e1482490f015aaa5ee5dd4.r2.dev/image/微信图片_20260428090130_16708_7.jpg', title: '微信图片 20260428090130 16708 7' }
    ];
        
        // 显示日期
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        document.getElementById('currentDate').textContent = today.toLocaleDateString('zh-CN', options);
        
        // 渲染图片画廊
        const gallery = document.getElementById('gallery');
        imageFiles.forEach(img => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = \`
                <img src="\${img.file}" alt="\${img.title}" loading="lazy">
                <div class="info">
                    <div class="filename">\${img.title}</div>
                </div>
            \`;
            item.addEventListener('click', () => openLightbox(img.file));
            gallery.appendChild(item);
        });
        
        // 灯箱
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        
        function openLightbox(src) {
            lightboxImg.src = src;
            lightbox.classList.add('active');
        }
        
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
        
        // 全局播放器
        const globalPlayer = document.getElementById('globalPlayer');
        const globalPlayBtn = document.getElementById('globalPlayBtn');
        const nowPlayingTitle = document.getElementById('nowPlayingTitle');
        const nowPlayingStatus = document.getElementById('nowPlayingStatus');
        
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        
        let currentAudio = null;
        let currentMusicItem = null;
        
        function playMusic(musicItem, audioSrc) {
            // 停止当前播放
            if (currentAudio) {
                currentAudio.pause();
                if (currentMusicItem) {
                    currentMusicItem.classList.remove('playing');
                }
            }
            
            // 如果点击的是同一首歌，切换播放/暂停
            if (currentAudio && currentAudio.src.includes(audioSrc)) {
                if (currentAudio.paused) {
                    currentAudio.play();
                    updatePlayState(true);
                } else {
                    currentAudio.pause();
                    updatePlayState(false);
                }
                return;
            }
            
            // 创建新的音频对象
            currentAudio = new Audio(audioSrc);
            currentMusicItem = musicItem;
            
            currentAudio.addEventListener('timeupdate', updateProgress);
            currentAudio.addEventListener('ended', () => {
                updatePlayState(false);
                nowPlayingStatus.textContent = '播放完成';
            });
            
            currentAudio.play();
            updatePlayState(true);
            globalPlayer.classList.add('active');
            musicItem.classList.add('playing');
        }
        
        function updatePlayState(isPlaying) {
            if (isPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                nowPlayingStatus.textContent = '正在播放';
            } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                nowPlayingStatus.textContent = '已暂停';
            }
        }
        
        function updateProgress() {
            if (!currentAudio) return;
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            const progressEl = currentMusicItem.querySelector('.progress');
            const timeEl = currentMusicItem.querySelector('.time');
            if (progressEl) progressEl.style.width = progress + '%';
            if (timeEl) {
                timeEl.textContent = formatTime(currentAudio.currentTime) + ' / ' + formatTime(currentAudio.duration);
            }
        }
        
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }
        
        globalPlayBtn.addEventListener('click', () => {
            if (!currentAudio) return;
            if (currentAudio.paused) {
                currentAudio.play();
                updatePlayState(true);
            } else {
                currentAudio.pause();
                updatePlayState(false);
            }
        });
        
        // 渲染音乐列表
        const musicList = document.getElementById('musicList');
        musicFiles.forEach(music => {
            const item = document.createElement('div');
            item.className = 'music-item';
            item.innerHTML = \`
                <button class="play-btn">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </button>
                <div class="music-info">
                    <div class="music-title">\${music.title}</div>
                    <div class="time">点击播放</div>
                    <div class="progress-bar"><div class="progress"></div></div>
                </div>
            \`;
            
            const playBtn = item.querySelector('.play-btn');
            playBtn.addEventListener('click', () => {
                const titleEl = item.querySelector('.music-title');
                nowPlayingTitle.textContent = titleEl.textContent;
                playMusic(item, music.file);
            });
            
            musicList.appendChild(item);

        // ── AI 新闻（aihot.virxact.com）──────────
        var CAT_LABELS = {
            'ai-models':   { label: '\u6a21\u578b\u53d1\u5e03', cls: 'cat-models'   },
            'ai-products': { label: '\u4ea7\u54c1\u53d1\u5e03', cls: 'cat-products' },
            'industry':    { label: '\u884c\u4e1a\u52a8\u6001', cls: 'cat-industry' },
            'paper':      { label: '\u8bba\u6587\u7814\u7a76', cls: 'cat-paper'    },
            'tip':        { label: '\u6280\u5de7\u89c2\u70b9', cls: 'cat-tip'      },
        };
        function relTime(iso) {
            if (!iso) return '';
            var diff = Date.now() - new Date(iso).getTime();
            var h = Math.floor(diff/3600000);
            if (h < 1)  return '\u521a\u521a';
            if (h < 24) return h+'\u5c0f\u65f6\u524d';
            var d = Math.floor(h/24);
            return d+'\u5929\u524d';
        }
        function renderNews(items) {
            var el = document.getElementById('newsList');
            if (!items || !items.length) {
                el.innerHTML = '<div class="news-error">\u4eca\u65e5\u6682\u65e0\u8d44\u8baf</div>'; return;
            }
            var html = '';
            for (var i = 0; i < Math.min(items.length, 8); i++) {
                var item = items[i];
                var cat = CAT_LABELS[item.category] || {label:'', cls:'cat-tip'};
                var sum = item.summary ? '<div class="news-summary">'+item.summary.slice(0,100)+(item.summary.length>100?'\u2026':'')+'</div>' : '';
                var src = item.source ? '<span class="news-source">'+item.source+'</span>' : '';
                var meta = relTime(item.publishedAt);
                var itemUrl = item.url || '#';
                var itemTitle = item.title || '';
                html += '<div class="news-item">' +
                    '<div class="news-item-header">' +
                        '<span class="news-category '+cat.cls+'">'+cat.label+'</span>' +
                        src + (meta ? '<span class="news-source">'+meta+'</span>' : '') +
                    '</div>' +
                    '<div class="news-title"><a href="'+itemUrl+'" target="_blank" rel="noopener">'+itemTitle+'</a></div>' +
                    sum +
                '</div>';
            }
            el.innerHTML = html;
        }
        (function loadNews() {
            var el = document.getElementById('newsList');
            var UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
            var sinceMs = Date.now() - 86400000;
            var since = new Date(sinceMs).toISOString().replace(/\.000Z$/, '.000Z');
            fetch('https://aihot.virxact.com/api/public/items?mode=selected&since='+since+'&take=8', {headers:{'User-Agent':UA}})
                .then(function(r){ return r.ok ? r.json() : Promise.reject(r.status); })
                .then(function(d){ renderNews(d.items||[]); })
                .catch(function(){ el.innerHTML='<div class="news-error">\u8d44\u8baf\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u5237\u65b0\u91cd\u8bd5</div>'; });
        })();

        });
    </script>
</body>
</html>
`, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    return new Response('Not Found', { status: 404 });
  }
};