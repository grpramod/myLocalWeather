var weatherApp = angular.module('weather',[]);


weatherApp.controller('showWeather',['$scope','$http',function($scope,$http) {
	$scope.weatherResp = '';
	$scope.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        }
        else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
    }

    $scope.showError = function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                $scope.error = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                $scope.error = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                $scope.error = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                $scope.error = "An unknown error occurred."
                break;
        }
        $scope.$apply();
    }

    $scope.showPosition = function (position) {
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
        $scope.$apply();
        //API for Current weather
        /*$http.get('http://api.openweathermap.org/data/2.5/weather?lat='+$scope.lat+'&lon='+$scope.lng+'&appid=708518532a791afde6d31d0fa4783fbf&units=metric')
	        .success(function(resp) {
	            $scope.weatherResp = resp;
	            console.log(JSON.stringify(resp));
	    });*/
	    //API for forcast 
	    /*$http.get('http://api.openweathermap.org/data/2.5/forecast?lat='+$scope.lat+'&lon='+$scope.lng+'&appid=708518532a791afde6d31d0fa4783fbf&units=metric')
	        .success(function(resp) {
	            $scope.weatherResp = resp;
	            console.log(JSON.stringify(resp));
	    });*/
	    $scope.weatherResp = {"coord":{"lon":77.6,"lat":12.98},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"base":"stations","main":{"temp":22,"pressure":1017,"humidity":53,"temp_min":22,"temp_max":22},"visibility":6000,"wind":{"speed":2.6,"deg":120},"clouds":{"all":0},"dt":1490558400,"sys":{"type":1,"id":7823,"message":0.0026,"country":"IN","sunrise":1490489357,"sunset":1490533251},"id":1277333,"name":"Bangalore","cod":200};
    	
    	$scope.$apply();
    }
    $scope.getLocation();
}]);
