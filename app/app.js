var weatherApp = angular.module('weather',[]);

weatherApp.controller('showWeatherController',['$scope','$http','$window',function($scope,$http,$window) {
	$scope.weatherResp = '';
	$scope.weatherForecastResp = '';
	$scope.units = 'F';
    $window.chrome.storage.sync.get('error', function(result) {
        if(result.error=== undefined) {
            $window.chrome.storage.sync.get('currentData', function(result) {
                $scope.weatherResp = result.currentData;
                $scope.$apply();
            });
            $window.chrome.storage.sync.get('forecastData', function(result) {                    
                $scope.weatherForecastResp = result.forecastData;
                $scope.$apply();
            });
        } else {
            $scope.error = result.error;
            $scope.$apply();
        }
    });
    //Conver the units to/from C and F
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
}]);

//Filter to convert milliseconds to date format
weatherApp.filter('convertDate', function() {
	return function (items) {
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		if(items!== undefined) {
			return days[new Date(items*1000).getDay()];
		}
	}
});
