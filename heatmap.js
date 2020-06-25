var grid = new Map();
var gridX, gridY, gridWidth, gridHeight;
var values, vpWidth, vpHeight;
var lastTime = performance.now();
var cellAmount = 100;
var dimCon = document.createElement('div');
var gridBut = document.createElement('button');


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
    
    gridBut.setAttribute("id", "heatmap-button");
    gridBut.setAttribute("class", "button");
    gridBut.innerHTML = "Show Heatmap";
    gridBut.addEventListener("click", (evt) => {
           showGridMap(); 
    });
    document.getElementsByTagName("BODY")[0].appendChild(gridBut);
    
    document.addEventListener("mousemove", (evt) => {
            addTime(evt.pageX, evt.pageY);
    });
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
    for(var i = 0; i < gridX; i++){
        for(var j = 0; j < gridY; j++){
            //grid.set(i + "x" + j, 0);
        }
    }
}


function displayGridTimes(){
    document.getElementById("grid-times").innerHTML = '';
    for(var i = 0; i < gridX; i++){
        for(var j = 0; j < gridY; j++){
            var text = document.createTextNode(i + "x" + j + ":  " + grid.get(i + "x" + j).toFixed(3));
            document.getElementById("grid-times").appendChild(text);
            document.getElementById("grid-times").appendChild(document.createElement("br"));
        }
    }
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
    //Add time (but less time than target cell) to adjacent cells (remove depending on desire of map accuracy / cell overflow)
    totalTime /= 3;
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
    
    lastTime = nowTime;
}


function getMax () {
    var maxValue;
    for (let [key, value] of grid.entries()) {
        maxValue = (!maxValue || maxValue < value) ? value : maxValue;
    }
    return maxValue;
}


function showGridMap(){
    var heatMap = document.createElement('div');
    heatMap.setAttribute("id", "heatmap-overlay");
    document.getElementsByTagName("BODY")[0].appendChild(heatMap);
    var maxTime = getMax();
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
            document.getElementById("heatmap-overlay").appendChild(heatCell);
        }
    }
    setTimeout(function() {
        document.getElementById("heatmap-overlay").remove();
    }, 5000);
}

