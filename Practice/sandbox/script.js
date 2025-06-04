
  document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('ul');
    const overlay = document.querySelector('.overlay');
    
    function toggleMenu() {
      burgerMenu.classList.toggle('active');
      navMenu.classList.toggle('active');
      overlay.classList.toggle('active');
      
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    
    burgerMenu.addEventListener('click', toggleMenu);
    
    overlay.addEventListener('click', toggleMenu);
    
    const navLinks = document.querySelectorAll('ul li a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
    
    window.addEventListener('resize', function() {
      if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
