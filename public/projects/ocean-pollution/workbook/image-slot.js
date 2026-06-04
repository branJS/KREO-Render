// Asset auto-loader: places real images into Claude Design placeholders.
// If a file is missing, the designed placeholder remains visible.
(function () {
  const slots = document.querySelectorAll("[data-asset]");

  slots.forEach((slot) => {
    const url = slot.dataset.asset;
    if (!url) return;
    const target = slot.closest(".imgslot") || slot;

    const img = new Image();

    img.onload = () => {
      if (target.classList.contains("has-asset")) return;

      target.classList.add("has-asset");
      const layer = document.createElement("div");
      layer.className = "asset-layer";
      layer.style.backgroundImage = 'url("' + url.replace(/"/g, "%22") + '")';
      target.appendChild(layer);
    };

    img.onerror = () => {
      // Keep the placeholder intact for missing files.
    };

    img.src = url;
  });
})();
