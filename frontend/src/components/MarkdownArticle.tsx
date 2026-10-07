import type { ReactNode } from 'react';

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g;
  let cursor = 0; let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index));
    parts.push(<a href={match[2]} target="_blank" rel="noreferrer" key={`${match.index}-${match[2]}`}>{match[1]}</a>);
    cursor = pattern.lastIndex;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

/** Small safe Markdown subset: headings, paragraphs, lists and HTTPS links; no raw HTML. */
export function MarkdownArticle({ markdown }: { markdown: string }) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const nodes: ReactNode[] = []; let list: string[] = [];
  const flush = () => { if (list.length) { nodes.push(<ul key={`ul-${nodes.length}`}>{list.map((x,i)=><li key={i}>{inline(x)}</li>)}</ul>); list=[]; } };
  lines.forEach((line, index) => {
    const value = line.trim();
    if (!value) { flush(); return; }
    if (value.startsWith('- ')) { list.push(value.slice(2)); return; }
    flush();
    if (value.startsWith('### ')) nodes.push(<h3 key={index}>{inline(value.slice(4))}</h3>);
    else if (value.startsWith('## ')) nodes.push(<h2 key={index}>{inline(value.slice(3))}</h2>);
    else if (value.startsWith('# ')) nodes.push(<h1 key={index}>{inline(value.slice(2))}</h1>);
    else nodes.push(<p key={index}>{inline(value)}</p>);
  });
  flush();
  return <div className="v16-markdown">{nodes}</div>;
}
