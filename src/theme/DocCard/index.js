import React from 'react';
import {
  useDocById,
  useActiveDocContext,
  findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import {
  extractLeadingEmoji,
  useDocCardDescriptionCategoryItemsPlural,
} from '@docusaurus/theme-common/internal';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Layout from '@theme/DocCard/Layout';
function getFallbackEmojiIcon(item) {
  if (item.type === 'category') {
    return '🗃';
  }
  return isInternalUrl(item.href) ? '📄️' : '🔗';
}
function getIconTitleProps(item) {
  const extracted = extractLeadingEmoji(item.label);
  const emoji = extracted.emoji ?? getFallbackEmojiIcon(item);
  return {
    icon: emoji,
    title: extracted.rest.trim(),
  };
}
// Categories linked to an index doc don't expose its description: look it up by permalink
function useCategoryLinkedDocDescription(item) {
  const {activeVersion} = useActiveDocContext(undefined);
  const linkedDoc = item.href
    ? activeVersion?.docs.find((d) => d.path === item.href)
    : undefined;
  return useDocById(linkedDoc?.id)?.description;
}
function CardCategory({item}) {
  const linkedDocDescription = useCategoryLinkedDocDescription(item);
  const href = findFirstSidebarItemLink(item);
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }
  return (
    <Layout
      item={item}
      className={item.className}
      href={href}
      description={item.description ?? linkedDocDescription}
      {...getIconTitleProps(item)}>
      <ul className="mk-card-children">
        {item.items.slice(0, 6).map((child) => (
          <li key={child.label}>{child.label}</li>
        ))}
        {item.items.length > 6 && <li>+ {item.items.length - 6} more…</li>}
      </ul>
    </Layout>
  );
}
function CardLink({item}) {
  const doc = useDocById(item.docId ?? undefined);
  return (
    <Layout
      item={item}
      className={item.className}
      href={item.href}
      description={item.description ?? doc?.description}
      {...getIconTitleProps(item)}
    />
  );
}
export default function DocCard({item}) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
