var grid = new Map();
var gridP = new Map();
var tableTimes = new Map();
var tablePerc = new Map();
var gridX, gridY, gridWidth, gridHeight;
var values, vpWidth, vpHeight;
var lastTime = performance.now();
var cellAmount = 200;
var tableDim = 100;
var dimCon = document.createElement('div');
var gridBut = document.createElement('button');
var tabBut = document.createElement('button');
var isPaused = false;


function heatmapSetup() {
    dimCon.setAttribute("id", "dimensions-container");
    document.getElementsByTagName("BODY")[0].appendChild(dimCon);
    document.getElementsByTagName("BODY")[0].appendChild(document.createElement('br'));
    
    values = getDimensions();
    vpWidth = values.width;
    vpHeight = values.height;
    dimCon.innerHTML = ('Viewport: '+vpWidth+'x'+vpHeight);
    
    document.getElementsByTagName("BODY")[0].onresize = function() {
        values = getDimensionsUpdate();
        vpWidth = values.width;
        vpHeight = values.height;
        dimCon.innerHTML = ('Viewport: '+vpWidth+'x'+vpHeight);
    };
    
    document.addEventListener("mousemove", (evt) => {
        addTime(evt.pageX, evt.pageY);
    });
    
    gridBut.setAttribute("id", "heatmap-button");
    gridBut.setAttribute("class", "button");
    gridBut.innerHTML = "Show Heatmap";
    gridBut.addEventListener("click", (evt) => {
        loadStart();
        window.setTimeout(showGridMap, 0);
    });
    document.getElementsByTagName("BODY")[0].appendChild(gridBut);
    
    tabBut.setAttribute("id", "table-button");
    tabBut.setAttribute("class", "button");
    tabBut.innerHTML = "Show Grid";
    tabBut.addEventListener("click", (evt) => {
        createTable(values.width, values.height);
    });
    document.getElementsByTagName("BODY")[0].appendChild(tabBut);
}


function getDimensions(){
    if (typeof window.innerWidth != 'undefined'){
          vpWidth = window.innerWidth,
          vpHeight = window.innerHeight
     }
     else if (typeof document.documentElement != 'undefined'
         && typeof document.documentElement.clientWidth !=
         'undefined' && document.documentElement.clientWidth != 0){
           vpWidth = document.documentElement.clientWidth,
           vpHeight = document.documentElement.clientHeight
     }
     else{
           vpWidth = document.getElementsByTagName('body')[0].clientWidth,
           vpHeight = document.getElementsByTagName('body')[0].clientHeight
     }
    createGrid(vpWidth, vpHeight);
    return {width: vpWidth, height: vpHeight};
}


function createGrid(width, height){
    gridWidth = width;
    gridHeight = height;
    gridX = cellAmount;
    gridY = cellAmount;
    for(var i = 0; i < gridX; i++){
        for(var j = 0; j < gridY; j++){
            grid.set(i + "x" + j, 0);
            gridP.set(i + "x" + j, 0);
        }
    }
}

function getDimensionsUpdate(){
    if (typeof window.innerWidth != 'undefined'){
          vpWidth = window.innerWidth,
          vpHeight = window.innerHeight
     }
     else if (typeof document.documentElement != 'undefined'
         && typeof document.documentElement.clientWidth !=
         'undefined' && document.documentElement.clientWidth != 0){
           vpWidth = document.documentElement.clientWidth,
           vpHeight = document.documentElement.clientHeight
     }
     else{
           vpWidth = document.getElementsByTagName('body')[0].clientWidth,
           vpHeight = document.getElementsByTagName('body')[0].clientHeight
     }
    createGridUpdate(vpWidth, vpHeight);
    return {width: vpWidth, height: vpHeight};
}


function createGridUpdate(width, height){
    gridWidth = width;
    gridHeight = height;
    gridX = cellAmount;
    gridY = cellAmount;
}


function getLoc(coorX, coorY){
    var X = Math.floor((coorX / gridWidth)*cellAmount);
    var Y = Math.floor((coorY / gridHeight)*cellAmount);
    return {x: X, y: Y};
}


function addTime(coorX, coorY){
    var nowTime = performance.now();
    var totalTime = nowTime - lastTime;
    var values = getLoc(coorX, coorY);
    var t = grid.get(values.x + "x" + values.y);
    grid.set(values.x + "x" + values.y, t+totalTime);
    
    var tPure = gridP.get(values.x + "x" + values.y);
    var toInt = parseInt(tPure+totalTime);
    gridP.set(values.x + "x" + values.y, toInt);
    
    //Add time (but less time than target cell) to adjacent cells (remove depending on desire of map accuracy / cell overflow)
    totalTime /= 2;
    if((values.x-1) >= 0 ){
        t = grid.get((values.x-1) + "x" + values.y);
        grid.set((values.x-1) + "x" + values.y, t+totalTime);
        if((values.y-1) >= 0 ){
            t = grid.get((values.x-1) + "x" + (values.y-1));
            grid.set((values.x-1) + "x" + (values.y-1), t+totalTime);
        }
        if((values.y+1) <= cellAmount ){
            t = grid.get((values.x-1) + "x" + (values.y+1));
            grid.set((values.x-1) + "x" + (values.y+1), t+totalTime);
        }
    }
    if((values.x+1) <= cellAmount ){
        t = grid.get((values.x+1) + "x" + values.y);
        grid.set((values.x+1) + "x" + values.y, t+totalTime);
        if((values.y-1) >= 0 ){
            t = grid.get((values.x+1) + "x" + (values.y-1));
            grid.set((values.x+1) + "x" + (values.y-1), t+totalTime);
        }
        if((values.y+1) <= cellAmount ){
            t = grid.get((values.x+1) + "x" + (values.y+1));
            grid.set((values.x+1) + "x" + (values.y+1), t+totalTime);
        }
    }
    if((values.y-1) >= 0 ){
        t = grid.get(values.x + "x" + (values.y-1));
        grid.set(values.x + "x" + (values.y-1), t+totalTime);
    }
    if((values.y+1) <= cellAmount ){
        t = grid.get(values.x + "x" + (values.y+1));
        grid.set(values.x + "x" + (values.y+1), t+totalTime);
    }
    
    //Add another layer of times
    totalTime /= 3;
    if((values.x-2) >= 0 ){
        t = grid.get((values.x-2) + "x" + values.y);
        grid.set((values.x-2) + "x" + values.y, t+totalTime);
        if((values.y-1) >= 0 ){
            t = grid.get((values.x-2) + "x" + (values.y-1));
            grid.set((values.x-2) + "x" + (values.y-1), t+totalTime);
        }
        if((values.y+1) <= cellAmount ){
            t = grid.get((values.x-2) + "x" + (values.y+1));
            grid.set((values.x-2) + "x" + (values.y+1), t+totalTime);
        }
        if((values.y-2) >= 0 ){
            t = grid.get((values.x-2) + "x" + (values.y-2));
            grid.set((values.x-2) + "x" + (values.y-2), t+totalTime);
        }
        if((values.y+2) <= cellAmount ){
            t = grid.get((values.x-2) + "x" + (values.y+2));
            grid.set((values.x-2) + "x" + (values.y+2), t+totalTime);
        }
    }
    if((values.x+2) <= cellAmount ){
        t = grid.get((values.x+2) + "x" + values.y);
        grid.set((values.x+2) + "x" + values.y, t+totalTime);
        if((values.y-1) >= 0 ){
            t = grid.get((values.x+2) + "x" + (values.y-1));
            grid.set((values.x+2) + "x" + (values.y-1), t+totalTime);
        }
        if((values.y+1) <= cellAmount ){
            t = grid.get((values.x+2) + "x" + (values.y+1));
            grid.set((values.x+2) + "x" + (values.y+1), t+totalTime);
        }
        if((values.y-2) >= 0 ){
            t = grid.get((values.x+2) + "x" + (values.y-2));
            grid.set((values.x+2) + "x" + (values.y-2), t+totalTime);
        }
        if((values.y+2) <= cellAmount ){
            t = grid.get((values.x+2) + "x" + (values.y+2));
            grid.set((values.x+2) + "x" + (values.y+2), t+totalTime);
        }
    }
    if((values.y-2) >= 0 ){
        t = grid.get(values.x + "x" + (values.y-2));
        grid.set(values.x + "x" + (values.y-2), t+totalTime);
        if((values.x-1) >= 0 ){
            t = grid.get((values.x-1) + "x" + (values.y-2));
            grid.set((values.x-1) + "x" + (values.y-2), t+totalTime);
        }
        if((values.x+1) <= cellAmount ){
            t = grid.get((values.x+1) + "x" + (values.y-2));
            grid.set((values.x+1) + "x" + (values.y-2), t+totalTime);
        }
    }
    if((values.y+2) <= cellAmount ){
        t = grid.get(values.x + "x" + (values.y+2));
        grid.set(values.x + "x" + (values.y+2), t+totalTime);
        if((values.x-1) >= 0 ){
            t = grid.get((values.x-1) + "x" + (values.y+2));
            grid.set((values.x-1) + "x" + (values.y+2), t+totalTime);
        }
        if((values.x+1) <= cellAmount ){
            t = grid.get((values.x+1) + "x" + (values.y+2));
            grid.set((values.x+1) + "x" + (values.y+2), t+totalTime);
        }
    }
    
    lastTime = nowTime;
}


function getMax(map) {
    var maxValue;
    for (let [key, value] of map.entries()) {
        maxValue = (!maxValue || maxValue < value) ? value : maxValue;
    }
    return maxValue;
}


function loadStart() {
    var frag = document.createDocumentFragment();
    var loadingGif = document.createElement('div');
    loadingGif.id = "loading";
    frag.appendChild(loadingGif);
    console.log("loading...");
    document.body.appendChild(frag);
}
function loadEnd() {
    document.getElementById("loading").remove();
    console.log("stopped loading");
}


async function showGridMap(){
    var heatMap = document.createElement('div');
    heatMap.setAttribute("id", "heatmap-overlay");
    document.getElementsByTagName("BODY")[0].appendChild(heatMap);
    var firstTime = performance.now();
    console.log("appending...");
    await makeGrid();
    var secondTime = performance.now();
    console.log("appended: " + (secondTime - firstTime).toFixed(0));
    loadEnd();
    setTimeout(function() {
        document.getElementById("heatmap-overlay").remove();
    }, 5000);

}


async function makeGrid(){
    var frag = document.createDocumentFragment();
    var maxTime = getMax(grid);
    for(var i = 0; i < gridX; i++){
        for(var j = 0; j < gridY; j++){
            var cellTime = (grid.get(i + "x" + j).toFixed(3));
            var percentMax, colorCode = 0;
            if (cellTime == 0) {colorCode = 240;}
            else {
                var percentMax = (cellTime / maxTime).toFixed(3);
                colorCode = ((percentMax - 1) * -1) * 240;
            }
            let heatCell = document.createElement('div');
            heatCell.setAttribute("class", "heatmap-cell");
            var sizeX = gridWidth / gridX;
            var sizeY = gridHeight / gridY;
            var cX = sizeX * i;
            var cY = sizeY * j;
            var sty;
            if (colorCode == 240){
                sty = 'left:'+cX+'px; top:'+cY+'px; ' +
                'width: ' + sizeX +'px; height: '+ sizeY + 'px; ' +
                'background-color: hsl('+colorCode+', 95%, 25%);';
                }
            else {
                sty = 'left:'+cX+'px; top:'+cY+'px; ' +
                'width: ' + sizeX +'px; height: '+ sizeY + 'px; ' +
                'background-color: hsl('+colorCode+', 85%, 25%);';
            }
            heatCell.setAttribute("style", sty);
            frag.appendChild(heatCell);
        }
    }
    document.getElementById("heatmap-overlay").appendChild(frag);
}


async function createTable(width, height){
    loadStart();
    var colNum = Math.floor(width / tableDim);
    var rowNum = Math.floor(height / tableDim);
    if ((height % tableDim) != 0){rowNum++;}
    if ((width % tableDim) != 0){colNum++;}
    const result1 = await makeAreas(rowNum, colNum);
    console.log(result1);
    const result2 = await makeTable(rowNum, colNum);
    console.log(result2);
    loadEnd();
    setTimeout(function() {
        document.getElementById("area-table").remove();
    }, 5000);
}


async function makeAreas(rows, cols){
    return new Promise(resolve => {
        for(var i = 0; i < rows; i++){
            for(var j = 0; j < cols; j++){
                tableTimes.set(i + "x" + j, 0);
                tablePerc.set(i + "x" + j, 0);
            }
        }
        for(var i = 0; i < gridX; i++){
            for(var j = 0; j < gridY; j++){
                var cellTime = (gridP.get(i + "x" + j));
                let cellRow = Math.floor((j * rows) / gridX);
                let cellCol = Math.floor((i * cols) / gridY);
                let t = tableTimes.get(cellRow + "x" + cellCol);
                let totalTime = (t + cellTime);
                tableTimes.set(cellRow + "x" + cellCol, totalTime);
            }
        }
        var maxTime = getMax(tableTimes);
        for(var i = 0; i < rows; i++){
            for(var j = 0; j < cols; j++){
                var time = tableTimes.get(i + "x" + j);
                var percentMax = (time / maxTime).toFixed(2);
                tablePerc.set(i + "x" + j, percentMax);
            }
        }
        
        resolve("done 1");
    });
}


async function makeTable(rowNum, colNum){
    return new Promise(resolve => {
        var oldTab = document.getElementById("area-table");
        if (oldTab){document.getElementById("area-table").remove();}
        var tab = document.createElement('TABLE');
        tab.id = "area-table";
        for(var i = 0; i < rowNum; i++){
            var row = tab.insertRow(i-1);
            for(var j = 0; j < colNum; j++){
                var cell = row.insertCell(j);
                var colorCode = tablePerc.get(i + "x" + j);
                var per = colorCode;
                colorCode = (((colorCode - 1) * -1) * 240).toFixed(2);
                var sty = 'background-color: hsl('+colorCode+', 85%, 25%);';
                cell.setAttribute("style", sty);
                cell.innerHTML = tableTimes.get(i + "x" + j) + '<br>' + (per * 100).toFixed(0);
            }
        }
        document.body.appendChild(tab);
        resolve("done 2");
    });
}
