document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.header-tools .menu');
  const nav = document.querySelector('.main-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.style.display === 'flex';
      nav.style.display = open ? 'none' : 'flex';
    });
  }

  const themeBtn = document.querySelector('.header-tools .theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const storedTheme = localStorage.getItem('seereh-theme');
  let currentTheme = storedTheme || (prefersDark.matches ? 'dark' : 'light');

  const applyTheme = theme => {
    document.body.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
  };
  applyTheme(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('seereh-theme', currentTheme);
      applyTheme(currentTheme);
    });
  }

  const handlePrefChange = event => {
    if (!localStorage.getItem('seereh-theme')) {
      currentTheme = event.matches ? 'dark' : 'light';
      applyTheme(currentTheme);
    }
  };
  if (prefersDark.addEventListener) {
    prefersDark.addEventListener('change', handlePrefChange);
  } else if (prefersDark.addListener) {
    prefersDark.addListener(handlePrefChange);
  }

  const headlineEl = document.querySelector('.hero-headline');
  if (headlineEl) {
    let headlines = [];
    try {
      headlines = JSON.parse(headlineEl.dataset.headlines || '[]');
    } catch (error) {
      headlines = [];
    }
    if (headlines.length > 1) {
      let index = 0;
      headlineEl.textContent = headlines[index];
      setInterval(() => {
        headlineEl.classList.add('is-transitioning');
        setTimeout(() => {
          index = (index + 1) % headlines.length;
          headlineEl.textContent = headlines[index];
          headlineEl.classList.remove('is-transitioning');
        }, 250);
      }, 4500);
    }
  }
});
