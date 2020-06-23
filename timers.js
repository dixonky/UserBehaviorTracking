function getTime() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    m = formatTime(m);
    s = formatTime(s);
    var time = ("Time: " + h + ":" + m + ":" + s);
    return time;
}
function getTimeClicks() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    var ms = now.getMilliseconds();
    m = formatTime(m);
    s = formatTime(s);
    var time = (h + ":" + m + ":" + s + ':' + ms);
    return time;
}
function formatTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}