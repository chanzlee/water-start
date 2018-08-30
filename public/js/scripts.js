//Back-end ////////////////////////////////////////////////////

//Rotating images on the top
var slideIndex = 0;
var images = [];
function carousel() {
  var i;
  //hide all images at first
  for (i = 0; i < images.length; i++) {
    images[i].hide();
  }
  //then show images by selecting its index
  slideIndex++;
  if (slideIndex > images.length) {slideIndex = 1}
  images[slideIndex-1].show();
  //As setTimeout function will repeat hide everything and show something, "slideIndex" goes up.
  //So, it will show the next image with higher index until the index reaches the length of index array!

  setTimeout(carousel, 3500);
  // 3500 is for changing image every 3.5 seconds
}



//the object, receipients will contain the receipient instances made through constructors with user-given inputs.
var receipients = {};
//Yes I know it's recipients, not receipients. Whatever.

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



//Front-end ///////////////////////////////////////////////
$(document).ready(function(){
  //Maybe, you are not sure why the images are pushed here all apart from the back-end carousel function.
  //That's because we have to grab images after html is fully loaded.
  $("img.carouselImage").each(function(){
    images.push($(this));
  });
  carousel();

  //Slidetoggle function for buttons, using ".collapse" class.
  $(".tablinks").click(function(){
    // var clicked = this;
    if($(this).next().is(":hidden")) {
      $(".collapse").slideUp("slow");
      $(this).next(".collapse").slideDown("slow");
    } else {
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



  //Prepare for pushing recipients user-inputs to firebase database! Nevermind. this just sets variable for convenience.
  var database = firebase.database();


  //When needies submit the form, the data will be stored in firebase database.
  $("#receipient").submit(function(event){
    event.preventDefault();

    var recName = $("#rec-name").val().toUpperCase();
    var recAge = $("#rec-age").val();
    var recPeople = $("#rec-people").val();
    var recCity = $("#rec-city").val();
    var recFrom = $("#rec-from").val();
    var recTo = $("#rec-to").val();
    var recMessage = $("#rec-message").val();


    // create Receipient instance based on the inputs.
    var recInstance = new Receipient (recName, recPeople, recCity,recFrom,recTo,recMessage);


    //Just need three lines to push
    //1. Set data reference to recipient's city so that the data can be stored under the city. You might want to show the database tree in firebase console online.
    var ref = database.ref(recCity);

    //2. Push the instance that recipient just created into the database
    ref.push(recInstance);

    //3. CONSOLE LOG.  So it needs just two lines to push.
    console.log(recInstance);


    //Clearing all previous inputs on the recipient's input fields. Chan found this.
    $("#receipient")[0].reset();
  });


  //Q...? When do you use the saved data?

  //So we pushed all the recipients data. We retrieve that when volunteers decide to help people and submit the form.

  //When retrieving the database, we need to "format" to append and put datas inside that "format". So, for every data, append format, text data values. This format is called "cell" here and total dataset will be located inside "cell-list"

  //cellFormat below is hidden div just for copying its html tags and use it as a format.
  var cellFormat = $(".format").html();
  console.log(cellFormat);

  //Volunteer side function
  $("#volunteer").submit(function(event){
    event.preventDefault();
    $(".hidden").show();
    var volName = $("#vol-name").val();
    var volCity = $("#vol-city").val();
    var volAge = $("#vol-age").val();
    var volFrom = $("#vol-from").val();
    var volTo = $("#vol-to").val();
    // if (volAge <=18){alert("You are too young to go to Africa by yourself")}
    var newVolunteer = new Volunteer(volName, volCity, volAge);
    console.log(newVolunteer);
    console.log(volCity);

    //Based on the city volunteers selected, we show map of the city through google map API!
    // Yes, it can be done by switch function.
    if (volCity === "Kinshasa") {$(".mapOfKinshasa").show();
    } else if (volCity === "Lubumbashi") {$(".mapOfLubumbashi").show();
    } else if (volCity === "Mbuji-Mayi") {$(".mapOfMbuji").show();
    } else if (volCity === "Kananga") {$(".mapOfKananga").show();
    } else if (volCity === "Kisangani") {$(".mapOfKisangani").show();
    } else if (volCity === "Goma") {$(".mapOfGoma").show();
    } else if (volCity === "Bukavu") {$(".mapOfBukavu").show();
    } else if (volCity === "Tshikapa") {$(".mapOfTshikapa").show();
    } else if (volCity === "Masina") {$(".mapOfMasina").show();
    } else {$(".mapOfKolwezi").show();
    }

    //When retrieving data, it's hard.
    //We want to show only the data of city that volunteer picked. So, set reference as a volCity this time.
    var ref = database.ref(volCity);
    // It is important to check what's going on.
    console.log(ref);

    //You might be accustomed to on() method if you know the older/newer version of javaScript. click(function(){}); is basically translated to on("click,...);
    // But here, it's about listening to changes on "Database". So there can be 5 types of event: "value","child-added","child-changed","child-moved","child-removed"
    //"value" is used when we want to retrieve "snapshot" of the data.
    // I assume that gotData is a handler function, and errData is a fail-safe function.
    ref.on("value", gotData, errData);

    //With the "dataSnapshot" we got from the reference, we run gotData function.
    function gotData(data){

      console.log(data);
      // $(".rec-list").html("");
      //value of dataSnapshot, is just object of objects. Very hard to make approach
      var recs = data.val();
      //So we breakdown this object with key arrays. Again, see the data tree to find out what these "keys" are.
      var keys = Object.keys(recs);

      //I don't know how to explain this in plain English. Just think these keys as a group of foreign gangsters. I can't really read their assigned names but before we jail them, we take down specific info of individual ganster, one by one. And then,
      for (var i=0; i<keys.length; i++){
        var k = keys[i];
        var name = recs[k].name;
        var people = recs[k].people;
        var city = recs[k].city;
        var from = recs[k].from;
        var to = recs[k].to;
        var message = recs[k].message;


      // We build a jail with "format" and put this ganster's info inside there.
        console.log(name, city);
        $(".col-sm-6.append").append(cellFormat);
        $(".rec-name-out:last").text(name);
        $(".rec-city-out:last").text(city);
        $(".rec-people-out:last").text(people);
        $(".rec-from-out:last").text(from);
        $(".rec-to-out:last").text(to);
        $(".rec-message-out:last").text(message);

      //We also assign function for each gansters. Just think we train them one by one to listen to our clicks. When he's clicked, he shows up(with his info). Everyone else, hide.
      //On my second thought after writing, this is a bad analogy. Don't use this.
        $(".cell").last().click(function(){
          $(this).siblings().fadeToggle();
          if (volCity === "Kinshasa") {$(".address1").show();
          } else if (volCity === "Lubumbashi") {$(".address2").show()
          } else if (volCity === "Mbuji-Mayi") {$(".address3").show();
          } else if (volCity === "Kananga") {$(".address4").show();
          } else if (volCity === "Kisangani") {$(".address5").show();
          } else if (volCity === "Goma") {$(".address6").show();
          } else if (volCity === "Bukavu") {$(".address7").show();
          } else if (volCity === "Tshikapa") {$(".address8").show();
          } else if (volCity === "Masina") {$(".address9").show();
          } else {$(".address10").show()};
        });
      }
      //end of the for-loop
    }
    //end of the gotData funciton

    function errData (err) {
      console.log("err");
      console.log(err);
    }
  });
  // end of volunteer-side submit function
});
