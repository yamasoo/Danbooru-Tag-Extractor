// ==UserScript==
// @name         Gelbooru and Danbooru Tag Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract tags from Gelbooru and Danbooru posts, replace characters, and copy to clipboard
// @author       Your Name
// @match        https://gelbooru.com/*
// @match        https://danbooru.donmai.us/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function createButton(id, text, color) {
        let button = document.createElement('button');
        button.id = id;
        button.innerText = text;
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.style.padding = '10px';
        button.style.backgroundColor = color;
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        return button;
    }

    if (window.location.href.includes('gelbooru.com')) {
        let button = createButton('gelbooru-button', 'Extract Tags', '#ff5722');
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            let images = document.querySelectorAll('img[title]');
            let tags = Array.from(images).map(img => img.getAttribute('title'));
            let tagsString = tags.join('\n').replace(/ /g, ', ');
            GM_setClipboard(tagsString);
            alert('Tags have been copied to the clipboard!');
        });
    } else if (window.location.href.includes('danbooru.donmai.us')) {
        let button = createButton('danbooru-button', 'Copy Tag Data', '#007bff');
        document.body.appendChild(button);

        button.addEventListener('click', function() {
            var articles = document.querySelectorAll('article.post-preview');
            var data = [];

            articles.forEach(function(article) {
                var tags = article.getAttribute('data-tags');
                var rating = article.getAttribute('data-rating');

                switch (rating) {
                    case 'e':
                        rating = 'explicit';
                        break;
                    case 'q':
                        rating = 'questionable';
                        break;
                    case 'g':
                        rating = 'general';
                        break;
                    case 's':
                        rating = 'safe';
                        break;
                    default:
                        rating = 'unknown';
                }

                tags = tags.replace(/ /g, ', ');
                data.push(`${tags}; ${rating}`);
            });

            var dataStr = data.join('\n');
            GM_setClipboard(dataStr);
            alert('Tag data copied to clipboard!');
        });
    }
})();
