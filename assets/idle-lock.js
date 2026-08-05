/* ==================================================================
   KIOSK AUTO-LOCK
   5 daqiqa davomida ekranga tegilmasa — bosh sahifadagi
   splash (til tanlash) ekraniga qaytadi. Telefon qulfi kabi.
   ================================================================== */
(function(){
  var IDLE_MS = 300000;          /* 5 daqiqa */
  var FADE_MS = 450;             /* qulflashdan oldingi qorayish */
  var HOME    = 'index.html';
  var timer   = null;
  var locking = false;

  function readLang(){
    var l = null;
    try { l = new URLSearchParams(window.location.search).get('lang'); } catch(e){}
    if (l !== 'uz' && l !== 'ru' && l !== 'en') {
      l = null;
      try { l = window.localStorage.getItem('bipLang'); } catch(e){}
    }
    return (l === 'uz' || l === 'ru' || l === 'en') ? l : 'uz';
  }

  function veil(){
    var v = document.getElementById('kiosk-lock-veil');
    if (!v) {
      v = document.createElement('div');
      v.id = 'kiosk-lock-veil';
      v.style.cssText =
        'position:fixed;inset:0;z-index:2147483647;background:#070d18;' +
        'opacity:0;pointer-events:none;transition:opacity ' + FADE_MS + 'ms ease;';
      document.body.appendChild(v);
    }
    return v;
  }

  function lock(){
    if (locking) return;
    locking = true;
    var v = veil();
    v.style.pointerEvents = 'auto';
    /* reflow — o‘tishni ishga tushirish uchun */
    void v.offsetWidth;
    v.style.opacity = '1';
    setTimeout(function(){
      window.location.replace(HOME + '?lang=' + readLang() + '#tp-splash');
    }, FADE_MS);
  }

  function reset(){
    if (locking) return;
    clearTimeout(timer);
    timer = setTimeout(lock, IDLE_MS);
  }

  ['pointerdown','pointermove','pointerup','touchstart','touchmove',
   'mousemove','mousedown','wheel','keydown','click','scroll']
  .forEach(function(ev){
    document.addEventListener(ev, reset, {passive:true, capture:true});
  });

  /* sahifa yana ko‘rinadigan bo‘lsa — hisobni qaytadan boshlash */
  document.addEventListener('visibilitychange', function(){
    if (!document.hidden) reset();
  });
  window.addEventListener('pageshow', function(){ locking = false; reset(); });

  reset();
})();
