import React from 'react'

// Stand-ins for the header and the bottom bars, which read from the CMS on the real site.
export const SampleHeader: React.FC = () => (
  <div className="border-b-2 border-line">
    <div className="container flex items-center justify-between gap-[2ch] py-[0.5lh] text-sm">
      <span>
        <b className="text-foreground">xoxn</b> <span className="text-blue">~/blog</span>{' '}
        <span className="text-green">$</span>
      </span>
      <ul className="tui-menubar">
        <li>
          <a href="#">projects</a>
        </li>
        <li data-open="" data-submenu="">
          <a aria-current="page" href="#">
            blog
          </a>
        </li>
        <li>
          <a href="#">about</a>
        </li>
      </ul>
    </div>
  </div>
)

export const SampleKeyBar: React.FC = () => (
  <nav className="tui-keybar">
    {['projects', 'blog', 'resume', 'about'].map((label, i) => (
      <a aria-current={label === 'blog' ? 'page' : undefined} href="#" key={label}>
        <kbd>{i + 1}</kbd>
        <span>{label}</span>
      </a>
    ))}
  </nav>
)

export const SampleStatusLine: React.FC = () => (
  <div className="tui-statusline" style={{ position: 'static' }}>
    <span className="tui-statusline-mode" />
    <span className="min-w-0 flex-1 truncate">
      <span className="text-green">xoxn</span>:<span className="text-blue">~/blog</span>
    </span>
    <span>Top</span>
  </div>
)
