// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const ctaButton = document.getElementById('cta-button');
  
    // Button click event
    ctaButton.addEventListener('click', () => {
      alert('Thanks for clicking! 🎉');
      ctaButton.textContent = 'Clicked!';
      ctaButton.style.background = '#2ecc71';
    });
  });