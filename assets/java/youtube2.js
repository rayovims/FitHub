var CLIENT_ID = '432317403557-0tm9npcn21fnb397riijjinkq1cnmpse.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';
var videoId = [];

googleApiClientReady = function() {
    gapi.auth.init(function() {
        window.setTimeout(checkAuth, 1);
    });
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        $("#signin-button").on("click", function() {
            handleAuthClick();
        });
        $("#signout-button").on("click", function() {
            handleSignoutClick();
        })
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        $('#search-button').attr('disabled', false);
        $("#signin-button").hide();
        $("#signout-button").show();

    } else {
        $("#signin-button").show();
        $("#signout-button").hide();
        $('#search-button').attr('disabled', true);
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    $("#videosGoHere").html("");
    $("#pic").html("");
    $("#notes").hide();
    $("#userNotes").hide();
}

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}
var pic = [];
var title;

function search() {
    var q = $('#query').val();
    var request = gapi.client.youtube.search.list({
        q: q,
        part: 'snippet'
    });
    request.execute(function(response) {
        for (var i = 0; i < 5; i++) {
            title.push(response.items[i].snippet.title);

            pic.push(response.items[i].snippet.thumbnails.high.url);

            videoId.push(response.items[i].id.videoId);
            $("#pic").append("<p>" + title[i] + "</p><img class='selection' data-answer-index='" + i + "' src='" + pic[i] + "'><br>");
        }
    });
};

$("#videoHome").on("click", "#addNote", function(e) {
    e.preventDefault();
    notesKept = $("#newNotes").val().trim();

    $("#notesDisplay").text(notesKept);

    localStorage.setItem("notesNew", notesKept);
});

$("#staffPickBtn").on("click", function() {
    $("#videoHome").html("<div class='col-lg-4 text-center'><h3>Kelly's pick</h3><img class='staffVideo' data-index='1'src='https://i.ytimg.com/vi/WFUOtnI1jwk/hqdefault.jpg'></div><div class='col-lg-4 text-center'><h3>Ray's pick</h3><img class='staffVideo' data-index='2'src= 'https://i.ytimg.com/vi/ZtlH0A5dlLg/hqdefault.jpg'></div><div class='col-lg-4 text-center'><h3>Stephen's pick</h3><img class='staffVideo' data-index='3'src='https://i.ytimg.com/vi/CdtrfXK7bcg/hqdefault.jpg'></div>");

    $("#videoHome").show();
    $("#videoSearched").hide();

})

$("#notesDisplay").text(localStorage.getItem("notesNew"));

$("#newNotesBtn").on("click", function() {
    $("#videoHome").show();
    $("#videoSearched").hide();

    $("#videoHome").html("<div class='col-lg-5'><textarea id='newNotes' placeholder='Here is where you can add new notes'></textarea></div><div class='col-lg-2 text-center'><button class='btn btn-success' id='addNote'>Add Note</button></div><div class='col-lg-5 text-right' id='notesDisplay'></div>");
});


$("#videoHome").on("click", ".staffVideo", function() {
    var staffChosen = ($(this).data("index"));
    if (staffChosen == 1) {
        $("#videoHome").html("<div class='col-lg-6 text-center'><h2>Leg Workout</h2><iframe class='videoFrame' src='https://www.youtube.com/embed/WFUOtnI1jwk'></iframe></div><div class='col-lg-6 text-right'><h2>Exercise instructions</h2><textarea id='staffNotes'>#1Front Barbell Squat: 4 set of 6-8 reps. #2 Leg Press: 3 sets of 8-10 reps. #3 Leg Curls: 3 sets of 6-8 reps. #4 Barbell Reverse Lunge: 3 sets of 8, 10, 12 reps. #5 Deadlift: 3 sets of 8-12 reps.</textarea>");
    }
    if (staffChosen == 2) {
        $("#videoHome").html("<div id='center1' class='col-lg-6'><h2>Chest Workout</h2><iframe class='videoFrame' src='https://www.youtube.com/embed/ZtlH0A5dlLg'></iframe></div><div class='col-lg-6 text-right'><h2>Exercise instructions</h2><textarea id='staffNotes'>#1Barbell Bench Press: 3 sets of 20,15,10 reps. #2Incline Dumbbell Press: 2 sets of 10-12 reps to failure. #3Flat Dumbbell Fly: 2 sets of 15 reps to failure. #4Bar Dip: 3 sets to failure. #5Push-Up: 100 reps.</textarea>");
    }
    if (staffChosen == 3) {
        $("#videoHome").html("<div class='col-lg-6 text-right'><h2>Back Workout</h2><iframe class='videoFrame' src='https://www.youtube.com/embed/CdtrfXK7bcg'></iframe></div><div class='col-lg-6 text-right'><h2>Exercise instructions</h2><textarea id='staffNotes'>#1Wide Grip Pullup: 3 sets of 8-12 reps. #2Standing T-Bar Row: 4 sets of 8-10 reps. #3Wide-Grip Seated Cable Row: 4 sets of 10-12 reps. #Reverse Grip Smith Machine Row: 3 sets to 8-10 reps. #5Close Grip Pull Down: 3 sets 10-12 reps.</textarea>");
    }
});

$("#newNotesBtn").on("click", function() {

})

$("#userNotes").hide();
$("#notes").hide();
$("#userNotes").hide();


$("body").on("click", ".selection", function() {

    var chosen = ($(this).data("answer-index"));

    $("#videosGoHere").html("<iframe id='player'src='https://www.youtube.com/embed/" + videoId[chosen] + "'></iframe>");

    $("#userNotes").show();
    $("#notes").show();
});

$("#search-button").on("click", function() {
    $("#videoSearched").show();
    $("#videoHome").hide();
    title = [];
    pic = [];
    videoId = [];
    $("#pic").html("");
    $("#videosGoHere").html("");
    search();
    $("#userNotes").hide();
    $("#notes").hide();
});