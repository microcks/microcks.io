import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import styles from './styles.module.css';
export default function DocCardHeadingText({title}) {
  return (
    <span
      className={clsx(

        ThemeClassNames.docs.docCard.title,
        styles.cardTitleText,
      )}>
      {title}
    </span>
  );
}
