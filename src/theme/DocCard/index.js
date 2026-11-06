import React from 'react';
import DocCard from '@theme-original/DocCard';
import {
  useActiveDocContext,
  useDocById,
} from '@docusaurus/plugin-content-docs/client';

// Categories linked to an index doc don't expose its description: look it up by permalink
function useLinkedDocDescription(item) {
  const needsLookup = item.type === 'category' && !item.description && item.href;
  const {activeVersion} = useActiveDocContext(undefined);
  const linkedDoc = needsLookup
    ? activeVersion?.docs.find((d) => d.path === item.href)
    : undefined;
  return useDocById(linkedDoc?.id)?.description;
}

export default function DocCardWrapper(props) {
  const {item} = props;
  const description = useLinkedDocDescription(item);
  return (
    <DocCard
      {...props}
      item={description ? {...item, description} : item}
    />
  );
}
