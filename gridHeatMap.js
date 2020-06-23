var grid = new Map();
var gridX, gridY, gridWidth, gridHeight;
var lastTime = performance.now();
var cellAmount = 50;


function getDimensions(){
    var vpWidth, vpHeight;
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
    body.appendChild(heatMap);
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

