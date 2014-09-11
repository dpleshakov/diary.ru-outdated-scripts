// ==UserScript==
// @name       diary additional buttons
// @namespace  http://github.com/dpleshakov/diary.ru-scripts/diary.ru_additional_buttons.user.js
// @author     dpleshakov (http://github.com/dpleshakov)
// @version    1.0
// @description  Add additional buttons to new post page with link to any other web page.
// @include    *://*diary.ru/?newpost*
// ==/UserScript==

var css='.AdditionalButton { display: block!important; float: left!important; height: 20px!important; line-height: 21px!important; background-color: #e1e5e0!important; cursor: default!important; color: black!important; font-weight: bolder!important; } .AdditionalButton:hover {background-color: #B6BDD2!important;}';
style=document.createElement('style');
if (style.styleSheet)
    style.styleSheet.cssText=css;
else 
    style.appendChild(document.createTextNode(css));
document.getElementsByTagName('head')[0].appendChild(style);

function AddButton(name, url) {
    var newAnchor = document.createElement('a');
    newAnchor.setAttribute('href', url);
    newAnchor.setAttribute('target', '_blank');
    newAnchor.setAttribute('class', 'AdditionalButton');
    newAnchor.setAttribute('style', 'margin: 2px!important; padding: 0px 5px!important; border: 1px solid black!important;');
	newAnchor.innerHTML = name;
    
    var buttonsDiv = document.getElementById("codebuttons");
	buttonsDiv.insertBefore(newAnchor, buttonsDiv.lastChild);
}

// TO DO
// Remove comment
// change name and url
//
// AddButton('Link', 'http://ya.ru')
// AddButton('Link', 'http://ya.ru')

