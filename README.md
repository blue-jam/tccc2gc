# tccc2gc
TopCoder部のカレンダーをGoogleカレンダーに書き込みます

[TopCoder部のカレンダー](https://topcoder.g.hatena.ne.jp)の内容を，
開始時間情報込みでGoogleカレンダーに書き込むGoogle Apps Scriptです．

Googleカレンダーの予定をいじります．
**「最悪予定が全部消えるかもしれない」**という覚悟のもと使ってください．

50週先まで1日毎に更新するカレンダーは[こちら](https://calendar.google.com/calendar/embed?src=2liqa7qfpt8dtf8rntpt472v7g%40group.calendar.google.com&ctz=Asia/Tokyo)にあります．

# 使い方

0. Googleアカウントでログインしておきます
1. Googleカレンダーの「他のカレンダー」→「URLで追加」を選択し，
TopCoder部のカレンダーのiCalendar形式ファイルのURL
https://topcoder.g.hatena.ne.jp/calendar?mode=ical を貼り付けます．
2. (既存のカレンダーを出力先に使わないのであれば，)
新しいGoogleカレンダーを作成します．
3. Googleドライブの「新規」→「その他」→「Google Apps Script」を選択します．
4. コードを入力する画面が出てくるので，tccc2gc.gsの中身を貼り付けます．
5. 適当な名前で保存します．
6. 「ファイル」→「プロジェクトのプロパティ」を選択し，スクリプトプロパティに
  
  | プロパティ    | 値                                                           |
  |:-------------:|:-------------------------------------------------------------|
  | srcCalendarId | (TopCoder部のカレンダーをインポートしたGoogleカレンダーのID) |
  | dstCalendarId | (出力先のGoogleカレンダーのID)                               |

  とします．AtCoderのイベントをカレンダーに追加したくない場合のみ，スクリプトプロパティに
  ignoreAtCoderを作成してください．
8. 一旦保存をした後に，「関数を選択」メニューから「calendarUpdate」を選び，
実行ボタンを押します．アプリケーションの承認が求められます．
承認し，スクリプトが正しく実行されれば出力先カレンダーに予定が書き込まれるはずです．
9. 自動で定期的に実行させる場合は，「現在のプロジェクトのトリガー（時計の絵のアイコン）」をクリックし，
calendarUpdateに対するトリガーを追加します．

# プロパティの設定

| プロパティ    | 値                                                           |
|:-------------:|:-------------------------------------------------------------|
| ignoreAtCoder | AtCoderのコンテストを追加したくない時は，空でない文字列を入れる  |
| fetchWeeks    | 取ってくるカレンダーの期間（デフォルトで5週間）              |
