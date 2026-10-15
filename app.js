const installButton = document.querySelector('#installButton');
const toast = document.querySelector('#toast');
let installPrompt;
let installedAppDetected = false;
let toastTimer;
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
document.documentElement.classList.toggle('standalone-mode', isStandalone);

if (!isStandalone && 'getInstalledRelatedApps' in navigator) {
  navigator.getInstalledRelatedApps().then(apps => {
    installedAppDetected = apps.some(app => app.platform === 'webapp');
    if (installedAppDetected) {
      installPrompt = null;
      installButton.hidden = true;
    }
  }).catch(() => {});
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4800);
}

document.querySelector('#year').textContent = new Date().getFullYear();

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  installButton.textContent = 'Instalar a app';
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  if (isStandalone || installedAppDetected) {
    installButton.hidden = true;
  } else if (installPrompt) {
    const promptEvent = installPrompt;
    installPrompt = null;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === 'accepted') installButton.hidden = true;
  } else if (isIOS) {
    showToast('No Safari, toca em Partilhar e escolhe «Adicionar ao ecrã principal».');
  } else {
    showToast('Abre o menu do navegador e escolhe «Instalar app» ou «Adicionar ao ecrã principal».');
  }
});

if (isStandalone) {
  installButton.hidden = true;
} else if (isIOS) {
  installButton.textContent = 'Adicionar ao ecrã';
}

window.addEventListener('appinstalled', () => {
  installButton.hidden = true;
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js?v=10', { updateViaCache: 'none' });
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            showToast('A app foi atualizada. Fecha e volta a abrir para ver as novidades.');
          }
        });
      });
    } catch (error) {
      console.warn('Não foi possível preparar o modo offline da app.', error);
    }
  });
}
