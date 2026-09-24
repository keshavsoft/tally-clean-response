// tally-to-xml-tdl documentation helper scripts

document.addEventListener('DOMContentLoaded', () => {
  // 1. Copy code button handler
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const codeBlock = btn.closest('.code-block');
      if (!codeBlock) return;
      const codeEl = codeBlock.querySelector('pre code') || codeBlock.querySelector('pre');
      if (!codeEl) return;

      const codeText = codeEl.innerText.trim();
      try {
        await navigator.clipboard.writeText(codeText);
        const originalContent = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalContent;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });
  });

  // 2. Quick install pill copy
  const installPill = document.querySelector('.quick-install-pill');
  if (installPill) {
    installPill.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('npm install tally-to-xml-tdl');
        const originalText = installPill.querySelector('.install-text').textContent;
        installPill.querySelector('.install-text').textContent = 'Copied to clipboard!';
        installPill.style.borderColor = 'var(--accent-emerald)';
        setTimeout(() => {
          installPill.querySelector('.install-text').textContent = originalText;
          installPill.style.borderColor = '';
        }, 2000);
      } catch (err) {
        console.error(err);
      }
    });
  }

  // 3. ScrollSpy for guide sidebar
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  if (sidebarLinks.length > 0) {
    const sections = Array.from(sidebarLinks).map(link => {
      const id = link.getAttribute('href').replace('#', '');
      return document.getElementById(id);
    }).filter(Boolean);

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;
      let currentSection = sections[0];

      sections.forEach(section => {
        if (section.offsetTop <= scrollPos) {
          currentSection = section;
        }
      });

      if (currentSection) {
        sidebarLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentSection.id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }, { passive: true });
  }
});
