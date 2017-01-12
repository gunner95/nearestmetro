
angular.module('metroApp')
  .factory('gservice',function($http){
    var googleMapService ={};
    var locations =[]; //array of locations received from the api calls
    var selectedLat = 28.6139;
    var selectedLong = 77.2090;

    googleMapService.refresh = function(latitude,longitude){
        locations=[];
        selectedLong=longitude;
        selectedLat=latitude;
        $http.get('/users')
          .then(function successCall(data){
            locations = convertToMapPoints(data.data);
            initialize(latitude,longitude);
          },function errorCall(){
            console.log('error in refresh method');
          });
    };


    googleMapService.plotPath = function(from,to,transport){
      var myOptions = {
          zoom: 10,
          center:from,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // Draw the map
      var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
      var directionsService = new google.maps.DirectionsService();
      var transMode=google.maps.DirectionsTravelMode.WALKING;
      if(transport=="DRIVING"){
        transMode = google.maps.DirectionsTravelMode.DRIVING;
      }
      var directionsRequest = {
        origin:from,
        destination:to,
        travelMode: transMode
      };
      directionsService.route(directionsRequest,function(result,status){
        if(status==='OK'){
          new google.maps.DirectionsRenderer({
                map: mapObject,
                directions: result
              });
        }else{
          console.log('error puta');
        }
      });
    };
    // ------------------
    //inner private functions
    var convertToMapPoints = function(data){
      var locations=[];
      for(var i=0;i<data.length;i++){
        var user = data[i];
        //pop up window
        var contentString =
        '<p><b>Username</b>: ' + user.username +
        '<br><b>latitude</b>'+user.location[0]+
        '<br><b>longitude</b>'+user.location[1]+'</p>';
        //converting json to googleMap format
        locations.push({
         latlon: new google.maps.LatLng(parseFloat(user.location[1]),parseFloat(user.location[0])),
         message: new google.maps.InfoWindow({
             content: contentString,
             maxWidth: 320
         }),
         username: user.username
       });
     }
     return locations;
   };

   //initialize the map
   var initialize = function(latitude,longitude){
     var myLatLng = {lat:parseFloat(selectedLat),lng:parseFloat(selectedLong)};
     if(!map){
       var map = new google.maps.Map(document.getElementById('map'), {
           zoom: 14,
           center: myLatLng
        });
     }
     locations.forEach(function(n, i){
       if(i==locations.length-1){
         var marker = new google.maps.Marker({
             position: n.latlon,
             map: map,
             title: "Big Map",
             icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
         });
       }else{
         var marker = new google.maps.Marker({
             position: n.latlon,
             map: map,
             title: "Big Map",
             icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
         });
     }
       // For each marker created, add a listener that checks for clicks
       google.maps.event.addListener(marker, 'click', function(e){

           // When clicked, open the selected marker's message
           currentSelectedMarker = n;
           n.message.open(map, marker);
       });
   });

 };
 google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
  });
