/********************************** Commented out till MVP completed****************88
 
 
// Creates an array that lists out all of the options (Rock, Paper, or Scissors).
     
var computerChoices = ["rock", "p", "s", "l", "s"];


// This function is run whenever the user presses a button.
function playComputer() {

//     // Determines which button was pressed.
   var userGuess = button.data;

   // Randomly chooses a choice from the options array. This is the Computer's guess.
   var computerGuess = computerChoices[Math.floor(Math.random() * computerChoices.length)];

   if (userGuess === "r" || userGuess === "p" || userGuess === "s" || userGuess === "l" || userGuess === "spock") {
       //alert(userGuess);

       if (userGuess === "r" && (computerGuess === "s" || computerGuess === "l")
           || userGuess === "p" && (computerGuess === "r" || computerGuess === "v")
           || userGuess === "s" && (computerGuess === "p" || computerGuess === "l")
           || userGuess === "l" && (computerGuess === "p" || computerGuess === "v")
           || userGuess === "v" && (computerGuess === "r" || computerGuess === "s")) {
           alert("Player wins!")
       }
       else if (userGuess === computerGuess) {
           alert("tie")
       }
       else {
           alert("you lose")
       }
   }
}
*/

// var userGuess = "";

// function roshambo() {
//     // if (userGuess === "rock" || userGuess === "paper" || userGuess === "scissors" || userGuess === "lizard" || userGuess === "spock") {
//     //     //alert(userGuess);

//         if (playerOneChoice === "rock" && (playerTwoChoice === "scissors" || playerTwoChoice === "lizard")
//             || playerOneChoice === "paper" && (playerTwoChoice === "rock" || playerTwoChoice === "spock")
//             || playerOneChoice === "scissors" && (playerTwoChoice === "paper" || playerTwoChoice === "lizard")
//             || playerOneChoice === "lizard" && (playerTwoChoice === "paper" || playerTwoChoice === "spock")
//             || playerOneChoice === "spock" && (playerTwoChoice === "rock" || playerTwoChoice === "scissors")) {
//             playerWin();
//         }
//         else if (playerOneChoice === opponentGuess) {
//             gameTie();
//         }
//         else {
//             playerLose();
//         }
//     }
// };


$("roshambo").on("click", function() {
    userGuess = $(this).attr("data");
});

$(document).ready(function () {
    $('.fixed-action-btn').floatingActionButton();
});

