const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const base=process.env.GARBA_AUDIT_ROOT;assert(base,'Set GARBA_AUDIT_ROOT to the folder containing the four checkouts: garba-advisor, mi-punto-de-partida, advisor-baseline and pdp-baseline');const out=process.env.GARBA_AUDIT_OUTPUT||path.join(require('os').tmpdir(),'garba-experience-audit');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{let file=path.join(base,decodeURIComponent(req.url.split('?')[0]));if(file.endsWith('/'))file+='index.html';try{res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end()}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});let report={checks:[],errors:[],overflow:[]};try{
 const context=await browser.newContext();await context.route('https://**/*',r=>r.abort());const p=await context.newPage();p.on('pageerror',e=>report.errors.push(e.message));const origin='http://127.0.0.1:'+server.address().port;
 const shot=async(name)=>{await p.screenshot({path:path.join(out,name+'.png'),fullPage:true})};
 const checkWidth=async(label)=>{const x=await p.evaluate(()=>({w:innerWidth,s:document.documentElement.scrollWidth}));if(x.s>x.w+1)report.overflow.push({label,...x})};
 let states=[];
 for(const repo of ['pdp-baseline','mi-punto-de-partida']){
  await p.goto(origin+'/'+repo+'/');
  await p.evaluate(()=>{window.enviarDiagnostico=()=>{};window.fetch=async()=>({ok:true,json:async()=>({}),text:async()=>''})});
  await p.locator('#vDolor .btn-primary').first().click();assert(await p.locator('#situErr1').isVisible());
  for(const group of ['chipsDolor','chipsMeta','chipsPorque','chipsCondicion','chipsFreno']){
   if(group==='chipsMeta')await p.locator('#vDolor .btn-primary').first().click();
   if(group==='chipsCondicion')await p.locator('.situ-step.active .btn-primary').click();
   await p.locator('#'+group+' .choice-btn').first().click();if(repo==='mi-punto-de-partida')assert.equal(await p.locator('#'+group+' .choice-btn').first().getAttribute('aria-pressed'),'true');
   if(repo==='mi-punto-de-partida'){await p.setViewportSize({width:390,height:844});await shot('pdp-'+group);await checkWidth(group)}
  }
  await p.locator('.situ-step.active .btn-primary').click();await p.locator('#deseo').fill('25000');await p.locator('#edad').fill('32');await p.locator('#vGoal .choice-btn').nth(1).click();
  if(repo==='mi-punto-de-partida'){await shot('pdp-goal-mobile');await checkWidth('goal')}
  await p.locator('#vGoal .btn-primary').click();await p.locator('#vReality .amounts button').nth(1).click();await p.locator('.plazo-grid button').first().click();await p.locator('#nombre').fill('Cliente de prueba');await p.locator('#wanum').fill('6620000000');await p.locator('#ingresoR').selectOption({index:2});
  if(repo==='mi-punto-de-partida'){await shot('pdp-reality-mobile');await checkWidth('reality')}
  await p.locator('#vReality .btn-primary').click();await p.locator('#vRes.active').waitFor();states.push(await p.evaluate(()=>{const s={...ST};delete s.fecha;return s}));
  if(repo==='mi-punto-de-partida')for(const width of [390,768,1440]){await p.setViewportSize({width,height:900});await shot('pdp-result-'+width);await checkWidth('result-'+width)}
 }
 assert.deepEqual(states[1],states[0]);report.checks.push('Punto de Partida: complete browser journey, required inputs, exact original financial and fiscal state');
 assert.deepEqual(report.overflow,[]);assert.deepEqual(report.errors,[]);console.log('PASS: complete diagnosis, original results, accessibility and responsive views');
 }finally{fs.writeFileSync(path.join(out,'pdp-audit.json'),JSON.stringify(report,null,2));await browser.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
