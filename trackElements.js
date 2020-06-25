var startTime, elapTime, diffTime, time, secs;
var mouEntTime, mouLeaTime, mouDiffTime, mouSecs;
var hoverID, leaveID;
var eleTimes = new Map();

var timeStartCon = document.createElement('div');
var timeNowCon = document.createElement('div');
var timeElapCon = document.createElement('div');
var divHoverCon = document.createElement('div');
var logBut = document.createElement('button');
var resTab = document.createElement('table');


function trackElementsSetup() {
    timeStartCon.setAttribute("id", "time-start-container");
    timeNowCon.setAttribute("id", "time-now-container");
    timeNowCon.innerHTML = "Current Time: ";
    timeElapCon.setAttribute("id", "time-elap-container");
    timeElapCon.innerHTML = "Elapsed Time: ";
    divHoverCon.setAttribute("id", "div-hover-container");
    divHoverCon.innerHTML = "Element Hovered: ";
    logBut.setAttribute("id", "logs-button");
    logBut.innerHTML = "Logs";
    logBut.setAttribute("class", "button");

    resTab.setAttribute("id", "time-table");
    var row1 = resTab.insertRow(-1);
    var resTimes = row1.insertCell(0);
    resTimes.setAttribute("class", "res");
    resTimes.setAttribute("id", "results-times");

    document.getElementsByTagName("BODY")[0].appendChild(timeStartCon);
    document.getElementsByTagName("BODY")[0].appendChild(timeNowCon);
    document.getElementsByTagName("BODY")[0].appendChild(timeElapCon);
    document.getElementsByTagName("BODY")[0].appendChild(document.createElement('br'));
    document.getElementsByTagName("BODY")[0].appendChild(divHoverCon);
    document.getElementsByTagName("BODY")[0].appendChild(logBut);
    document.getElementsByTagName("BODY")[0].appendChild(resTab);


    //Time on site functions
    startTime = performance.now();
    time = "Start " + getTime();
    timeStartCon.textContent = time;
    time = "Current " + getTime();
    timeNowCon.textContent = time;
    setInterval(function() {
        time = "Current " + getTime();
        timeNowCon.textContent = time;
    }, 1000);
    setInterval(function() {
        elapTime = performance.now();
        diffTime = elapTime - startTime;
        diffTime /= 1000;
        secs = Math.round(diffTime);
        timeElapCon.textContent = ("Elapsed Time: " + secs);
    }, 1000);


    //Add events to individual elements
    document.querySelectorAll('*').forEach(function(node) {
        node.addEventListener("mouseover", (evt) => {
            hoverID = evt.target.id;
            if(hoverID){mouEntTime = performance.now();}
            if(!hoverID) {hoverID = "None";}
            divHoverCon.textContent = ("Element Hovered: " + hoverID);
        });
        node.addEventListener("mouseleave", (evt) => {
            leaveID = evt.target.id;
            if (hoverID == leaveID) {
                mouLeaTime = performance.now();
                mouDiffTime = mouLeaTime - mouEntTime;
                mouDiffTime = Math.round(mouDiffTime);
                mouDiffTime /= 1000;
                if(eleTimes.has(leaveID)){
                    eleTimes.set(leaveID, (eleTimes.get(leaveID)+mouDiffTime));
                }
                else {
                    eleTimes.set(leaveID, mouDiffTime);
                }
            }
        });
    });

    //Add events to the buttons
    logBut.addEventListener("click", (evt) => {
        resTimes.innerHTML = '';
        var textnode = document.createTextNode('Time Spent on Each Element:');
        resTimes.appendChild(textnode);
        resTimes.appendChild(document.createElement('br'));
        let sortedTimes = new Map([...eleTimes].sort());
        for (let [key, value] of sortedTimes.entries()) {
            var textnode = document.createTextNode("\u00a0\u00a0\u00a0"+key + ' = ' + value.toFixed(3));
            resTimes.appendChild(textnode);
            resTimes.appendChild(document.createElement('br'));
        }
    });
}