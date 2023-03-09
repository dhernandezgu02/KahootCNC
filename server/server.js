//Import dependencies
const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

//Import classes
const { LiveGames } = require("./utils/liveGames");
const { Players } = require("./utils/players");

const publicPath = path.join(__dirname, "../public");
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
// const io = require("socket.io")(server);
var games = new LiveGames();
var players = new Players();

//Mongodb setup
var MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");
// var url = "mongodb://localhost:27017/";
var url =
  "mongodb+srv://EPMGDP:E2s%2atNsmvlUTfR@cluster0.kwv0nnj.mongodb.net/test?authSource=admin&replicaSet=atlas-yx0j1g-shard-0&readPreference=primary&ssl=true";

app.use(express.static(publicPath));

//Starting server on port 3000
server.listen(3000, () => {
  console.log("Server started on port 3000");
});

/*250	100	400	500	800	100
0	40	160	200	320	40
*/

const getPlayerRanking = (hostId) => {
  var playersInGame = players.getPlayers(hostId);

  playersInGame.sort(function (a, b) {
    return b.gameData.score - a.gameData.score;
  });

  var topFivePlayers = playersInGame.slice(0, 8);

  var playerNames = topFivePlayers.map(function (player) {
    return player.name + ": " + player.gameData.score;
  });
  return playerNames;
};

const rounds = [
  {
    bankRuptProbability: 0.42,
    comparison: [
      { a: 400, b: 500, c: 100 },
      { a: 650, b: 700, c: 50 },
      { a: 950, b: 1300, c: 350 },
      { a: 100, b: 500, c: 400 },
      { a: 400, b: 450, c: 50 },
    ],
    inVest: [
      { 1: "A", 2: "A", 3: "A", 4: "A", 5: "A" },
      { 1: "A", 2: "B", 3: "A", 4: "0", 5: "B" },
      { 1: "A", 2: "B", 3: "B", 4: "A", 5: "0" },
      { 1: "B", 2: "B", 3: "B", 4: "0", 5: "0" },
      { 1: "0", 2: "B", 3: "B", 4: "B", 5: "0" },
      { 1: "B", 2: "A", 3: "A", 4: "0", 5: "A" },
    ],
    payments: [
      { 0: 250, 1: 100, 2: 400, 3: 500, 4: 800, 5: 100 },
      { 0: 0, 1: 40, 2: 160, 3: 200, 4: 320, 5: 40 },
    ],
    portFolios: [
      { win: 250, loose: 0 },
      { win: 100, loose: 40 },
      { win: 400, loose: 160 },
      { win: 500, loose: 200 },
      { win: 800, loose: 320 },
      { win: 100, loose: 40 },
    ],
  },
  {
    bankRuptProbability: 0.47,
    comparison: [
      { a: 544, b: 612, c: 68 },
      { a: 1292, b: 1768, c: 476 },
      { a: 544, b: 680, c: 136 },
      { a: 136, b: 680, c: 544 },
      { a: 884, b: 952, c: 68 },
    ],
    inVest: [
      { 1: "A", 2: "A", 3: "A", 4: "A", 5: "A" },
      { 1: "A", 2: "B", 3: "A", 4: "A", 5: "0" },
      { 1: "0", 2: "B", 3: "A", 4: "A", 5: "B" },
      { 1: "B", 2: "B", 3: "B", 4: "0", 5: "0" },
      { 1: "0", 2: "B", 3: "B", 4: "B", 5: "0" },
      { 1: "B", 2: "A", 3: "A", 4: "0", 5: "A" },
    ],
    payments: [
      { 0: 340, 1: 476, 2: 544, 3: 680, 4: 1156, 5: 68 },
      { 0: 0, 1: 340, 2: 272, 3: 425, 4: 646, 5: 51 },
    ],
    portFolios: [
      { win: 340, loose: 0 },
      { win: 476, loose: 340 },
      { win: 544, loose: 272 },
      { win: 680, loose: 425 },
      { win: 1156, loose: 646 },
      { win: 68, loose: 51 },
    ],
  },

  {
    bankRuptProbability: 0.41,
    comparison: [
      { a: 2615.35, b: 3578.9, c: 963.55 },
      { a: 1101.2, b: 1238.85, c: 137.65 },
      { a: 1789.45, b: 1927.1, c: 137.65 },
      { a: 1101.2, b: 1376.5, c: 275.3 },
      { a: 275.3, b: 1376.5, c: 1101.2 },
    ],
    inVest: [
      { 1: "A", 2: "A", 3: "A", 4: "A", 5: "A" },
      { 1: "A", 2: "B", 3: "B", 4: "A", 5: "0" },
      { 1: "0", 2: "B", 3: "A", 4: "A", 5: "B" },
      { 1: "B", 2: "B", 3: "B", 4: "0", 5: "0" },
      { 1: "0", 2: "B", 3: "B", 4: "B", 5: "B" },
      { 1: "B", 2: "A", 3: "A", 4: "0", 5: "A" },
    ],
    payments: [
      { 0: 688, 1: 138, 2: 1239, 3: 1239, 4: 1652, 5: 964 },
      { 0: 0, 1: 118, 2: 1101, 3: 747, 4: 1219, 5: 590 },
    ],
    portFolios: [
      { win: 688, loose: 0 },
      { win: 138, loose: 118 },
      { win: 1239, loose: 1101 },
      { win: 1239, loose: 747 },
      { win: 1652, loose: 1219 },
      { win: 964, loose: 590 },
    ],
  },
  {
    bankRuptProbability: 0.48,
    comparison: [
      { a: 3605.25, b: 4933.5, c: 1328.25 },
      { a: 1518, b: 1897.5, c: 379.5 },
      { a: 379.5, b: 1897.5, c: 1518 },
      { a: 2466.75, b: 2656.5, c: 189.75 },
      { a: 1518, b: 1707.75, c: 189.75 },
    ],
    inVest: [
      { 1: "A", 2: "A", 3: "A", 4: "A", 5: "A" },
      { 1: "A", 2: "B", 3: "A", 4: "A", 5: "0" },
      { 1: "0", 2: "B", 3: "A", 4: "A", 5: "B" },
      { 1: "B", 2: "B", 3: "B", 4: "0", 5: "0" },
      { 1: "0", 2: "B", 3: "B", 4: "B", 5: "B" },
      { 1: "B", 2: "A", 3: "A", 4: "0", 5: "A" },
    ],
    payments: [
      { 0: 949, 1: 380, 2: 569, 3: 3226, 4: 2277, 5: 1328 },
      { 0: 0, 1: 633, 2: 1392, 3: 2404, 4: 1961, 5: 1265 },
    ],
    portFolios: [
      { win: 949, loose: 0 },
      { win: 380, loose: 633 },
      { win: 569, loose: 1392 },
      { win: 3226, loose: 2404 },
      { win: 2277, loose: 1961 },
      { win: 1328, loose: 1265 },
    ],
  },
  {
    bankRuptProbability: 0.41,
    comparison: [
      { a: 1527.5, b: 1645, c: 117.5 },
      { a: 235, b: 1175, c: 940 },
      { a: 940, b: 1175, c: 235 },
      { a: 940, b: 1057.5, c: 117.5 },
      { a: 2235.5, b: 3055, c: 822.5 },
    ],
    inVest: [
      { 1: "A", 2: "A", 3: "A", 4: "A", 5: "A" },
      { 1: "A", 2: "B", 3: "A", 4: "A", 5: "0" },
      { 1: "0", 2: "B", 3: "0", 4: "A", 5: "B" },
      { 1: "B", 2: "B", 3: "B", 4: "0", 5: "0" },
      { 1: "0", 2: "B", 3: "B", 4: "0", 5: "B" },
      { 1: "B", 2: "A", 3: "A", 4: "0", 5: "A" },
    ],
    payments: [
      { 0: 443, 1: 89, 2: 710, 3: 887, 4: 798, 5: 710 },
      { 0: 0, 1: 710, 2: 745, 3: 1313, 4: 674, 5: 568 },
    ],
    portFolios: [
      { win: 443, loose: 0 },
      { win: 89, loose: 710 },
      { win: 710, loose: 745 },
      { win: 887, loose: 1313 },
      { win: 798, loose: 674 },
      { win: 710, loose: 568 },
    ],
  },
  {
    bankRuptProbability: 0.46,
    comparison: [
      { a: 177.39, b: 886.95, c: 709.56 },
      { a: 709.56, b: 798.255, c: 88.695 },
      { a: 1153.035, b: 1241.73, c: 88.695 },
      { a: 709.56, b: 886.95, c: 177.39 },
      { a: 1685.205, b: 2306.07, c: 620.865 },
    ],
    inVest: [
      { 1: "A", 2: "A", 3: "A", 4: "A", 5: "A" },
      { 1: "A", 2: "B", 3: "A", 4: "A", 5: "0" },
      { 1: "A", 2: "B", 3: "0", 4: "A", 5: "B" },
      { 1: "B", 2: "B", 3: "B", 4: "0", 5: "0" },
      { 1: "0", 2: "B", 3: "B", 4: "0", 5: "B" },
      { 1: "A", 2: "0", 3: "B", 4: "A", 5: "A" },
    ],
    payments: [
      { 0: 588, 1: 940, 2: 940, 3: 1293, 4: 1998, 5: 1058 },
      { 0: 0, 1: 1586, 2: 1058, 3: 2233, 4: 2233, 5: 1116 },
    ],
    portFolios: [
      { win: 588, loose: 0 },
      { win: 940, loose: 1586 },
      { win: 940, loose: 1058 },
      { win: 1293, loose: 2233 },
      { win: 1998, loose: 2233 },
      { win: 1058, loose: 1116 },
    ],
  },
  {
    bankRuptProbability: 0.4,
    comparison: [
      { a: 1333.2, b: 1666.5, c: 333.3 },
      { a: 1333.2, b: 1499.85, c: 166.65 },
      { a: 333.3, b: 1666.5, c: 1333.2 },
      { a: 2166.45, b: 2333.1, c: 166.65 },
      { a: 3166.35, b: 4332.9, c: 1166.55 },
    ],
    inVest: [
      { 1: "A", 2: "A", 3: "A", 4: "A", 5: "A" },
      { 1: "B", 2: "B", 3: "B", 4: "B", 5: "0" },
      { 1: "B", 2: "0", 3: "0", 4: "A", 5: "B" },
      { 1: "B", 2: "B", 3: "B", 4: "0", 5: "0" },
      { 1: "0", 2: "B", 3: "B", 4: "0", 5: "B" },
      { 1: "B", 2: "0", 3: "0", 4: "B", 5: "B" },
    ],
    payments: [
      { 0: 833, 1: 2000, 2: 1500, 3: 1833, 4: 2666, 5: 1667 },
      { 0: 0, 1: 3444, 2: 2111, 3: 4777, 4: 4111, 5: 2222 },
    ],
    portFolios: [
      { win: 833, loose: 0 },
      { win: 2000, loose: 3444 },
      { win: 1500, loose: 2111 },
      { win: 1833, loose: 4777 },
      { win: 2666, loose: 4111 },
      { win: 1667, loose: 2222 },
    ],
  },
  {
    bankRuptProbability: 0.47,
    comparison: [
      { a: 1259.05, b: 1355, c: 96.85 },
      { a: 774.8, b: 871.65, c: 96.85 },
      { a: 193.7, b: 968.5, c: 774.8 },
      { a: 774.8, b: 968.5, c: 193.7 },
      { a: 1840.15, b: 2518.1, c: 677.95 },
    ],
    inVest: [
      { 1: "A", 2: "A", 3: "A", 4: "A", 5: "A" },
      { 1: "B", 2: "B", 3: "B", 4: "B", 5: "0" },
      { 1: "B", 2: "0", 3: "0", 4: "A", 5: "B" },
      { 1: "B", 2: "B", 3: "B", 4: "A", 5: "0" },
      { 1: "0", 2: "B", 3: "B", 4: "0", 5: "B" },
      { 1: "B", 2: "0", 3: "0", 4: "B", 5: "B" },
    ],
    payments: [
      { 0: 484, 1: 1162, 2: 775, 3: 969, 4: 1550, 5: 969 },
      { 0: 0, 1: 3002, 2: 1743, 3: 2809, 4: 3583, 5: 1937 },
    ],
    portFolios: [
      { win: 484, loose: 0 },
      { win: 1162, loose: 3002 },
      { win: 775, loose: 1743 },
      { win: 969, loose: 2809 },
      { win: 1550, loose: 3583 },
      { win: 969, loose: 1937 },
    ],
  },
];

//When a connection to server is made from client
io.on("connection", (socket) => {
  //When host connects for the first time
  socket.on("host-join", (data) => {
    //Check to see if id passed in url corresponds to id of kahoot game in database
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("kahootDB");
      var query = { id: parseInt(data.id) };
      dbo
        .collection("kahootGames")
        .find(query)
        .toArray(function (err, result) {
          if (err) throw err;

          //A kahoot was found with the id passed in url
          if (result[0] !== undefined) {
            var gamePin = Math.floor(Math.random() * 90000) + 10000; //new pin for game

            games.addGame(gamePin, socket.id, false, {
              playersAnswered: 0,
              questionLive: false,
              gameid: data.id,
              question: 1,
            }); //Creates a game with pin and host id

            var game = games.getGame(socket.id); //Gets the game data

            socket.join(game.pin); //The host is joining a room based on the pin

            console.log("Game Created with pin:", game.pin);

            //Sending game pin to host so they can display it for players to join
            socket.emit("showGamePin", {
              pin: game.pin,
            });
          } else {
            socket.emit("noGameFound");
          }
          db.close();
        });
    });
  });

  //When the host connects from the game view
  socket.on("host-join-game", (data) => {
    var oldHostId = data.id;
    var game = games.getGame(oldHostId); //Gets game with old host id
    if (game) {
      game.hostId = socket.id; //Changes the game host id to new host id
      socket.join(game.pin);
      var playerData = players.getPlayers(oldHostId); //Gets player in game
      for (var i = 0; i < Object.keys(players.players).length; i++) {
        if (players.players[i].hostId == oldHostId) {
          players.players[i].hostId = socket.id;
        }
      }
      var gameid = game.gameData["gameid"];
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("kahootDB");
        var query = { id: parseInt(gameid) };
        dbo
          .collection("kahootGames")
          .find(query)
          .toArray(function (err, res) {
            if (err) throw err;

            var question = res[0].questions[0].question;
            var answer1 = res[0].questions[0].answers[0];
            var answer2 = res[0].questions[0].answers[1];
            var answer3 = res[0].questions[0].answers[2];
            var answer4 = res[0].questions[0].answers[3];
            var correctAnswer = res[0].questions[0].correct;

            socket.emit("gameQuestions", {
              q1: question,
              a1: answer1,
              a2: answer2,
              a3: answer3,
              a4: answer4,
              correct: correctAnswer,
              playersInGame: playerData.length,
            });
            db.close();
          });
      });

      io.to(game.pin).emit(
        "gameStartedPlayer",
        // [
        //   { player: 1, isBankRupt: true },
        //   { player: 2, isBankRupt: false },
        // ]
        // players.players.map((player) => ({
        //   ...player,
        // isBankRupt: Math.random() > 0.5 ? true : false,
        rounds[0]
      );
      setTimeout(() => {
        io.to(game.pin).emit("newTable", rounds[0], 58);
      }, 3000);
      // console.log(players.players);
      game.gameData.questionLive = true;
    } else {
      socket.emit("noGameFound"); //No game was found, redirect user
    }
  });

  //When player connects for the first time
  socket.on("player-join", (params) => {
    var gameFound = false; //If a game is found with pin provided by player

    //For each game in the Games class
    for (var i = 0; i < games.games.length; i++) {
      //If the pin is equal to one of the game's pin
      if (params.pin == games.games[i].pin) {
        console.log("Player connected to game");

        var hostId = games.games[i].hostId; //Get the id of host of game

        players.addPlayer(hostId, socket.id, params.name, {
          score: 250,
          answer: 0,
        }); //add player to game

        socket.join(params.pin); //Player is joining room based on pin

        var playersInGame = players.getPlayers(hostId); //Getting all players in game

        io.to(params.pin).emit("updatePlayerLobby", playersInGame); //Sending host player data to display
        gameFound = true; //Game has been found
      }
    }

    //If the game has not been found
    if (gameFound == false) {
      socket.emit("noGameFound"); //Player is sent back to 'join' page because game was not found with pin
    }
  });

  //When the player connects from game view
  socket.on("player-join-game", (data) => {
    var player = players.getPlayer(data.id);
    if (player) {
      var game = games.getGame(player.hostId);
      socket.join(game.pin);
      player.playerId = socket.id; //Update player id with socket id

      var playerData = players.getPlayers(game.hostId);
      socket.emit("playerGameData", playerData);
    } else {
      socket.emit("noGameFound"); //No player found
    }
  });

  //When a host or player leaves the site
  // socket.on("disconnect", () => {
  //   var game = games.getGame(socket.id); //Finding game with socket.id
  //   //If a game hosted by that id is found, the socket disconnected is a host
  //   if (game) {
  //     //Checking to see if host was disconnected or was sent to game view
  //     if (game.gameLive == false) {
  //       games.removeGame(socket.id); //Remove the game from games class
  //       console.log("Game ended with pin:", game.pin);

  //       var playersToRemove = players.getPlayers(game.hostId); //Getting all players in the game

  //       //For each player in the game
  //       for (var i = 0; i < playersToRemove.length; i++) {
  //         players.removePlayer(playersToRemove[i].playerId); //Removing each player from player class
  //       }

  //       io.to(game.pin).emit("hostDisconnect"); //Send player back to 'join' screen
  //       socket.leave(game.pin); //Socket is leaving room
  //     }
  //   } else {
  //     //No game has been found, so it is a player socket that has disconnected
  //     var player = players.getPlayer(socket.id); //Getting player with socket.id
  //     //If a player has been found with that id
  //     if (player) {
  //       var hostId = player.hostId; //Gets id of host of the game
  //       var game = games.getGame(hostId); //Gets game data with hostId
  //       var pin = game.pin; //Gets the pin of the game

  //       if (game.gameLive == false) {
  //         players.removePlayer(socket.id); //Removes player from players class
  //         var playersInGame = players.getPlayers(hostId); //Gets remaining players in game

  //         io.to(pin).emit("updatePlayerLobby", playersInGame); //Sends data to host to update screen
  //         socket.leave(pin); //Player is leaving the room
  //       }
  //     }
  //   }
  // });

  // socket.io.connect(SERVER_URL, {
  //   reconnection: true, // Habilita la reconexión
  //   reconnectionAttempts: 10, // Número máximo de intentos de reconexión
  //   reconnectionDelay: 1000, // Tiempo de espera antes del primer intento de reconexión
  //   timeout: 5000, // Tiempo máximo permitido para intentar la conexión
  // });

  //Sets data in player class to answer from player
  socket.on("playerAnswer", function (num) {
    var player = players.getPlayer(socket.id);
    var hostId = player.hostId;
    var playerNum = players.getPlayers(hostId);
    var game = games.getGame(hostId);
    if (game.gameData.questionLive == true) {
      //##############################################
      randomNumber = Math.random();
      console.log(
        "Jugador ",
        player.name,
        randomNumber,
        player.gameData.score,
        num
      );
      if (game.gameData.question > 1) {
        if (
          randomNumber < rounds[game.gameData.question - 1].bankRuptProbability
        ) {
          player.gameData.score -=
            rounds[game.gameData.question - 1].portFolios[+num].loose;
          player.gameData.isBankRupt = true;
        } else {
          player.gameData.score +=
            rounds[game.gameData.question - 1].portFolios[+num].win;
          player.gameData.isBankRupt = false;
        }
      }
      console.log("Jugador ", player.name, randomNumber, player.gameData.score);

      //if the question is still live
      player.gameData.answer = num;
      game.gameData.playersAnswered += 1;
      var gameQuestion = game.gameData.question;
      var gameid = game.gameData.gameid;

      MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("kahootDB");
        var query = { id: parseInt(gameid) };
        dbo
          .collection("kahootGames")
          .find(query)
          .toArray(function (err, res) {
            if (err) throw err;
            var correctAnswer = res[0].questions[gameQuestion - 1].correct;
            //Checks player answer with correct answer
            if (num == correctAnswer) {
              // player.gameData.score += 100;
              io.to(game.pin).emit("getTime", socket.id);
              socket.emit("answerResult", true);
            }

            //Checks if all players answered
            if (game.gameData.playersAnswered == playerNum.length) {
              var playerData = players.getPlayers(game.hostId);
              const playerRanking = getPlayerRanking(game.hostId);
              io.to(game.pin).emit(
                "questionOver",
                playerData,
                correctAnswer,
                playerRanking
              ); //Tell everyone that question is over
              game.gameData.questionLive = false; //Question has been ended bc players all answered under time
            } else {
              //update host screen of num players answered
              io.to(game.pin).emit("updatePlayersAnswered", {
                playersInGame: playerNum.length,
                playersAnswered: game.gameData.playersAnswered,
              });
            }

            db.close();
          });
      });
    }
  });

  socket.on("getScore", function () {
    var player = players.getPlayer(socket.id);
    console.log("Get score", player.name, player.gameData.score);
    socket.emit("newScore", player.gameData.score);
  });

  socket.on("time", function (data) {
    var time = data.time / 20;
    time = time * 100;
    var playerid = data.player;
    var player = players.getPlayer(playerid);
    // player.gameData.score += time;
  });

  socket.on("timeUp", function () {
    var game = games.getGame(socket.id);
    game.gameData.questionLive = false;
    var playerData = players.getPlayers(game.hostId);

    var gameQuestion = game.gameData.question;
    var gameid = game.gameData.gameid;

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;

      var dbo = db.db("kahootDB");
      var query = { id: parseInt(gameid) };
      dbo
        .collection("kahootGames")
        .find(query)
        .toArray(function (err, res) {
          if (err) throw err;
          var correctAnswer = res[0].questions[gameQuestion - 1].correct;
          const playerRanking = getPlayerRanking(game.hostId);
          io.to(game.pin).emit(
            "questionOver",
            playerData,
            correctAnswer,
            playerRanking
          );

          db.close(); // Se cerró la conexión aquí, después de haber obtenido los datos necesarios de la base de datos
        });
    });
  });

  socket.on("nextQuestion", function () {
    var playerData = players.getPlayers(socket.id);
    //Reset players current answer to 0
    for (var i = 0; i < Object.keys(players.players).length; i++) {
      if (players.players[i].hostId == socket.id) {
        players.players[i].gameData.answer = 0;
      }
    }

    var game = games.getGame(socket.id);
    game.gameData.playersAnswered = 0;
    game.gameData.questionLive = true;
    game.gameData.question += 1;
    var gameid = game.gameData.gameid;

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;

      var dbo = db.db("kahootDB");
      var query = { id: parseInt(gameid) };
      dbo
        .collection("kahootGames")
        .find(query)
        .toArray(function (err, res) {
          if (err) throw err;

          if (res[0].questions.length >= game.gameData.question) {
            var questionNum = game.gameData.question;
            questionNum = questionNum - 1;
            var question = res[0].questions[questionNum].question;
            var answers = res[0].questions[questionNum].answers;
            var correctAnswer = res[0].questions[questionNum].correct;

            socket.emit("gameQuestions", {
              q1: question,
              a1: answers[0],
              a2: answers[1],
              a3: answers[2],
              a4: answers[3],
              correct: correctAnswer,
              playersInGame: playerData.length,
            });
            db.close();
          } else {
            var playersInGame = players.getPlayers(game.hostId);

            playersInGame.sort(function (a, b) {
              return b.gameData.score - a.gameData.score;
            });

            var topFivePlayers = playersInGame.slice(0, 8);

            var playerNames = topFivePlayers.map(function (player) {
              return player.name + ": " + player.gameData.score;
            });

            io.to(game.pin).emit("GameOver", {
              num1: playerNames[0],
              num2: playerNames[1],
              num3: playerNames[2],
              num4: playerNames[3],
              num5: playerNames[4],
              num6: playerNames[5],
              num7: playerNames[6],
              num8: playerNames[7],
            });
          }
        });
    });

    io.to(game.pin).emit(
      "nextQuestionPlayer",
      rounds[game.gameData.question - 1]
    );
    const playerRanking = getPlayerRanking(game.hostId);
    io.to(game.pin).emit("newTable", rounds[game.gameData.question - 1], 60);
  });

  //When the host starts the game
  socket.on("startGame", () => {
    var game = games.getGame(socket.id); //Get the game based on socket.id
    game.gameLive = true;
    socket.emit("gameStarted", game.hostId, rounds[0]); //Tell player and host that game has started
  });

  //Give user game names data
  socket.on("requestDbNames", function () {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;

      var dbo = db.db("kahootDB");
      dbo
        .collection("kahootGames")
        .find()
        .toArray(function (err, res) {
          if (err) throw err;
          socket.emit("gameNamesData", res);
          db.close();
        });
    });
  });

  socket.on("newQuiz", function (data) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("kahootDB");
      dbo
        .collection("kahootGames")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          var num = Object.keys(result).length;
          if (num == 0) {
            data.id = 1;
            num = 1;
          } else {
            data.id = result[num - 1].id + 1;
          }
          var game = data;
          dbo.collection("kahootGames").insertOne(game, function (err, res) {
            if (err) throw err;
            db.close();
          });
          db.close();
          socket.emit("startGameFromCreator", num);
        });
    });
  });
});
