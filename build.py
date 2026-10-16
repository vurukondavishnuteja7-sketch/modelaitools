import re,os,shutil,json
D='YOURDOMAIN.online'
src=open('/mnt/user-data/outputs/model-ai.html').read()
css=re.search(r'<style>(.*?)</style>',src,re.S).group(1)
js=src.split('<script>\n',1)[1].split('const P={',1)[0]
new=r"""{id:'prompt-builder',c:0,n:'AI Prompt Builder',d:'Build a clear, structured prompt for any AI chatbot.',
h:`<label for="r">Role</label><input id="r" placeholder="a friendly maths tutor"><label for="k">Task</label><textarea id="k" style="min-height:80px" placeholder="Explain fractions to a 10-year-old"></textarea><label for="x">Context</label><input id="x" placeholder="They struggle with pizza-slice examples"><label for="f">Output format</label><input id="f" placeholder="5 short bullet points"><button id="g">Build prompt</button><button id="c" class="alt">Copy</button><div class="out" id="o"></div>`,
j(){$('#g').onclick=()=>{const v=i=>$('#'+i).value.trim();if(!v('k')){$('#o').innerHTML='<span class="err">Describe the task first.</span>';return}$('#o').textContent=[v('r')&&`You are ${v('r')}.`,`Task: ${v('k')}`,v('x')&&`Context: ${v('x')}`,v('f')&&`Format the answer as: ${v('f')}`,'Ask me a question if anything is unclear before you answer.'].filter(Boolean).join('\n')};$('#c').onclick=()=>cp($('#o').textContent)}},
{id:'marks-calculator',c:2,n:'Marks & Grade Calculator',d:'Turn your score into a percentage and a letter grade.',
h:`<div class="row"><div><label for="a">Marks obtained</label><input id="a" type="number" min="0"></div><div><label for="b">Total marks</label><input id="b" type="number" min="1"></div></div><button id="g">Calculate</button><div class="stats" id="o"></div>`,
j(){$('#g').onclick=()=>{const a=+$('#a').value,b=+$('#b').value;if(!(b>0)||a<0||a>b){$('#o').innerHTML='<p class="err">Enter marks between 0 and the total.</p>';return}const p=a/b*100,g=p>=90?'A+':p>=80?'A':p>=70?'B':p>=60?'C':p>=50?'D':'F';$('#o').innerHTML=`<div class="stat"><b>${+p.toFixed(2)}%</b>Percentage</div><div class="stat"><b>${g}</b>Grade</div>`}}},
{id:'qr-code-generator',c:4,n:'QR Code Generator',d:'Create a QR code from any text or link.',
h:`<label for="t">Text or URL</label><input id="t" placeholder="https://"><button id="g">Generate QR</button><div id="o" style="margin-top:14px"></div>`,
j(){const L=()=>window.QRCode?Promise.resolve():new Promise((r,e)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';s.onload=r;s.onerror=e;document.head.appendChild(s)});$('#g').onclick=()=>{const v=$('#t').value.trim();if(!v){$('#o').innerHTML='<span class="err">Enter text or a URL.</span>';return}L().then(()=>{$('#o').innerHTML='';new QRCode($('#o'),{text:v,width:220,height:220})}).catch(()=>$('#o').innerHTML='<span class="err">Could not load the QR library. Check your connection.</span>')}}}
"""
js=js.rstrip()
assert js.endswith('];')
js=js[:-2].rstrip()+',\n'+new+'];\n'
shutil.rmtree('site',ignore_errors=True);os.makedirs('site/tools')
w=lambda p,t:(os.makedirs(os.path.dirname('site/'+p) or 'site',exist_ok=True),open('site/'+p,'w').write(t))
w('style.css',css);w('tools.js',js)
meta=re.findall(r"\{id:'([^']+)',c:(\d),n:'([^']+)',d:'([^']+)'",js)
CATS=['AI Writing & Text','YouTube & Social','Student & Education','Image & File','Productivity']
def page(title,desc,path,body,extra=''):
    return f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title><meta name="description" content="{desc}">
<link rel="canonical" href="https://{D}{path}">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:type" content="website"><meta property="og:url" content="https://{D}{path}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E✨%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css"></head><body>
<header><a class="logo" href="/">MODEL AI</a>{extra}<nav><a href="/">Tools</a><a href="/about.html">About</a><a href="/contact.html">Contact</a></nav></header>
<main>{body}</main>
<footer><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/disclaimer.html">Disclaimer</a><div>© 2026 MODEL AI. All tools run in your browser; nothing is uploaded.</div></footer>
'''
card=lambda i,n,d:f'<a class="card" href="/tools/{i}/"><h3>{n}</h3><p>{d}</p><span class="tag">Available</span></a>'
secs=''.join(f'<section><h2>{CATS[c]}</h2><div class="grid">'+''.join(card(i,n,d) for i,cc,n,d in meta if int(cc)==c)+'</div></section>' for c in range(5))
home=page('MODEL AI – All-in-One AI Tools Platform','MODEL AI: Free online tools for writing, YouTube, students, images and productivity. No signup, instant results in your browser.','/',
 '<section class="hero"><h1>All Your AI Tools. One Simple Platform.</h1><p>Writing, YouTube, study and image tools that work instantly in your browser. Free, private, no signup.</p></section>'+secs+'<p id="none" hidden>No tools match that search. Try “word”, “image” or “percent”.</p>',
 '<input id="q" type="search" placeholder="Search tools…" aria-label="Search tools">')
w('index.html',home+'<script src="/script.js"></script></body></html>')
w('script.js',"""const q=document.getElementById('q');q.addEventListener('input',()=>{const t=q.value.toLowerCase().trim();let n=0;document.querySelectorAll('.card').forEach(c=>{const s=c.textContent.toLowerCase().includes(t);c.hidden=!s;if(s)n++});document.querySelectorAll('main section:not(.hero)').forEach(s=>s.hidden=!s.querySelector('.card:not([hidden])'));document.getElementById('none').hidden=n>0;document.querySelector('.hero').hidden=!!t});
""")
for i,c,n,d in meta:
    b=f'<article class="tool"><div class="bc"><a href="/">Tools</a> / {CATS[int(c)]}</div><h1>{n}</h1><p>{d}</p><div class="panel" id="panel"><noscript>This tool needs JavaScript.</noscript></div><h2>About this tool</h2><p>{d} It runs entirely in your browser, so your input is never uploaded or stored.</p></article>'
    w(f'tools/{i}/index.html',page(f'{n} – Free Online Tool | MODEL AI',d,f'/tools/{i}/',b)+f'<script src="/tools.js"></script><script>const t=T.find(x=>x.id==="{i}");$("#panel").innerHTML=t.h;t.j()</script></body></html>')
P={'about':('About MODEL AI','MODEL AI is a free collection of browser-based tools for writing, YouTube, students, images and everyday productivity. Every tool runs on your device, with no signup.'),
'contact':('Contact','Questions or tool requests? Email hello@'+D+' (replace with your real address before applying to AdSense).'),
'privacy':('Privacy Policy','Tools process your text and files locally in your browser; we do not upload or store them. If advertising is enabled, third-party vendors such as Google may use cookies to serve ads, and you can opt out at Google Ads Settings. Replace this draft with your final policy.'),
'terms':('Terms of Use','Use these tools at your own risk and for lawful purposes. Results are provided as-is without warranty. Replace this draft with your final terms.'),
'disclaimer':('Disclaimer','Generated titles, descriptions and calculations are suggestions. Check important results before relying on them.')}
for k,(t,x) in P.items(): w(k+'.html',page(t+' – MODEL AI',x[:150],'/'+k+'.html',f'<article class="tool"><h1>{t}</h1><p>{x}</p></article>')+'</body></html>')
w('404.html',page('Page not found – MODEL AI','Page not found.','/404.html','<article class="tool"><h1>Page not found</h1><p>That page does not exist. <a href="/">Browse all tools</a>.</p></article>')+'</body></html>')
urls=['/']+[f'/tools/{m[0]}/' for m in meta]+[f'/{k}.html' for k in P]
w('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<url><loc>https://{D}{u}</loc></url>\n' for u in urls)+'</urlset>\n')
w('robots.txt',f'User-agent: *\nAllow: /\nSitemap: https://{D}/sitemap.xml\n')
w('ads.txt','# Replace with your AdSense publisher ID after approval\n# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n')
w('_headers','/style.css\n  Cache-Control: public, max-age=86400\n/tools.js\n  Cache-Control: public, max-age=86400\n/ads.txt\n  Content-Type: text/plain; charset=utf-8\n')
w('README.md','# MODEL AI\nStatic site. Deploy on Cloudflare Pages: build command none, output directory `/`.\nBefore launch: replace YOURDOMAIN.online everywhere (or re-run build.py with D changed), fix contact email and policy pages, add your AdSense ID to ads.txt.\n')
print(len(meta),'tools')
