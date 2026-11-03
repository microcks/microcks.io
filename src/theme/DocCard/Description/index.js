import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import styles from './styles.module.css';
export default function DocCardDescription({description}) {
  return (
    <p
      className={clsx(
                ThemeClassNames.docs.docCard.description,
        styles.cardDescription,
      )}
      title={description}>
      {description}
    </p>
  );
}
