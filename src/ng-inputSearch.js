angular.module('ng.inputSearch',[])
    .directive('searchBar',['$timeout',function($timeout){

        var createElement = function(clazz) {
            var el = angular.element("<div>");
            if(clazz){
                el.addClass(clazz);
            }
            return el;
        }

        var retrieveElementLi = function(elem,index){
            var ul = elem.find("ul")[0];
            var li = ul.children;
            return li[index];
        }

        return {
            restrict:'E',
            scope:{
                results:'=',
                searchQuery:'=',
                searchButton:'&',
                searchPartials:'&',
                actionOnElement:'&'
            },
            template:
                '<form class="form-inline">' +
                '<div ng-init="warning=false" ng-show="warning && minCharSearch" class="alert alert-warning search-warning text-center"> Thank you to enter at least {{minCharSearch}} characters for your search.</div>' +
                '<div class="controls search">'+
                '<div class="input-group col-sm-5 col-sm-offset-3 col-md-5 col-md-offset-3 col-lg-offset-4 col-lg-4 pull-left">' +
                '<input type="text" size="50" class="form-control" ng-model="searchQuery" placeholder="Rechercher un site">'+
                '<div class="input-group-btn delete-button">'+
                '<button type="button" class="btn btn-default" ng-click="deleteSearch($event)">'+
                '<div>x</div>'+
                '</button>'+
                '</div>' +
                '</div>'+
                '<span class="center-text search-button" ng-click="searchButton()">'+
                '<button type="submit" class="btn btn-primary btn-lg glyphicon glyphicon-search"></button>'+
                '</span>'+
                '<div class="dropdown" ng-class="{open:results !==undefined}">' +
                '<ul class="col-sm-5 col-sm-offset-3 col-md-5 col-md-offset-3 col-lg-offset-4 col-lg-4 dropdown-menu " role="menu">' +
                '<li ng-show="results.length > 0" ng-repeat="element in results | limitTo : maxResults ">' +
                '<result-element element="element" ng-click="actionOnElement({id:element.id})"></result-element>'+
                '</li>' +
                '<li ng-show="results.length > maxResults" class="text-center">' +
                '<a ng-click="searchWithRedirect()" class="more-results">More results</a>' +
                '</li>' +
                '<li ng-show="results.length == 0" class="text-center">' +
                '<span class="no-search-result">No results</span>'+
                '</li>' +
                '</ul>' +
                '</div>'+
                '</div>' +
                '</form>',
            replace:true,
            link:function(scope,elem,attrs){

                scope.maxResults = angular.isDefined(attrs.maxResults) ? scope.$parent.$eval(attrs.maxResults) : 5;
                scope.minCharSearch = angular.isDefined(attrs.minCharSearch) ? scope.$parent.$eval(attrs.minCharSearch) : 3;

                /**
                 * Watch search input and make a search action when 3 chars are present
                 * wait 300ms after each change to start search
                 */
                var promise;
                scope.$watch('searchQuery',function(newVal){
                    if (newVal && newVal.length >= scope.minCharSearch) {
                        $timeout.cancel(promise);
                        promise = $timeout(function(){
                            scope.searchPartials();
                        },300);

                    } else {
                        scope.results = undefined;
                        index=0;
                    }
                });

                /**
                 * create a backdrop dialog when fast result appears
                 * if the user click on it, the result disappears
                 */
                var backDropElement = createElement('dialog-backdrop');
                scope.$watch(function(){
                    return scope.results;
                },function(newVal,oldVal){
                    if(newVal){
                        elem.parent().append(backDropElement);
                        backDropElement.bind('click',function(event){
                            scope.$apply(function(){
                                scope.results=undefined;
                                index=0;
                            });
                            backDropElement.remove();
                        });
                    }
                });

                /**
                 * erase search input and results
                 * and change focus to input
                 * @param $event
                 */
                scope.deleteSearch = function($event) {
                    $event.stopPropagation();
                    if ($event.preventDefault) {
                        $event.preventDefault();
                    } else {
                        $event.returnValue = false;
                    }
                    scope.searchQuery = '';
                    scope.results=undefined;
                    index=0;
                    elem.find("input")[0].focus();
                }

                var index = -1;
                var selectedLi;
                var predecessorLi;
                elem.on('keydown',function(event){
                    //Esc
                    if(event.keyCode === 27){
                        scope.$apply(function(){
                            scope.results=undefined;
                            index=0;
                        });
                    }
                    //KeyDown
                    if(event.keyCode === 40){
                        if(index == 0){
                            selectedLi = retrieveElementLi(elem,index++);
                        } else if(index <= scope.maxResults) {
                            selectedLi = retrieveElementLi(elem,index);
                            predecessorLi = retrieveElementLi(elem,index-1);
                            index++;
                            angular.element(predecessorLi).removeClass('search-focus');
                        }
                        if(angular.isDefined(selectedLi)){
                            angular.element(selectedLi).addClass('search-focus');
                        }
                    }
                    //KeyUp
                    if(event.keyCode === 38){
                        if(index != 0){
                            index--;
                            selectedLi = retrieveElementLi(elem,index-1);
                            predecessorLi = retrieveElementLi(elem,index);
                            angular.element(predecessorLi).removeClass('search-focus');
                        }
                        angular.element(selectedLi).addClass('search-focus');
                    }
                    //Enter
                    if(event.keyCode === 13){
                        if(index > 0 && index < (scope.maxResults+1)){
                            event.preventDefault();
                            var selectedResult = scope.results[index-1];
                            scope.$apply(function() {
                                if(selectedResult.id){
                                    scope.actionOnElement({id:selectedResult.id});
                                } else {
                                    scope.actionOnElement({id:index-1});
                                }
                            });
                        } else {
                            scope.$apply(function() {
                                scope.searchButton();
                            });
                        }
                    }
                })
            }
        }
    }])
    .directive('resultElement',[function(){
        return{
            restrict:'EA',
            scope:{
                element:'='
            },
            replace:true,
            templateUrl:'template/searchinput/element.html'
        }
    }])
;
