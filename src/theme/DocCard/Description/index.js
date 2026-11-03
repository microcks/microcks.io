import React from 'react';
import Description from '@theme-original/DocCard/Description';

const MAX_CHILDREN = 6;

export default function DescriptionWrapper(props) {
  const {item} = props;
  const tags = item?.customProps?.tags ?? [];
  const children = item?.type === 'category' ? item.items : [];
  return (
    <>
      <Description {...props} />
      {children.length > 0 && (
        <ul className="mk-card-children">
          {children.slice(0, MAX_CHILDREN).map((child) => (
            <li key={child.label}>{child.label}</li>
          ))}
          {children.length > MAX_CHILDREN && (
            <li>+ {children.length - MAX_CHILDREN} more…</li>
          )}
        </ul>
      )}
      {tags.length > 0 && (
        <div className="mk-card-tags">
          {tags.map((t) => (
            <span key={t} className="mk-card-tag">
              {t}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
