$(document).ready(function(){
    var stuff = {
        "toast":[
            {"image": "img/toast1.jpg"},
            {"image": "img/toast2.jpg"},
            {"image": "img/toast3.jpg"},
            {"image": "img/toast4.jpg"}
        ],
        "run":[
            {"image": "img/run1.jpg"},
            {"image": "img/run2.jpg"},
            {"image": "img/run3.jpg"},
            {"image": "img/run4.jpg"}
        ],
        "burn":[
            {"image": "img/burn1.jpg"},
            {"image": "img/burn2.jpg"},
            {"image": "img/burn3.jpg"},
            {"image": "img/burn4.jpg"}
        ],
        "squeeze":[
            {"image": "img/squeeze1.jpg"},
            {"image": "img/squeeze2.jpg"},
            {"image": "img/squeeze3.jpg"},
            {"image": "img/squeeze4.jpg"}
        ],
        "sleep":[
            {"image": "img/sleep1.jpg"},
            {"image": "img/sleep2.jpg"},
            {"image": "img/sleep3.jpg"},
            {"image": "img/sleep4.jpg"}
        ],
        "bolt":[
            {"image": "img/bolt1.jpg"},
            {"image": "img/bolt2.jpg"},
            {"image": "img/bolt3.jpg"},
            {"image": "img/bolt4.jpg"}
        ],
        "drive":[
            {"image": "img/drive1.jpg"},
            {"image": "img/drive2.jpg"},
            {"image": "img/drive3.jpg"},
            {"image": "img/drive4.jpg"}
        ],
        "spin":[
            {"image": "img/spin1.jpg"},
            {"image": "img/spin2.jpg"},
            {"image": "img/spin3.jpg"},
            {"image": "img/spin4.jpg"}
        ]
    }

    var words = Object.keys(stuff);
    var currentRound = 0;
    var randomWord;

    shuffle(words); // ensures random word every time the page is refreshed
    setupGame();  // generates images and letter tiles for first word in list

    function setupGame(){
      setImages(currentRound);
      wordBlanks(words[currentRound]);
      populateLetterTiles(randomWord);
    }

    // places corresponding images in individual td
    function setImages(selectedWord){
      randomWord = words[selectedWord];
      var imageContainer = $("table tr").children();
      for(i=1; i<imageContainer.length+1; i++) {
        imageContainer[i-1].innerHTML = "<img src='img/"+randomWord+i+".jpg'>";
      }
    }

    // generates empty tiles for words to be guessed
    function wordBlanks(word) {
      var guessWordContainer = $("#word-guess .flex-container");
      guessWordContainer.children().remove();
      for(i=0; i<word.length; i++) {
        var guessDiv = document.createElement("div");
        guessDiv.classList.add("letter-tile");
        guessDiv.classList.add("empty-tile");
        var guessSpan = document.createElement("span");
        guessDiv.appendChild(guessSpan);
        // guessSpan.append(word[i]);
        guessWordContainer.append(guessDiv);
      }
    }

    // fill in letter tiles at start of game
    function populateLetterTiles(randomWord) {
      var letterTiles = $("#letters .flex-container .has-letter").children("span");
      var eachLetter = randomWord.split("");
      var iterations = 12-eachLetter.length;
      for(i=0; i<iterations; i++) {
        var randomLetter = String.fromCharCode(getRandomIntRange(97,122));
        eachLetter.push(randomLetter);
      }
      shuffle(eachLetter);
      for(i=0; i<eachLetter.length; i++) {
        letterTiles[i].innerHTML = eachLetter[i];
      }
    }

    // add letters to guess tiles
    $("#letters").on("click","div.has-letter",function(){
      var emptyTiles = $("#word-guess div.empty-tile>span");
      if(emptyTiles.length!=0) {
        var spanLetter = $(this).children().text();
        var spanId = $(this).attr("id");
        var nextEmptyTile = emptyTiles.first();
        nextEmptyTile.text(spanLetter);
        nextEmptyTile.parent().attr("id",spanId);
        $(this).removeClass("has-letter");
        $(this).addClass("empty-tile");
        nextEmptyTile.parent().addClass("has-letter");
        nextEmptyTile.parent().removeClass("empty-tile");
        emptyTiles = $("#word-guess div.empty-tile>span");
      }
    });

    // remove letters from guess & add back to letter container
    $("#backspace").on("click", function(){
      var hasLetterTiles = $("#word-guess div.has-letter>span");
        if (hasLetterTiles.length > 0) {   //at least one letter in word guess
          var lastLetter = hasLetterTiles.last().parent();
          var spanId = lastLetter.attr("id");
          lastLetter.removeClass("has-letter");
          lastLetter.addClass("empty-tile");

          var deletedTile = $("#letters div[id='"+spanId+"']");
          deletedTile.addClass("has-letter");
          deletedTile.removeClass("empty-tile");
        }
    });

    var allowSubmit = true;
    $("#submit").on("click",function(){
      var hasLetterTiles = $("#word-guess div.has-letter>span");
      var currentGuess = "";
      for(i=0; i<hasLetterTiles.length; i++) {
        currentGuess += hasLetterTiles[i].innerHTML;
      }

      var isCorrect = checkWordIsCorrect(currentGuess,randomWord);
      if(isCorrect && allowSubmit) {
        allowSubmit = false;
        youWin();
        setTimeout(function(){
          allowSubmit = true;
        },1000);
      } else {
        wrongGuess();
      }
    });

    // check if word guess is correct
    function checkWordIsCorrect(str1,str2) {
      if(str1 == str2) {
        return true;
      } else {
        return false;
      }
    }

    // variables for wrongGuess() and youWin()
    var teedees = $("td");
    var flexy = $("#word-guess .flex-container");

    // flash red if word wrong
    function wrongGuess() {
      teedees.addClass("wrong-guess");
      flexy.addClass("wrong-guess");
      setTimeout(function(){
        teedees.removeClass("wrong-guess");
        flexy.removeClass("wrong-guess");
      }, 1000);
    }

    // flash green if correct and setup next game
    function youWin(){
      currentRound++;
      if(currentRound<words.length) {
        rightGuess();
        setTimeout(function(){
          setupGame();
        },1000);
      } else {
        rightGuess();
        setTimeout(function(){
          alert("You guessed all the words");
      },1300);
      }
    }

    function rightGuess() {
      teedees.addClass("right-guess");
      flexy.addClass("right-guess");
      setTimeout(function() {
        var emptyLetterTiles = $("#letters div.empty-tile");
        emptyLetterTiles.addClass("has-letter");
        emptyLetterTiles.removeClass("empty-tile");
          teedees.removeClass("right-guess");
          flexy.removeClass("right-guess");
      }, 1000);
    }

    // shuffles array of available words to guarantee a random order
    function shuffle(array) {
      var currentIndex = array.length, tempVal, randomIndex;
      while(0!=currentIndex) {
        randomIndex = getRandomInt(currentIndex);
        currentIndex--;

        tempVal = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempVal;
      }
    }

    // generates random int
    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    // generates random int between range
    function getRandomIntRange(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    // starts new round as long as a new word is available


});
