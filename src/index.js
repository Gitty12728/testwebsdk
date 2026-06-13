let activeXRSession = null;

function enterVRSession() {
  if (!navigator.xr) {
    alert("WebXR wird nicht unterstützt!");
    return;
  }

  // REPARATUR: Wenn noch eine Session offen ist, beenden wir sie aktiv vor dem Neustart!
  if (activeXRSession) {
    activeXRSession.end().catch(() => {});
    activeXRSession = null;
  }

  navigator.xr.requestSession('immersive-vr', {
    requiredFeatures: [],
    optionalFeatures: ['viewer']
  })
  .then((session) => {
    activeXRSession = session;
    
    // Falls die Session von außen (oder durch Absturz) beendet wird:
    session.addEventListener('end', () => {
      activeXRSession = null;
      const btn = document.getElementById('start-vr-button');
      if (btn) btn.style.display = 'block'; // Button wieder einblenden
    });

    const btn = document.getElementById('start-vr-button');
    if (btn) btn.style.display = 'none';

    console.log("✅ VR-Raum erfolgreich betreten!");
    setupTerminalLogic();
  })
  .catch((err) => {
    // Falls die Brille immer noch blockiert, zeigen wir einen gezielten Hinweis:
    if (err.message.includes("active")) {
      alert("Die Quest blockiert! Bitte schließe alle Browser-Tabs oder starte die Brille kurz neu.");
    } else {
      alert("Fehler beim VR-Start: " + err.message);
    }
  });
}

function setupTerminalLogic() {
  const btnInfo = document.getElementById('btn-show-info');
  const btnReset = document.getElementById('btn-reset');
  const infoGraphic = document.getElementById('infografik-panel');

  if (btnInfo && infoGraphic) {
    console.log("🎯 Infoterminal-Buttons einsatzbereit!");

    btnInfo.addEventListener('click', () => {
      infoGraphic.setAttribute('visible', 'true');
    });

    btnReset?.addEventListener('click', () => {
      infoGraphic.setAttribute('visible', 'false');
    });
  } else {
    setTimeout(setupTerminalLogic, 100);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-vr-button')?.addEventListener('click', enterVRSession);
});