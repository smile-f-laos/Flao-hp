"""Render static annual albums from assets/data/gallery/*.json (standard library only)."""
from pathlib import Path
from itertools import groupby
import json, html, re

root=Path(__file__).resolve().parents[1]
escape=html.escape
template=(root/'gallery.html').read_text(encoding='utf-8')
years=json.loads((root/'assets/data/gallery-albums.json').read_text(encoding='utf-8'))
albums=[json.loads((root/f'assets/data/gallery/{y}.json').read_text(encoding='utf-8')) for y in years]

def page(content,title,description):
    s=re.sub(r'<main\b.*?</main>',content,template,count=1,flags=re.S)
    s=re.sub(r'<title>.*?</title>',f'<title>{escape(title)}｜Smile F LAOS</title>',s,count=1)
    s=re.sub(r'<meta name="description" content="[^"]*">',f'<meta name="description" content="{escape(description,quote=True)}">',s,count=1)
    if 'assets/css/gallery.css' not in s:
        s=s.replace('</head>','<link rel="stylesheet" href="assets/css/gallery.css">\n</head>')
    return s

def hero(kicker,title,lead,crumb):
    return f'''<main class="page-main gallery" id="main-content">
<nav class="breadcrumbs" aria-label="現在の位置"><a href="index.html">トップ</a><span>／</span>{crumb}</nav>
<section class="page-hero"><p class="page-kicker">{kicker}</p><h1 class="page-title">{title}</h1><p class="page-lead">{lead}</p></section>'''

cards=[]
for album in albums:
    year=album['year']; photos=album['photos']; cover=next((p for p in photos if p['source']=='IMG_5820.jpg'),photos[0])
    cards.append(f'''<a class="album-folder" href="gallery-{year}.html"><span class="folder-tab">{escape(album['title'])}</span><img src="{cover['thumb']}" alt="" width="{cover['width']}" height="{cover['height']}" loading="lazy"><span class="folder-info"><span class="album-type">{escape(album['subtitle'])}</span><strong>{escape(album['title'])}</strong><span>{len(photos)}枚の写真</span><span class="folder-open">アルバムを開く ↗</span></span></a>''')
    content=hero('PHOTO ALBUM / '+year,escape(album['title'])+'<br>'+escape(album['subtitle']),escape(album['description']),'<a href="gallery.html">ギャラリー</a><span>／</span>'+escape(album['title']))
    content+=f'<div class="album-toolbar"><a href="gallery.html">← 年度別アルバムに戻る</a><p>{len(photos)}枚 ／ 撮影日時の記録をもとに掲載</p></div>'
    days=[(d,list(ps)) for d,ps in groupby(photos,key=lambda p:p['date'])]
    content+='<nav class="album-days" aria-label="撮影日から探す">'+''.join(f'<a href="#day-{d}">{int(d[5:7])}/{int(d[8:])}</a>' for d,_ in days)+'</nav>'
    for date,items in days:
        summary=album.get('daySummaries',{}).get(date,'')
        summary_html=f'<p class="album-day-summary">{escape(summary)}</p>' if summary else ''
        content+=f'<section class="album-day" id="day-{date}"><div class="album-day-heading"><h2><time datetime="{date}">{int(date[5:7])}月{int(date[8:])}日</time></h2>{summary_html}<span class="album-day-count">{len(items)}枚</span></div><div class="album-photos">'
        for p in items:
            cap=escape(p['caption'],quote=True)
            content+=f'''<figure><a class="album-photo" href="{p['full']}" data-caption="{cap}" data-date="{date}" aria-label="{cap}の写真を大きく見る"><img src="{p['thumb']}" alt="{cap}" width="{p['width']}" height="{p['height']}" loading="lazy" decoding="async"></a><figcaption>{cap}</figcaption></figure>'''
        content+='</div></section>'
    content+='''<p class="album-end"><a href="gallery.html">← 年度別アルバムに戻る</a><a href="#main-content">ページの先頭へ ↑</a></p>
<dialog class="photo-viewer" aria-label="写真を拡大表示"><div class="viewer-tools"><span class="viewer-count" aria-live="polite"></span><button type="button" class="viewer-close" aria-label="拡大表示を閉じる">閉じる ×</button></div><img class="viewer-image" alt=""><p class="viewer-caption"></p><div class="viewer-bottom"><button type="button" class="viewer-prev">← 前の写真</button><a class="viewer-original" target="_blank" rel="noopener noreferrer">写真を別タブで開く ↗</a><button type="button" class="viewer-next">次の写真 →</button></div></dialog></main>'''
    result=page(content,album['title']+' '+album['subtitle'],album['description'])
    result=result.replace('</body>','<script src="assets/js/gallery.js" defer></script>\n</body>')
    (root/f'gallery-{year}.html').write_text(result,encoding='utf-8')

content=hero('PHOTO JOURNAL','写真で見る、エフラオ。','年度ごとのアルバムから、活動の記録をたどれます。','<span>ギャラリー</span>')
content+='<section class="album-list" aria-label="年度別アルバム">'+''.join(cards)+'</section>'
content+='<section class="gallery-updating"><h2>ほかの写真・年度</h2><p>ただいま更新中です。準備ができ次第、順次追加していきます。</p></section></main>'
(root/'gallery.html').write_text(page(content,'写真ギャラリー','Smile F LAOSの活動写真を年度ごとのアルバムで紹介します。'),encoding='utf-8')
print(f'Generated gallery index and {len(albums)} annual album(s).')
