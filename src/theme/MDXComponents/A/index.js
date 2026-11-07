import React from 'react';
import A from '@theme-original/MDXComponents/A';

// Name image-only links (e.g. video thumbnails) after the image alt text.
export default function MDXA(props) {
  const child = React.Children.count(props.children) === 1 ? props.children : null;
  const alt = child && child.props && child.props.alt;
  return <A {...(alt && !props['aria-label'] ? {'aria-label': alt} : {})} {...props} />;
}
