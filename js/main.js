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

// お客様の声の動画：初期表示ではネイティブコントロールを出さず、
// ポスター下部の字幕を隠さない。再生ボタンを押したらコントロールを有効化する。
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
