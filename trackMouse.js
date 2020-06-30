var startTimeMilli = performance.now();
var mouseMove = new Map();
var mouBut = document.createElement('button');
var mouCon = document.createElement('div');

function trackMouseSetup() {
    mouCon.setAttribute("id", "mouse-container");
    mouCon.innerHTML = "Mouse Location: ";
    mouBut.setAttribute("id", "mouse-button");
    mouBut.innerHTML = "Track Mouse";
    mouBut.setAttribute("class", "button");
    document.getElementsByTagName("BODY")[0].appendChild(mouCon);
    document.getElementsByTagName("BODY")[0].appendChild(mouBut);
    document.getElementsByTagName("BODY")[0].appendChild(document.createElement('br'));
    
    document.addEventListener("mousemove", (evt) => {
        var loc = (evt.pageX + " " + evt.pageY);
        var locTime = performance.now();
        mouseMove.set(locTime, loc);
        mouCon.textContent = ("Mouse Location: " + evt.pageX + " " + evt.pageY);
    });
    
    mouBut.addEventListener("click", (evt) => {
        cliMap = document.createElement('div');
        cliMap.setAttribute("id", "clickmap-overlay");
        document.getElementsByTagName("BODY")[0].appendChild(cliMap);
        var prevTime = startTimeMilli;
        let delayTot = 0;
        let count = 0;
        for (let [key, value] of mouseMove.entries()) {
            count += 1;
            if (count == 361){count = 0;}
            let coor = value.split(" ");                
            let cli = document.createElement('div');
            cli.setAttribute("class", "mousemap-container");
            var sty = 'left:'+(coor[0]-10)+'px;top:'+(coor[1]-10)+'px;' + 
                'background-color: hsl('+count+', 100%, 50%);';
            cli.setAttribute("style", sty);
            let nowTime = key;
            let delay = nowTime - prevTime;
            delayTot += delay;
            function timer(){ 
                setTimeout(()=>{
                    document.getElementById("clickmap-overlay").appendChild(cli);
                }, delayTot);
            }
            timer();
            prevTime = nowTime;
        }
        setTimeout(function() {
            document.getElementById("clickmap-overlay").remove();
        }, 3000 + delayTot);
    });
}



