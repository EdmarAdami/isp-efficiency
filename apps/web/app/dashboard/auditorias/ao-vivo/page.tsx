import Link from 'next/link';
import { loadAudits } from '../../../../lib/audits';

export const dynamic = 'force-dynamic';
const money=(cents:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100);
export default async function LiveAudits() {
  const result=await loadAudits();
  return <main className="simplePage">
    <Link href="/dashboard">← Voltar ao dashboard</Link>
    <div className="eyebrow">API protegida · Ambiente de desenvolvimento</div>
    <h1>Auditorias persistidas</h1>
    {!result.ok ? <div className="dataPanel">
      <h2>{result.reason==='unconfigured'?'Conexão não configurada':'API indisponível'}</h2>
      <p>{result.reason==='unconfigured'?'Configure ISP_API_INTERNAL_URL e ISP_API_SERVICE_TOKEN exclusivamente no servidor Next.js.':'Verifique a API, o token de serviço e a conectividade com PostgreSQL.'}</p>
      <p>Nenhum dado fictício é apresentado como auditoria real.</p>
    </div> : <div className="dataPanel">
      <div className="panelTitle"><div><h2>{result.data.count} ocorrências retornadas</h2><p>Dados consultados da API, sem cache</p></div></div>
      <div className="tableScroll"><table><thead><tr><th>Regra</th><th>Jornada</th><th>Estado</th><th>Custo sob análise</th><th>Registro</th></tr></thead>
      <tbody>{result.data.findings.map(f=><tr key={f.id}><td>{f.ruleCode}</td><td>{f.journeyId}</td><td><span className="status">{f.status}</span></td><td>{money(f.estimatedCostCents)}</td><td>{new Date(f.createdAt).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</td></tr>)}</tbody></table></div>
      {result.data.count===0&&<p>Não há ocorrências persistidas para este provedor.</p>}
      <p className="muted">Custos estimados não equivalem a economia realizada.</p>
    </div>}
  </main>;
}
