const upcoming = [
  { date: "Sep 15", name: "Salary", amount: "+₱100,000", kind: "income" },
  { date: "Sep 20", name: "Hanoi trip", amount: "−₱40,000", kind: "expense" },
  { date: "Oct 5", name: "Credit card", amount: "−₱32,000", kind: "expense" },
];

export default function Home() {
  return (
    <main className="shell">
      <aside>
        <div className="brand">Cashflow</div>
        <nav>
          {['Overview', 'Plan', 'Transactions', 'Budget', 'Accounts', 'Goals'].map((item) => (
            <a className={item === 'Overview' ? 'active' : ''} href="#" key={item}>{item}</a>
          ))}
        </nav>
      </aside>
      <section className="content">
        <header><div><p className="eyebrow">OVERVIEW</p><h1>Your money, now and next</h1></div><button>Add transaction</button></header>
        <div className="stats">
          <article><span>Available cash</span><strong>₱287,450</strong><small>Across 4 cash accounts</small></article>
          <article><span>Due next 30 days</span><strong>₱63,240</strong><small>7 scheduled payments</small></article>
          <article><span>Projected in 3 months</span><strong>₱418,300</strong><small className="positive">+45.5% from today</small></article>
          <article><span>Lowest projected balance</span><strong>₱182,400</strong><small>September 20</small></article>
        </div>
        <div className="grid">
          <article className="panel forecast"><div><p className="eyebrow">FORECAST</p><h2>Where your money is going</h2></div><div className="chart"><span>₱450k</span><div className="line" /><span>Today</span><span>Oct</span><span>Nov</span><span>Dec</span></div></article>
          <article className="panel"><p className="eyebrow">UPCOMING</p><h2>Next on your timeline</h2><div className="events">{upcoming.map((item) => <div className="event" key={item.name}><time>{item.date}</time><span>{item.name}</span><b className={item.kind}>{item.amount}</b></div>)}</div></article>
        </div>
      </section>
    </main>
  );
}

