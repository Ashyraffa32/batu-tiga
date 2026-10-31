// logic/settings.js

const darkModeToggle = document.getElementById('darkModeToggle');

if (darkModeToggle) {
  darkModeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      // Pas switch ON, idupin dark mode & save ke memori
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      // Pas switch OFF, matiin dark mode & update memori
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  });
}