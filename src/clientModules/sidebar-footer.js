import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Shrinks the sticky docs sidebar by the part of the footer that is in view,
// so its last items stay reachable when the page is scrolled to the bottom.
if (ExecutionEnvironment.canUseDOM) {
  const update = () => {
    const footer = document.querySelector('footer.footer');
    const overlap = footer ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top) : 0;
    document.documentElement.style.setProperty('--footer-overlap', `${Math.round(overlap)}px`);
  };
  window.addEventListener('scroll', update, {passive: true});
  window.addEventListener('resize', update, {passive: true});
  window.addEventListener('load', update);
}

export function onRouteDidUpdate() {
  requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
}
