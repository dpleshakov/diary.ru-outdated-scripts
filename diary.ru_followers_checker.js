// ==UserScript==
// @name       diary followers checker
// @namespace  https://github.com/dpleshakov/diary.ru-followers-checker
// @author     dpleshakov (https://github.com/dpleshakov)
// @version    1.0
// @include    *://*diary.ru/?favorite*
// ==/UserScript==

var lastUpdateKey = "diaryRu.followersChecker.lastUpdate";
var followersCountKey = "diaryRu.followersChecker.followers.count";
var followersKeyMask = "diaryRu.followersChecker.followers.";
var newFollowersKey = "diaryRu.followersChecker.followers.new";
var unsubscribedFollowersKey = "diaryRu.followersChecker.followers.leaved";

var informationDivClassName = "diaryRu_followersChecker_information";
var hideDef = false; /*Hide info from page*/

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function SaveFollowers(followers) {
    var storedFoolowersCount = parseInt(localStorage.getItem(followersCountKey));
    var preMask = '';
    if(storedFoolowersCount !== NaN) {
        for(var index = 0; index < storedFoolowersCount; ++index) {
            preMask = followersKeyMask + index.toString();
            localStorage.removeItem(preMask + ".name");
            localStorage.removeItem(preMask + ".url");
        }
    }
    var len = followers.length;
    localStorage.setItem(followersCountKey, len);
    for(var index = 0; index < len; ++index) {
        preMask = followersKeyMask + index.toString();
        localStorage.setItem(preMask + ".name", followers[index].name);
        localStorage.setItem(preMask + ".url", followers[index].url);
    }
}

function GetStoredFollowers() {
    var followers = [];
    var preMask = '';
    var storedFoolowersCount = parseInt(localStorage.getItem(followersCountKey));
    for(var index = 0; index < storedFoolowersCount; ++index) {
        preMask = followersKeyMask + index.toString();
        followers.push({'name': localStorage.getItem(preMask + ".name"), 'url': localStorage.getItem(preMask + ".url")});
    }
    return followers;
}

function UpdateLocalStorage(followers) {
    localStorage.setItem(lastUpdateKey, new Date().getDate());
    SaveFollowers(followers);
}

function ContainFollowerWithName(followers, followerName) {
    var len = followers.length;
    for(var index = 0; index < len; ++index) {
        if(followers[index].name == followerName) {
            return true;
        }
    }
    return false;
}

function GetFollowersComplement(leftFollowers, rightFollowers) {
    var complementResult = [];
    var len = leftFollowers.length;
    for(var index = 0; index < len; ++index) {
        var element = leftFollowers[index];
        if(!ContainFollowerWithName(rightFollowers, element.name)) {
            complementResult.push(element);
        }
    }
    return complementResult;
}

function GetFollowersFromPage() {
    var followers = [];
    var anchors = document.querySelectorAll("#pchs li a");
    var len = anchors.length;
    var elem = null;
    var name = '';
    var href = '';
    for(var index = 0; index < len; ++index) {
        elem = anchors[index];
        name = elem.innerHTML.toString();
        name.replace('<font color="red">','');
        name.replace('</font>','');
        href = elem.href.toString();
        href.replace('&amp;checknewreader"','');
        href.replace('&checknewreader"','');
        followers.push({'name': name, 'url': href});
    }
    return followers;
}

function OneFollowerToString(oneFollower) {
    return "<a href='" + oneFollower.url + "'>" + oneFollower.name + "</a>";
}

function FollowersToString(followers) {
    var result = "";
    var len = followers.length;
    for(var index = 0; index < len; ++index) {
        if(index > 0) {
            result = result + ", ";
        }
        result += OneFollowerToString(followers[index]);
    }
    return result;
}

function CreateInformationDiv(newFollowersString, unsubscribedFollowersString) {
    var informationDiv = document.getElementById(informationDivClassName);
    if(informationDiv == null) {
        var informationDiv = document.createElement("div");
        informationDiv.setAttribute("id", informationDivClassName);
        informationDiv.setAttribute("class", "menuSection");
        document.getElementById("pchs").parentNode.appendChild(informationDiv);
    }
    var newFollowersInformation = "<p><b>New followers:</b> " + newFollowersString + "</p>";
    var unsubscribedFollowersInformation = "<p><b>Leaved followers:</b> " + unsubscribedFollowersString + "</p>";
    informationDiv.innerHTML = newFollowersInformation + unsubscribedFollowersInformation;
}
 
if(!supports_html5_storage()) {
    return false;
}

function testPchsAndHide() {
    var tdiv = document.getElementById("pchs_title");
    if (tdiv == null) {
        alert("Пожалуйста, включите в настройках показ постоянных читателей на странице избранного!");
        return false;
    }
    else {
        if (hideDef) { tdiv.innerHTML=""; }
        return true;
    }
}

if(!testPchsAndHide()) {
    return false;
}

function hideDefaultPchsList() {
    var anchors = document.querySelectorAll("#pchs li");
    if (anchors != null) {
        anchors[0].innerHTML=""; // No other way for hide the element
    }
}


function main() {
    if (hideDef) { hideDefaultPchsList(); }
    var currentFollowers = GetFollowersFromPage();
    var lastUpdateDay = localStorage.getItem(lastUpdateKey);

    var newFollowersString = "";
    var unsubscribedFollowersString = "";
    if(lastUpdateDay == null) {
        // First time
        localStorage.setItem(newFollowersKey, newFollowersString);
        localStorage.setItem(unsubscribedFollowersKey, unsubscribedFollowersString);

        UpdateLocalStorage(currentFollowers);
    } else if (lastUpdateDay < new Date().getDate()) {
        // Next day, should update followers
        var yesterdeyFollowers = GetStoredFollowers();
        
        newFollowersString = FollowersToString(GetFollowersComplement(currentFollowers, yesterdeyFollowers));
        unsubscribedFollowersString = FollowersToString(GetFollowersComplement(yesterdeyFollowers, currentFollowers));

        localStorage.setItem(newFollowersKey, newFollowersString);
        localStorage.setItem(unsubscribedFollowersKey, unsubscribedFollowersString);
        
        UpdateLocalStorage(currentFollowers);
    } else {
        // Followers updated, should show stored information
        newFollowersString = localStorage.getItem(newFollowersKey);
        unsubscribedFollowersString = localStorage.getItem(unsubscribedFollowersKey);

        if (newFollowersString == null) newFollowersString = "";
        if (unsubscribedFollowersString == null) unsubscribedFollowersString = "";
    }
    
    CreateInformationDiv(newFollowersString, unsubscribedFollowersString);
}

main();