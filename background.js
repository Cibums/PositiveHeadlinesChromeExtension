try {
    var baseApiUrl = "https://secure-plateau-84403.herokuapp.com/";
    var headlines = [];

    function fetchAllTitles() {
        fetch(baseApiUrl + "title", {
            method: "GET"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            headlines = data;
        })
        .catch(error => console.error('Error:', error));
    }

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.contentScriptQuery === "backend") {
                // Validate that we have all necessary data
                if (!request.domain || !request.title || !request.article) {
                    sendResponse({ success: false, error: "Incomplete request data" });
                    return;
                }

                let enc_title = btoa(encodeURIComponent(request.title));
                let foundHeadline = headlines.find(headline => headline.enc_title === enc_title);
                if(foundHeadline){
                    sendResponse({ success: true, data: foundHeadline });
                    return;
                }

                var model = {
                    domain: request.domain,
                    title: request.title,
                    articleText: request.article
                };

                fetch(baseApiUrl + "title", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(model),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => sendResponse({ success: true, data: data }))
                .catch(error => sendResponse({ success: false, error: error.toString() }));

                return true;  // Will respond asynchronously.
            }
        }
    );

    fetchAllTitles();
    
    // create an alarm for fetching API data every 10 minutes
    chrome.alarms.create('fetchAllTitles', { periodInMinutes: 10 });

    // listen for when this alarm fires
    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name === 'fetchAllTitles') {
            fetchAllTitles();
        }
    });

} catch(error) {
    console.error(error);
}