var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;

var params = jQuery.deparam(window.location.search); //Gets the id from url

let time = 60;
let timer = null;

function updateTimer(initialTime) {
  if (timer) {
    clearInterval(timer);
  }
  time = initialTime || 60;
  timer = setInterval(function () {
    time -= 1;
    document.getElementById("timePlayer").textContent = "Tiempo: " + time;
    // if (time == 0) {
    //   socket.emit("timeUp");
    // }
  }, 1000);
}

socket.on("connect", function () {
  //Tell server that it is host connection from game view
  socket.emit("player-join-game", params);

  document.getElementById("answer0").style.visibility = "visible";
  document.getElementById("answer1").style.visibility = "visible";
  document.getElementById("answer2").style.visibility = "visible";
  document.getElementById("answer3").style.visibility = "visible";
  document.getElementById("answer4").style.visibility = "visible";
  document.getElementById("answer5").style.visibility = "visible";
});

socket.on("noGameFound", function () {
  window.location.href = "../../"; //Redirect user to 'join game' page
});

function answerSubmitted(num) {
  if (playerAnswered == false) {
    playerAnswered = true;

    socket.emit("playerAnswer", num); //Sends player answer to server

    //Hiding buttons from user
    document.getElementById("answer0").style.visibility = "hidden";
    document.getElementById("answer1").style.visibility = "hidden";
    document.getElementById("answer2").style.visibility = "hidden";
    document.getElementById("answer3").style.visibility = "hidden";
    document.getElementById("answer4").style.visibility = "hidden";
    document.getElementById("answer5").style.visibility = "hidden";
    document.getElementById("message").style.display = "block";
    document.getElementById("message").innerHTML =
      "Respuesta enviada esperando al host";
  }
}

//Get results on last question
socket.on("answerResult", function (data) {
  if (data == true) {
    correct = true;
  }
});

socket.on("questionOver", function (data, _, playerRanking) {
  console.log(data);
  console.log(document.getElementById("nameText").innerHTML);
  const [, name] = document.getElementById("nameText").innerHTML.split(": ");
  const {
    gameData: { isBankRupt },
  } = data.find((item) => item.name === name);
  if (!isBankRupt) {
    document.body.style.backgroundColor = "#4CAF50";
    document.getElementById("message").style.display = "block";
    document.getElementById("message").innerHTML = "No hay bancarota!";
  } else {
    document.body.style.backgroundColor = "#f94a1e";
    document.getElementById("message").style.display = "block";
    document.getElementById("message").innerHTML = "Hay bancarota!";
  }
  document.getElementById("answer0").style.visibility = "hidden";
  document.getElementById("answer1").style.visibility = "hidden";
  document.getElementById("answer2").style.visibility = "hidden";
  document.getElementById("answer3").style.visibility = "hidden";
  document.getElementById("answer4").style.visibility = "hidden";
  document.getElementById("answer5").style.visibility = "hidden";
  socket.emit("getScore");
  const modalElement = document.createElement("div");
  modalElement.classList.add("global-modal");
  modalElement.style.position = "absolute";
  modalElement.style.height = "100vh";
  modalElement.style.width = "100vw";
  modalElement.style.top = "0";
  modalElement.style.left = "0";
  modalElement.style.display = "flex";
  modalElement.style.justifyContent = "center";
  modalElement.style.alignItems = "center";

  const cardElement = document.createElement("div");
  cardElement.style.height = "500px";
  cardElement.style.width = "500px";
  cardElement.style.backgroundColor = "#FFA477";

  // Agregar título "Posiciones de Jugadores"
  const titleElement = document.createElement("h1");
  titleElement.textContent = "Posiciones de Jugadores";
  titleElement.style.textAlign = "center";
  titleElement.style.color = "#FFFFFF";
  cardElement.appendChild(titleElement);

  modalElement.appendChild(cardElement);

  for (const player of playerRanking) {
    const currentElement = document.createElement("div");
    currentElement.innerHTML = player;
    currentElement.style.fontFamily = "Arial, sans-serif"; // Agregar fontFamily
    cardElement.appendChild(currentElement);
  }

  const closeButtonContainer = document.createElement("div");
  closeButtonContainer.style.display = "flex";
  closeButtonContainer.style.justifyContent = "center";
  closeButtonContainer.style.alignItems = "center";
  closeButtonContainer.style.marginTop = "auto"; // Alinear al final de la tarjeta
  cardElement.appendChild(closeButtonContainer);

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "Cerrar";
  closeButton.style.fontFamily = "Arial, sans-serif"; // Agregar fontFamily
  closeButton.addEventListener("click", () => {
    console.log("click en cerrar");
    document.getElementsByClassName("global-modal")[0].remove();
  });
  closeButtonContainer.appendChild(closeButton);
  modalElement.appendChild(cardElement);
  document.body.appendChild(modalElement);
});

socket.on("newScore", function (data) {
  document.getElementById("scoreText").innerHTML = "Score: " + data;
  // console.log(data);
});
socket.on("newTable", function (currentRound, initialTime) {
  updateTimer(initialTime);
  document.getElementById(
    "rankText"
  ).innerHTML = `Probabilidad de bancarrota: ${
    currentRound.bankRuptProbability * 100
  }%`;
  // Crea la tabla con las clases de Bootstrap
  var tablaComparaciones = document.createElement("table");
  tablaComparaciones.classList.add("table", "table-striped", "table-bordered");

  // Crea el título de la tabla con la clase de Bootstrap
  var tituloTabla = document.createElement("h2");
  tituloTabla.classList.add("mb-3");
  tituloTabla.textContent = "Tabla Comparaciones";

  // Crea una fila para los encabezados de la tabla de comparaciones con la clase de Bootstrap
  var headerRowComparaciones = document.createElement("tr");
  headerRowComparaciones.classList.add("table-primary");

  // Crea un encabezado para cada columna de la tabla de comparaciones con la clase de Bootstrap
  var fondoHeaderComparaciones = document.createElement("th");
  fondoHeaderComparaciones.classList.add("text-center");
  fondoHeaderComparaciones.textContent = "Fondo";
  headerRowComparaciones.appendChild(fondoHeaderComparaciones);

  var aHeaderComparaciones = document.createElement("th");
  aHeaderComparaciones.textContent = "a";
  headerRowComparaciones.appendChild(aHeaderComparaciones);

  var bHeaderComparaciones = document.createElement("th");
  bHeaderComparaciones.textContent = "b";
  headerRowComparaciones.appendChild(bHeaderComparaciones);

  var cHeaderComparaciones = document.createElement("th");
  cHeaderComparaciones.textContent = "c";
  headerRowComparaciones.appendChild(cHeaderComparaciones);

  tablaComparaciones.appendChild(headerRowComparaciones);

  // Crea una fila para cada objeto en la lista de comparaciones con la clase de Bootstrap
  for (var i = 0; i < currentRound.comparison.length; i++) {
    var comparacion = currentRound.comparison[i];

    var comparacionRow = document.createElement("tr");

    var fondoCell = document.createElement("td");
    fondoCell.classList.add("text-center");
    fondoCell.textContent = i + 1;
    comparacionRow.appendChild(fondoCell);

    var aCell = document.createElement("td");
    aCell.textContent = comparacion.a;
    comparacionRow.appendChild(aCell);

    var bCell = document.createElement("td");
    bCell.textContent = comparacion.b;
    comparacionRow.appendChild(bCell);

    var cCell = document.createElement("td");
    cCell.textContent = comparacion.c;
    comparacionRow.appendChild(cCell);

    tablaComparaciones.appendChild(comparacionRow);
  }

  // Crea un div contenedor para la tabla
  var tablaContainer = document.createElement("div");
  tablaContainer.classList.add("container_comparaciones", "my-5");
  tablaContainer.appendChild(tituloTabla);
  tablaContainer.appendChild(tablaComparaciones);

  // Agrega el contenedor al DOM
  var mainContainer = document.getElementById("main-container");
  mainContainer.appendChild(tablaContainer);

  // Agrega la tabla al elemento div en el archivo HTML
  var tablaComparacionesDiv = document.getElementById("tablaComparaciones");
  tablaComparacionesDiv.innerHTML = ""; // Limpiar tablas antiguas
  tituloTabla.textContent = "";
  tablaComparacionesDiv.appendChild(tablaComparaciones);

  //AGREGAR TABLA INVEST

  var tablaInvest = document.createElement("table");
  tablaInvest.classList.add("table", "table-striped", "table-bordered"); // Agrega las clases de Bootstrap a la tabla

  // Crea el título de la tabla con la clase de Bootstrap
  var tituloTablaInvest = document.createElement("h2");
  tituloTablaInvest.classList.add("mb-3");
  tituloTablaInvest.textContent = "Opciones de Inversión";

  // Crea una fila para los encabezados de la tabla de invest
  var headerRowInvest = document.createElement("tr");
  headerRowInvest.classList.add("table-primary");

  // Crea un encabezado para la columna "Fondo"
  var fondoHeaderInvest = document.createElement("th");
  fondoHeaderInvest.classList.add("text-center");
  fondoHeaderInvest.textContent = "Fondo";
  headerRowInvest.appendChild(fondoHeaderInvest);

  // Crea un encabezado para cada columna de la tabla de invest
  var aHeaderInvest = document.createElement("th");
  aHeaderInvest.textContent = "1";
  headerRowInvest.appendChild(aHeaderInvest);

  var bHeaderInvest = document.createElement("th");
  bHeaderInvest.textContent = "2";
  headerRowInvest.appendChild(bHeaderInvest);

  var cHeaderInvest = document.createElement("th");
  cHeaderInvest.textContent = "3";
  headerRowInvest.appendChild(cHeaderInvest);

  var dHeaderInvest = document.createElement("th");
  dHeaderInvest.textContent = "4";
  headerRowInvest.appendChild(dHeaderInvest);

  var eHeaderInvest = document.createElement("th");
  eHeaderInvest.textContent = "5";
  headerRowInvest.appendChild(eHeaderInvest);

  tablaInvest.appendChild(headerRowInvest);

  // Crea una fila para cada objeto en la lista de invest
  for (var j = 0; j < currentRound.inVest.length; j++) {
    var inVest = currentRound.inVest[j];

    var inVestRow = document.createElement("tr");

    // Agregar columna "Fondo" con los valores de "Portafolio 0" a "Portafolio 5"
    var fondoCell = document.createElement("td");
    if (j === 0) {
      fondoCell.textContent = "Portafolio 0";
    } else {
      fondoCell.textContent = "Portafolio " + j;
    }
    inVestRow.appendChild(fondoCell);

    var aCell = document.createElement("td");
    aCell.textContent = inVest["1"];
    inVestRow.appendChild(aCell);

    var bCell = document.createElement("td");
    bCell.textContent = inVest["2"];
    inVestRow.appendChild(bCell);

    var cCell = document.createElement("td");
    cCell.textContent = inVest["3"];
    inVestRow.appendChild(cCell);

    var dCell = document.createElement("td");
    dCell.textContent = inVest["4"];
    inVestRow.appendChild(dCell);

    var eCell = document.createElement("td");
    eCell.textContent = inVest["5"];
    inVestRow.appendChild(eCell);

    tablaInvest.appendChild(inVestRow);
  }

  var tablaContainerInvest = document.createElement("div");
  tablaContainerInvest.classList.add("container", "my-5");
  tablaContainerInvest.appendChild(tablaInvest);
  tablaContainerInvest.appendChild(tituloTablaInvest);

  // Agrega el contenedor al DOM
  var mainContainerInvest = document.getElementById("main-container");
  mainContainerInvest.appendChild(tablaContainerInvest);

  // Agrega la tabla al elemento div en el archivo HTML
  var tablaInvestDiv = document.getElementById("tablaInvest");
  tablaInvestDiv.innerHTML = ""; // Limpiar tablas antiguas
  tituloTablaInvest.textContent = "";
  tablaInvestDiv.appendChild(tablaInvest);
  //////////////////////////////////////////////////////////////////////////
  var tablaPayments = document.createElement("table");
  tablaPayments.classList.add("table", "table-striped", "table-bordered");

  // Crea una fila para los encabezados de la tabla de payments
  var headerRowPayments = document.createElement("tr");
  headerRowPayments.classList.add("table-primary");

  // Crea un encabezado para la primera columna de la tabla de payments
  var firstHeaderPayments = document.createElement("th");
  firstHeaderPayments.classList.add("text-center");
  firstHeaderPayments.textContent = "Ganancias/Perdidas";
  headerRowPayments.appendChild(firstHeaderPayments);

  // Crea un encabezado para cada columna restante de la tabla de payments
  var aHeaderPayments = document.createElement("th");
  aHeaderPayments.textContent = "0";
  headerRowPayments.appendChild(aHeaderPayments);

  var bHeaderPayments = document.createElement("th");
  bHeaderPayments.textContent = "1";
  headerRowPayments.appendChild(bHeaderPayments);

  var cHeaderPayments = document.createElement("th");
  cHeaderPayments.textContent = "2";
  headerRowPayments.appendChild(cHeaderPayments);

  var dHeaderPayments = document.createElement("th");
  dHeaderPayments.textContent = "3";
  headerRowPayments.appendChild(dHeaderPayments);

  var eHeaderPayments = document.createElement("th");
  eHeaderPayments.textContent = "4";
  headerRowPayments.appendChild(eHeaderPayments);

  var fHeaderPayments = document.createElement("th");
  fHeaderPayments.textContent = "5";
  headerRowPayments.appendChild(fHeaderPayments);

  tablaPayments.appendChild(headerRowPayments);

  // Crea una fila para cada objeto en la lista de payments
  for (var l = 0; l < currentRound.payments.length; l++) {
    var payments = currentRound.payments[l];

    var paymentsRow = document.createElement("tr");

    // Agrega la celda para la primera columna
    var firstCell = document.createElement("td");
    if (l == 0) {
      firstCell.textContent = "Ganancias";
    } else if (l == 1) {
      firstCell.textContent = "Perdidas";
    }
    paymentsRow.appendChild(firstCell);

    // Agrega las celdas para las columnas restantes
    var aCell = document.createElement("td");
    aCell.textContent = payments["0"];
    paymentsRow.appendChild(aCell);

    var bCell = document.createElement("td");
    bCell.textContent = payments["1"];
    paymentsRow.appendChild(bCell);

    var cCell = document.createElement("td");
    cCell.textContent = payments["2"];
    paymentsRow.appendChild(cCell);

    var dCell = document.createElement("td");
    dCell.textContent = payments["3"];
    paymentsRow.appendChild(dCell);

    var eCell = document.createElement("td");
    eCell.textContent = payments["4"];
    paymentsRow.appendChild(eCell);

    var fCell = document.createElement("td");
    fCell.textContent = payments["5"];
    paymentsRow.appendChild(fCell);

    tablaPayments.appendChild(paymentsRow);
  }

  // Agrega la tabla al elemento div en el archivo HTML
  var tablaPaymentsDiv = document.getElementById("tablaPayments");
  tablaPaymentsDiv.innerHTML = ""; // Limpiar tablas antiguas
  tablaPaymentsDiv.appendChild(tablaPayments);
});
socket.on("nextQuestionPlayer", function (currentRound) {
  console.log(currentRound);
  correct = false;
  playerAnswered = false;

  document.getElementById("answer0").style.visibility = "visible";
  document.getElementById("answer1").style.visibility = "visible";
  document.getElementById("answer2").style.visibility = "visible";
  document.getElementById("answer3").style.visibility = "visible";
  document.getElementById("answer4").style.visibility = "visible";
  document.getElementById("answer5").style.visibility = "visible";
  document.getElementById("message").style.display = "none";
  document.body.style.backgroundColor = "white";
});

socket.on("hostDisconnect", function () {
  // window.location.href = "../../";
});

socket.on("playerGameData", function (data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].playerId == socket.id) {
      document.getElementById("nameText").innerHTML = "Nombre: " + data[i].name;
      // document.getElementById("nameText").innerHTML = "Nombre: " + data[i].;
      document.getElementById("scoreText").innerHTML =
        "Score: " + data[i].gameData.score;
    }
  }
});

socket.on("GameOver", function () {
  document.body.style.backgroundColor = "#FFFFFF";
  document.getElementById("answer0").style.visibility = "hidden";
  document.getElementById("answer1").style.visibility = "hidden";
  document.getElementById("answer2").style.visibility = "hidden";
  document.getElementById("answer3").style.visibility = "hidden";
  document.getElementById("answer4").style.visibility = "hidden";
  document.getElementById("answer5").style.visibility = "hidden";
  document.getElementById("tablaComparaciones").style.visibility = "hidden";
  document.getElementById("tablaInvest").style.visibility = "hidden";
  document.getElementById("tablaPayments").style.visibility = "hidden";
  document.getElementById("message").style.display = "block";
  document.getElementById("message").innerHTML = "GAME OVER";
});
