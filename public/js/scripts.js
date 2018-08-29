var slideIndex = 0;
var images = [];
function carousel() {
  var i;
  for (i = 0; i < images.length; i++) {
    images[i].hide();
  }
  slideIndex++;
  if (slideIndex > images.length) {slideIndex = 1}
  images[slideIndex-1].show();
  setTimeout(carousel, 3500); // Change image every 2 seconds
}

var receipients = {};

function Receipient(name, people, city, from, to, message) {
  this.name = name;
  this.people= people;
  this.city = city;
  this.from = from;
  this.to = to;
  this.message = message;
}


function Volunteer(name, city, age){
  this.name=name;
  this.city=city;
  this.age=age;
}

// function gotData(cityofrec){
//   console.log(cityofrec);
//   $(".rec-list").html("");
//   var recs = cityofrec.val();
//   var keys = Object.keys(recs);
//   for (var i=0; i<keys.length; i++){
//     var k = keys[i];
//     var name = recs[k].name;
//     var people = recs[k].people;
//     var city = recs[k].city;
//     var from = recs[k].from;
//     var to = recs[k].to;
//     var message = recs[k].message;
//
//     console.log(name, city);
//     $(".rec-list").append(cellFormat);
//     $(".rec-name-out:last").text(name);
//     $(".rec-city-out:last").text(city);
//     $(".rec-people-out:last").text(people);
//     $(".rec-from-out:last").text(from);
//     $(".rec-to-out:last").text(to);
//     $(".rec-message-out:last").text(message);
//   }
// }



//Front-end ///////////////////////////////////////////////
$(document).ready(function(){
  $("img.carouselImage").each(function(){
   images.push($(this));
 })
 carousel();

  $(".tablinks").click(function(){
    // var clicked = this;
    if($(this).next().is(":hidden")) {
      console.log(this);
      $(".collapse").slideUp("slow");
      $(this).next(".collapse").slideDown("slow");
    } else {
      console.log(this);
      $(".collapse").slideUp("slow");
    }

  });


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAfDRoRMGeJG6m15rX5szp4Ix8pDjsM-vc",
    authDomain: "water-4b7ca.firebaseapp.com",
    databaseURL: "https://water-4b7ca.firebaseio.com",
    projectId: "water-4b7ca",
    storageBucket: "",
    messagingSenderId: "462023099172"
  };

  firebase.initializeApp(config);
  var database = firebase.database();

  var cellFormat = $(".rec-list:first").html();
  // console.log(cellFormat);


  $("#receipient").submit(function(event){
    event.preventDefault();

    var recName = $("#rec-name").val().toUpperCase();
    var recAge = $("#rec-age").val();
    var recPeople = $("#rec-people").val();
    var recCity = $("#rec-city").val();
    // var recSupplies = $("#rec-supplies").val();
    // var recLat = parseInt($("#rec-lat").val());
    // var recLng = parseInt($("#rec-lng").val());
    var recFrom = $("#rec-from").val();
    var recTo = $("#rec-to").val();
    var recMessage = $("#rec-message").val();

    // console.log(recName);
    // console.log(recAddress);
    // console.log(recSupplies);
    // console.log(recLat);
    // console.log(recLng);
    // console.log(recFrom);
    // console.log(recTo);

    // create Receipient instance based on the input.
    var recInstance = new Receipient (recName, recPeople, recCity,recFrom,recTo,recMessage);

    var ref = database.ref(recCity);
    ref.push(recInstance);
    console.log(recInstance);

    // ref.on("value", gotData, errData);




    $("#receipient")[0].reset();
  });

    //Volunteer side function
    $("#volunteer").submit(function(event){
      event.preventDefault();

      var volName = $("#vol-name").val();
      var volCity = $("#vol-city").val();
      var volAge = $("#vol-age").val();
      var volFrom = $("#vol-from").val();
      var volTo = $("#vol-to").val();
      // if (volAge <=18){alert("You are too young to go to Africa by yourself")}
      var newVolunteer = new Volunteer(volName, volCity, volAge);
      console.log(newVolunteer);
      console.log(volCity);

      var ref = database.ref(volCity);
      console.log(ref);
      ref.on("value", gotData, errData);

      function gotData(data){
        console.log(data);
        $(".rec-list").html("");
        var recs = data.val();
        var keys = Object.keys(recs);
        for (var i=0; i<keys.length; i++){
          var k = keys[i];
          var name = recs[k].name;
          var people = recs[k].people;
          var city = recs[k].city;
          var from = recs[k].from;
          var to = recs[k].to;
          var message = recs[k].message;

          console.log(name, city);
          $(".rec-list").append(cellFormat);
          $(".rec-name-out:last").text(name);
          $(".rec-city-out:last").text(city);
          $(".rec-people-out:last").text(people);
          $(".rec-from-out:last").text(from);
          $(".rec-to-out:last").text(to);
          $(".rec-message-out:last").text(message);
        }
      }

      function errData (err) {
        console.log("err");
        console.log(err);
      }
      $(".rec-list-hidden").show();
    });




    // $(".rec-list").append(cellFormat);
    //
    // $(".rec-name-out:last").text(recName);
    // $(".rec-age-out:last").text(recAge);
    // $(".rec-city-out:last").text(recCity);
    // $(".rec-people-out:last").text(recPeople);
    // // $(".rec-supplies-out").text(recSupplies);
    // // $(".rec-lat-out").text(recLat);
    // // $(".rec-lng-out").text(recLng);
    // $(".rec-from-out:last").text(recFrom);
    // $(".rec-to-out:last").text(recTo);
    // $(".rec-message-out:last").text(recMessage);
    //
    // $("#receipient")[0].reset();
});
