var clickCon = document.createElement('div');
var divClickCon = document.createElement('div');
var cliBut = document.createElement('button');
var cliLogBut = document.createElement('button');
var cliTab = document.createElement('table');
var clicks = new Map();


function trackClicksSetup() {
    clickCon.setAttribute("id", "click-container");
    clickCon.innerHTML = "Click Location: ";
    divClickCon.setAttribute("id", "div-click-container");
    divClickCon.innerHTML = "Element Clicked: ";
    cliBut.setAttribute("id", "clicks-button");
    cliBut.innerHTML = "Show Clicks";
    cliBut.setAttribute("class", "button");
    cliLogBut.setAttribute("id", "click-logs-button");
    cliLogBut.innerHTML = "Click Log";
    cliLogBut.setAttribute("class", "button");

    cliTab.setAttribute("id", "click-table");
    var row1 = cliTab.insertRow(-1);
    var resClicks = row1.insertCell(0);
    resClicks.setAttribute("class", "res");
    resClicks.setAttribute("id", "results-clicks");
    
    document.getElementsByTagName("BODY")[0].appendChild(clickCon);
    document.getElementsByTagName("BODY")[0].appendChild(divClickCon);
    document.getElementsByTagName("BODY")[0].appendChild(document.createElement('br'));
    document.getElementsByTagName("BODY")[0].appendChild(cliBut);
    document.getElementsByTagName("BODY")[0].appendChild(cliLogBut);
    document.getElementsByTagName("BODY")[0].appendChild(cliTab);
    
    document.querySelectorAll('*').forEach(function(node) {
        node.addEventListener("click", (evt) => {
            var loc = (evt.pageX + " " + evt.pageY);
            var locTime = getTimeClicks();
            clicks.set(locTime, loc);
            clickCon.textContent = ("Click Location: " + evt.pageX + " " + evt.pageY); 
        });
    });
    
    document.addEventListener("click", (evt) => {
        var clickedid = evt.target.id;
        if(!clickedid) {clickedid = "None";}
        divClickCon.textContent = ("Element Clicked: " + clickedid);
    });
    
    cliBut.addEventListener("click", (evt) => {
        cliMap = document.createElement('div');
        cliMap.setAttribute("id", "clickmap-overlay");
        document.getElementsByTagName("BODY")[0].appendChild(cliMap);
        let count = 0;
        for (let [key, value] of clicks.entries()) {
            count += 1;
            var coor = value.split(" ");
            let cli = document.createElement('div');
            cli.setAttribute("class", "clickmap-container");
            var sty = 'left:'+(coor[0]-10)+'px;top:'+(coor[1]-10)+'px;';
            cli.setAttribute("style", sty)
            cli.innerHTML = count;
            document.getElementById("clickmap-overlay").appendChild(cli);
        }
        setTimeout(function() {
            document.getElementById("clickmap-overlay").remove();
        }, 5000);
    });
    
    cliLogBut.addEventListener("click", (evt) => {
        resClicks.innerHTML = '';
        var textnode = document.createTextNode('Click Log:');
        resClicks.appendChild(textnode);
        resClicks.appendChild(document.createElement('br'));
        let sortedClicks = new Map([...clicks].sort());
        for (let [key, value] of sortedClicks.entries()) {
            var textnode = document.createTextNode("\u00a0\u00a0\u00a0"+value +" @ " + key);
            resClicks.appendChild(textnode);
            resClicks.appendChild(document.createElement('br'));
        }
    });
}