document.addEventListener('DOMContentLoaded', () => {
    const disagreeBtn = document.getElementById('disagreeBtn');
    const agreeBtn = document.getElementById('agreeBtn');
    const successOverlay = document.getElementById('successOverlay');

    // State for the disagree button
    let runCount = 0;
    let scale = 1.0;

    // Floating screen effect
    const headerTitle = document.querySelector('h1');
    headerTitle.style.cursor = 'pointer';
    headerTitle.addEventListener('click', () => {
        document.body.classList.toggle('floating-active');
    });

    // Configure running behavior
    const runAway = (e) => {
        // Move button to body to avoid container transforms (like the float animation) affecting its position
        if (disagreeBtn.parentElement !== document.body) {
            document.body.appendChild(disagreeBtn);
            disagreeBtn.style.position = 'fixed';
            disagreeBtn.style.zIndex = '99999';
        }

        // Shrink every time it runs (is chased)
        scale -= 0.1;
        if (scale < 0.2) scale = 0.2; // Don't disappear completely, just get tiny
        disagreeBtn.style.transform = `scale(${scale})`;

        // Get the viewport dimensions
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Get button dimensions
        // Note: After appending to body, verifying rect ensures we get the current visible size
        const btnRect = disagreeBtn.getBoundingClientRect();
        const btnWidth = btnRect.width;
        const btnHeight = btnRect.height;

        // Calculate safe boundaries with padding
        const padding = 20;
        const maxLeft = vw - btnWidth - padding;
        const maxTop = vh - btnHeight - padding;

        // Generate random position
        // Ensure values are positive
        let newLeft = Math.max(padding, Math.random() * maxLeft);
        let newTop = Math.max(padding, Math.random() * maxTop);

        // Apply new positions
        disagreeBtn.style.left = `${newLeft}px`;
        disagreeBtn.style.top = `${newTop}px`;

        // Add some snarky text change after a few runs
        runCount++;
        if (runCount === 3) {
            disagreeBtn.innerText = "你是認真的？";
        } else if (runCount === 6) {
            disagreeBtn.innerText = "再考慮一下";
        } else if (runCount === 10) {
            disagreeBtn.innerText = "不要再追了";
        }
    };

    // Helper to calculate distance from mouse to center of button
    const getDistance = (mouseX, mouseY, element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
    };

    // Run away on mouse over
    disagreeBtn.addEventListener('mouseover', runAway);

    // Also run away on mousemove if get too close (for smoother feel)
    // Using a throttle or check could be good, but direct check is simple for now.
    document.addEventListener('mousemove', (e) => {
        const dist = getDistance(e.clientX, e.clientY, disagreeBtn);
        // If distance is less than threshold (e.g. 100px) and it's not already moving, maybe trigger runAway?
        // But the mouseover is usually sufficient. Let's stick to mouseover to avoid flickering.
    });

    // Shrink and try to run on click (in case they manage to click it)
    disagreeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Shrink
        scale -= 0.1;
        if (scale < 0) scale = 0;
        disagreeBtn.style.transform = `scale(${scale})`;

        // Run away immediately
        runAway();

        if (scale < 0.2) {
            disagreeBtn.style.opacity = '0';
            disagreeBtn.pointerEvents = 'none';
        }
    });

    // Agree button logic
    agreeBtn.addEventListener('click', () => {
        // Confetti could go here, but let's just show the modal for now
        successOverlay.classList.remove('hidden');
        // Force reflow for transition
        void successOverlay.offsetWidth;
        successOverlay.classList.add('visible');
    });
});
