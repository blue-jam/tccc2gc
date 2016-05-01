function calendarUpdate() {
  // プロパティからIDを読み取る
  var scriptProperties = PropertiesService.getScriptProperties();
  var srcCalendarId = scriptProperties.getProperty("srcCalendarId");
  var dstCalendarId = scriptProperties.getProperty("dstCalendarId");
  // カレンダーの取得
  srcCalendar = CalendarApp.getCalendarById(srcCalendarId);
  dstCalendar = CalendarApp.getCalendarById(dstCalendarId);
  
  ignoreAtCoder = Boolean(scriptProperties.getProperty("ignoreAtCoder"));
  
  // 全部は見えないらしいので，先1か月のを調べる．
  var now = new Date();
  var oneMonthFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
  var srcEvents = srcCalendar.getEvents(now, oneMonthFromNow);
  
  // 各イベントについて処理
  var re = new RegExp("[0-9][0-9]:[0-9][0-9]");
  for each(var e in srcEvents){
    var date = e.getTitle().match(re);
    var title = RegExp.rightContext.trim();
    var startTime = new Date(Date.parse(e.getStartTime().toLocaleDateString() + " " + date));
    
    // AtCoderを無視する設定で，AtCoderのイベントならchokuDie
    var atcoder = isAtCoderEvent(title);
    if (ignoreAtCoder && atcoder) continue;

    if (isCodeforcesEvent(title)) continue;    // こどふぉは時間のAPIが公開されているので省く
    
    // 終了時刻を計算
    var duration = getDurationByTitle(title);
    var endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    
    // 重複チェック
    var res = checkDuplication(title, startTime);
    if (res == null) {
      dstCalendar.createEvent(title, startTime, endTime);
    }
    else {
      res.setTime(startTime, endTime);
    }
  }

  // Codeforcesのイベントの追加.
  var contests = getCodeforcesEvent();
  for each(var e in contests){
    var startTime = new Date(e.startTimeSeconds*1000);
    var endTime = new Date((e.startTimeSeconds + e.durationSeconds) * 1000);
    var res = checkDuplication(e.name, startTime);
    if(res == null) {
      dstCalendar.createEvent(e.name, startTime, endTime,
               { description: e.description, location:e.websiteUrl });
    } else {
      res.setTime(startTime, endTime);
      res.setLocation(e.websiteUrl);
      res.setDescription(e.description);
    }
  }
}

/*
 * タイトルからコンテストの長さを適当に取得する．当然間違う．
 */
function getDurationByTitle(title) {
  durationDictionary = {
    "SRM":90,
    "AtCoder Regular Contest": 90,
    "AtCoder Beginner Contest": 120,
    "Codeforces": 120,
    "yukicoder": 120
  };
  for (var key in durationDictionary) {
    Logger.log(title.indexOf(key));
    if(title.indexOf(key) >= 0)
      return durationDictionary[key];
  }
  return 90;
}

/*
 * 登録が重複しているか確認する
 * 重複しているなら，そのインスタンスを返す
 */
function checkDuplication(title, startTime) {
  var events = this.dstCalendar.getEventsForDay(startTime);
  for each(e in events){
    if(e.getTitle() == title)
      return e;
  }
  return null;
}

/*
 * AtCoderのイベントかどうか
 */
function isAtCoderEvent(title) {
  return title.indexOf("AtCoder") >= 0;
}
/*
 * こどふぉのイベントかどうか
 */
function isCodeforcesEvent(title) {
  return title.indexOf("Codeforces") >= 0;
}

/*
 * こどふぉのイベントを受け取る
 */
function getCodeforcesEvent(){
  var response = UrlFetchApp.fetch("http://codeforces.com/api/contest.list?gym=false&lang=en");
  var obj = JSON.parse(response.getContentText());
  var contests = obj.result;
  var res = []
  for each(var c in contests) {
    if( c.phase == "FINISHED" ) continue;
    if( c.name.indexOf("Codeforces") < 0 ) c.name = "[Codeforces]" + c.name;
    res.push(c);
  }
  return res;
}
