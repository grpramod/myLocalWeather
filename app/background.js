(function(){

	var locationInfo = {
		lat: '',
		lng: ''
	};
	var err = '';
	var getLocation;
	//Update weather every 6hrs
	function updateWeather() {
		console.log('updating weather data...')
		getLocation();
	}
	//Init function when background script is loaded
	function init() {
    	console.log('Extension installed and initialized..');
    	console.log('clearing cache...')
	    chrome.storage.sync.clear(); // clear cache
    	 //Get the lat lon from the browsers location
		getLocation = function () {
			console.log(navigator.geolocation)
	        if (navigator.geolocation) {

				console.log('getting location...')
	            navigator.geolocation.getCurrentPosition(getPosition, showError);
	        }
	        else {
	            err = "Geolocation is not supported by this browser.";
	            chrome.storage.sync.set({'error':err});
	        }
	    }
	    //Get the weather data from OpenWeatherMap server
	    var getWeatherData = function(url,success,error) {
			var xmlHTTPReq = new XMLHttpRequest();
        	xmlHTTPReq.open('GET', url, true);
	        xmlHTTPReq.onload = function(){
	            if(this.status === 200) {
	            	var responseObj = JSON.parse(this.responseText);
	            	console.log(responseObj)
	            	//update the current weather as title to the icon
	            	if(responseObj.main !== undefined) {
	            		window.chrome.browserAction.setBadgeText({text:Math.round(responseObj.main.temp).toString()+' F'});
    					success(responseObj);
	            	}
	            	//update the forecast weather 
	            	if(responseObj.list !== undefined) {
    					success(responseObj);
	            	}
    				
	            } else {
	                err = "Internal Error!";
	            	chrome.storage.sync.set({'error':err});
	            }
	        };
	        xmlHTTPReq.onerror = function(){
	        	err = "Server Error!";
	            chrome.storage.sync.set({'error':err});
	        };
        	xmlHTTPReq.send();
	    }
	    //Set the current data to UI
	    var currentData = function(resp) {
	    	console.log('setting current data',resp)
	    	chrome.storage.sync.set({'currentData':resp});
	    }
	    //Set the forecast data to UI
	    var forecastData = function(resp) {
	    	console.log('setting forecast data ', resp)
	    	chrome.storage.sync.set({'forecastData':resp});
	    }
	    //Get positions callback
	    var getPosition = function (position) {
	        locationInfo.lat = position.coords.latitude;
	        locationInfo.lng = position.coords.longitude;
	        //Cache location information
	        chrome.storage.sync.set({'locationInfo':[{'lat':locationInfo.lat,'lng':locationInfo.lat}]});	       
	        //Get Current weather
	        getWeatherData('http://api.openweathermap.org/data/2.5/weather?lat='+locationInfo.lat+'&lon='+locationInfo.lng+'&appid=708518532a791afde6d31d0fa4783fbf&units=imperial',currentData,showError);
	        //Get forecast weather
	        getWeatherData('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+locationInfo.lat+'&lon='+locationInfo.lng+'&appid=708518532a791afde6d31d0fa4783fbf&units=imperial',forecastData,showError);
	    }
	    //Show error if location info is not available
	    var showError = function (error) {
	    	console.log('Some error..');
	        switch (error.code) {
	            case error.PERMISSION_DENIED:
	                err = "User denied the request for Geolocation."
	                break;
	            case error.POSITION_UNAVAILABLE:
	                err = "Location information is unavailable."
	                break;
	            case error.TIMEOUT:
	                err = "The request to get user location timed out."
	                break;
	            case error.UNKNOWN_ERROR:
	                err = "An unknown error occurred."
	                break;
	            default:
	            	err = "An unknown error occurred."
	            	break;
	        }
	        chrome.storage.sync.set({'error':err});
    	}
    	//Callback function for Geolocation
	    getLocation();
	    //Creating an alaram to update the weather every 6hrs, 60(minutes)*6(hrs)
	    chrome.alarms.create('updateWeather', {periodInMinutes: 360});
	    chrome.alarms.onAlarm.addListener(updateWeather);
	}
	chrome.runtime.onInstalled.addListener(init);
  	chrome.runtime.onStartup.addListener(init);

    
})();
