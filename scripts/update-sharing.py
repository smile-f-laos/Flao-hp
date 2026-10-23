"""Keep sharing metadata aligned with each page's title and description."""
from pathlib import Path
import html,re
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
    lines += ['<meta name="twitter:card" content="summary_large_image">',f'<meta name="twitter:title" content="{html.escape(title,quote=True)}">',f'<meta name="twitter:description" content="{html.escape(description,quote=True)}">',f'<meta name="twitter:image" content="{BASE}assets/images/sharing/og-default.jpg">','<link rel="icon" type="image/png" sizes="32x32" href="assets/images/brand/favicon-32.png">','<link rel="apple-touch-icon" sizes="180x180" href="assets/images/brand/apple-touch-icon.png">','<!-- /Sharing metadata -->']
    source=source.replace('</head>','\n'.join(lines)+'\n</head>',1)
    path.write_text(source,encoding='utf-8')
print('Updated sharing metadata for all pages.')
