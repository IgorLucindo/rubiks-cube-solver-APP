export function initToggleMenu(virtualCube) {
    const menuBtn = document.getElementById('debugMenuBtn');
    const menu = document.getElementById('debugMenu');
    const forceBtn = document.getElementById('forceCubeBtn');
    const autoBtn = document.getElementById('autoSolveBtn');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
            menu.setAttribute('aria-hidden', String(!isOpen));
        });

        // Close menu when clicking outside
        window.addEventListener('mousedown', (e) => {
            if (!menu.classList.contains('open')) return;
            if (menu.contains(e.target) || menuBtn.contains(e.target)) return;
            menu.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
        });

        // Close on Escape
        window.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            if (!menu.classList.contains('open')) return;
            menu.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
        });
    }

    if (forceBtn) forceBtn.addEventListener('click', () => virtualCube.forceUnsolvedState());
    if (autoBtn) autoBtn.addEventListener('click', () => virtualCube.autoSolve());
}