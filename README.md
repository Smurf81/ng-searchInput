# ng-inputSearch

*Advanced search component*

<br/>
## Functionnality

* delete search button
* search button
* search partial when a minimum of char appears
* close partials results with click outside the results ( for desktop & tablet ) or with Esc Key ( for desktop )
* Use Key up and Key Down for navigate between partials results
* Action on Enter key when a partial result is selected
* Tablet Friendly

<br/>

## Installation
Installation is easy as angular-ui-bootstrap has minimal dependencies - only the AngularJS and Bootstrap's CSS are required.
Two versions are available : 
* ng-inputSearch-tpls.min.js
* ng-inputSearch.min.js

For people who want to take all the directives and don't need to customize anything the solution is to grab a file named ng-inputSearch-tpls.min.js.

If, on the other hand default template are not what you need you could take ng-inputSearch.min.js and provide your own templates, taking the default ones in template directory.

## Html code Loader

```html
    <link href="ng-inputSearch.min.css" rel="stylesheet" />
    <link href="bootstrap.min.css" rel="stylesheet" />
    <script src="//angular/angular.min.js"></script>
    <script src="//ng-inputSearch[-tpls].min.js"></script>
```
<br/>
## Angular configuration

```javascript
    angular.module('myApp', ['ng.inputSearch'])
```

<br/>
## Example

```html
    <search-bar
        max-results="5"
        search-button="searchButton()"
        search-partials="searchPartials()"
        action-on-element="actionOnElement(id)"
        search-query="searchQuery"
        results="results"
        min-char-search="3"
        >
        </search-bar>
```
<br/>

```javascript
    controller:function($scope){
        $scope.searchButton = function(){
            ...
        }    
        $scope.searchPartials = function(){
            ...
        }
        $scope.actionOnElement = function(id){
            ...
        }
    }
```

## Attribute :

* max-results : "5", // Number of results appears for partials results (required)
* search-button : "", // Function executed when the users click on the search button (required)
* search-partials : "", // Watch search input and execute "search-partials" function when "minCharSearch" chars are present, wait 300ms after each change to execute action (required)
* action-on-element : "", // Action executed when users select it ( by click or with enter key ) -> NEED ID on element
* search-query : "", // the search element used by previous function (required )
* results : "", // results of the search (required)
* minCharSearch : "3"


## Customize templates (only with tpls)

You might want to customize default templates to match your desired look & feel, add new functionality etc.

The easiest way to override an individual template is to use the <script> directive:

```html
    <script id="template/searchinput/element.html" type="text/ng-template">
        <div>
            {{element.name}}
        </div>
    </script>
```
<br/>


