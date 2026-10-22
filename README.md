# Smile F LAOS ホームページ

公開サイト：https://smile-f-laos.github.io/Flao-hp/

## ファイルの置き場所

- 各ページの文章・レイアウト：直下の HTML ファイル
- 写真・ロゴ：`assets/images/`（下表）
- 共通の配色・書体・ヘッダー・フッター：`assets/css/site.css`
- トップページ固有のデザイン：`assets/css/home.css`
- その他10ページのデザイン：`assets/css/pages.css`
- トップの写真スライド・回転する活動紹介：`assets/js/home.js`
- 全ページのヘッダーメニュー：`assets/js/navigation.js`
- 下層ページの写真切替・年度リンク：`assets/js/pages.js`
- ページを先頭から表示する処理：`assets/js/page-start.js`
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

## デザインを更新するとき

文章と写真の指定は各 HTML、共通の配色・文字・ヘッダーは site.css、下層ページのレイアウトは pages.css を編集します。トップの写真スライドと回転する活動カードは home.js です。教育支援・スタディツアーの写真は各ページの photo-track 内に追加します。沿革は history-entry の details を開いて読む構成です。価格表は order.html の festival-menu を更新し、お知らせからそこへ案内します。
