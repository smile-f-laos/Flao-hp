# 検索結果のサイトリンク

サイトリンクの表示・件数・順序は検索エンジンが自動で決定します。サイトマップや構造化データは、表示を強制する設定ではありません。

- 重要なページへは共通ナビゲーションとフッターからリンク。
- 各ページのタイトル・説明・正規URLは `scripts/update-sharing.py` で同期。
- 同スクリプトでサブページのパンくず情報と `sitemap.xml` を生成。
- ギャラリー再生成時にも上記を実行。
- `indexnow-key.txt` はIndexNow所有確認用の公開ファイル。管理者ログイン用の秘密鍵ではありません。キーの有効範囲は `/Flao-hp/` 以下。

Google Search Console / Bing Webmaster Toolsの所有確認済みサイトがある場合は、以下をサイトマップとして送信できます。
https://smile-f-laos.github.io/Flao-hp/sitemap.xml

IndexNowの受付成功は、クロール・インデックス登録・サイトリンク表示の保証ではありません。
