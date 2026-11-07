import React from 'react';
import Logo from '@theme/Logo';

// The logo image alone gives the link no static accessible name for crawlers.
export default function NavbarLogo() {
  return (
    <Logo
      aria-label="Microcks"
      className="navbar__brand"
      imageClassName="navbar__logo"
      titleClassName="navbar__title text--truncate"
    />
  );
}
