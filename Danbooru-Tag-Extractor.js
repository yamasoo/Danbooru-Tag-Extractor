// ==UserScript==
// @name         Danbooru-Tag-Extractor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extract tags and rating from Danbooru and copy to clipboard
// @author       You
// @match        https://danbooru.donmai.us/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    var button = document.createElement('button');
    button.innerHTML = 'Copy Tag Data';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);

    button.addEventListener('click', function() {
        var articles = document.querySelectorAll('article.post-preview');
        var data = [];

        articles.forEach(function(article) {
            var tags = article.getAttribute('data-tags');
            var rating = article.getAttribute('data-rating');

            // Adjust the rating format
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

            // Replace underscores with spaces and spaces with commas in tags
            tags = tags.replace(/_/g, ' ').replace(/ /g, ',');

            // Combine tags and rating in the specified format
            data.push(`${tags}; ${rating}`);
        });

        var dataStr = data.join('\n');
        GM_setClipboard(dataStr);
        alert('Tag data copied to clipboard!');
    });
})();
