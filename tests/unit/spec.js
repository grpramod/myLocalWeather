describe('showWeatherController', function () {
  var controller = null;
  $scope = null;
  var mockWindow;

  beforeEach(function () {
    module('weather');
  });
  //Mock for storage API
  beforeEach(function(){
      mockWindow = {
          chrome:{
              storage:{
                  sync: sinon.stub({
                      set: function(){ },
                      get: function(){ },
                      remove: function(){ },
                      clear: function(){ }
                  })
              }
          },
          addEventListener: function(){    }
      }
      module(function($provide){
          $provide.value('$window', mockWindow);
      })
  });
  
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    controller = $controller('showWeatherController', {
      $scope: $scope
    });
  }));
  it('should exist', function() {
      expect($scope.weatherResp).toBeDefined();
      expect($scope.weatherForecastResp).toBeDefined();
      expect($scope.units).toBeDefined();
    });
  it('initially the units should be fahrenheit', function () {
    expect($scope.units).toEqual("F");
  });
});

