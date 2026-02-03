document.addEventListener('DOMContentLoaded', () => {

    // --- HOME BUTTON (Unchanged) ---
    if (!window.location.pathname.endsWith('index.html')) {
        const btn = document.createElement('a');
        btn.href = 'index.html';
        btn.innerHTML = '<i class="fa-solid fa-house"></i>';
        Object.assign(btn.style, { position: 'fixed', bottom: '20px', right: '20px', width: '50px', height: '50px', background: '#25f4ee', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', textDecoration: 'none', zIndex: '999' });
        document.body.appendChild(btn);
    }

    // --- QUIZ ENGINE ---
    function initQuiz(id, data) {
        const el = document.getElementById(id);
        if (!el) return;
        let idx = 0, score = 0;

        const render = () => {
            // --- RESULT SCREEN (Unchanged) ---
            if (idx >= data.length) {
                el.innerHTML = `
                    <div style="text-align:center; padding:30px; background:#fff !important; border-radius:12px; border:1px solid #ddd; color:#333 !important;">
                        <h3 style="color:#333 !important; margin:0 0 20px 0;">Result: ${score}/${data.length * 10}</h3>
                        <button onclick="location.reload()" style="padding:12px 30px; background:#2d3436 !important; color:#fff !important; border:none; border-radius:30px; cursor:pointer; font-weight:bold; font-size:1rem;">Retry Quiz</button>
                    </div>`;
                return;
            }

            const q = data[idx];

            // --- QUESTION SCREEN ---
            const optionsHtml = Object.entries(q.options).map(([k, v]) => `
                <button class="opt-btn" data-k="${k}" style="
                    display:block; width:100%; padding:15px 20px; margin-bottom:10px;
                    background: #ffffff !important; 
                    color: #333333 !important; 
                    border: 2px solid #e0e0e0 !important; 
                    border-radius: 8px; 
                    text-align: left; 
                    cursor: pointer; 
                    font-weight: bold;
                    font-size: 1rem;
                    transition: all 0.2s;
                ">
                    <span style="color:#00bcd4; margin-right:10px;">${k}.</span> ${v}
                </button>
            `).join('');

            el.innerHTML = `
                <div style="background:#fff; padding:20px; border-radius:10px;">
                    <p style="font-weight:bold; margin-bottom:20px; font-size:1.2rem; color:#333 !important;">
                        Q${idx + 1}. ${q.q}
                    </p>
                    <div style="display:grid; gap:0;">
                        ${optionsHtml}
                    </div>
                    <div id="fb-${idx}" style="
                        display:none; 
                        margin-top:20px; 
                        padding:25px; 
                        background: #2d3436 !important; 
                        color: #ffffff !important;
                        border-radius: 12px;
                        line-height: 1.6;
                        border: 2px solid #2d3436;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    "></div>
                </div>
            `;

            // Event Listeners
            el.querySelectorAll('.opt-btn').forEach(b => {
                b.onmouseover = () => { if (!b.disabled) { b.style.borderColor = '#00bcd4'; b.style.background = '#f0fbff'; } };
                b.onmouseout = () => { if (!b.disabled) { b.style.borderColor = '#e0e0e0'; b.style.background = '#ffffff'; } };
                b.onclick = (e) => { const target = e.target.closest('.opt-btn'); check(target.dataset.k); };
            });
        };

        const check = (ans) => {
            const q = data[idx];
            const fb = document.getElementById(`fb-${idx}`);
            const isCorrect = ans === q.correct;
            if (isCorrect) score += 10;

            // --- FIX: BADGE STYLE FOR VISIBILITY ---
            const statusBadge = isCorrect
                ? `<span style="display:inline-block; background:#00bcd4 !important; color:#fff !important; padding:5px 15px; border-radius:20px; font-size:0.9rem; font-weight:bold; letter-spacing:1px;">CORRECT! 🎯</span>`
                : `<span style="display:inline-block; background:#ff7675 !important; color:#fff !important; padding:5px 15px; border-radius:20px; font-size:0.9rem; font-weight:bold; letter-spacing:1px;">INCORRECT... 😢</span>`;

            fb.innerHTML = `
                <div style="margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:15px;">
                    ${statusBadge}
                </div>
                <p style="color: #ffffff !important; margin:0; font-weight:normal; font-size:1.05rem;">
                    ${q.rationale}
                </p>
                <button onclick="next()" style="
                    margin-top:20px; 
                    padding:12px 35px; 
                    background: #ffffff !important; 
                    color: #2d3436 !important; 
                    border: none; 
                    border-radius: 30px; 
                    cursor: pointer; 
                    font-weight: bold;
                    transition: 0.2s;
                ">Next Question <i class="fa-solid fa-arrow-right"></i></button>
            `;
            fb.style.display = 'block';

            // Lock Buttons
            el.querySelectorAll('.opt-btn').forEach(b => {
                b.disabled = true;
                b.style.cursor = 'default';
                if (b.dataset.k === q.correct) {
                    b.style.background = '#00bcd4 !important'; b.style.color = '#fff !important'; b.style.borderColor = '#00bcd4 !important'; b.querySelector('span').style.color = '#fff';
                } else if (b.dataset.k === ans) {
                    b.style.background = '#ff7675 !important'; b.style.color = '#fff !important'; b.style.borderColor = '#ff7675 !important'; b.querySelector('span').style.color = '#fff';
                } else {
                    b.style.opacity = '0.4';
                }
            });
        };
        window.next = () => { idx++; render(); };
        render();
    }

    // --- QUIZ DATA (Vol.1: Gemini & TikTok Start) ---
    initQuiz('quiz-vol01-1', [
        { q: "Geminiを使用するために必須のアカウントは？", options: { A: "TikTok", B: "Microsoft", C: "Google", D: "OpenAI" }, correct: "C", rationale: "GeminiはGoogleが提供するサービスであるため、Googleアカウントが必要です。" },
        { q: "TikTokの「ユーザー名（@マーク以降）」を変更する際の制限として正しいものはどれですか？", options: { A: "何度でも自由に変更できる", B: "30日に1回のみ変更可能", C: "一度設定したら二度と変更できない", D: "有料プランでのみ変更可能" }, correct: "B", rationale: "ユーザー名はURLの一部にもなるため、頻繁な変更は制限されています（30日に1回）。" },
        { q: "今回の研修コース目標として設定されている「動画投稿数」は？", options: { A: "毎日投稿（30本）", B: "期間中に1本", C: "期間中に10本", D: "期間中に3本以上" }, correct: "D", rationale: "まずは質より量、そして慣れが必要です。「3本以上」が目標です。" },
        { q: "Geminiが得意とする「マルチモーダル」とはどういう意味ですか？", options: { A: "複数の言語を翻訳できること", B: "テキストだけでなく、画像や音声など複数の種類の情報を扱えること", C: "複数のユーザーで同時に作業できること", D: "複数のアプリを同時に起動できること" }, correct: "B", rationale: "テキスト、コード、画像、音声、動画など、異なる形式のデータを理解・生成できる能力を指します。" },
        { q: "TikTokのリサーチ（探索）を行う主な目的として、初期段階で最も重要なのは？", options: { A: "競合の動画に低評価を押すため", B: "流行っている曲や動画のスタイルを知り、自分の企画の参考にするため", C: "コメント欄で自分のチャンネルを宣伝するため", D: "単に時間を潰すため" }, correct: "B", rationale: "「今何がウケているか」というトレンド感覚を養うことが、伸びる動画を作る第一歩です。" }
    ]);
});
