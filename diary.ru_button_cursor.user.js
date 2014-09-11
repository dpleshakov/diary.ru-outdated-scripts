// ==UserScript==
// @name       diary button curs
// @namespace  http://github.com/dpleshakov/diary.ru-scripts/diary.ru_button_cursor.user.js
// @author     dpleshakov (http://github.com/dpleshakov)
// @version    1.0
// @description  Fixed problem with [cuRs]. You can use [curs_]
// @include      *://*.diary.ru/?newpost*
// ==/UserScript==

function SetCursor() {
    console.log("in SetCursor()");
    var cursorText = '[curs_]';
    var messageElement = document.getElementById('message');
    var cursorPosition = messageElement.value.indexOf(cursorText);
    if(cursorPosition != -1) {
        messageElement.value = messageElement.value.replace(cursorText, '');
        messageElement.focus();
        messageElement.selectionStart = messageElement.selectionEnd = cursorPosition;
    }
}

document.addEventListener(
    "DOMContentLoaded",
    function() {
        document.getElementById('message').oninput = SetCursor;
        
        var newScript = document.createElement("script");
        newScript.type = "text/javascript";
        newScript.innerHTML = SetCursor.toString();
        document.getElementsByTagName('head')[0].appendChild(newScript);
        
        var aElements = document.getElementsByTagName('a');
        for(var index = 0; index < aElements.length; ++index) {
            var currentAnchor = aElements[index];
            var currentAnchorOnclick = currentAnchor.getAttribute('onclick');
            if(currentAnchorOnclick && currentAnchorOnclick.indexOf('insertCodeHTML') != -1) {
                if(currentAnchorOnclick.indexOf('return false') != -1) {
                    currentAnchor.setAttribute('onclick', currentAnchorOnclick.replace('return false', 'SetCursor(); return false'));
                } else if(currentAnchorOnclick.indexOf('return insertCodeHTML') != -1) {
                    currentAnchor.setAttribute('onclick', currentAnchorOnclick.replace(new RegExp(/return (insertCodeHTML\(.*?\);)/), '$1 SetCursor(); return false;'));
                }
                
            }
        }
    },
    false);