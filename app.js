const installButton = document.querySelector('#installButton');
const toast = document.querySelector('#toast');
const searchInput = document.querySelector('#searchInput');
const projectCards = [...document.querySelectorAll('.project-card')];
const noResults = document.querySelector('#noResults');
let installPrompt;
let toastTimer;
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4800);
}

document.querySelector('#year').textContent = new Date().getFullYear();

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLocaleLowerCase('pt-PT');
  let visible = 0;
  projectCards.forEach(card => {
    const text = `${card.textContent} ${card.dataset.search}`.toLocaleLowerCase('pt-PT');
    const match = text.includes(query);
    card.hidden = !match;
    if (match) visible += 1;
  });
  noResults.hidden = visible > 0;
});

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  installButton.textContent = 'Instalar app';
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  if (isStandalone) {
    showToast('A app já está instalada neste dispositivo.');
  } else if (installPrompt) {
    const promptEvent = installPrompt;
    installPrompt = null;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === 'accepted') installButton.textContent = 'App instalada';
  } else if (isIOS) {
    showToast('No Safari, toca em Partilhar e escolhe «Adicionar ao ecrã principal».');
  } else {
    showToast('Abre o menu do navegador e escolhe «Instalar app» ou «Adicionar ao ecrã principal».');
  }
});

if (isStandalone) {
  installButton.textContent = 'App instalada';
} else if (isIOS) {
  installButton.textContent = 'Adicionar ao ecrã';
}

window.addEventListener('appinstalled', () => {
  installButton.textContent = 'App instalada';
  showToast('App instalada. Boas leituras!');
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js?v=3', { updateViaCache: 'none' });
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
