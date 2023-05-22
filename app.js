let previousUrl = "";

function handleUrlChange() {
    const currentUrl = window.location.href;

    if (currentUrl !== previousUrl) {
        previousUrl = currentUrl;

        let d = window.location.hostname.replace("www.", "");

        var header = getHeader(d);

        if(header !== null){
            var org = header.innerHTML;

            var joinedText = getArticleText(d);
            header.innerHTML = joinedText.length;

            if(joinedText.length < 400){
                header.innerHTML = org;
                return;
            }

            header.innerHTML = "Loading...";

            chrome.runtime.sendMessage({contentScriptQuery: "backend", domain: d, title: org, article: joinedText}, 
                function(response) {
                    if(chrome.runtime.lastError) {
                        header.innerHTML = org;
                    } else {

                        if(response.success){
                            header.innerHTML = response.data.newTitle;
                        }
                        else{
                            header.innerHTML = org;
                        }
                    }
                }
            );
        }
    }
}

function getHeader(domain){
    switch(domain){
        case "aftonbladet.se":
            return document.querySelector("h1");
        case "dn.se":
            return document.querySelector("h1");
        case "bbc.com":
            return document.querySelector("h1");
        case "svt.se":
            let article1 = document.querySelector('article.nyh_article');  // select the article tag
            return article1.querySelector("h1");
        case "elmundo.es":
            let article2 = document.querySelector('article.ue-c-article');  // select the article tag
            return article2.querySelector("h1");
        default:
            return null;
    }
}

function getArticleText(domain){
    if(domain === "aftonbladet.se"){
        let article = document.querySelector('article');  // select the article tag
        let paragraphs = article.querySelectorAll('p, p strong, p b');  // select direct child p tags
        let textContents = Array.from(paragraphs).map(p => p.textContent);  // extract text content of each p tag
        let joinedText = textContents.join(' ');  // join all text contents into one string
        return joinedText;
    }

    if(domain === "bbc.com"){
        let article = document.querySelector('article');  // select the article tag
        let paragraphs = article.querySelectorAll('p, p strong, p b');  // select direct child p tags
        let textContents = Array.from(paragraphs).map(p => p.textContent);  // extract text content of each p tag
        let joinedText = textContents.join(' ');  // join all text contents into one string
        return joinedText;
    }

    if(domain === "svt.se"){
        let article = document.querySelector('article.nyh_article');  // select the article tag
        let paragraphs = article.querySelectorAll('p, p strong, p b');  // select direct child p tags
        let textContents = Array.from(paragraphs).map(p => p.textContent);  // extract text content of each p tag
        let joinedText = textContents.join(' ');  // join all text contents into one string
        return joinedText;
    }

    if(domain === "elmundo.es"){
        let article = document.querySelector('article.ue-c-article');  // select the article tag
        let paragraphs = article.querySelectorAll('p, p strong, p b');  // select direct child p tags
        let textContents = Array.from(paragraphs).map(p => p.textContent);  // extract text content of each p tag
        let joinedText = textContents.join(' ');  // join all text contents into one string
        return joinedText;
    }

    if(domain === "dn.se"){
        let div1 = document.querySelector('div.article__content');  // select the div with class1
        let paragraphs1 = div1.querySelectorAll('p, p strong, p b');  // select all p tags under the div with class1

        let div2 = document.querySelector('div.article__premium-content');  // select the div with class2
        let paragraphs2 = div2.querySelectorAll('p, p strong, p b');  // select all p tags under the div with class2

        let allParagraphs = [...paragraphs1, ...paragraphs2];  // combine the NodeList into an array
        let textContents = Array.from(allParagraphs).map(p => p.textContent);  // extract text content of each p tag
        let joinedText = textContents.join(' ');  // join all text contents into one string
        return joinedText;
    }

    return "";
}

// Call handleUrlChange now to handle the page load event (first time)
handleUrlChange();

// And set up an interval to check regularly
setInterval(handleUrlChange, 1000);  // Check every second