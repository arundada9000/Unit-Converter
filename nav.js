function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
  document.querySelector(".menu-toggle").classList.toggle("active");

  if (navLinks.classList.contains("active")) {
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 500);
  } else {
    document.removeEventListener("click", handleOutsideClick);
  }
}

function handleOutsideClick(event) {
  const navLinks = document.querySelector(".nav-links");
  const menuToggle = document.querySelector(".menu-toggle");

  if (!navLinks.contains(event.target)) {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");

    document.removeEventListener("click", handleOutsideClick);
  }
}

// PWA Install Button Logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  
  const footerLinks = document.querySelector('.footer-links');
  if (footerLinks && !document.getElementById('pwa-install-btn')) {
    const btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.className = 'install-btn';
    btn.innerText = 'Install App';
    btn.onclick = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
          btn.style.display = 'none';
        }
        deferredPrompt = null;
      }
    };
    footerLinks.appendChild(btn);
  }
});

window.addEventListener('appinstalled', () => {
  const btn = document.getElementById('pwa-install-btn');
  if (btn) btn.style.display = 'none';
  deferredPrompt = null;
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful');
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateToast(newWorker);
            }
          });
        });
      })
      .catch((err) => {
        console.log('ServiceWorker registration failed: ', err);
      });
      
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

function showUpdateToast(newWorker) {
  const toast = document.createElement('div');
  toast.className = 'update-toast scroll-animate';
  toast.innerHTML = `
    <p>New version available!</p>
    <button id="update-btn">Refresh</button>
  `;
  document.body.appendChild(toast);
  
  document.getElementById('update-btn').onclick = () => {
    toast.style.display = 'none';
    newWorker.postMessage({ type: 'SKIP_WAITING' });
  };
}
