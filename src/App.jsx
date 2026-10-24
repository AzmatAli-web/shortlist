import { useEffect, useMemo, useRef, useState } from 'react';

const { tools: TOOLS, categories: CATS } = window.SL;
const PRICE_LABEL = { free: 'Free', freemium: 'Free plan', paid: 'Paid', oss: 'Open source' };
const PLATFORM_LABEL = { web: 'Web', desktop: 'Desktop', mobile: 'Mobile', api: 'API' };
const ADJACENT = {
  write: ['work', 'auto'], design: ['video', 'code'], code: ['data', 'auto'],
  video: ['design', 'audio'], audio: ['video', 'work'], work: ['write', 'auto'],
  auto: ['data', 'work'], data: ['auto', 'code'],
};
const QUESTIONS = [
  { key: 'job', title: 'What are you trying to get done?', hint: 'Pick the job, not the tool category.', options: [
    ['write', 'Write and research', 'Drafting, reading, searching, checking a claim'],
    ['design', 'Make something visual', 'Images, interfaces, a site that ships'],
    ['code', 'Build or review software', 'Editors, agents, prototypes'],
    ['media', 'Make video or audio', 'Shots, cuts, voice, music'],
    ['ops', 'Run the operation', 'Meetings, notes, email, internal flows'],
    ['data', 'Answer a data question', 'Analysis, charts, dashboards'],
  ] },
  { key: 'budget', title: 'What can you spend?', hint: 'A usable free tier counts as free.', options: [
    ['free', 'Free plan, please', 'No card, no trial clock'],
    ['paid', 'Paid is fine', 'A tool that pays for itself'],
    ['open', 'Prefer open source', 'Self-hosted or forkable'],
  ] },
  { key: 'where', title: 'Where do you work?', hint: 'We favour tools that run there natively.', options: [
    ['web', 'In the browser', 'Nothing to install'],
    ['desktop', 'On the desktop', 'Mac, Windows or Linux'],
    ['mobile', 'On my phone', 'Between other things'],
  ] },
];
const JOB_CATS = { write: ['write'], design: ['design'], code: ['code'], media: ['video', 'audio'], ops: ['work', 'auto'], data: ['data'] };
const JOB_PHRASE = { write: 'writing and research', design: 'visual work', code: 'shipping code', media: 'video and audio', ops: 'running the operation', data: 'data questions' };

function icon(name, className = 'ic') {
  return <svg className={className} aria-hidden="true"><use href={`#i-${name}`} /></svg>;
}

function parseRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const [path, query = ''] = hash.split('?');
  return { path, params: new URLSearchParams(query) };
}

function routeHref(path, params) {
  const query = params instanceof URLSearchParams ? params.toString() : new URLSearchParams(params || {}).toString();
  return `#${path}${query ? `?${query}` : ''}`;
}

function getTool(id) {
  return TOOLS.find((tool) => tool.id === id);
}

function getCategory(id) {
  return CATS.find((category) => category.s === id) || CATS[0];
}

function useSaved() {
  const [saved, setSaved] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('shortlist.saved.v1') || '[]');
      return new Set(Array.isArray(parsed) ? parsed.filter((id) => getTool(id)) : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      const value = JSON.stringify([...saved]);
      if (localStorage.getItem('shortlist.saved.v1') !== value) localStorage.setItem('shortlist.saved.v1', value);
    } catch { /* Storage can be unavailable. */ }
  }, [saved]);

  useEffect(() => {
    function sync(event) {
      if (event.key !== 'shortlist.saved.v1') return;
      try {
        const parsed = JSON.parse(event.newValue || '[]');
        setSaved(new Set(Array.isArray(parsed) ? parsed.filter((id) => getTool(id)) : []));
      } catch { setSaved(new Set()); }
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  function toggle(id) {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return [saved, toggle, setSaved];
}

function SaveButton({ tool, saved, onToggle, variant = '' }) {
  const active = saved.has(tool.id);
  const classes = variant ? `${variant} ${active ? 'btn-saved' : 'btn-line'}` : 'save';
  return (
    <button className={classes} type="button" aria-pressed={active}
      aria-label={`${active ? 'Remove' : 'Save'} ${tool.n}${active ? ' from' : ' to'} your shortlist`}
      onClick={() => onToggle(tool.id)}>
      {icon('star')}{variant && <span>{active ? 'Saved' : 'Save to shortlist'}</span>}
    </button>
  );
}

function Plate({ tool, size = '' }) {
  return <span className={`plate${size ? ` ${size}` : ''}`} aria-hidden="true">{tool.ab}</span>;
}

function Price({ tool }) {
  const cls = tool.p === 'oss' ? 'price-oss' : tool.p === 'paid' ? 'price-paid' : 'price-free';
  return <span className={`price ${cls}`}>{PRICE_LABEL[tool.p] || tool.p}</span>;
}

function ToolLink({ tool, children, className }) {
  return <a className={className} href={routeHref(`/tools/${tool.id}`)}>{children}</a>;
}

function Header({ route, saved, theme, onTheme, onToast }) {
  const [query, setQuery] = useState('');
  const navItems = [['/browse', 'Directory'], ['/recommend', 'Find three'], ['/favorites', 'Your shortlist']];
  function search(event) {
    event.preventDefault();
    window.location.hash = routeHref('/browse', query.trim() ? { q: query.trim() } : {});
  }
  useEffect(() => {
    function shortcut(event) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      const input = document.querySelector('.hsearch input');
      if (input && input.offsetParent !== null) { event.preventDefault(); input.focus(); input.select(); }
    }
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, []);
  return <>
    <header className="topbar"><div className="topbar-in">
      <a className="brand" href="#/" aria-label="Shortlist home">
        <svg className="brand-mark" viewBox="0 0 22 22" aria-hidden="true"><rect x="1" y="3" width="20" height="4.2" rx="1"/><rect x="1" y="9.6" width="14.6" height="2.3" rx="1"/><rect x="1" y="14" width="10" height="2.3" rx="1"/></svg>
        <span className="brand-name">Shortlist</span><span className="brand-count">{TOOLS.length}</span>
      </a>
      <nav className="nav" aria-label="Primary">{navItems.map(([path, label]) => <a key={path} href={routeHref(path)} aria-current={route.path === path || (path === '/browse' && route.path.startsWith('/tools/')) ? 'page' : undefined}>{label}</a>)}</nav>
      <form className="hsearch" role="search" onSubmit={search}>
        {icon('search', 'ic ic-sm')}<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${TOOLS.length} tools`} aria-label="Search the directory" autoComplete="off" /> <kbd aria-hidden="true">/</kbd>
      </form>
      <div className="top-actions">
        <a className="save-pill" href={routeHref('/favorites')} data-on={saved.size > 0 ? 'true' : 'false'} aria-label={`Your shortlist, ${saved.size} tools saved`}>
          {icon('star')}<span className="n">{saved.size}</span>
        </a>
        <button className="icon-btn" type="button" onClick={onTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          {icon('moon', 'ic theme-moon')}{icon('sun', 'ic theme-sun')}
        </button>
        <a className="btn btn-ink" href={routeHref('/recommend')}>Find three</a>
      </div>
    </div></header>
    <div className="mobilebar"><div className="mobilebar-in">{navItems.map(([path, label]) => <a key={path} href={routeHref(path)} aria-current={route.path === path ? 'page' : undefined}>{label}{path === '/favorites' && <span className="n">{saved.size}</span>}</a>)}</div></div>
  </>;
}

function Footer() {
  return <footer className="foot"><div className="foot-in">
    <div><div className="foot-brand">Shortlist <span className="brand-count">{TOOLS.length}</span></div><p>Forty AI tools that survived a week of real work. Filed by the job, edited by hand, no paid placements.</p></div>
    <nav className="foot-nav" aria-label="Footer"><a href={routeHref('/browse')}>Directory</a><a href={routeHref('/recommend')}>Find three</a><a href={routeHref('/favorites')}>Your shortlist</a></nav>
    <div className="foot-meta"><span>&copy; {new Date().getFullYear()} Shortlist</span><span>Saved tools live in this browser</span></div>
  </div></footer>;
}

function ToolRow({ tool, index, saved, onToggle }) {
  return <article className="trow">
    <span className="idx" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    <ToolLink tool={tool}><Plate tool={tool} /></ToolLink>
    <div><div className="nm"><ToolLink tool={tool}>{tool.n}</ToolLink></div><div className="tg">{tool.t}</div></div>
    <span className="cat">{getCategory(tool.c).code}</span><Price tool={tool} /><SaveButton tool={tool} saved={saved} onToggle={onToggle} />
  </article>;
}

function PickRow({ tool, saved, onToggle }) {
  return <div className="pick-row">
    <ToolLink tool={tool}><Plate tool={tool} /></ToolLink>
    <div><div className="nm"><ToolLink tool={tool}>{tool.n}</ToolLink></div><div className="tg">{tool.t}</div></div>
    <SaveButton tool={tool} saved={saved} onToggle={onToggle} />
  </div>;
}

function SectionHead({ eyebrow, title, note }) {
  return <div className="sec-head"><div><p className="kicker eyebrow">{eyebrow}</p><h2>{title}</h2></div><p className="sec-meta">{note}</p></div>;
}

function Home({ saved, onToggle }) {
  const featured = TOOLS.filter((tool) => tool.pick).slice(0, 6);
  const recent = [...TOOLS].filter((tool) => tool.added).sort((a, b) => a.newRank - b.newRank).slice(0, 4);
  const quick = ['meeting notes', 'code review', 'voiceover', 'dashboards'];
  return <>
    <section className="hero"><div className="wrap"><div className="hero-grid"><div>
      <p className="hero-kicker eyebrow">40 tools · 8 jobs · edited by hand</p><h1>AI tools worth <span className="mark">keeping</span>.</h1>
      <p className="lede">Forty tools that survived a week of real work, filed by the job they do well. <b>No launch-day hype, no paid placements.</b></p>
      <form className="searchbar" role="search" onSubmit={(event) => { event.preventDefault(); const value = new FormData(event.currentTarget).get('q'); window.location.hash = routeHref('/browse', value ? { q: value } : {}); }}>
        {icon('search')}<input name="q" type="search" placeholder="Search all 40 tools" aria-label="Search tools by name, job or keyword" autoComplete="off"/><span className="go" aria-hidden="true">Enter</span>
      </form>
      <div className="quick"><span>Try</span>{quick.map((item) => <a key={item} href={routeHref('/browse', { q: item })}>{item}</a>)}</div>
    </div>
    <PickCard tool={getTool('claude')} />
    </div></div></section>
    <section className="sec"><div className="wrap"><SectionHead eyebrow="Editor's picks" title="Six that earn the tab." note={<>Chosen after<br/>a week of use</>} />
      <div className="picks"><article className="feature"><p className="cat">Code &amp; build</p><h3><ToolLink tool={getTool('cursor')}>Cursor</ToolLink></h3><p className="tagline">An editor built around the model, not bolted onto it.</p><blockquote>Six months in, it is still the first app I open.</blockquote><ToolLink className="go" tool={getTool('cursor')}>Open the entry {icon('arrow', 'ic ic-sm')}</ToolLink></article>
        <div className="pick-list">{featured.filter((tool) => tool.id !== 'cursor').slice(0, 5).map((tool) => <PickRow key={tool.id} tool={tool} saved={saved} onToggle={onToggle} />)}</div>
      </div>
    </div></section>
    <section className="sec"><div className="wrap"><SectionHead eyebrow="Browse" title="Eight jobs, five tools each." note={<>Start with the work,<br/>not the model</>} />
      <div className="cat-grid">{CATS.map((category) => {
        const inCategory = TOOLS.filter((tool) => tool.c === category.s);
        return <a className="cat-card" href={routeHref('/browse', { cat: category.s })} key={category.s} aria-label={`Browse ${category.n}: ${inCategory.length} tools`}>
          <span className="cat-card-top"><span className="code">{category.code}</span><span className="count">{String(inCategory.length).padStart(2, '0')} tools</span></span>
          <h3>{category.n}</h3><p>{category.d}</p><span className="names">{inCategory.slice(0, 3).map((tool) => tool.n).join(' · ')}</span>{icon('arrow', 'ic arrow')}
        </a>;
      })}</div>
    </div></section>
    <section className="sec"><div className="wrap"><SectionHead eyebrow="Recently added" title="New to the list." note={<>Tested before<br/>it went in</>} />
      <div className="recent">{recent.map((tool) => <ToolLink className="recent-row" tool={tool} key={tool.id}><span className="date">{tool.added}</span><Plate tool={tool}/><span className="body"><span className="nm">{tool.n}</span><span className="ex">{tool.t}</span></span><span className="code">{getCategory(tool.c).code}</span></ToolLink>)}</div>
    </div></section>
    <section className="sec"><div className="wrap"><SectionHead eyebrow="Method" title="How a tool gets on the list." note={<>Forty in,<br/>everything else out</>} />
      <div className="method"><MethodItem no="01" title="A week inside the work">Every entry is used on a real project first: a live repo, a client deck, a dataset that matters. If it only looks good in a demo, it does not get in.</MethodItem><MethodItem no="02" title="One tool, one job">Each entry answers a specific question: what is this actually good at, and what should you watch? Five tools per category, no padding.</MethodItem><MethodItem no="03" title="No paid placements">Nobody buys a spot, a badge or a better position. The only thing that moves a tool up is that it earned the tab.</MethodItem></div>
    </div></section>
    <section className="sec"><div className="wrap"><div className="band"><div><p className="eyebrow">Not sure where to start</p><h2>Three questions. Three tools.</h2><p>Tell us the job, the budget and where you work. We score all forty entries and return three with the reasons attached — no scrolling, no sponsored picks.</p></div><a className="btn" href={routeHref('/recommend')}>Find three tools {icon('arrow', 'ic ic-sm')}</a></div></div></section>
  </>;
}

function PickCard({ tool }) {
  if (!tool) return null;
  return <aside className="pick-card" aria-label="The pick"><div className="pick-head"><span>The pick</span><span>{getCategory(tool.c).code} / {PRICE_LABEL[tool.p]}</span></div>
    <div className="pick-body"><div className="pick-top"><Plate tool={tool} size="plate-lg"/><div><h2><ToolLink tool={tool}>{tool.n}</ToolLink></h2><div className="eyebrow">{getCategory(tool.c).n}</div></div></div>
      <p className="pick-note">{tool.note}</p><div className="pick-foot"><span className="quote">{tool.pickNote}</span><ToolLink tool={tool}>Read the entry {icon('arrow', 'ic ic-sm')}</ToolLink></div>
    </div>
  </aside>;
}

function MethodItem({ no, title, children }) {
  return <div className="method-item"><p className="no">{no}</p><h3>{title}</h3><p>{children}</p></div>;
}

function Browse({ route, saved, onToggle }) {
  const initial = route.params;
  const [filters, setFilters] = useState(() => ({ q: initial.get('q') || '', cat: initial.get('cat') || 'all', price: initial.get('price') || 'all', where: initial.get('where') || 'all', sort: initial.get('sort') || 'pick', picks: initial.get('picks') === '1' }));
  useEffect(() => {
    setFilters({ q: route.params.get('q') || '', cat: route.params.get('cat') || 'all', price: route.params.get('price') || 'all', where: route.params.get('where') || 'all', sort: route.params.get('sort') || 'pick', picks: route.params.get('picks') === '1' });
  }, [route.params.toString()]);
  const category = filters.cat === 'all' ? null : getCategory(filters.cat);
  const results = useMemo(() => {
    const words = filters.q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const list = TOOLS.filter((tool) => {
      if (filters.cat !== 'all' && tool.c !== filters.cat) return false;
      if (filters.price === 'free' && !['free', 'freemium', 'oss'].includes(tool.p)) return false;
      if (!['all', 'free'].includes(filters.price) && tool.p !== filters.price) return false;
      if (filters.where !== 'all' && !tool.pl.includes(filters.where)) return false;
      if (filters.picks && !tool.pick) return false;
      const category = getCategory(tool.c);
      const text = `${tool.n} ${tool.t} ${tool.tags || ''} ${category.n} ${category.d} ${(tool.good || []).join(' ')}`.toLowerCase();
      return words.every((word) => text.includes(word));
    });
    if (filters.sort === 'az') list.sort((a, b) => a.n.localeCompare(b.n));
    else if (filters.sort === 'new') list.sort((a, b) => (a.newRank < 0 ? 99 : a.newRank ?? 99) - (b.newRank < 0 ? 99 : b.newRank ?? 99) || a.n.localeCompare(b.n));
    else list.sort((a, b) => Number(Boolean(b.pick)) - Number(Boolean(a.pick)) || CATS.findIndex((c) => c.s === a.c) - CATS.findIndex((c) => c.s === b.c) || a.n.localeCompare(b.n));
    return list;
  }, [filters]);
  function update(key, value) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([name, val]) => {
      if (name === 'picks') { if (val) params.set(name, '1'); }
      else if (val && val !== 'all' && val !== 'pick') params.set(name, val);
    });
    window.history.replaceState(null, '', routeHref('/browse', params));
  }
  function reset() {
    const next = { q: '', cat: 'all', price: 'all', where: 'all', sort: 'pick', picks: false };
    setFilters(next);
    window.history.replaceState(null, '', routeHref('/browse'));
  }
  const isDirty = filters.q || filters.cat !== 'all' || filters.price !== 'all' || filters.where !== 'all' || filters.sort !== 'pick' || filters.picks;
  return <div className="wrap browse"><div className="page-head"><div className="page-head-row"><div><h1>{category?.n || 'All tools'}</h1><p className="sub">{category?.d || 'Every tool on the list, with the job it is actually good at. Filter by what you can spend and where you work.'}</p></div><p className="page-count">{results.length} of {TOOLS.length}<br/>Index / edited by hand</p></div></div>
    <div className="browse-layout"><aside className="rail" aria-label="Browse by job"><div><p className="rail-h">Directory</p><a className="rail-link" href={routeHref('/browse')} aria-current={filters.cat === 'all'}>All tools<span className="n">{TOOLS.length}</span></a>{CATS.map((cat) => <a className="rail-link" key={cat.s} href={routeHref('/browse', { cat: cat.s })} aria-current={filters.cat === cat.s}>{cat.n}<span className="n">05</span></a>)}</div><div><p className="rail-h">Elsewhere</p><a className="rail-link" href={routeHref('/recommend')}>Find three tools<span className="n">3 Qs</span></a><a className="rail-link" href={routeHref('/favorites')}>Your shortlist<span className="n">{saved.size}</span></a></div><p className="rail-note">Forty tools, edited by hand. No paid placements, no scraped launch lists.</p></aside>
      <div><div className="filter-search">{icon('search', 'ic ic-sm')}<input type="search" value={filters.q} onChange={(event) => update('q', event.target.value)} placeholder="Search by name, job or keyword" aria-label="Search tools" autoComplete="off"/>{filters.q && <button className="clear" type="button" onClick={() => update('q', '')} aria-label="Clear search">{icon('x', 'ic ic-sm')}</button>}</div>
        <div className="filters"><div className="filter-row">{[['all', 'All'], ...CATS.map((cat) => [cat.s, cat.code])].map(([value, label]) => <button key={value} className="chip" type="button" aria-pressed={filters.cat === value} onClick={() => update('cat', value)}>{label}{value === 'all' && <span className="n">{TOOLS.length}</span>}</button>)}</div>
          <div className="filter-row">{[['all', 'Any price'], ['free', 'Free plan'], ['paid', 'Paid'], ['oss', 'Open source']].map(([value, label]) => <button key={value} className="chip" type="button" aria-pressed={filters.price === value} onClick={() => update('price', value)}>{label}</button>)}
            <span className="sel"><select aria-label="Where it runs" value={filters.where} onChange={(event) => update('where', event.target.value)}><option value="all">Any platform</option>{Object.entries(PLATFORM_LABEL).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>{icon('chev')}</span>
            <span className="sel"><select aria-label="Sort tools" value={filters.sort} onChange={(event) => update('sort', event.target.value)}><option value="pick">Editor's order</option><option value="az">A to Z</option><option value="new">Newest first</option></select>{icon('chev')}</span>
            <button className="chip" type="button" aria-pressed={filters.picks} onClick={() => update('picks', !filters.picks)}>{icon('star')} Picks</button>{isDirty && <button className="reset" type="button" onClick={reset}>Reset</button>}
          </div>
        </div>
        <div className="resbar"><span>{category?.n || 'The whole index'}</span><span>No paid placements</span></div>
        <div className="results" aria-live="polite">{results.length ? results.map((tool, index) => <ToolRow key={tool.id} tool={tool} index={index} saved={saved} onToggle={onToggle}/>) : <div className="empty"><h2>Nothing here yet.</h2><p>No tool matches those filters. Clear a filter or try another search.</p><button className="btn btn-ink" type="button" onClick={reset}>Clear filters</button></div>}</div>
      </div>
    </div>
  </div>;
}

function ToolDetail({ id, saved, onToggle }) {
  const tool = getTool(id);
  if (!tool) return <NotFound/>;
  const category = getCategory(tool.c);
  const related = TOOLS.filter((item) => item.c === tool.c && item.id !== tool.id).slice(0, 3);
  return <div className="wrap tool"><nav className="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span className="sep">/</span><a href={routeHref('/browse')}>Directory</a><span className="sep">/</span><a href={routeHref('/browse', { cat: category.s })}>{category.n}</a><span className="sep">/</span><span>{tool.n}</span></nav>
    <div className="tool-hero"><Plate tool={tool} size="plate-xl"/><div className="tool-title"><p className="cat"><a href={routeHref('/browse', { cat: category.s })}>{category.n}</a></p><h1>{tool.n}</h1><p className="tagline">{tool.t}</p><div className="metarow"><Price tool={tool}/>{tool.pl.map((platform) => <span className="plat" key={platform}>{PLATFORM_LABEL[platform]}</span>)}{tool.pick && <span className="reason reason-hot">Editor's pick</span>}</div></div>
      <div className="tool-acts"><SaveButton tool={tool} saved={saved} onToggle={onToggle} variant="btn"/><a className="btn btn-ink" href={tool.url} target="_blank" rel="noopener noreferrer">Visit site {icon('up', 'ic ic-sm')}</a></div>
    </div>
    <div className="tool-body"><div className="prose"><h2>Why it is here</h2><p className="lede">{tool.note}</p><h2>Good at</h2><ul className="goodlist">{(tool.good || []).map((item) => <li key={item}>{icon('check')}<span>{item}</span></li>)}</ul><h2>Watch out</h2><div className="callout"><b>Before you commit</b><span>{tool.watch}</span></div></div>
      <aside className="aside" aria-label="Tool details"><div className="card"><h2>At a glance</h2><dl><div className="kv"><dt>Price</dt><dd>{PRICE_LABEL[tool.p]}</dd></div><div className="kv"><dt>Runs on</dt><dd>{tool.pl.map((platform) => PLATFORM_LABEL[platform]).join(', ')}</dd></div><div className="kv"><dt>Category</dt><dd>{category.n}</dd></div><div className="kv"><dt>Tags</dt><dd>{tool.tags}</dd></div></dl></div>
        <div className="card"><h2>If {tool.n} is not it</h2><div className="alt">{related.map((item) => <ToolLink className="alt-link" tool={item} key={item.id}><Plate tool={item} size="plate-sm"/><span><span className="nm">{item.n}</span><span className="tg">{item.t}</span></span>{icon('arrow', 'ic ic-sm')}</ToolLink>)}</div></div>
        <div className="card"><h2>More in {category.n}</h2><a className="btn btn-line" href={routeHref('/browse', { cat: category.s })}>Five tools for this job {icon('arrow', 'ic ic-sm')}</a><p className="aside-note">Every tool is scored against the job, not the launch date.</p></div>
      </aside>
    </div>
  </div>;
}

function Favorites({ saved, onToggle, setSaved, onToast }) {
  const [armed, setArmed] = useState(false);
  const [copyText, setCopyText] = useState('');
  const dialogRef = useRef(null);
  const items = TOOLS.filter((tool) => saved.has(tool.id));
  const groups = CATS.map((category) => ({ category, items: items.filter((tool) => tool.c === category.s) })).filter((group) => group.items.length);
  const suggestions = items.length ? TOOLS.filter((tool) => !saved.has(tool.id) && items.some((item) => item.c === tool.c || ADJACENT[item.c]?.includes(tool.c))).slice(0, 3) : TOOLS.filter((tool) => tool.pick).slice(0, 3);
  useEffect(() => { if (copyText && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal(); }, [copyText]);
  useEffect(() => { if (!armed) return undefined; const timer = setTimeout(() => setArmed(false), 5000); return () => clearTimeout(timer); }, [armed]);
  async function copyList() {
    const lines = [`My AI shortlist (${items.length} ${items.length === 1 ? 'tool' : 'tools'})`, ''];
    groups.forEach(({ category, items: group }) => { lines.push(category.n.toUpperCase()); group.forEach((tool) => lines.push(`- ${tool.n}: ${tool.t}`)); lines.push(''); });
    const text = lines.join('\n').trim();
    try { await navigator.clipboard.writeText(text); onToast('Shortlist copied to clipboard'); }
    catch { setCopyText(text); }
  }
  return <div className="wrap"><div className="page-head"><div className="page-head-row"><div><h1>Your shortlist.</h1><p className="sub">Tools you kept, saved in this browser. No account, no sync — and nothing leaves your machine.</p><p className="eyebrow" style={{ marginTop: 14 }}>{items.length} {items.length === 1 ? 'tool' : 'tools'} saved</p></div>
    {items.length > 0 && <div className="saved-actions"><button className="btn btn-line" type="button" onClick={copyList}>{icon('copy', 'ic ic-sm')}Copy list</button><button className="btn btn-line" type="button" aria-label={armed ? 'Confirm clearing your shortlist' : 'Clear your shortlist'} onClick={() => { if (armed) { setSaved(new Set()); setArmed(false); onToast('Shortlist cleared'); } else setArmed(true); }}>{armed ? 'Click again to confirm' : 'Clear all'}</button></div>}</div></div>
    <div className="saved-wrap"><div>{items.length === 0 ? <div className="empty"><h2>Nothing saved yet.</h2><p>Tap the star beside any tool to keep it here. Saved tools stay in this browser — no account, no sync, nothing leaves your machine.</p><div className="acts"><a className="btn btn-ink" href={routeHref('/browse')}>Browse the directory</a><a className="btn btn-line" href={routeHref('/recommend')}>Find three tools</a></div></div> : <>{groups.map(({ category, items: group }) => <section className="saved-group" key={category.s}><h2>{category.n}<span className="n">{String(group.length).padStart(2, '0')}</span></h2>{group.map((tool) => <div className="saved-row" key={tool.id}><Plate tool={tool}/><div><div className="nm"><ToolLink tool={tool}>{tool.n}</ToolLink></div><div className="tg">{tool.t}</div></div><SaveButton tool={tool} saved={saved} onToggle={onToggle}/></div>)}</section>)}<div className="saved-more"><p>{items.length} {items.length === 1 ? 'tool' : 'tools'} kept in this browser.</p><a className="link-btn" href={routeHref('/browse')}>Add more from the directory</a><a className="link-btn" href={routeHref('/recommend')}>Find three tools</a></div></>}</div>
      <aside className="aside">{suggestions.length > 0 && <div className="card"><h2>{items.length ? 'Picked for you' : 'Start here'}</h2><div className="rec-list">{suggestions.map((tool) => <div className="rec" key={tool.id}><div className="why">{items.some((item) => item.c === tool.c) ? `More in ${getCategory(tool.c).n}` : "Editor's pick"}</div><div className="row"><div><div className="nm"><ToolLink tool={tool}>{tool.n}</ToolLink></div><div className="tg">{tool.t}</div></div><SaveButton tool={tool} saved={saved} onToggle={onToggle}/></div></div>)}</div></div>}<div className="card"><h2>How saving works</h2><p className="aside-note">Your shortlist is stored in this browser using local storage. Clearing site data will clear it. Copy list gives you plain text you can paste into a note or an email.</p></div></aside>
    </div>
    <dialog className="dialog" ref={dialogRef} aria-labelledby="copyTitle" onClose={() => setCopyText('')}><form method="dialog" className="dialog-head"><h2 id="copyTitle">Copy your shortlist</h2><button className="icon-btn" value="close" aria-label="Close">{icon('x')}</button></form><p>Automatic copy was blocked by the browser. The list is selected below — press Ctrl+C (or Cmd+C), then close this panel.</p><textarea readOnly value={copyText} onFocus={(event) => event.target.select()} aria-label="Your shortlist as plain text"/></dialog>
  </div>;
}

function scoreRecommendations(answers) {
  const categories = JOB_CATS[answers.job] || [];
  const scored = TOOLS.filter((tool) => categories.includes(tool.c)).map((tool) => {
    let score = tool.pick ? 1.5 : 0;
    const why = [];
    if (answers.budget === 'free' && ['free', 'freemium', 'oss'].includes(tool.p)) { score += 3; why.push('Has a free plan'); }
    else if (answers.budget === 'paid') { if (tool.p === 'paid') { score += 3; why.push('Built for paying teams'); } else score += 1.2; }
    else if (answers.budget === 'open') { if (tool.p === 'oss') { score += 4; why.push('Open source'); } else score += 0.4; }
    if (tool.pl.includes(answers.where)) { score += 2; why.push(`Runs ${answers.where === 'web' ? 'in the browser' : answers.where === 'desktop' ? 'on the desktop' : 'on mobile'}`); }
    if (tool.pick) why.push("Editor's pick");
    return { tool, score, why };
  }).sort((a, b) => b.score - a.score || a.tool.n.localeCompare(b.tool.n));
  const top = [];
  const counts = {};
  scored.forEach((row) => { const count = counts[row.tool.c] || 0; if (top.length < 3 && count < 2) { top.push(row); counts[row.tool.c] = count + 1; } });
  scored.forEach((row) => { if (top.length < 3 && !top.includes(row)) top.push(row); });
  return { top, rest: scored.filter((row) => !top.includes(row)).slice(0, 2) };
}

function Recommend({ saved, onToggle, setSaved, onToast }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState(false);
  const titleRef = useRef(null);
  const result = done ? scoreRecommendations(answers) : null;
  useEffect(() => { if (touched) titleRef.current?.focus({ preventScroll: true }); }, [step, done, touched]);
  function restart() { setStep(0); setAnswers({}); setDone(false); setTouched(true); }
  function choose(key, value) { setAnswers((current) => ({ ...current, [key]: value })); setTouched(true); if (step < 2) setStep((current) => current + 1); else setDone(true); }
  const jobPhrase = JOB_PHRASE[answers.job] || 'your brief';
  const pool = TOOLS.filter((tool) => (JOB_CATS[answers.job] || []).includes(tool.c));
  const openMissing = answers.budget === 'open' && pool.length > 0 && !pool.some((tool) => tool.p === 'oss');
  return <div className="wrap quiz-wrap">{!done ? <><div className="quiz-intro"><div><h1>Three tools, not forty.</h1><p className="sub">Answer three questions. Every tool on the list is scored against the job, the budget and where you work.</p></div></div>
    <div className="quiz-card"><div className="quiz-head"><span>Question {step + 1} of 3</span><span className="steps" aria-hidden="true">{[0, 1, 2].map((item) => <span key={item} data-on={item <= step}/>)}</span></div><div className="quiz-body"><h2 ref={titleRef} tabIndex="-1">{QUESTIONS[step].title}</h2><p className="hint">{QUESTIONS[step].hint}</p><div className="opts">{QUESTIONS[step].options.map(([value, title, description], index) => <button className="opt" type="button" key={value} aria-pressed={answers[QUESTIONS[step].key] === value} onClick={() => choose(QUESTIONS[step].key, value)}><span className="k" aria-hidden="true">{'ABCDEF'[index]}</span><span><span className="t">{title}</span><span className="d">{description}</span></span>{icon('arrow', 'ic ic-sm')}</button>)}</div></div><div className="quiz-foot"><button className="link-btn" type="button" hidden={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>Back</button><span className="eyebrow">{step === 2 ? 'Then we score the list' : 'Tap an answer to continue'}</span></div></div>
  </> : <><div className="result-head"><div><p className="eyebrow">Recommendation / scored</p><h1 ref={titleRef} tabIndex="-1">Your three.</h1><p className="sub">Scored for {jobPhrase}, your budget and where you work. Nothing sponsored, nothing boosted.</p></div><div className="res-actions"><button className="btn btn-ink" type="button" disabled={result.top.every((row) => saved.has(row.tool.id))} onClick={() => { setSaved((current) => new Set([...current, ...result.top.map((row) => row.tool.id)])); onToast('Three tools saved to your shortlist'); }}>{icon('star', 'ic ic-sm')}<span>{result.top.every((row) => saved.has(row.tool.id)) ? 'All saved' : 'Save all three'}</span></button><button className="btn btn-line" type="button" onClick={restart}>Start over</button></div></div>
    {result.top.map((row, index) => <article className="result" key={row.tool.id}><div className="rank"><b>{String(index + 1).padStart(2, '0')}</b></div><div><div className="nm"><ToolLink tool={row.tool}>{row.tool.n}</ToolLink></div><div className="tg">{row.tool.t}</div><div className="reasons"><span className="reason reason-hot">{getCategory(row.tool.c).n}</span>{row.why.map((reason) => <span className="reason" key={reason}>{reason}</span>)}</div></div><SaveButton tool={row.tool} saved={saved} onToggle={onToggle}/></article>)}
    {result.rest.length > 0 && <><div className="resbar"><span>Also worth a look</span><span>Same brief</span></div>{result.rest.map((row) => <article className="result" key={row.tool.id}><div className="rank"><b>+</b></div><div><div className="nm"><ToolLink tool={row.tool}>{row.tool.n}</ToolLink></div><div className="tg">{row.tool.t}</div></div><SaveButton tool={row.tool} saved={saved} onToggle={onToggle}/></article>)}</>}
    <p className="match-note">Scores weigh the job, the price model and native platform. No sponsored placement in the ranking. Change any answer and the order changes with it.{openMissing ? ' No open-source tool has earned a place in this job yet, so these are the closest options.' : ''}</p>
  </>}</div>;
}

function NotFound() {
  return <div className="wrap" style={{ paddingTop: 'clamp(40px,7vw,90px)' }}><p className="eyebrow">404 / not on the list</p><h1 style={{ fontSize: 'clamp(2.4rem,6vw,4.4rem)', margin: '18px 0 16px' }}>That page is not on the list.</h1><p className="sub" style={{ maxWidth: '52ch', color: 'var(--muted)' }}>The link may be old, or the entry may have been removed. Forty tools are still here, filed by the job.</p><div className="empty" style={{ marginTop: 32 }}><h2>Where to go instead</h2><p>Browse the whole index, or let three questions narrow it down.</p><div className="acts"><a className="btn btn-ink" href={routeHref('/browse')}>Browse the directory</a><a className="btn btn-line" href={routeHref('/recommend')}>Find three tools</a></div></div></div>;
}

function SpriteSheet() {
  return <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false"><defs>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></symbol>
    <symbol id="i-star" viewBox="0 0 24 24"><path d="M11.5 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.9l5.16-.76a2.12 2.12 0 0 0 1.6-1.16z"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></symbol>
    <symbol id="i-up" viewBox="0 0 24 24"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
    <symbol id="i-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
    <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.1-15.1 1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M6.3 17.7l-1.4 1.4m14.2-14.2-1.4 1.4"/></symbol>
    <symbol id="i-moon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></symbol>
    <symbol id="i-copy" viewBox="0 0 24 24"><rect width="13" height="13" x="9" y="9" rx="1.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></symbol>
  </defs></svg>;
}

export default function App() {
  const [route, setRoute] = useState(parseRoute);
  const [saved, toggleSaved, setSaved] = useSaved();
  const [toast, setToast] = useState('');
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('shortlist.theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
    catch { return 'light'; }
  });
  useEffect(() => {
    const onHashChange = () => { setRoute(parseRoute()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0F120E' : '#F2F4EC');
    try { localStorage.setItem('shortlist.theme', theme); } catch { /* Storage can be unavailable. */ }
  }, [theme]);
  useEffect(() => {
    const title = route.path.startsWith('/tools/') ? `${getTool(route.path.split('/')[2])?.n || 'Tool'} | Shortlist` : route.path === '/browse' ? 'The directory | Shortlist' : route.path === '/favorites' ? 'Your shortlist | Shortlist' : route.path === '/recommend' ? 'Find three tools | Shortlist' : 'Shortlist | AI tools worth keeping';
    document.title = title;
  }, [route.path]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);
  function notify(message) { setToast(message); }
  let page;
  if (route.path === '/') page = <Home saved={saved} onToggle={(id) => { toggleSaved(id); notify(saved.has(id) ? `${getTool(id).n} removed from your shortlist` : `${getTool(id).n} saved to your shortlist`); }}/>
  else if (route.path === '/browse') page = <Browse route={route} saved={saved} onToggle={(id) => { toggleSaved(id); notify(saved.has(id) ? `${getTool(id).n} removed from your shortlist` : `${getTool(id).n} saved to your shortlist`); }}/>
  else if (route.path === '/favorites') page = <Favorites saved={saved} onToggle={toggleSaved} setSaved={setSaved} onToast={notify}/>
  else if (route.path === '/recommend') page = <Recommend saved={saved} onToggle={toggleSaved} setSaved={setSaved} onToast={notify}/>
  else if (route.path.startsWith('/tools/')) page = <ToolDetail id={route.path.split('/')[2]} saved={saved} onToggle={(id) => { toggleSaved(id); notify(saved.has(id) ? `${getTool(id).n} removed from your shortlist` : `${getTool(id).n} saved to your shortlist`); }}/>
  else page = <NotFound/>;
  return <><SpriteSheet/><a className="skip-link" href="#main" onClick={(event) => { event.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a><Header route={route} saved={saved} theme={theme} onTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}/><main id="main" tabIndex="-1">{page}</main><Footer/><div className="toast" data-on={Boolean(toast)} role="status" aria-live="polite">{toast && <>{icon('check', 'ic ic-sm')}<span>{toast}</span></>}</div></>;
}
