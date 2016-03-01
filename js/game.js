// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";


// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// Game objects

var princess = {};
var arr_monster = {}
var arr_stone = []
var n_monster = 0;
var n_stone = 0;
var monsterspeed = 40;
var princessesCaught
n_stone = localStorage.getItem('n_stone');
arr_stone = localStorage.getItem('arr_stone');
n_monster = localStorage.getItem('n_monster');
arr_monster = localStorage.getItem('arr_monster');
var herolives = localStorage.getItem('herolives')
if (herolives==undefined){
	herolives=3;
}
var hero = {
	speed: 255, // movement in pixels per second
	lives: herolives
};

princessesCaught = localStorage.getItem('princessesCaught');
if (princessesCaught == undefined){
	princessesCaught= 0
}


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	arr_stone = []
	arr_monster = []
	var princessOk = true
	var heroOk = true

	// Throw the princess somewhere on the screen randomly
	princess.x = Math.random()*(455-32)+32
	princess.y = Math.random()*(415-30)+30


	for (var i = 0; i < n_monster; i++) {
	  var monster = {}
	  for(;;){
	    monster.x = Math.random()*(455-32)+32
	    monster.y = Math.random()*(415-30)+30

	    if(
	      monster.x <= (hero.x + 25)
	      && hero.x <= (monster.x + 25)
	      && monster.y <= (hero.y + 32)
	      && hero.y <= (monster.y + 32)
	    ){
	      heroOk=false
	    }else{
	      heroOk=true
	    }

	    if(
	      monster.x <= (princess.x + 25)
	      && princess.x <= (monster.x + 25)
	      && monster.y <= (princess.y + 32)
	      && princess.y <= (monster.y + 32)
	    ){
	      princessOk=false
	    }else{
	      princessOk=true
	    }

	    if(princessOk  && heroOk){
	      break;
	    }

	  }
	  arr_monster.push(monster)
	}


	for (var i = 0; i < n_stone; i++) {
		var stone = {}
		for(;;){
			stone.x = Math.random()*(455-32)+32
			stone.y = Math.random()*(415-30)+30

			if(
				stone.x <= (hero.x + 25)
				&& hero.x <= (stone.x + 25)
				&& stone.y <= (hero.y + 32)
				&& hero.y <= (stone.y + 32)
			){
				heroOk=false
			}else{
				heroOk=true
			}

			if(
				stone.x <= (princess.x + 25)
				&& princess.x <= (stone.x + 25)
				&& stone.y <= (princess.y + 32)
				&& princess.y <= (stone.y + 32)
			){
				princessOk=false
			}else{
				princessOk=true
			}

			if(princessOk  && heroOk){
				break;
			}

		}
		arr_stone.push(stone)
	}
};


var NotTouchStone = function(aux){

	for (var j = 0; j < arr_stone.length; j++) {
		if (
			aux.x <= (arr_stone[j].x + 25)
			&& arr_stone[j].x <= (aux.x + 25)
			&& aux.y <= (arr_stone[j].y + 32)
			&& (arr_stone[j].y <= (aux.y + 32))
		) {
			return false
		}
	}
	return true
}

// Update game objects
var update = function (modifier) {
	var heroAux = {}
	if (38 in keysDown) { // Player holding up
		var y = hero.y - hero.speed * modifier
		heroAux.y = y
		heroAux.x = hero.x
		if(y>30 && NotTouchStone(heroAux)){
			hero.y -= hero.speed * modifier;
		}else {
			hero.y = hero.y;
		}
	}

	if (40 in keysDown) { // Player holding down
		var y = hero.y + hero.speed * modifier
		heroAux.y = y
		heroAux.x = hero.x
		if(y<415 && NotTouchStone(heroAux) ){
			hero.y += hero.speed * modifier;
		}else {
			hero.y = hero.y;
		}
	}

	if (37 in keysDown) { // Player holding left
		var x = hero.x - hero.speed * modifier
		heroAux.x = x
		heroAux.y = hero.y
		if(x>32 && NotTouchStone(heroAux) ){
			hero.x -= hero.speed * modifier;
		}else {
			hero.x = hero.x;
		}

	}
	if (39 in keysDown) { // Player holding right
		var x = hero.x + hero.speed * modifier
		heroAux.x = x
		heroAux.y = hero.y
		if(x < 455 && NotTouchStone(heroAux) ){
			hero.x += hero.speed * modifier;
		}else {
			hero.x = hero.x;
		}
	}

	for (var i = 0; i < arr_monster.length; i++) {
		if (
			hero.x <= (arr_monster[i].x + 25)
			&& arr_monster[i].x <= (hero.x + 25)
			&& hero.y <= (arr_monster[i].y + 32)
			&& arr_monster[i].y <= (hero.y + 32)
		) {
			if(hero.lives == 0){
				alert("has perdido");
				localStorage.setItem('princessesCaught',0);
				localStorage.setItem('herolives',0);
				localStorage.setItem('n_stone',0);
				localStorage.setItem('arr_stone',[]);
				localStorage.setItem('n_monster',0);
				localStorage.setItem('arr_monster',[]);
				localStorage.setItem('herolives',3);
				location.reload()
			}else{
				--hero.lives;
				localStorage.setItem('herolives',hero.lives);
				reset()
			}

		}
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 25)
		&& princess.x <= (hero.x + 25)
		&& hero.y <= (princess.y + 32)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		localStorage.setItem('princessesCaught',princessesCaught);
		localStorage.setItem('n_stone',n_stone);
		localStorage.setItem('arr_stone',arr_stone);
		localStorage.setItem('n_monster',n_monster);
		localStorage.setItem('arr_monster',arr_monster);
		localStorage.setItem('herolives',hero.lives);
		localStorage.setItem('princessesCaught',princessesCaught);
{
			if (princessesCaught <= 5){
				n_stone = 3;
				n_monster = 1;
			}else if (princessesCaught > 5 && princessesCaught <= 10) {
				n_stone = 6;
				n_monster = 2;
			}else if (princessesCaught > 10 && princessesCaught <= 15){
				n_stone = 9;
				n_monster = 3;
			}else if(princessesCaught > 15 && princessesCaught <= 20){
				n_stone = 12;
				n_monster = 4;
			}else{
				n_stone = 15;
				n_monster =5;
			}
		}
		reset();
	}
};

var moveMonster = function(modifier){
	for (var i = 0; i < arr_monster.length; i++){
		if (hero.x - arr_monster[i].x > 0){
			arr_monster[i].x += monsterspeed * modifier;
		}else{
			arr_monster[i].x -= monsterspeed * modifier;
		}
		if (hero.y - arr_monster[i].y > 0){
			arr_monster[i].y += monsterspeed * modifier;
		}else{
			arr_monster[i].y -= monsterspeed * modifier;
		}
	}
}

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
	if (monsterReady) {
		for (var j = 0; j < arr_monster.length; j++) {
			ctx.drawImage(monsterImage, arr_monster[j].x, arr_monster[j].y);
		}
	}


	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady) {
		for (var j = 0; j < arr_stone.length; j++) {
			ctx.drawImage(stoneImage, arr_stone[j].x, arr_stone[j].y);
		}

	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught + " lives: " + hero.lives, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	moveMonster(delta/1000)
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
