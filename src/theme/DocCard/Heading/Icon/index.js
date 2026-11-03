import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import styles from './styles.module.css';
export default function DocCardHeadingIcon({icon}) {
  return (
    <span
      className={clsx(ThemeClassNames.docs.docCard.icon, styles.cardTitleIcon)}>
      {icon}
    </span>
  );
}
