import Link from 'next/link';
const cards = [
 {title:'Jornadas analisadas',value:'1.284',note:'Amostra fictícia'},
 {title:'Oportunidades potenciais',value:'87',note:'Aguardando validação'},
 {title:'Custo sob análise',value:'R$ 18.450',note:'Não é economia realizada'},
 {title:'Economia confirmada',value:'R$ 0',note:'Nenhuma validação nesta demonstração'}
];
const findings=[
 {code:'SUP-001',name:'Recontato em até 7 dias',count:32,amount:'R$ 6.450',status:'Potencial'},
 {code:'SUP-002',name:'Duplicidade de protocolo',count:14,amount:'Não apurado',status:'Investigação'},
 {code:'SUP-003',name:'Transferências excessivas',count:41,amount:'Não apurado',status:'Potencial'}
];
export default function Dashboard() { return <div className="appShell"><aside className="sidebar"><Link className="brand" href="/">ISP<span>Efficiency</span></Link><div className="sidebarCaption">WORKSPACE DEMONSTRAÇÃO</div><Link className="active" href="/dashboard">Visão executiva</Link><Link href="/dashboard/auditorias">Auditorias</Link><Link href="/dashboard/regras">Regras e parâmetros</Link><Link href="/">Landing page</Link></aside><main className="appMain"><div className="appTop"><div><div className="eyebrow">Customer Support Intelligence</div><h1>Visão executiva</h1><p>Identifique oportunidades de eficiência no suporte e atendimento.</p></div><span className="demoTag">Dados fictícios</span></div><div className="statGrid">{cards.map(c=><div className="statCard" key={c.title}><small>{c.title}</small><strong>{c.value}</strong><span>{c.note}</span></div>)}</div><section className="dataPanel"><div className="panelTitle"><div><h2>Principais oportunidades</h2><p>Exemplos para demonstrar o fluxo de auditoria</p></div><Link href="/dashboard/auditorias">Ver auditorias →</Link></div><div className="tableScroll"><table><thead><tr><th>Regra</th><th>Categoria</th><th>Ocorrências</th><th>Impacto</th><th>Classificação</th></tr></thead><tbody>{findings.map(f=><tr key={f.code}><td>{f.code}</td><td>{f.name}</td><td>{f.count}</td><td>{f.amount}</td><td><span className="status">{f.status}</span></td></tr>)}</tbody></table></div></section><div className="dataPanel"><h2>Próximas integrações</h2><p>O dashboard utilizará APIs autenticadas para carregar dados reais de ERP, Lia e Zabbix. Nenhuma dessas integrações está ativa neste protótipo.</p></div></main></div> }
