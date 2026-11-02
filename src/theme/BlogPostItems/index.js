import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {BlogPostProvider} from '@docusaurus/plugin-content-blog/client';
import styles from './styles.module.css';

const dateFmt = new Intl.DateTimeFormat('en', {year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'});

function Authors({authors}) {
  const {withBaseUrl} = useBaseUrlUtils();
  return (
    <ul className={styles.authors}>
      {authors.map(a => (
        <li key={a.key ?? a.name}>
          {a.imageURL && <img src={withBaseUrl(a.imageURL)} alt="" width="28" height="28" loading="lazy" />}
          <span>{a.name}</span>
        </li>
      ))}
    </ul>
  );
}

function Card({post, featured}) {
  const {withBaseUrl} = useBaseUrlUtils();
  const {metadata, frontMatter} = post;
  const image = frontMatter.image;
  return (
    <article className={clsx(styles.card, featured && styles.featured)}>
      {image && (
        <Link to={metadata.permalink} className={styles.thumb} tabIndex={-1} aria-hidden="true">
          <img src={withBaseUrl(image)} alt="" loading={featured ? 'eager' : 'lazy'} />
        </Link>
      )}
      <div className={styles.body}>
        <div className={styles.meta}>
          <Authors authors={metadata.authors} />
          <time dateTime={metadata.date}>{dateFmt.format(new Date(metadata.date))}</time>
        </div>
        <h2>
          <Link to={metadata.permalink}>{metadata.title}</Link>
        </h2>
        <p>{metadata.description}</p>
        <Link className={clsx('button button--primary', !featured && 'button--sm')} to={metadata.permalink}>
          Read More<span className="sr-only"> about {metadata.title}</span>
        </Link>
      </div>
    </article>
  );
}

export default function BlogPostItems({items}) {
  const {pathname} = useLocation();
  const isIndex = /^\/blog\/?$/.test(pathname);
  // Featured card = newest post tagged `featured` (like the former Hugo `type: featured`); falls back to the newest post
  const isFeatured = ({content}) => content.metadata.tags.some(t => t.label.toLowerCase() === 'featured');
  const featuredIdx = Math.max(items.findIndex(isFeatured), 0);
  const first = items[featuredIdx];
  const cards = isIndex ? items.filter((_, i) => i !== featuredIdx) : items;
  return (
    <>
      {isIndex && (
        <header className={styles.header}>
          <h1>Latest News</h1>
          <p>Microcks 📣 latest <strong>blog posts</strong> and <strong>updates</strong> from our vibrant <strong>community</strong></p>
        </header>
      )}
      {isIndex && first && (
        <BlogPostProvider content={first.content} isBlogPostPage={false}>
          <Card post={first.content} featured />
        </BlogPostProvider>
      )}
      <div className={styles.grid}>
        {cards.map(({content}) => (
          <BlogPostProvider key={content.metadata.permalink} content={content} isBlogPostPage={false}>
            <Card post={content} />
          </BlogPostProvider>
        ))}
      </div>
    </>
  );
}
