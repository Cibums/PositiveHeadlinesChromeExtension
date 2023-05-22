try {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.contentScriptQuery === "backend") {
                var url = "https://secure-plateau-84403.herokuapp.com/title";

                // Validate that we have all necessary data
                if (!request.domain || !request.title || !request.article) {
                    sendResponse({ success: false, error: "Incomplete request data" });
                    return;
                }

                var model = {
                    domain: request.domain,
                    title: request.title,
                    articleText: request.article
                };

                fetch(url, {
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
        });   
} catch(error) {
    console.error(error);
}