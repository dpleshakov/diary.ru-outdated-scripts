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

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function SaveFollowers(followers) {
    var storedFoolowersCount = parseInt(localStorage.getItem(followersCountKey));
    if(storedFoolowersCount !== NaN) {
        for(var index = 0; index < storedFoolowersCount; ++index) {
            localStorage.removeItem(followersKeyMask + index.toString() + ".name");
            localStorage.removeItem(followersKeyMask + index.toString() + ".url");
        }
    }
    
    localStorage.setItem(followersCountKey, followers.length);
    for(var index = 0; index < followers.length; ++index) {
        localStorage.setItem(followersKeyMask + index.toString() + ".name", followers[index].name);
        localStorage.setItem(followersKeyMask + index.toString() + ".url", followers[index].url);
    }
}

function GetStoredFollowers() {
    var followers = [];
    var storedFoolowersCount = parseInt(localStorage.getItem(followersCountKey));
    for(var index = 0; index < storedFoolowersCount; ++index) {
        followers.push({'name': localStorage.getItem(followersKeyMask + index.toString() + ".name"), 'url': localStorage.getItem(followersKeyMask + index.toString() + ".url")});
    }
    return followers;
}

function UpdateLocalStorage(followers) {
    localStorage.setItem(lastUpdateKey, new Date().getDate());
    SaveFollowers(followers);
}

function ContainFollowerWithName(followers, followerName) {
    for(var index = 0; index < followers.length; ++index) {
        if(followers[index].name == followerName) {
            return true;
        }
    }
    return false;
}

function GetFollowersComplement(leftFollowers, rightFollowers) {
    var complementResult = [];
    for(var index = 0; index < leftFollowers.length; ++index) {
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
    for(var index = 0; index < anchors.length; ++index) {
        followers.push({'name': anchors[index].innerHTML, 'url': anchors[index].href});
    }
    return followers;
}

function OneFollowerToString(oneFollower) {
    return "<a href='" + oneFollower.url + "'>" + oneFollower.name + "</a>";
}

function FollowersToString(followers) {
    var result = "";
    for(var index = 0; index < followers.length; ++index) {
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

function main() {
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
        unsubscribedFollowersString = localStorage.getItem(unsubscribedFollowersString);

        if (newFollowersString == null) newFollowersString = "";
        if (unsubscribedFollowersString == null) unsubscribedFollowersString = "";
    }
    
    CreateInformationDiv(newFollowersString, unsubscribedFollowersString);
}

main();