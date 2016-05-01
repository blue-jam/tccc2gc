function calendarUpdate() {
  // �v���p�e�B����ID��ǂݎ��
  var scriptProperties = PropertiesService.getScriptProperties();
  var srcCalendarId = scriptProperties.getProperty("srcCalendarId");
  var dstCalendarId = scriptProperties.getProperty("dstCalendarId");
  // �J�����_�[�̎擾
  srcCalendar = CalendarApp.getCalendarById(srcCalendarId);
  dstCalendar = CalendarApp.getCalendarById(dstCalendarId);
  
  ignoreAtCoder = Boolean(scriptProperties.getProperty("ignoreAtCoder"));
  
  // �S���͌����Ȃ��炵���̂ŁC��1�����̂𒲂ׂ�D
  var now = new Date();
  var oneMonthFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
  var srcEvents = srcCalendar.getEvents(now, oneMonthFromNow);
  
  // �e�C�x���g�ɂ��ď���
  var re = new RegExp("[0-9][0-9]:[0-9][0-9]");
  for each(var e in srcEvents){
    var date = e.getTitle().match(re);
    var title = RegExp.rightContext.trim();
    var startTime = new Date(Date.parse(e.getStartTime().toLocaleDateString() + " " + date));
    
    // AtCoder�𖳎�����ݒ�ŁCAtCoder�̃C�x���g�Ȃ�chokuDie
    var atcoder = isAtCoderEvent(title);
    if (ignoreAtCoder && atcoder) continue;
    
    // �I���������v�Z
    var duration = getDurationByTitle(title);
    var endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    
    // �d���`�F�b�N
    var res = checkDuplication(title, startTime);
    if (res == null) {
      dstCalendar.createEvent(title, startTime, endTime);
    }
    else {
      res.setTime(startTime, endTime);
    }
  }
}

/*
 * �^�C�g������R���e�X�g�̒�����K���Ɏ擾����D���R�ԈႤ�D
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
 * �o�^���d�����Ă��邩�m�F����
 * �d�����Ă���Ȃ�C���̃C���X�^���X��Ԃ�
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
 * AtCoder�̃C�x���g���ǂ���
 */
function isAtCoderEvent(title) {
  return title.indexOf("AtCoder") >= 0;
}
