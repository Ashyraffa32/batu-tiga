// logic/script.js

// Jalanin fungsi ini pas halaman beres di-load
document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = localStorage.getItem('theme');
  const darkModeToggle = document.getElementById('darkModeToggle');

  // Kalo di memori udah diset 'dark', tembak class-nya ke body
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    
    // Kalo user lagi di halaman Settings, pastiin switch-nya geser ke posisi ON
    if (darkModeToggle) {
      darkModeToggle.checked = true;
    }
  }
});