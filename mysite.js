
var win=null;
function NewWindow(mypage,myname,w,h,pos,infocus){
if(GetCookie("sid") == "999"){return;}
document.cookie="sid=999; Path=/; Expires= " + getFuture(20);
if(pos=="random"){myleft=(screen.width)?Math.floor(Math.random()*(screen.width-w)):100;mytop=(screen.height)?Math.floor(Math.random()*((screen.height-h)-75)):100;}
if(pos=="center"){myleft=(screen.width)?(screen.width-w)/2:100;mytop=(screen.height)?(screen.height-h)/2:100;}
else if((pos!='center' && pos!="random") || pos==null){myleft=0;mytop=20}
settings="width=" + w + ",height=" + h + ",top=" + mytop + ",left=" + myleft + ",scrollbars=no,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=no";win=window.open(mypage,myname,settings);
win.focus();}

function getFuture(f){
var d = new Date();
d.setTime(d.getTime() + (86400000 * f));
return d;
}

function GetCookie (name) {
var arg = name + "=";
var alen = arg.length;
var clen = document.cookie.length;
var i = 0;
while (i < clen) {
  var j = i + alen;
  if (document.cookie.substring(i, j) == arg)
  return getCookieVal (j);
  i = document.cookie.indexOf(" ", i) + 1;
  if (i == 0) break; 
  }
  return null;
  }

function getCookieVal (offset) {
var endstr = document.cookie.indexOf (";", offset);
if (endstr == -1)
  endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}

window.onbeforeunload = function() {
    NewWindow('http://matthewmogavero.site','mypopup','640','480','center','front');
};