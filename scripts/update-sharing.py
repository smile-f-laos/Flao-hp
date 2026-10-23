"""Keep sharing metadata aligned with each page's title and description."""
from pathlib import Path
import html,re,json
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
BASE='https://smile-f-laos.github.io/Flao-hp/'
for path in ROOT.glob('*.html'):
    source=path.read_text(encoding='utf-8')
    source=re.sub(r'\n?<!-- Sharing metadata -->.*?<!-- /Sharing metadata -->','',source,flags=re.S)
    title=html.unescape(re.search(r'<title>(.*?)</title>',source,re.S)[1])
    match=re.search(r'<meta name="description" content="([^"]*)">',source)
    description=html.unescape(match[1]) if match else '学生がつなぐラオスと日本。Smile F LAOSの公式ホームページです。'
    url=BASE+('' if path.name=='index.html' else path.name)
    values={'og:type':'website','og:site_name':'Smile F LAOS','og:locale':'ja_JP','og:title':title,'og:description':description,'og:url':url,'og:image':BASE+'assets/images/sharing/og-default.jpg','og:image:secure_url':BASE+'assets/images/sharing/og-default.jpg','og:image:type':'image/jpeg','og:image:width':'1200','og:image:height':'630','og:image:alt':'Smile F LAOS 学生がつなぐラオスと日本。ラオスでの活動写真。'}
    lines=['<!-- Sharing metadata -->',f'<link rel="canonical" href="{url}">']
    lines += [f'<meta property="{key}" content="{html.escape(value,quote=True)}">' for key,value in values.items()]
    if path.name != 'index.html':
        label=title.split('｜')[0]
        items=[{'@type':'ListItem','position':1,'name':'トップ','item':BASE}]
        if path.name.startswith('gallery-'):
            items.append({'@type':'ListItem','position':2,'name':'ギャラリー','item':BASE+'gallery.html'})
        items.append({'@type':'ListItem','position':len(items)+1,'name':label,'item':url})
        breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':items}
        lines += ['<script type="application/ld+json">'+json.dumps(breadcrumb,ensure_ascii=False)+'</script>']
    lines += ['<meta name="twitter:card" content="summary_large_image">',f'<meta name="twitter:title" content="{html.escape(title,quote=True)}">',f'<meta name="twitter:description" content="{html.escape(description,quote=True)}">',f'<meta name="twitter:image" content="{BASE}assets/images/sharing/og-default.jpg">','<link rel="icon" type="image/png" sizes="48x48" href="assets/images/brand/favicon-48.png">','<link rel="apple-touch-icon" sizes="180x180" href="assets/images/brand/apple-touch-icon.png">','<!-- /Sharing metadata -->']
    source=source.replace('</head>','\n'.join(lines)+'\n</head>',1)
    path.write_text(source,encoding='utf-8')
print('Updated sharing metadata for all pages.')

# Only public HTML pages belong in the sitemap; omit unverified lastmod dates.
ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
urlset=ET.Element('{http://www.sitemaps.org/schemas/sitemap/0.9}urlset')
for path in sorted(ROOT.glob('*.html')):
    node=ET.SubElement(urlset,'{http://www.sitemaps.org/schemas/sitemap/0.9}url')
    ET.SubElement(node,'{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text=BASE+('' if path.name=='index.html' else path.name)
ET.ElementTree(urlset).write(ROOT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
