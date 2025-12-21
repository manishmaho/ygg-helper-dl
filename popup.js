document.addEventListener('DOMContentLoaded', function() {
  // Tabs Logic
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // --- Download Logic ---
  const downloadBtn = document.getElementById('downloadBtn');
  const idInput = document.getElementById('torrentId');
  const statusDiv = document.getElementById('status');

  // Auto-detect ID
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0] && tabs[0].url) {
      const url = tabs[0].url;
      const match = url.match(/\/(\d+)-/);
      if (match && match[1]) {
        idInput.value = match[1];
        statusDiv.innerText = "✨ ID détecté automatiquement !";
        statusDiv.style.color = "#2ecc71";
      }
    }
  });

  downloadBtn.addEventListener('click', function() {
    const id = idInput.value.trim();
    if (!id) {
      statusDiv.innerText = "❌ Veuillez entrer un ID valide.";
      statusDiv.style.color = "#d9534f";
      return;
    }
    const downloadUrl = `https://www.yggtorrent.org/engine/download_torrent?id=${id}`;
    chrome.tabs.create({ url: downloadUrl });
    statusDiv.innerText = "✅ Téléchargement lancé !";
    statusDiv.style.color = "#2ecc71";
  });

  // --- Passkey Logic ---
  const passkeyInput = document.getElementById('passkeyInput');
  const savePasskeyBtn = document.getElementById('savePasskeyBtn');
  const passkeyStatus = document.getElementById('passkeyStatus');

  // Load saved passkey
  chrome.storage.local.get(['yggPasskey'], function(result) {
    if (result.yggPasskey) {
      passkeyInput.value = result.yggPasskey;
    }
  });

  savePasskeyBtn.addEventListener('click', function() {
    const pk = passkeyInput.value.trim();
    if (pk) {
      chrome.storage.local.set({yggPasskey: pk}, function() {
        passkeyStatus.innerText = "✅ Passkey sauvegardé !";
        passkeyStatus.style.color = "#28a745";
        setTimeout(() => passkeyStatus.innerText = "", 3000);
      });
    } else {
      passkeyStatus.innerText = "❌ Passkey vide";
      passkeyStatus.style.color = "#d9534f";
    }
  });
});
