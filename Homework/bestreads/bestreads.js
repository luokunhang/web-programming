/*global fetch*/
"use strict";
(function() {
    
    window.onload = function() {
        start();
    };
    
    function start() {
        let url = "https://php-kunta.c9users.io/bestreads/bestreads.php";
        fetch(url + "?mode=books&title=harrypotter", {credentials: "include"})
        .then(checkStatus)
        .then(populate)
        .catch(function(reason) {alert(reason);});
    }
    
    function populate(text) {
        let content = JSON.parse(text);
        console.log(content);
    }
    
    
    function checkStatus(response) {  
        if (response.status >= 200 && response.status < 300) {  
            return response.text();
        } else {
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        }
    }
})();