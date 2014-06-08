chrome.management.onUninstalled.addListener(function(id) {
    if(localStorage[id] == "diary followers checker" || id == "diary followers checker") {
        var lastUpdateKey = "diaryRu.followersChecker.lastUpdate";
        var followersCountKey = "diaryRu.followersChecker.followers.count";
        var followersKeyMask = "diaryRu.followersChecker.followers.";
        var newFollowersKey = "diaryRu.followersChecker.followers.new";
        var unsubscribedFollowersKey = "diaryRu.followersChecker.followers.leaved";
        var storedFoolowersCount = parseInt(localStorage.getItem(followersCountKey));
        var preMask = '';
        if(storedFoolowersCount !== NaN) {
            for(var index = 0; index < storedFoolowersCount; ++index) {
                preMask = followersKeyMask + index.toString();
                localStorage.removeItem(preMask + ".name");
                localStorage.removeItem(preMask + ".url");
            }
        }
        localStorage.removeItem(lastUpdateKey);
        localStorage.removeItem(followersCountKey);
        localStorage.removeItem(newFollowersKey);
        localStorage.removeItem(unsubscribedFollowersKey);
    }
}); 