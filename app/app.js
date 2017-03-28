var weatherApp = angular.module('weather',[]);


weatherApp.controller('showWeather',['$scope','$http',function($scope,$http) {
	$scope.weatherResp = '';
	$scope.units = 'F';
	var getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getPosition, showError);
        }
        else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
    }

    $scope.convertUnits = function(e,param) {
    	$scope.units = param;
    	if(angular.element(e.target).hasClass('active')) {
    		return;
    	}
    	//convert farienheit to celcius
    	if(param === 'C') {
    		$scope.weatherResp.main.temp = Math.round((5/9) * ($scope.weatherResp.main.temp-32));
    		angular.forEach($scope.weatherForecastResp.list, function(val,key) {
    			$scope.weatherForecastResp.list[key].temp.day = Math.round((5/9) * ($scope.weatherForecastResp.list[key].temp.day-32));
    		});
    	} else if(param === 'F') {
    		$scope.weatherResp.main.temp = $scope.weatherResp.main.temp * 9 / 5 + 32;
    		angular.forEach($scope.weatherForecastResp.list, function(val,key) {
    			$scope.weatherForecastResp.list[key].temp.day = $scope.weatherForecastResp.list[key].temp.day * 9 / 5 + 32;
    		});
    	}
    }

    var showError = function (error) {
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
            default:
            	$scope.error = "An unknown error occurred."
            	break;
        }
        $scope.$apply();
    }
    var getWeatherData = function(url,success,error) {
    	$http.get(url)
	        .success(function(resp) {
	            success(resp);
	            console.log(JSON.stringify(resp));
	    	})
	    	.error(function(err) {
	    		error(err);
	    	});
    }
    var currentData = function(resp) {
    	$scope.weatherResp = resp;
    	//Set the current weather as title to the icon
    	window.chrome.browserAction.setBadgeText({text:$scope.weatherResp.main.temp.toString()});
    }
    var forcastData = function(resp) {
    	$scope.weatherForecastResp = resp;
    }
    var getPosition = function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $scope.$apply();
        //Get Current weather
        getWeatherData('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&appid=708518532a791afde6d31d0fa4783fbf&units=imperial',currentData,showError);
        //Get forecast weather
        getWeatherData('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lng+'&appid=708518532a791afde6d31d0fa4783fbf&units=imperial',forcastData,showError);
    }
    
    getLocation();
}]);

weatherApp.filter('convertDate', function() {
	return function (items) {
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		if(items!== undefined) {
			return days[new Date(items*1000).getDay()];
		}
	}
});
