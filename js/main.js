// ハンバーガーメニューの開閉
(function () {
  const hamburger = document.getElementById('hamburger');
  const gnav = document.getElementById('gnav');
  if (!hamburger || !gnav) return;

  const toggle = (open) => {
    const isOpen = open ?? !gnav.classList.contains('is-open');
    gnav.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  };

  hamburger.addEventListener('click', () => toggle());

  // ナビ内リンクをクリックしたら閉じる
  gnav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => toggle(false));
  });
})();

// お客様の声の動画（トップページ #voice）
//  ・最初は3本だけ表示し、「もっと見る」で3本ずつ追加（別ページ遷移・再読み込みなし）
//  ・すべて表示したらボタンを「表示を閉じる」に切り替え、押すと最初の3本に戻す
//  ・カードのサムネイルを押すと、その動画だけをモーダルで読み込んで大きく再生（自動再生なし・同時再生なし）
(function () {
  const grid = document.getElementById('vvGrid');
  const modal = document.getElementById('vvModal');
  const moreBtn = document.getElementById('vvMoreBtn');
  if (!grid || !modal) return;

  const cards = Array.from(grid.querySelectorAll('.vv-card'));
  const STEP = 3;             // 1回に表示・追加する本数
  const total = cards.length;
  let shown = STEP;

  const stage = document.getElementById('vvModalStage');
  const caption = document.getElementById('vvModalTitle');
  const dialog = modal.querySelector('.vv-modal__dialog');

  // --- 表示本数をカードに反映 ---
  const render = () => {
    cards.forEach((card, i) => card.classList.toggle('is-hidden', i >= shown));
    if (!moreBtn) return;
    const allShown = shown >= total;
    moreBtn.textContent = allShown ? '表示を閉じる' : 'お客様の声（動画）をもっと見る';
    moreBtn.setAttribute('aria-expanded', String(shown > STEP));
  };

  if (moreBtn) {
    if (total <= STEP) {
      // 3本以下なら「もっと見る」は不要
      const wrap = moreBtn.closest('.vv-more');
      if (wrap) wrap.hidden = true;
    } else {
      moreBtn.addEventListener('click', () => {
        if (shown >= total) {
          shown = STEP;                         // すべて表示済み → 最初の3本に戻す
          render();
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          shown = Math.min(shown + STEP, total); // 3本ずつ追加
          render();
        }
      });
    }
  }
  render();

  // --- モーダル再生（クリックされた動画のみ読み込む） ---
  let lastFocus = null;

  const openModal = (wrap) => {
    const src = wrap.getAttribute('data-src');
    if (!src) return;
    const title = wrap.getAttribute('data-title') || 'お客様インタビュー動画';
    lastFocus = document.activeElement;

    stage.innerHTML = '';                       // 同時に複数再生しないよう常に1本だけ
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('aria-label', title);
    const thumb = wrap.querySelector('.vv-card__thumb');
    if (thumb && thumb.getAttribute('src')) video.poster = thumb.getAttribute('src');
    stage.appendChild(video);

    caption.textContent = title;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (dialog) dialog.focus();

    // 自動再生はしない設定だが、クリックというユーザー操作なので再生を試みる（ブロックされても手動再生可）
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  const closeModal = () => {
    const video = stage.querySelector('video');
    if (video) video.pause();
    stage.innerHTML = '';                       // src を解放して読み込みを止める
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  cards.forEach((card) => {
    const wrap = card.querySelector('.vv-card__video');
    if (wrap) wrap.addEventListener('click', () => openModal(wrap));
  });

  modal.querySelectorAll('[data-vv-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();

// 旧・お客様の声ページ（voice.html）用の従来動画プレーヤー（インライン<video>がある場合のみ動作）
(function () {
  document.querySelectorAll('.vv-card__video').forEach((wrap) => {
    const video = wrap.querySelector('video');
    const btn = wrap.querySelector('.vv-card__playbtn');
    if (!video || !btn) return;

    const start = () => {
      wrap.classList.add('is-playing');
      video.controls = true;
      video.play();
    };

    btn.addEventListener('click', start);
    video.addEventListener('play', () => wrap.classList.add('is-playing'));
  });
})();
