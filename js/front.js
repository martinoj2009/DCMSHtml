// Dojo framework
require(
    [
        "dojo/query",
        "dojo/dom",
        "dojo/on",
        "dojo/dom-construct",
        "dojo/request/xhr",
        "dojo/domReady!"
    ], function (on, dom, query, domConstruct, xhr) {
        
        var currentPage = 1;
        
        function getArticles(page) {
            console.log("Started get for page " + page);
            
            // Enable the previous page button if this is paged
            if (currentPage > 1) {
                previousClass.className = "page-item";
            }
            else {
                previousClass.className = "page-item disabled";
            }
            
            if (page === undefined || page === null) {
                page = 0;
            }
            
            xhr("/api/articles/" + page, {
                handleAs: "json"
            }).then(function (response) {
                
                if (response.length === 0) {
                    nextClass.className = "page-item disabled";
                    
                }
                else {
                    nextClass.className = "page-item";

                    for (var i = 0; i < response.length; i++) {
                        var node = document.createElement("a");
                        node.className = "list-group-item";
                        node.href = 'https://martinojones.com/article.html?id=' + response[i].id;
                        
                        title = document.createElement('h2');
                        title.className = "list-group-item-heading";
                        title.innerHTML = response[i].post_title;
                        node.appendChild(title);
                        
                        document.getElementsByName("articles")[0].appendChild(node);
                    }
                    
                    console.log("Done getting articles and displaying page " + page);
                }
                
            }, function (err) {
                console.log(err);
            });
            
        }
        
        function getAlerts() {
            xhr("/api/alerts", {
                handleAs: "json"
            }).then(function (response) {
                if(response.length === 1)
                    {
                    dom.byId("alerts").innerHTML = "<div class=\"alert alert-success\" role=\"alert\"><strong>" + response[0].title + "</strong> <p>" + response[0].message +" </p></div>";
                }
                else
                    {
                    dom.byId("alerts").innerHTML = "";
                }
            });
        }
        
        // Handlers
        var previousButton = dom.byId("previous-button");
        var previousClass = dom.byId("previous-class");
        var nextButton = dom.byId("next-button");
        var nextClass = dom.byId("next-class");
        
        nextButton.onclick = function (e) {
            e.preventDefault();
            if (nextClass.className === "page-item disabled") {
                return;
            }
            //Clear the DIV
            dom.byId("articles").innerHTML = "";
            currentPage++;
            console.log("Nextbutton! Page " + currentPage);
            getArticles(currentPage);
        }
        
        previousButton.onclick = function (e) {
            e.preventDefault()
            if (currentPage === 1) {
                return;
            }
            //Clear the DIV
            dom.byId("articles").innerHTML = "";
            currentPage--;
            getArticles(currentPage);
        }
        
        // Keep checking for alerts
        
        
        window.setInterval(function () {
            getAlerts();
        }, 10000);
        
        
        getArticles(currentPage);
        getAlerts()
        
    }
)

