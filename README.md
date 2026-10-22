# Smile F LAOS ホームページ

公開サイト：https://smile-f-laos.github.io/Flao-hp/

## ファイルの置き場所

- 各ページの文章・レイアウト：直下の HTML ファイル
- 写真・ロゴ：`assets/images/`（下表）
- スタイル：`assets/css/`（トップページは `home.css`）
- トップの写真スライド・回転する活動紹介：`assets/js/home.js`
- トップのヘッダーメニュー：`assets/js/navigation.js`
- 更新の手順書：`docs/00_まず最初に読む.md`、`docs/01_運用マニュアル.md`

|画像フォルダ|用途|
|---|---|
|`brand`|団体ロゴ|
|`home`|トップのスライド写真・活動の柱|
|`coffee`|コーヒー商品|
|`education`|教育支援・教材|
|`study-tour`|スタディツアー|
|`gallery`|ギャラリー|

## ページ一覧

|ファイル|内容|
|---|---|
|`index.html`|トップ・白山祭案内|
|`about.html`|団体紹介|
|`coffee.html`|コーヒー・白山祭メニュー|
|`education.html`|教育支援|
|`studytour.html`|スタディツアー|
|`news.html`|お知らせ・活動報告|
|`order.html`|購入相談|
|`gallery.html`|写真|
|`members.html`|メンバー・活動予定|
|`history.html`|沿革|
|`partners.html`|協力団体|

## 写真を追加するとき

用途に合う画像フォルダへ入れ、HTML の `src` またはスライド用配列のパスも更新します。例：`assets/images/gallery/gallery-03.jpg`。半角英数字とハイフンで名前を付け、拡張子は一度だけにしてください。圧縮済みの画像を使用し、教材など文字を含む画像は文字が読めるかも確認します。ページの URL を保つため、HTML は直下に置きます。
