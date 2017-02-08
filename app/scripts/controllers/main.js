'use strict';

/**
 * @ngdoc function
 * @name metroApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the metroApp
 */
angular.module('metroApp')
  .controller('MainCtrl', function ($scope,$http,geolocation,gservice,$window,$timeout,$cordovaGeolocation) {
    $scope.formData={};
    $scope.data=[];
    $scope.formData.transport="WALKING"
    // $scope.initMap=function() {
    //    // Create a map object and specify the DOM element for display.
    //    var map = new google.maps.Map(document.getElementById('map'), {
    //      center: {lat: -34.397, lng: 150.644},
    //      scrollwheel: false,
    //      zoom: 8
    //    });
    //  };
    // $scope.initMap();
    // $scope.geoL = function(){
    //   geolocation.getLocation().then(function(data){
    //
    // // Set the latitude and longitude equal to the HTML5 coordinates
    //   // coords = {lat:data.coords.latitude, long:data.coords.longitude};
    //
    //   // Display coordinates in location textboxes rounded to three decimal points
    //   $scope.formData.longitude = parseFloat(data.coords.longitude).toFixed(3);
    //   $scope.formData.latitude = parseFloat(data.coords.latitude).toFixed(3);
    //
    //   // Display message confirming that the coordinates verified.
    //   $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";
    //
    //   gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    //
    // },function error() {
    //   console.log('error');
    // });
    // };
    $scope.geoL = function(){
      navigator.geolocation.getCurrentPosition(function(data){
        $scope.formData.longitude = parseFloat(data.coords.longitude).toFixed(3);
        $scope.formData.latitude = parseFloat(data.coords.latitude).toFixed(3);
        $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";
        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
      },function(error){
        console.log('error in cordova geolocation');
      });
    };
    $scope.geoL();
    $scope.submit = function(){
      console.log($scope.formData);
      var data={
        username:$scope.formData.username,
        location:[$scope.formData.longitude,$scope.formData.latitude]
      };
      var dataQuery = {
        latitude:parseFloat($scope.formData.latitude),
        longitude:parseFloat($scope.formData.longitude)
      }
      var from = new google.maps.LatLng(parseFloat($scope.formData.latitude),parseFloat($scope.formData.longitude));

      $http.post('/query',dataQuery)
        .then(function successCall(obj){
          console.log(obj);
          if(obj.data.length==0){
            $window.alert('too far from any metro station');
          }else{
            var to =new google.maps.LatLng(parseFloat(obj.data[0].location[1]),parseFloat(obj.data[0].location[0]));
            gservice.plotPath(from,to,$scope.formData.transport);
            $timeout(function () {
              if(gservice.distance!=undefined){
              $scope.distance = gservice.distance.text;
              $scope.timeTaken= gservice.timeTaken.text;
            }
          }, 500);
          }
        },function errorCall(){
          console.log('unable to retrieve data');
        })

      console.log(data);

      // $http.post('/users',data)
      //     .then(function successCall(){
      //       console.log("you are awesome");
      //       $scope.formData.username = "";
      //       gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
      //       $scope.formData.latitude="";
      //       $scope.formData.longitude="";
      //     },function errorCall(){
      //       console.log('fuck you');
      //     });

    };

  });
