document.addEventListener("DOMContentLoaded", function (event) {
    restore_options();
    document.getElementById("saveButton").addEventListener("click", saveOptions);
    document.getElementById("addMatchPattern").addEventListener("click", addMatchPattern); 
    document.getElementById("addMatchFinalBtn").addEventListener("click", addMatchFinal);
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
    document.getElementById("hiddenAddMatchField").style.visibility = "visible";
}
function addMatchFinal() {
    var newPattern = document.getElementById("addMatchField").value;
    if (newPattern != null && newPattern != "") {
        document.getElementById("matchPatternsTR").style.visibility = "visible";
        settings.matchPatterns.push(newPattern);
        var listDOM = document.getElementById("matchPatternsList");
        var item = document.createElement("li");
        var hideButton = document.createElement("div");
        hideButton.className = "hide-button";
        hideButton.appendChild(document.createTextNode("X"));
        item.title = newPattern;
        item.appendChild(hideButton);
        item.appendChild(document.createTextNode(decodeURI(newPattern)));
        listDOM.appendChild(item);
        item.onclick = removeMatchPatern;
    }
    document.getElementById("addMatchField").value = "";
    document.getElementById("hiddenAddMatchField").style.visibility = "hidden";

    chrome.storage.local.set({
        matchPatterns: settings.matchPatterns,
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById("status");
        status.textContent = "Pattern Added";
        setTimeout(function () {
            status.innerHTML = "&nbsp;";
        }, 750);
    });
}
function restore_options() {
    chrome.storage.local.get({
        telLinkFormat: "",
        linkTextFormat: "",
        overrideLinks: true,
        ignoredDomains: [],
        ignoredURLS: [],
        matchPatterns: ["(?:[\\s:]|\\d+(?:-|\\.)|^)\\(?(\\d{3})\\)?[- \\.]?(\\d{3})[- \\.]?(\\d{4})(?=<|\\s|$)"]
    }, function (items) {
        settings = items;
        document.getElementById("telLinkFormat").value = items.telLinkFormat;
        document.getElementById("linkTextFormat").value = items.linkTextFormat;
        document.getElementById("overrideLinks").checked = items.overrideLinks;

        restoreList(settings.ignoredDomains, "filteredDomainsTR", "filteredDomainsList", removeDomain);
        restoreList(settings.ignoredURLS, "filteredURLSTR", "filteredURLList", removeURL);
        restoreList(settings.matchPatterns, "matchPatternsTR", "matchPatternsList", removeMatchPatern);
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
function restoreList(list, htmlID, htmlListID, removalFunction)
{
    if (list.length == 0) {
        document.getElementById(htmlID).remove();
    } else {
        var listDOM = document.getElementById(htmlListID);
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