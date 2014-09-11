// ==UserScript==
// @name       diary snitch
// @namespace  http://github.com/dpleshakov/diary.ru-scripts/diary.ru_snitch.user.js
// @author     dpleshakov (http://github.com/dpleshakov)
// @version    1.0
// @description  Change 'snitch' link, just for fun.
// @include      *://*.diary.ru/*
// ==/UserScript==

function ReplaceSnitch(postLinkBackg) {
  postLinkBackg.innerHTML = postLinkBackg.innerHTML.replace(new RegExp(/Пожаловаться/g), "Наябедничать");
    
}

postLinksBackges = document.getElementsByClassName('postLinksBackg');
for(var indexLink = 0; indexLink < postLinksBackges.length; indexLink++) {
  ReplaceSnitch(postLinksBackges[indexLink]);
}