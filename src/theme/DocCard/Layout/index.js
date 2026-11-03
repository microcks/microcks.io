import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {ThemeClassNames} from '@docusaurus/theme-common';
import Heading from '@theme/DocCard/Heading';
import Description from '@theme/DocCard/Description';
import styles from './styles.module.css';
function Container({className, href, children}) {
  return (
    <Link
      href={href}
      className={clsx(
        'card padding--lg',
        ThemeClassNames.docs.docCard.container,
        styles.cardContainer,
        className,
      )}>
      {children}
    </Link>
  );
}
export default function DocCardLayout({
  item,
  className,
  href,
  icon,
  title,
  description,
  children,
}) {
  return (
    <Container href={href} className={className}>
      <Heading item={item} icon={icon} title={title} />
      {description && <Description item={item} description={description} />}
      {children}
      {item.customProps?.tags?.length > 0 && (
        <div className="mk-card-tags">
          {item.customProps.tags.map((t) => (
            <span key={t} className="mk-card-tag">{t}</span>
          ))}
        </div>
      )}
    </Container>
  );
}
