let previousUrl = "";

// Configurations for each domain
const domainConfig = {
    "aftonbladet.se": {
        getHeader: () => document.querySelector("h1"),
        getArticleText: () => getArticleText('article', 'p, p strong, p b')
    },
    "dn.se": {
        getHeader: () => document.querySelector("h1"),
        getArticleText: () => {
            let div1Text = getArticleText('div.article__content', 'p, p strong, p b');
            let div2Text = getArticleText('div.article__premium-content', 'p, p strong, p b');
            return div1Text + " " + div2Text;
        }
    },
    "bbc.com": {
        getHeader: () => document.querySelector("h1"),
        getArticleText: () => getArticleText('article', 'p, p strong, p b')
    },
    "svt.se": {
        getHeader: () => {
            let article = document.querySelector('article.nyh_article');
            return article.querySelector("h1");
        },
        getArticleText: () => getArticleText('article.nyh_article', 'p, p strong, p b')
    },
    "elmundo.es": {
        getHeader: () => {
            let article = document.querySelector('article.ue-c-article');
            return article.querySelector("h1");
        },
        getArticleText: () => getArticleText('article.ue-c-article', 'p, p strong, p b')
    }
};

function handleUrlChange() {
    const currentUrl = window.location.href;

    if (currentUrl !== previousUrl) {
        previousUrl = currentUrl;

        let domain = window.location.hostname.replace("www.", "");

        let config = domainConfig[domain];
        if(!config) return;

        let header = config.getHeader();
        if(!header) return;

        let org = header.innerHTML;
        let joinedText = config.getArticleText();

        if(joinedText.length < 400){
            header.innerHTML = org;
            return;
        }

        header.innerHTML = "Loading...";

        chrome.runtime.sendMessage({contentScriptQuery: "backend", domain: domain, title: org, article: joinedText}, 
            function(response) {
                if(chrome.runtime.lastError || !response.success) {
                    header.innerHTML = org;
                } else {
                    header.innerHTML = response.data.newTitle;
                }
            }
        );
    }
}

function getArticleText(tag, subtags){
    let article = document.querySelector(tag); 
    let paragraphs = article.querySelectorAll(subtags);  
    let textContents = Array.from(paragraphs).map(p => p.textContent); 
    return textContents.join(' ');  
}

handleUrlChange();

setInterval(handleUrlChange, 1000);  // Check every second