angular.module('appName')
.directive('addTag', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
            	
            	scope.pushTag(scope.tags)
            	console.log(scope.tags)
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
})
.controller('draftCtrl', function($scope, $rootScope, draftsSvc, headerSvc) {


//////////////////////////////////////

$scope.pushTag = function(tag) {
	var tagID = tag.length-1
	//console.log("ID: " + tagID + "  Tag: ", tag[0].text) 

	tag[tagID].id = tagID
	console.log(tag)
	tag = JSON.stringify(tag)
	

	draftsSvc.draftObj.tags = tag
}

$scope.pushTitle = function(title) {
	draftsSvc.draftObj.title = title
}



///////////////////////////////////////

//declare necessary variables

setTimeout(function() {
	$scope.tags = draftsSvc.editTags

	// $scope.tags = [
	// {"text":"tagone", "id":1},
	// {"text":"tagtwo", "id":2},
	// {"text":"tagthree", "id":3}]

	$scope.title = draftsSvc.editTitle
	draftsSvc.draftObj.title = $scope.title
	draftsSvc.draftObj.tags = $scope.tags
}, 200)

$scope.showMenu = false;
$scope.publishMenu = true
$scope.dotMenu = true
$scope.search = true
$scope.userMenu = true
$scope.notificationsMenu = true

//display notifiations
$scope.getNotifcations = headerSvc.getNotifications().then(function(resp){
	$scope.notifications = resp.data

	for (var i = 0; i < $scope.notifications.length; i++) {
		
		$scope.notifications[i].title = ''

		for (var prop in $scope.notifications[i]) {

			// Create proper textual responses
			switch($scope.notifications[i].action) {
				case 'l':
				$scope.notifications[i].action = 'liked your';
				break;
				case 'b':
				$scope.notifications[i].action = 'bookmarked your';
				break;
				case 'f':
				$scope.notifications[i].action = 'followed you';
				break;
				case 's':
				$scope.notifications[i].action = 'shared your';
				break;
				case 'r':
				$scope.notifications[i].action = 'responded to';
				break;
			}
		}

		//When using asynch calls within a loop
		//you need to use a closure to capute the value of i at each iteration
		if ($scope.notifications[i].article === true) {
			(function(i) {
				headerSvc.getArticleTitle($scope.notifications[i].action_on_id)
				.then(function(resp) {
					$scope.notifications[i].title = ' your article ' + resp.data[0].title
				})
			})(i);	
		}

		if ($scope.notifications[i].response === true) {
			(function(i) {
				headerSvc.getArticleTitleByResponse($scope.notifications[i].action_on_id)
				.then(function(resp) {
					$scope.notifications[i].title = resp.data[0].title
				})
			})(i);
		}
	}
})

}).directive('headerMenuForWriting', function() {
	return {
		restrict: 'AE',
		templateUrl: '/views/directives/header-for-writing.html',
		controller: 'draftCtrl'	
	}

})