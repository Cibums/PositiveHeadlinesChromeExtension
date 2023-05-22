try{
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            if (request.contentScriptQuery == "backend") {
              
                var url = "https://secure-plateau-84403.herokuapp.com/title";

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
                .then(response => response.json())  // or response.json() if the response is JSON.
                .then(data => sendResponse({ success: true, data: data }))
                .catch(error => sendResponse({ success: false, error: error.toString() }));

                return true;  // Will respond asynchronously.
            }
        });   
}catch(error){
    console.error(error);
}