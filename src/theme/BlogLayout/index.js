import React from 'react';
import BlogLayout from '@theme-original/BlogLayout';

// Swizzled (wrapper): blog posts have no table of contents, like the former Hugo site.
export default function BlogLayoutWrapper({toc, ...props}) {
  return <BlogLayout {...props} />;
}
