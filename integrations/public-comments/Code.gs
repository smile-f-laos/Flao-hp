// 初回だけ所有者がエディタから setupComments を実行します。
function setupComments() {
  var active = Session.getActiveUser().getEmail();
  if (!active || active !== Session.getEffectiveUser().getEmail()) throw new Error('管理者のみ実行できます。');
  setupComments_();
}

// 末尾_の関数は訪問者から呼べません。
function setupComments_() {
  var properties = PropertiesService.getScriptProperties();
  if (properties.getProperty('COMMENTS_SHEET_ID')) return;
  var book = SpreadsheetApp.create('Smile F LAOS 公開コメント管理');
  var sheet = book.getSheets()[0];
  sheet.setName('コメント');
  sheet.appendRow(['受付日時', 'ID', '公開状態', 'ニックネーム', 'コメント']);
  sheet.setFrozenRows(1);
  sheet.getRange('C2:C').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['保留', '公開', '非公開'], true).build());
  sheet.getRange('D:E').setNumberFormat('@');
  sheet.setColumnWidths(1, 4, 160);
  sheet.setColumnWidth(5, 550);
  properties.setProperty('COMMENTS_SHEET_ID', book.getId());
  console.log('管理シート（共有設定は変更しないでください）: ' + book.getUrl());
}

function commentsSheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('COMMENTS_SHEET_ID');
  if (!id) throw new Error('コメント欄の準備中です。公式LINEをご利用ください。');
  return SpreadsheetApp.openById(id).getSheetByName('コメント');
}

function getPublicComments() {
  var sheet = commentsSheet_();
  var end = sheet.getLastRow();
  if (end < 2) return [];
  var start = Math.max(2, end - 999);
  return sheet.getRange(start, 1, end - start + 1, 5).getValues()
    .filter(function(row) { return row[2] === '公開'; })
    .slice(-50).reverse().map(function(row) {
      return { date: Utilities.formatDate(new Date(row[0]), 'Asia/Tokyo', 'yyyy/MM/dd'), name: String(row[3]), message: String(row[4]) };
    });
}

function getCommentToken() {
  commentsSheet_();
  var token = Utilities.getUuid();
  CacheService.getScriptCache().put('form:' + token, 'ready', 3600);
  return token;
}

function submitPublicComment(input) {
  if (!input || input.consent !== true) throw new Error('公開についての確認にチェックを入れてください。');
  var name = String(input.name || '').trim() || '名無し';
  var message = String(input.message || '').trim();
  if (name.length > 40 || !message || message.length > 1200 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(name + message)) throw new Error('名前は40文字以内、コメントは1〜1200文字で入力してください。');
  if (input.website) throw new Error('投稿を受け付けられませんでした。');
  var token = String(input.token || '');
  if (!/^[a-f0-9-]{36}$/i.test(token)) throw new Error('ページを再読み込みしてから投稿してください。');
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) throw new Error('混み合っています。少し待ってからお試しください。');
  try {
    var cache = CacheService.getScriptCache();
    if (!cache.get('form:' + token)) throw new Error('投稿済みか、入力画面の有効期限が切れています。ページを再読み込みしてください。');
    var digest = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, name + '\n' + message));
    if (cache.get('recent:' + digest)) throw new Error('同じ内容を受け付け済みです。');
    var hour = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMddHH');
    var count = Number(cache.get('limit:' + hour) || '0');
    if (count >= 300) throw new Error('投稿が集中しています。時間をおいてお試しください。');
    var safe = function(text) { return /^[\s]*[=+@-]/.test(text) ? "'" + text : text; };
    commentsSheet_().appendRow([new Date(), Utilities.getUuid(), '保留', safe(name), safe(message)]);
    cache.remove('form:' + token);
    cache.put('recent:' + digest, 'accepted', 600);
    cache.put('limit:' + hour, String(count + 1), 3600);
    return { accepted: true };
  } finally { lock.releaseLock(); }
}

function doGet() {
  return HtmlService.createHtmlOutput(COMMENTS_HTML_)
    .setTitle('エフラオ みんなの声')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

var COMMENTS_HTML_ = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;padding:18px 6px;background:#f8f5ef;color:#302922;font:14px/1.9 'Yu Gothic',Meiryo,sans-serif}h2{font-size:23px;font-weight:500;margin:0 0 20px}label{display:block;margin:16px 0 6px;font-weight:600}input[type=text],textarea{width:100%;font:inherit;color:inherit;background:#fffdf9;border:1px solid #c7bba9;padding:12px;border-radius:0}textarea{resize:vertical;min-height:150px}button{font:inherit;background:#a44f30;color:white;border:0;padding:12px 22px;cursor:pointer}button:disabled{opacity:.5;cursor:default}.note{font-size:12px;color:#756b60}#status{min-height:2em;margin:14px 0;white-space:pre-wrap}.consent{font-size:12px;font-weight:400;display:flex;gap:10px;align-items:flex-start}.consent input{margin-top:8px;flex-shrink:0}.trap{position:absolute;left:-9999px}.entry{padding:22px 0;border-bottom:1px solid #d6cec1}.entry header{display:flex;gap:20px;align-items:baseline}.entry time{font-size:11px;color:#756b60}.entry p{white-space:pre-wrap;overflow-wrap:anywhere;margin:10px 0 0}.comments{margin-top:40px}.error{color:#a13422}button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid #a44f30;outline-offset:3px}
</style></head><body><h2>コーヒーの感想を聞かせてください</h2><p class="note">ログインは不要です。名前とコメントは、団体側で確認した後に公開します。個人情報や公開したくない内容は書かないでください。</p><form id="form"><label for="name">ニックネーム（任意）</label><input id="name" name="name" type="text" maxlength="40" autocomplete="nickname"><label for="message">コメント</label><textarea id="message" name="message" maxlength="1200" required placeholder="コーヒーの感想や、活動へのメッセージをどうぞ"></textarea><label class="trap" aria-hidden="true">Website<input id="website" type="text" tabindex="-1" autocomplete="off"></label><label class="consent"><input id="consent" type="checkbox" required><span>入力した名前とコメントが、このサイトに公開されることに同意します。</span></label><button id="submit" type="submit" disabled>コメントを送る</button></form><p id="status" role="status" aria-live="polite">入力画面を準備しています。</p><section class="comments"><h2>届いた声</h2><div id="list" aria-live="polite">読み込んでいます。</div></section><script>
var token = '';
var form = document.getElementById('form');
var status = document.getElementById('status');
var button = document.getElementById('submit');
function failure(error) { status.textContent = error.message || '読み込めませんでした。時間をおいてお試しください。'; status.className = 'error'; }
google.script.run.withSuccessHandler(function(value) { token = value; button.disabled = false; status.textContent = ''; }).withFailureHandler(failure).getCommentToken();
google.script.run.withSuccessHandler(function(rows) {
  var list = document.getElementById('list'); list.textContent = '';
  if (!rows.length) { list.textContent = 'まだ公開されたコメントはありません。最初の感想をお待ちしています。'; return; }
  rows.forEach(function(row) {
    var article = document.createElement('article'); article.className = 'entry';
    var header = document.createElement('header'); var name = document.createElement('strong'); name.textContent = row.name;
    var date = document.createElement('time'); date.textContent = row.date;
    var message = document.createElement('p'); message.textContent = row.message;
    header.append(name, date); article.append(header, message); list.append(article);
  });
}).withFailureHandler(function() { document.getElementById('list').textContent = 'コメントを読み込めませんでした。時間をおいてお試しください。'; }).getPublicComments();
form.addEventListener('submit', function(event) {
  event.preventDefault(); if (!form.reportValidity() || !token || button.disabled) return;
  button.disabled = true; status.className = ''; status.textContent = '送信しています…';
  google.script.run.withSuccessHandler(function(result) {
    if (!result || result.accepted !== true) { button.disabled = false; failure({ message:'送信を確認できませんでした。時間をおいてお試しください。' }); return; }
    form.reset(); token = ''; status.textContent = 'コメントを受け付けました。団体側で確認した後に公開します。ありがとうございます。';
  }).withFailureHandler(function(error) { button.disabled = false; failure(error); }).submitPublicComment({ token:token, name:document.getElementById('name').value, message:document.getElementById('message').value, consent:document.getElementById('consent').checked, website:document.getElementById('website').value });
});
</script></body></html>`;
