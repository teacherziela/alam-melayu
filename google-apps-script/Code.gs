/** HISTORYVERSE 360 — Google Sheets receiver
 * Deploy as Web App: Execute as Me; access as permitted by school policy.
 * Sheet: Rekod PBD HistoryVerse
 */
const SHEET_ID='18OtPZMZ3Rjq9syI35hqxo1xB_gA7oTH4XN_tiyo6T98';
function doPost(e){
  try{
    const p=JSON.parse(e.postData.contents||'{}');
    const clean=v=>String(v??'').replace(/^[=+@-]/,"'"+String(v??'').charAt(0)).slice(0,250);
    if(!p.nama||!p.kelas||!p.topik||!Number.isFinite(Number(p.markah))||!Number.isFinite(Number(p.markahPenuh)))throw Error('Data tidak lengkap');
    const full=Number(p.markahPenuh),score=Number(p.markah);
    if(full<=0||score<0||score>full)throw Error('Markah tidak sah');
    const lock=LockService.getScriptLock();lock.waitLock(15000);
    try{
      const sh=SpreadsheetApp.openById(SHEET_ID).getSheetByName('Rekod PBD HistoryVerse');
      sh.appendRow([new Date(),clean(p.idMurid),clean(p.nama),clean(p.kelas),clean(p.topik),score,full,Math.round(score/full*100),clean(p.tp||'Belum ditaksir'),Number(p.bilBetul)||0,Number(p.bilSoalan)||0,clean(p.catatan||'')]);
    }finally{lock.releaseLock()}
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err.message)})).setMimeType(ContentService.MimeType.JSON)}
}
function doGet(){return ContentService.createTextOutput('HistoryVerse PBD receiver ready')}
