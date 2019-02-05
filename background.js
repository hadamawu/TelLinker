var defaultTelFormat = 'tel:+1-{1}-{2}-{3}';

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "call",
        title: "Call Number",
        contexts: ['selection'],
    });
    chrome.storage.local.set({
        telLinkFormat: "tel:+1-{1}-{2}-{3}",
        overrideLinks: true,
        linkTextFormat: "{0}",
        ignoredDomains: [],
        ignoredURLS: [],
        matchPatterns: [ "(?:[\\s:]|\\d+(?:-|\\.)|^)\\(?(\\d{3})\\)?[- \\.]?(\\d{3})[- \\.]?(\\d{4})(?=<|\\s|$)" ]
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    var selectedText = info.selectionText;
    chrome.storage.local.get({
        telLinkFormat: defaultTelFormat,
        matchPatterns: ["(?:[\\s:]|\\d+(?:-|\\.)|^)\\(?(\\d{3})\\)?[- \\.]?(\\d{3})[- \\.]?(\\d{4})(?=<|\\s|$)"]
    }, function (settings) {
        for (var i = 0; i < settings.matchPatterns.length; i++) {
            var phoneRegex = new RegExp(settings.matchPatterns[i], "g");
            if (phoneRegex.test(selectedText)) {
                var matches = selectedText.match(phoneRegex);
                var formattedTel = settings.telLinkFormat.format(matches);
                if (formattedTel.startsWith("http")) {
                    var urlObj = new URL(formattedTel);
                    chrome.tabs.update(tab.id, { url: urlObj });
                } else {
                    chrome.tabs.update(tab.id, { url: formattedTel });
                }
                return;
            }
        }
        if (settings.telLinkFormat.startsWith("http")) {
            var numberString = settings.telLinkFormat.substring(0, settings.telLinkFormat.indexOf('{')) + selectedText;
            var url = new URL(numberString);
            //this feels stupidly hacky but it seems to get the job done so.. lets do it?
            var urlString = url.protocol + "//" + url.hostname + url.pathname;
            numberString = numberString.replace(urlString, "").replace("?", "");
            var parts = numberString.split("=");
            if (parts.length > 0) {
                urlString += "?";
                for (var i = 0; i < parts.length; i+=2) {
                    urlString += parts[i] + "=" + encodeURIComponent(parts[i+1]);
                }
            }
            chrome.tabs.update(tab.id, { url: urlString });
        } else {
            chrome.tabs.update(tab.id, { url: settings.telLinkFormat.substring(0, settings.telLinkFormat.indexOf('{')) + selectedText });
        }
    });

});


if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = []; //arguments;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i].constructor == Array) {
                for (var j = 0; j < arguments[i].length; j++) {
                    args.push(arguments[i][j]);
                }
            } else {
                args.push(arguments[i]);
            }
        }
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}