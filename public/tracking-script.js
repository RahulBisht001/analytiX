/**
 * It will be a self invoked function as it will be initialized immediately
 * as any website / app will open after adding this script in the <head>
 */

(function () {
    // this is tracking script
    ("use strict");
    var location = window.location;
    var document = window.document;
    var scriptElement = document.currentScript;
    var dataDomain = scriptElement.getAttribute("data-domain");
    var endpoint = "http://localhost:3000/api/track";

    let queryString = location.search;
    const params = new URLSearchParams(queryString);
    let utmSource = params.get("utm");
    /**
     * Start calculation of page visits the page visit session will
     * be a window of 10 minutes.which means if some user visits the page/website
     * again in the same window, then we will not consider it as a new visit.
     */

    function generateSessionId() {
        return "session-" + Math.random().toString(36).substr(2, 9);
    }

    function initializeSession() {
        var sessionId = localStorage.getItem("session_id");
        var expirationTimestamp = localStorage.getItem("session_expiration_timestamp");

        if (!sessionId || !expirationTimestamp) {
            sessionId = generateSessionId();
            expirationTimestamp = Date.now() + 10 * 60 * 1000;

            localStorage.setItem("session_id", sessionId);
            localStorage.setItem("session_expiration_timestamp", expirationTimestamp);
            trackSessionStart();
        }

        return {
            sessionId,
            expirationTimestamp: parseInt(expirationTimestamp),
        };
    }

    function isSessionExpired(expirationTimestamp) {
        return Date.now() >= expirationTimestamp;
    }

    function checkSessionStatus() {
        var session = initializeSession();

        if (isSessionExpired(session.expirationTimestamp)) {
            localStorage.removeItem("session_id");
            localStorage.removeItem("session_expiration_timestamp");
            trackSessionEnd();
            initializeSession();
        }
    }

    checkSessionStatus();

    function trigger(eventName, options) {
        var payload = {
            event: eventName,
            url: location.href,
            domain: dataDomain,
            source: utmSource || "direct",
            language: navigator.language,
            screenSize: screen.width + " x " + screen.height,
            referrer: document.referrer || "direct",
            // timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        sendRequest(payload, options);
    }

    function sendRequest(payload, options) {
        var request = new XMLHttpRequest();
        request.open("POST", endpoint, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                options && options.callback && options.callback();
            }
        };
        request.send(JSON.stringify(payload));
    }

    /**
     * Queue of tracking events
     */

    var queue = (window.your_tracking && window.your_tracking.q) || [];
    window.your_tracking = trigger;

    for (var i = 0; i < queue.length; i++) {
        trigger.apply(this.queue[i]);
    }

    /**
     * Function to track page views
     */

    function trackPageView() {
        //Trigger a custom event indicating page view.
        trigger("pageview");
    }

    function trackSessionStart() {
        trigger("session_start");
    }
    function trackSessionEnd() {
        trigger("session_end");
    }

    trackPageView();
    var pathname = window.location.pathname;

    window.addEventListener("popstate", trackPageView);
    window.addEventListener("hashChange", trackPageView);

    document.addEventListener("click", function (event) {
        setTimeout(() => {
            if (window.location.pathname != initialPathname) {
                trackPageView();
                initialPathname = window.location.pathname;
            }
        }, 3000);
    });
})();
