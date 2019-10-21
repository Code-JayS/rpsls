var firebaseConfig = {
    apiKey: "AIzaSyAeu_5FuwSniyjk7CxwJ_PpcnAsiwkRglU",
    authDomain: "rpsls-d07d6.firebaseapp.com",
    databaseURL: "https://rpsls-d07d6.firebaseio.com",
    projectId: "rpsls-d07d6",
    storageBucket: "rpsls-d07d6.appspot.com",
    messagingSenderId: "1032783513130",
    appId: "1:1032783513130:web:0ad67b96a45dea4a40a553",
    measurementId: "G-72QSE9YX7D"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();
var playerOneWins;
var playerOneLosses;
var playerOneName;
var playerOneChoice;

var playerTwoWins;
var playerTwoLosses;
var playerTwoName;
var playerTwoChoice;
var ties = 0;
var sequence;
var myPlayerNumber = "none";


// retrieve the data from the database (both initially and every time something changes)

database.ref().on("value", function (snapshot) {

    // whose turn is it.
    if (snapshot.val().db_sequence !== undefined) {
        sequence = snapshot.val().db_sequence;
    }
    // If firebase doesn't know whose turn it is, make it know
    else {
        database.ref().update({
            db_sequence: 1
        });
    }

    // If db_player1 has a name, display p1Stats
    if (snapshot.val().db_playerOneName !== undefined) {
        $("#playerOneName").text(snapshot.val().db_playerOneName);
        $("#playerOneWins").text("Wins: " + snapshot.val().db_playerOneWins);
        $("#playerOneLosses").text("Losses: " + snapshot.val().db_playerOneLosses);
    }
    // If player 2 just logged out, don't let p1 play yet
    else if (snapshot.val().db_playerOneName === undefined && snapshot.val().db_playerTwoName !== undefined) {
        $("#gameSplash").text("Waiting for a new opponent...");
        $("#playerOneName").text("Player One");
        $("#playerOneWins").text(" ");
        $("#playerOneLosses").text(" ");
    }
    else {
        $("#playerOneName").text("Player One");
        $("#playerOneWins").text(" ");
        $("#playerOneLosses").text(" ");
    }

    // If db_player2 has a name, display p2Stats
    if (snapshot.val().db_playerTwoName !== undefined) {
        $("#playerTwoName").text(snapshot.val().db_playerTwoName);
        $("#playerTwoWins").text("Wins: " + snapshot.val().db_playerTwoWins);
        $("#playerTwoLosses").text("Losses: " + snapshot.val().db_p2Losses);
    }
    // If player 1 just logged out, don't let p2 play yet
    else if (snapshot.val().db_playerTwoName === undefined && snapshot.val().db_playerOneName !== undefined) {
        $("#gameSplash").text("Waiting for a new opponent...");
        $("#playerTwoName").text("Player Two");
        $("#playerTwoWins").text(" ");
        $("#playerTwoLosses").text(" ");
    }
    else {
        $("#playerTwoName").text("Player Two");
        $("#playerTwoWins").text(" ");
        $("#playerTwoLosses").text(" ");
    }

    // if Both players are active
    if (snapshot.val().db_playerOneName !== undefined && snapshot.val().db_playerTwoName !== undefined) {
        // if db_sequence === 1
        if (snapshot.val().db_sequence === 1) {
            if (myPlayerNumber === "player1") {
                // let player1 choose
                $("#gameSplash").text("Roshambo!");
            }
            else {
                $("#gameSplash").text("Waiting for " + snapshot.val().db_playerOneName + " to choose");
            }
        }
        // else if db_sequence === 2
        else if (snapshot.val().db_sequence === 2) {
            if (myPlayerNumber === "player2") {
                // let player2 choose  
                $("#gameSplash").text("Roshambo!");
            }
            else {
                $("#gameSplash").text("Waiting for " + snapshot.val().db_playerTwoName + " to choose");

            }
        }
        // else
        else if (snapshot.val().db_sequence === 0) {
            // Display all results
            playerOneChoice = snapshot.val().db_playerOneChoice;
            playerTwoChoice = snapshot.val().db_playerTwoChoice;


            $("#playerOneImage").attr("src", "./assets/images/" + playerOneChoice + ".png");
            $("#playerTwoImage").attr("src", "./assets/images/" + playerTwoChoice + ".png");

            // If player 1 wins
            if (playerOneChoice === "rock" && (playerTwoChoice === "scissors" || playerTwoChoice === "lizard")
                || playerOneChoice === "paper" && (playerTwoChoice === "rock" || playerTwoChoice === "spock")
                || playerOneChoice === "scissors" && (playerTwoChoice === "paper" || playerTwoChoice === "lizard")
                || playerOneChoice === "lizard" && (playerTwoChoice === "paper" || playerTwoChoice === "spock")
                || playerOneChoice === "spock" && (playerTwoChoice === "rock" || playerTwoChoice === "scissors")) {
                $("#gameSplash").text("Player One wins!");
                // Only update the database 1 time
                if (myPlayerNumber === "player1") {
                    playerOneWins = snapshot.val().db_playerOneWins;
                    playerOneWins++;
                    playerTwoLosses = snapshot.val().db_p2Losses;
                    playerTwoLosses++;
                    sequence = 3;
                    database.ref().update({
                        db_playerOneWins: playerOneWins,
                        db_p2Losses: playerTwoLosses,
                        db_sequence: sequence
                    });
                }
            }
            // Else if draw
            else if (playerTwoChoice === playerOneChoice) {
                $("#gameSplash").text("It's a draw!")
                ties++
            }
            // Else (draw)
            else {
                $("#gameSplash").text("Player Two wins!");
                // Only update the database 1 time
                if (myPlayerNumber === "player2") {
                    playerTwoWins = snapshot.val().db_playerTwoWins;
                    playerTwoWins++;
                    playerOneLosses = snapshot.val().db_playerOneLosses;
                    playerOneLosses++;
                    sequence = 3;
                    database.ref().update({
                        db_playerTwoWins: playerTwoWins,
                        db_playerOneLosses: playerOneLosses,
                        db_sequence: sequence
                    });
                }

            }
            // setTimeout for 3 seconds & reset sequence to 1
            setTimeout(resetsequence, 1000 * 5);
        }
    }

    // if a new user arrives & no p1, user can become p1
    if (myPlayerNumber === "none" && snapshot.val().db_playerOneName === undefined) {
        drawPlayerNameInput("player1");
        resetsequence();
    }
    // If a new user arrives & p1 exists but no p2, user can become p2
    else if (myPlayerNumber === "none" && snapshot.val().db_playerTwoName === undefined) {
        drawPlayerNameInput("player2");
        resetsequence();
    }
    else if (myPlayerNumber === "none") {
        drawPlayerNameDisplay();
    }

    // Set the local variable of p1's choice
    playerOneChoice = snapshot.val().db_playerOneChoice;

    // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
    // Again we could have named errorObject anything we wanted.
}, function (errorObject) {

    // In case of error this will print the error
    console.log("Something Went Wrong: " + errorObject.code);
});

// When a user clicks on one of the 3 choices,
$(document).on("click", "#choice", function () {
    var decision = $(this).attr("data");
    //if p1's turn
    if (sequence === 1) {
        
        sequence = 2;
        // update p1 db value
        database.ref().update({
            db_playerOneChoice: decision,
            db_sequence: sequence
        });
        
        if (myPlayerNumber === "player1") {
            $("#playerOneImage").attr("src", "./assets/images/" + playerOneChoice + ".png");
        }
        else{}
    }
        // if p2's turn
        else if (sequence === 2) {
            // sequence = 0
            sequence = 0;
            // update p2 db value
            database.ref().update({
                db_playerTwoChoice: decision,
                db_sequence: sequence
            });
        }
    });

// If a user inputs a name & pressed "Play"
$(document).on("click", ".btnPlayerNameInput", function (event) {
    event.preventDefault();

    sequence = 1;

    // If the form was for player 1, set local playerOneName & update db_playerOneName
    if ($(this).attr("id") === "player1") {
        playerOneName = $("#playerNameInput").val().trim();
        database.ref().update({
            db_playerOneName: playerOneName,
            db_playerOneWins: 0,
            db_playerOneLosses: 0,
            db_sequence: sequence
        });

        // Identify which player the user is & draw the player's side of the board
        myPlayerNumber = "player1";
        drawPlayerNameDisplay();
    }
    // If the form was for player 2, do the same
    else if ($(this).attr("id") === "player2") {
        playerTwoName = $("#playerNameInput").val().trim();
        database.ref().update({
            db_playerTwoName: playerTwoName,
            db_playerTwoWins: 0,
            db_p2Losses: 0,
            db_sequence: sequence
        });

        myPlayerNumber = "player2";
        drawPlayerNameDisplay();
    }
});

// Resets the player's turn to 1
function resetsequence() {
    database.ref().update({
        db_sequence: 1
    });
    $("#playerOneImage").attr("src", "./assets/images/roll.png");
    $("#playerTwoImage").attr("src", "./assets/images/roll.png");
}
// Draws the Player Name Input area if a player's seat is empty
function drawPlayerNameInput(whichPlayer) {
    $("#playerInfo").html(
        '<form class="form-inline">'
        + '<div class="form-group">'
        + '<input type="text" class="form-control" id="playerNameInput" placeholder="Your Name">'
        + '</div>'
        + '<button type="submit" class="btn btn-default btnPlayerNameInput" id="' + whichPlayer + '">Start</button>'
        + '</form>'
    );
}

// Shows the player which seat they're in, or if they're spectating
function drawPlayerNameDisplay() {
    if (myPlayerNumber === "none") {
        $("#playerInfo").html("You are currently spectating.");
    }
    else if (myPlayerNumber === "player1") {
        $("#playerInfo").html("Welcome, " + playerOneName + " You are player 1.");

    }
    else if (myPlayerNumber === "player2") {
        $("#playerInfo").html("Welcome, " + playerTwoName + " You are player 2.");

    }
}

$(document).on("click", "#chatSubmit", function (event) {
    event.preventDefault();

    var chatText = $("#messageInput").val().trim();
    var myName = "Spectator";

    if (myPlayerNumber === "player1") {
        myName = playerOneName;
    }
    else if (myPlayerNumber === "player2") {
        myName = playerTwoName;
    }

    database.ref().push({
        db_chatName: myName,
        db_chatType: myPlayerNumber,
        db_chatText: chatText
    });
    $("#messageInput").val(" ");
});

database.ref().on("child_added", function (snapshot) {
    var chatType = snapshot.val().db_chatType;
    var chatName = snapshot.val().db_chatName;
    var chatText = snapshot.val().db_chatText;


    if (chatType === "player1") {
        $("#chatLobby").prepend(chatName + ": " + chatText + '\n');
    }
    else if (chatType === "player2") {
        $("#chatLobby").prepend(chatName + ": " + chatText + '\n');
    }
    else if (chatType === "none") {
        $("#chatLobby").prepend(chatName + ": " + chatText + '\n');
    }
});




// When the user closes the window or tab, their seat becomes available
$(window).unload(function () {
    // If the player is p1, reset the p1 DB values
    if (myPlayerNumber === "player1") {
        database.ref().update({
            db_playerOneName: null,
            db_playerOneWins: 0,
            db_playerOneLosses: 0
        });


    }
    // If the player is p2, reset the p2 DB values
    else if (myPlayerNumber === "player2") {
        database.ref().update({
            db_playerTwoName: null,
            db_playerTwoWins: 0,
            db_p2Losses: 0
        });
    }

});
