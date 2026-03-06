/* ============================================
   script.js — A.I.M サイト共通JS
   ============================================ */

(function () {
    'use strict';

    const header    = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('navMobile');

    /* ─────────────────────────────────────────
       ヘッダー: スクロールで .scrolled トグル
       ─────────────────────────────────────────
       scrollY > 40: 濃紺ガラス背景に切り替え
    ───────────────────────────────────────── */
    function onScroll() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // ページロード時の初期状態を即適用

    /* ─────────────────────────────────────────
       ハンバーガー: モバイルメニュー開閉
    ───────────────────────────────────────── */
    if (hamburger && navMobile) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('active');
            navMobile.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        /* モバイルメニューのリンクをクリックしたら閉じる */
        navMobile.querySelectorAll('.nav-mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ─────────────────────────────────────────
       スムーススクロール
    ───────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = 72; // ヘッダー高さ
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ─────────────────────────────────────────
       スクロールアニメーション (animate-on-scroll)
       IntersectionObserver で要素が見えたら
       .visible クラスを付与
    ───────────────────────────────────────── */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    } else {
        /* IntersectionObserver 非対応ブラウザは全て表示 */
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('visible');
        });
    }

    /* ─────────────────────────────────────────
       カウントアップアニメーション
       対象: .stat-badge-num / .stat-number-tiktok / .result-stat-number
             .comparison-value-large（数値を含む要素のみ）
    ───────────────────────────────────────── */

    /**
     * テキストから数値・接頭辞・接尾辞を解析する
     * 例: "87%"    → { prefix:"", num:87,   suffix:"%" }
     *     "100+"   → { prefix:"", num:100,  suffix:"+" }
     *     "100万+" → { prefix:"", num:100,  suffix:"万+" }
     *     "60万円" → { prefix:"", num:60,   suffix:"万円" }
     *     "8万円"  → { prefix:"", num:8,    suffix:"万円" }
     *     "600+"   → { prefix:"", num:600,  suffix:"+" }
     * 数値が含まれない文字列（"集まらない"等）はスキップ
     */
    function parseCountTarget(el) {
        // <span class="value-unit"> などの子要素を除いたテキストのみ取得
        let rawText = '';
        el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) rawText += node.textContent;
        });
        rawText = rawText.trim();

        // 数値を含まない場合はスキップ
        const match = rawText.match(/^([^\d]*)(\d[\d,]*)(.*)$/);
        if (!match) return null;

        const prefix = match[1];
        const num    = parseInt(match[2].replace(/,/g, ''), 10);
        const suffix = match[3];

        if (isNaN(num)) return null;
        return { el, prefix, num, suffix };
    }

    /**
     * easeOutExpo イージング
     */
    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    /**
     * 1要素をカウントアップ
     */
    function animateCount(target) {
        const { el, prefix, num, suffix } = target;
        const duration = Math.min(2000, 600 + num * 0.6); // 数値が大きいほど少し長め (max 2s)
        const start    = performance.now();

        // 子要素（value-unit など）を退避
        const children = Array.from(el.children);

        function tick(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = easeOutExpo(progress);
            const current  = Math.round(eased * num);

            // テキストノードだけ書き換え、子要素は保持
            // まず既存テキストノードを削除
            el.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) node.textContent = '';
            });

            // 先頭テキストノードがなければ作成
            const firstText = el.childNodes[0];
            if (firstText && firstText.nodeType === Node.TEXT_NODE) {
                firstText.textContent = prefix + current.toLocaleString('ja-JP') + suffix;
            } else {
                el.insertBefore(document.createTextNode(
                    prefix + current.toLocaleString('ja-JP') + suffix
                ), el.firstChild);
            }

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                // 最終値を確実にセット
                if (el.childNodes[0] && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                    el.childNodes[0].textContent = prefix + num.toLocaleString('ja-JP') + suffix;
                }
            }
        }

        requestAnimationFrame(tick);
    }

    /**
     * カウントアップ対象セレクター
     * - .stat-badge-num          : ヒーロー フローティングバッジ
     * - .stat-number-tiktok      : サービスセクション TikTok統計
     * - .result-stat-number      : 実績セクション 統計数字
     * - .comparison-value-large  : 実績 Before/After 比較数字
     */
    const COUNT_SELECTORS = [
        '.stat-badge-num',
        '.stat-number-tiktok',
        '.result-stat-number',
        '.comparison-value-large',
    ].join(',');

    if ('IntersectionObserver' in window) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const target = parseCountTarget(entry.target);
                if (target) animateCount(target);
                countObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.4, // 要素が40%見えたら発火
        });

        document.querySelectorAll(COUNT_SELECTORS).forEach(el => {
            countObserver.observe(el);
        });
    }

    /* ─────────────────────────────────────────
       お問い合わせフォーム: 送信処理
    ───────────────────────────────────────── */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = contactForm.querySelector('.btn-submit');
            if (btn) {
                btn.disabled = true;
                btn.querySelector('span').textContent = '送信中...';
            }

            /* ここに実際の送信処理（Fetch / FormSubmit など）を追加 */
            setTimeout(() => {
                contactForm.style.display = 'none';
                const successMsg = document.querySelector('.form-success');
                if (successMsg) successMsg.style.display = 'flex';
            }, 1000);
        });
    }

})();
