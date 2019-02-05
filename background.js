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


if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}
