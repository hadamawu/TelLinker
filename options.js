document.addEventListener("DOMContentLoaded", function (event) {
    restore_options();
    document.getElementById("saveButton").addEventListener("click", saveOptions);
    document.getElementById("addMatchPattern").addEventListener("click", addMatchPattern);
});

var settings = null;

function saveOptions() {
    var linkFormatValue = document.getElementById("telLinkFormat").value;
    var linkTextFormatValue = document.getElementById("linkTextFormat").value;
    var overrideValue = document.getElementById("overrideLinks").checked;
    chrome.storage.local.set({
        telLinkFormat: linkFormatValue,
        linkTextFormat: linkTextFormatValue,
        overrideLinks: overrideValue
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById("status");
        status.textContent = "Options Saved";
        setTimeout(function () {
            status.innerHTML = "&nbsp;";
        }, 750);
    });
}
function addMatchPattern() {
    var status = document.getElementById("status");
    status.textContent = "Options Saved";
    setTimeout(function () {
        status.innerHTML = "&nbsp;";
    }, 750);
        /*var newPattern = window.prompt("Please enter new match pattern:", "");
    if (newPattern != null && newPattern != "") {
        settings.matchPatterns.push(newPattern);
        var listDOM = document.getElementById("matchPatternsTR");
        var item = document.createElement("li");
        var hideButton = document.createElement("div");
        hideButton.className = "hide-button";
        hideButton.appendChild(document.createTextNode("X"));
        item.title = newPattern;
        item.appendChild(hideButton);
        item.appendChild(document.createTextNode(decodeURI(newPattern)));
        listDOM.appendChild(item);
        item.onclick = removeMatchPatern;
    }*/
}
function restore_options() {
    chrome.storage.local.get({
        telLinkFormat: "",
        linkTextFormat: "",
        overrideLinks: true,
        ignoredDomains: [],
        ignoredURLS: [],
        matchPatterns: []
    }, function (items) {
        settings = items;
        document.getElementById("telLinkFormat").value = items.telLinkFormat;
        document.getElementById("linkTextFormat").value = items.linkTextFormat;
        document.getElementById("overrideLinks").checked = items.overrideLinks;

        restoreList(settings.ignoredDomains, "filteredDomainsTR", removeDomain);
        restoreList(settings.ignoredURLS, "filteredURLSTR", removeURL);
        restoreList(settings.matchPatterns, "matchPatternsTR", removeMatchPatern);
    });
}
function removeMatchPatern(event) {
    var data = event.target.textContent.substring(1);
    settings.matchPatterns.splice(settings.matchPatterns.indexOf(data), 1);
    chrome.storage.local.set({
        matchPatterns: settings.matchPatterns
    }, function () {
        event.target.remove();
        if (settings.matchPatterns.length == 0)
            document.getElementById("matchPatternsTR").remove();
    });
}
function removeDomain(event) {
    var data = event.target.textContent.substring(1);
    settings.ignoredDomains.splice(settings.ignoredDomains.indexOf(data), 1);
    chrome.storage.local.set({
        ignoredDomains: settings.ignoredDomains
    }, function () {
        event.target.remove();
        if (settings.ignoredDomains.length == 0)
            document.getElementById("filteredDomainsTR").remove();
    });
}
function removeURL(event) {
    var data = event.target.textContent.substring(1);
    settings.ignoredURLS.splice(settings.ignoredURLS.indexOf(data), 1);
    chrome.storage.local.set({
        ignoredURLS: settings.ignoredURLS
    }, function () {
        event.target.remove();
        if (settings.ignoredURLS.length == 0)
            document.getElementById("filteredURLSTR").remove();
    });
}
function restoreList(list, htmlID, removalFunction)
{
    if (list.length == 0) {
        document.getElementById(htmlID).remove();
    } else {
        var listDOM = document.getElementById(htmlID);
        for (var i = 0; i < list.length; i++) {
            var item = document.createElement("li");
            var hideButton = document.createElement("div");
            hideButton.className = "hide-button";
            hideButton.appendChild(document.createTextNode("X"));
            item.title = list[i];
            item.appendChild(hideButton);
            item.appendChild(document.createTextNode(decodeURI(list[i])));
            listDOM.appendChild(item);
            item.onclick = removalFunction;
        }
    }
}