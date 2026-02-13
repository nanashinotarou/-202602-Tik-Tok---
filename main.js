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

    // --- QUIZ DATA (Vol.1 Day 2: Algorithm & Canva) ---
    initQuiz('quiz-vol01-2', [
        { q: "TikTokのアルゴリズムは何方式で評価される？", options: { A: "減点方式", B: "加算方式", C: "ランダム", D: "年功序列" }, correct: "B", rationale: "TikTokは「減点」ではなく、ユーザーの好意的なアクションを「加算」していく方式です。誰にでもチャンスがあります。" },
        { q: "動画が最初にテスト配信される規模は？", options: { A: "全ユーザー", B: "1万人", C: "200〜300人", D: "フォロワーのみ" }, correct: "C", rationale: "まずは200〜300人の少人数に配信され、そこでの反応が良ければ次のステージへ拡散されます（スモールスタート）。" },
        { q: "CanvaでTikTok用動画を作る際、選ぶべきキャンバスサイズは？", options: { A: "Instagramリール動画 (9:16)", B: "YouTube動画 (16:9)", C: "正方形 (1:1)", D: "A4用紙" }, correct: "A", rationale: "TikTokやInstagramリールは「9:16（縦長）」が標準です。スマホの画面全体を使うことで没入感を高めます。" },
        { q: "動画内のテロップ（文字）で重要な「タイミング調整」とは？", options: { A: "常に表示し続けること", B: "話している内容に合わせて表示/非表示を切り替えること", C: "点滅させること", D: "半透明にすること" }, correct: "B", rationale: "「耳で聞いている言葉」と「目で見ている文字」を一致させることで、脳への負担を減らし、視聴維持率を高めることができます。" },
        { q: "今回のコース目標における「動画投稿数」は？", options: { A: "1本", B: "3本以上", C: "毎日投稿", D: "100本" }, correct: "B", rationale: "「習うより慣れろ」です。失敗を恐れず、まずは3本投稿して反応を見る体験を重視しています。" }
    ]);


    // --- SYNCHRONIZED HIGHLIGHTING (No Auto-Scroll Version) ---
    // User Agency over generic automation.

    const toggleHighlight = (id, isActive) => {
        if (!id) return;
        const targetCell = document.querySelector(`.cal-cell[data-day="${id}"]`);
        const targetItem = document.getElementById(id);

        // Toggle class only (No scrollIntoView)
        if (targetCell) targetCell.classList.toggle('active-sync', isActive);
        if (targetItem) targetItem.classList.toggle('active-sync', isActive);
    };

    // 1. Hover on Calendar
    document.querySelectorAll('.cal-cell.has-event').forEach(cell => {
        cell.addEventListener('mouseenter', () => toggleHighlight(cell.dataset.day, true));
        cell.addEventListener('mouseleave', () => toggleHighlight(cell.dataset.day, false));
    });

    // 2. Hover on List
    document.querySelectorAll('.c-item').forEach(item => {
        item.addEventListener('mouseenter', () => toggleHighlight(item.id, true));
        item.addEventListener('mouseleave', () => toggleHighlight(item.id, false));
    });

    // --- HIGHLIGHT TODAY (Valid until Mar 7, 2026) ---
    const highlightToday = () => {
        const today = new Date();
        // Check if year is 2026 (Strict constraint)
        if (today.getFullYear() !== 2026) return;

        const m = today.getMonth(); // 0=Jan, 1=Feb, 2=Mar
        const d = today.getDate();
        let targetCell = null;

        if (m === 1) { // February
            // Find regular cell with this number (excluding other-month cells)
            const cells = document.querySelectorAll('.cal-cell:not(.other-month)');
            cells.forEach(c => {
                const numSpan = c.querySelector('.date-num');
                if (numSpan && parseInt(numSpan.textContent) === d) {
                    targetCell = c;
                }
            });
        } else if (m === 2 && d <= 7) { // March 1st - 7th (Next Month display)
            // Mar 1-7 are shown as .other-month cells at the end
            const cells = document.querySelectorAll('.cal-cell.other-month');
            cells.forEach(c => {
                // These cells usually just have text "1", "2" etc.
                if (parseInt(c.textContent.trim()) === d) {
                    targetCell = c;
                }
            });
        }

        if (targetCell) {
            targetCell.classList.add('is-today');
        }
    };
    highlightToday();

    // --- AUTO-UPDATE LATEST BUTTON ---
    const updateLatestButton = () => {
        // Find all "published" items (anchor tags in the curriculum list)
        const publishedItems = document.querySelectorAll('.curriculum-list a.c-item');
        if (publishedItems.length > 0) {
            // The last one is the latest released day
            const latestItem = publishedItems[publishedItems.length - 1];

            const latestUrl = latestItem.getAttribute('href');

            // Extract Vol Number from ID (e.g. "d02" -> 2)
            const dayId = latestItem.id; // "d01", "d02"
            const volNum = parseInt(dayId.replace('d', ''));

            const btn = document.querySelector('.shortcut-btn');
            if (btn) {
                btn.href = latestUrl;
                btn.innerHTML = `<i class="fa-solid fa-play"></i> LATEST: Vol.${volNum} テキストを開く`;
            }
        }
    };
    // --- DAY 3 QUIZ ---
    initQuiz('quiz-vol01-3', [
        {
            q: "企画リサーチをする際、TikTokアプリ内で最初に使うべき機能は？",
            options: { A: "設定画面", B: "探索（トレンド）タブでの検索", C: "プロフィールの編集", D: "課金アイテムの購入" },
            correct: "B",
            rationale: "まずは「今、何が流行っているのか」を肌で感じることが重要です。探索タブでトレンドを把握しましょう。"
        },
        {
            q: "Canvaを使って、同じデザインの動画を大量に作る機能の名前は？",
            options: { A: "マジック作文", B: "一括作成 (Bulk Create)", C: "背景除去", D: "ブランドキット" },
            correct: "B",
            rationale: "「一括作成」機能を使えば、CSVなどを取り込んでデザインを量産できます。まさに「工場」のような機能です。"
        },
        {
            q: "動画の冒頭で視聴者の興味を引き、指を止めさせる要素を何と呼ぶ？",
            options: { A: "フック", B: "クロージング", C: "CTA", D: "ハッシュタグ" },
            correct: "A",
            rationale: "釣り針（Hook）のように、視聴者の心を「引っかける」ための冒頭の工夫です。ここが弱いとすぐにスクロールされてしまいます。"
        },
        {
            q: "Canvaの一括作成で、用意したデータを流し込むために必要な操作は？",
            options: { A: "画像を削除する", B: "右クリックして「データを接続」", C: "フォントを太字にする", D: "アニメーションを削除する" },
            correct: "B",
            rationale: "テンプレート上の要素を右クリックし、流し込みたいデータの項目と「接続」することで、一気に流し込みが可能になります。"
        },
        {
            q: "今回の研修（3日目）で設定された、最低限の動画アップロード本数は？",
            options: { A: "1本", B: "3本以上", C: "10本", D: "30本" },
            correct: "B",
            rationale: "質にこだわりすぎず、まずは「数を出す」経験を積むために、最低3本のアウトプットを目標としています。"
        }
    ]);

    // --- DAY 5 QUIZ ---
    initQuiz('quiz-vol01-5', [
        {
            q: "TikTokの動画において、最も推奨されるアスペクト比（縦横比）は？",
            options: { A: "16:9 (横長)", B: "1:1 (正方形)", C: "9:16 (縦長)", D: "4:3" },
            correct: "C",
            rationale: "TikTokはスマホ視聴がメインのため、「9:16」の縦全画面サイズが最も没入感が高く、推奨されています。"
        },
        {
            q: "CapCutで、動画の上に別の画像や動画を重ねる機能の名前は？",
            options: { A: "はめ込み合成 (Overlay)", B: "クロマキー", C: "フリーズ", D: "逆再生" },
            correct: "A",
            rationale: "「はめ込み合成（オーバーレイ）」を使うことで、メイン映像の上にリアクション動画や資料画像を重ねることができます。"
        },
        {
            q: "動画の一部だけを切り抜いたり、特定の形に表示させたりする機能は？",
            options: { A: "ブレンド", B: "マスク (Mask)", C: "調整", D: "フィルター" },
            correct: "B",
            rationale: "「マスク」機能を使うことで、映像を円形や長方形に切り抜いたり、画面を分割したりすることができます。"
        },
        {
            q: "動画のテンポを良くするために、会話の「無言の間」をカットする手法は？",
            options: { A: "ジャンプカット (ジェットカット)", B: "クロスフェード", C: "とことんカット", D: "マシンガンカット" },
            correct: "A",
            rationale: "「ジャンプカット」は、不要な間を極限まで削ることで、視聴者を飽きさせないリズムを生み出す必須テクニックです。"
        },
        {
            q: "本日の目標投稿本数は？",
            options: { A: "1本", B: "3本以上", C: "10本", D: "0本" },
            correct: "B",
            rationale: "習うより慣れろ、の精神で「3本以上」の投稿を目指しましょう。質より量のフェーズです。"
        }
    ]);

    // --- DAY 6 QUIZ (Placeholder) ---
    initQuiz('quiz-vol01-4', [
        {
            q: "視線を誘導する効果がある、画面を縦横3つに分ける基本的な構図は？",
            options: { A: "三分割法", B: "日の丸構図", C: "シンメトリー", D: "額縁構図" },
            correct: "A",
            rationale: "「三分割法」は、画面を縦横に3等分し、その交点や線上に被写体を配置することで、バランスの良い写真になります。"
        },
        {
            q: "丸い被写体を画面のど真ん中に配置する、シンプルで力強い構図は？",
            options: { A: "三分割法", B: "日の丸構図", C: "対角線構図", D: "放射線構図" },
            correct: "B",
            rationale: "「日の丸構図」は、被写体を中央に大胆に配置し、その存在感を強調するシンプルな構図です。"
        },
        {
            q: "CapCutでPCとスマホ間でデータを共有するために使う機能は？",
            options: { A: "Bluetooth", B: "AirDrop", C: "スペース / Space", D: "USBケーブル" },
            correct: "C",
            rationale: "CapCutの「スペース（クラウド）」機能を使えば、PCで編集したプロジェクトをクラウド経由でスマホと同期できます。"
        },
        {
            q: "今回の実習で、AI（Gemini等）で作るショート動画の台本の文字数は？",
            options: { A: "1000文字以上", B: "300文字程度", C: "140文字以内", D: "制限なし" },
            correct: "B",
            rationale: "ショート動画（1分未満）の場合、300文字程度が適切な情報量とテンポを生み出します。"
        },
        {
            q: "本コースの最終目標（再生数）は？",
            options: { A: "1本でも50回再生", B: "1万回再生", C: "フォロワー1000人", D: "収益化達成" },
            correct: "A",
            rationale: "まずは「50回再生」という小さな壁を超えることが、アルゴリズムに乗るための第一歩です。"
        }
    ]);


    // --- DAY 6 QUIZ ---
    initQuiz('quiz-vol01-6', [
        {
            q: "Suno AIの無料プラン（Basic Plan）で作成した楽曲の商用利用について正しいものは？",
            options: { A: "自由に商用利用可能", B: "クレジット表記すれば可能", C: "不可（収益化NG）", D: "TikTokのみ可能" },
            correct: "C",
            rationale: "無料プランの楽曲は商用利用権が付与されません。収益化する動画に使う場合は、必ず有料プラン（Pro以上）への加入が必要です。"
        },
        {
            q: "TikTok動画において「音（サウンド）」が重要視される理由は？",
            options: { A: "90%以上のユーザーが「音アリ」で視聴しているから", B: "音が大きい方が目立つから", C: "画質をごまかせるから", D: "特に重要ではない" },
            correct: "A",
            rationale: "TikTokは「音で遊ぶアプリ」として認知されており、ほぼ全てのユーザーが音声をオンにして視聴するため、音のクオリティが直帰率に直結します。"
        },
        {
            q: "動画の長さに合わせてBGMを自動生成・調整できるAIツールは？",
            options: { A: "ChatGPT", B: "SOUNDRAW", C: "Midjourney", D: "Excel" },
            correct: "B",
            rationale: "SOUNDRAWは、指定した秒数やムードに合わせてBGMを生成できるため、動画編集の尺合わせに最適です。"
        },
        {
            q: "Suno AIで、歌詞や曲調を細かく指定して作曲するモードの名前は？",
            options: { A: "Simple Mode", B: "Auto Mode", C: "Custom Mode", D: "Pro Mode" },
            correct: "C",
            rationale: "「Custom Mode」に切り替えることで、自作の歌詞（Lyrics）や具体的なスタイル（Style of Music）を指定できます。"
        },
        {
            q: "本日の目標投稿本数は？",
            options: { A: "1本", B: "3本以上", C: "10本", D: "0本" },
            correct: "B",
            rationale: "AIツールを使えば、音楽素材も無限に生成できます。まずは3本投稿し、音と映像のシンクロを体感しましょう。"
        }
    ]);

    updateLatestButton();

});
