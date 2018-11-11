var myGameArea;
var myGamePieces = [];
var myObstacles = [];
var myscore = {};
var myactivate = {};

var velocidade_atual = 5;
var velocidade_interval = 80;
var velocidade_personagem = velocidade_atual + 2;
var count_quantidade = 0;

var velocidade_restart = 0;
var numero_genomas = 500;
var record_fitness = 0;
var controle = numero_genomas;
var geracao = 1;

var Architect = synaptic.Architect;
var Network = synaptic.Network;
var Genetic = new Genetic();
var genomas = [];

function restartGame() {

    document.getElementById("canvascontainer").innerHTML = "";
    document.getElementById("myfilter").style.display = "none";
    document.getElementById("myrestartbutton").style.display = "none";

    myGameArea.stop();
    myGameArea.clear();
    myGameArea = {};

    myGamePieces = [];
    myObstacles = [];
    myscore = {};
    myactivate = {};
    controle = numero_genomas;

    startGame();
}

function startGame() {

    document.getElementById("myfilter").style.display = "none";
    document.getElementById("mystartbutton").style.display = "none";

    while (myGamePieces.length < numero_genomas) {
        myGamePieces.push(new Component({
            width: 20,
            height: 20,
            x: 10,
            y: 200,
            fill: "#" + rdn(100,999)
        }));
    }

    myscore = new Component({x: 2, y: 14, type: "text", font: "12px Arial", fill: "#FFF"});
    myactivate = new Component({x: 200, y: 14, type: "text", font: "12px Arial", fill: "#FFF"});

    myGameArea = new GameArea({
        genetic: Genetic,
        numero_genomas: numero_genomas,
        animation: this.animation
    });

    myGameArea.start();
}

function updateGameArea() {

    var x, y, height, gap;

    myGameArea.clear();
    myGameArea.frameNo += 1;
    myscore.score += 1;

    for (var j = 0; j < myGamePieces.length; j++) {
        for (var i = 0; i < myObstacles.length; i++) {
            if (myGamePieces[j].disabled) continue;
            if (myGamePieces[j].crashWith(myObstacles[i])) {
                controle--;
                myGamePieces[j].disabled = true;
                if (controle == 0) {
                    myGameArea.stop();
                    Genetic.executeGenome(j, true);
                    setTimeout(function () {
                        restartGame();
                    }, velocidade_restart);
                    return;
                } else {
                    Genetic.executeGenome(j, false);
                    continue;
                }
            }
        }

        if (myGamePieces[j].disabled) continue;

        var input_g = [
            myGamePieces[j].mais_perto_left,
            myGamePieces[j].mais_perto_top,
            myGamePieces[j].mais_perto_mytop
        ];

        var active = Genetic.activateNetwork(genomas[j], input_g);
        var quad = active[1] * 100;
        validaState(active, j);

        myGamePieces[j].x += myGamePieces[j].speedX;
        myGamePieces[j].y += myGamePieces[j].speedY;

        myGamePieces[j].width = quad > 10 ? quad : 10;
        myGamePieces[j].height = quad > 10 ? quad : 10;

        myGamePieces[j].update();
    }

    if (myGameArea.pause == false) {

        if (myGameArea.frameNo == 1 || everyinterval(velocidade_interval)) {

            x = myGameArea.canvas.width;
            y = myGameArea.canvas.height - 100;
            height = rdn(1, 350);
            gap = rdn(50, 250);

            myObstacles.push(new Component({
                width: 15,
                height: height,
                x: x,
                y: 0,
                fill: "#38ff8f"
            }));
            myObstacles.push(new Component({
                width: 15,
                height: x - height - gap,
                x: x,
                y: height + gap,
                fill: "#38ff8f",
                id: "botton"
            }));
        }

        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -velocidade_atual;
            myObstacles[i].update();
        }

        myscore.value = "Gen: " + geracao + " (" + controle + "/" + numero_genomas + ")\n" +
            "| Best: " + record_fitness + " " +
            "| Fitness: " + myscore.score;

        myscore.update();

        myactivate.value = "Activate: " + active;
        myactivate.update();
    }

    this.animation = window.requestAnimationFrame(updateGameArea);
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function validaState(active, pos) {

    if (active[0] >= 0.52)
        moveup(pos);
    else if (active[0] <= 0.48)
        movedown(pos);
}

function rdn(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function moveup(pos) {
    myGamePieces[pos].speedY = -velocidade_personagem;
}

function movedown(pos) {
    myGamePieces[pos].speedY = velocidade_personagem;
}

function moveleft(pos) {
    myGamePieces[pos].speedX = -velocidade_personagem;
}

function moveright(pos) {
    myGamePieces[pos].speedX = velocidade_personagem;
}

function clearmove(pos) {
    myGamePieces[pos].speedX = 0;
    myGamePieces[pos].speedY = 0;
}

function accelerate(n, pos) {
    myGamePieces[pos].gravity = n;
}

function velocidade(velocidade) {

    velocidade_atual = velocidade;
    velocidade_personagem = velocidade_atual + 1;
    switch (velocidade) {
        case 1:
            velocidade_interval = 85;
            break;
        case 2:
            velocidade_interval = 65;
            break;
        case 3:
            velocidade_interval = 45;
            break;
        case 4:
            numero_genomas = 200;
            velocidade_interval = 60;
            velocidade_personagem = velocidade_atual + 2;
            break;
        case 5:
            numero_genomas = 100;
            controle = numero_genomas;
            velocidade_interval = 50;
            velocidade_personagem = velocidade_atual + 2;
            break;
    }
}