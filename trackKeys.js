var keyCon = document.createElement('div');
var keyAllCon = document.createElement('div');


function trackKeysSetup() {
    
    keyCon.setAttribute("id", "key-container");
    keyCon.innerHTML = "Last Key Entered: ";
    keyAllCon.setAttribute("id", "key-all-container");
    keyAllCon.innerHTML = "All Keys Entered: ";
    document.getElementsByTagName("BODY")[0].appendChild(keyCon);
    document.getElementsByTagName("BODY")[0].appendChild(keyAllCon);
    document.getElementsByTagName("BODY")[0].appendChild(document.createElement('br'));
    
    document.addEventListener("keypress", (evt) => {
        var key =  getKey(evt.shiftKey, evt.which);
        var textnode = document.createTextNode(key);
        keyCon.textContent = ("Last Key Entered: " + key);
        keyAllCon.appendChild(textnode);
    });
    
}