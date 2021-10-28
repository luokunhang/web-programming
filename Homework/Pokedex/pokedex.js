/*Quinn Luo, CSE 154, Section AI(Jeremy Zhang)
 *Pokedex: display the function of Pokemons
 *controls the display, fight of pokedex game
 */
"use strict";
(function() {

	//helper functions: retrive id and class
	function $(id) {
		return document.getElementById(id);
	}

	function qs(word) {
		return document.querySelector(word);
	}

	function qsa(word) {
		return document.querySelectorAll(word);
	}

	//helper method that deals with ajax request
	function checkStatus(response) {  
	    if (response.status >= 200 && response.status < 300) {  
	        return response.text();
	    } else {  
	        return Promise.reject(new Error(response.status+": "+response.statusText)); 
	    } 
	}

	//Module-global variables
	//found: the pokemons that is usable
	//currPoke: the pokemon that has been chosen
	//guid: the game id for the game in play
	//pid: player id
	let found = ["Bulbasaur", "Charmander", "Squirtle"];
	let currPoke;
	let guid;
	let pid;

	//when the page loads, the sprite images should appear in the container
	window.onload = function() {
		loadSprite();
	};

	//call response if ajax request secceeds
	function loadSprite() {
		fetch("https://webster.cs.washington.edu/pokedex/pokedex.php?pokedex=all")
		.then(checkStatus)
		.then(response)
		.catch(function() {
			alert("ERROR");
		});
	}

	//load sprite images, those not in the found list are in black
	function response(text) {
		let line = text.split("\n");
		for (let i = 0; i < line.length; i++) {
			line[i] = line[i].split(":");
			let curr = document.createElement("img");
			curr.src = "sprites/" + line[i][1];
			curr.id = line[i][0];
			curr.classList.add("sprite");
			if (!found.includes(curr.id)) {
				curr.classList.add("unfound");
			} else {
				curr.onclick = cardViewb;
			}
			$("pokedex-view").append(curr);
		}
	}

	//set the parameter of query 1 ajax call
	function cardViewb() {
		currPoke = this.id.toLowerCase();
		cardView();
	}

	//call dataResponse if ajax request succeeds
	function cardView() {
		let url = "https://webster.cs.washington.edu/pokedex/pokedex.php?pokemon=";
		fetch(url + currPoke)
		.then(checkStatus)
		.then(dataResponse)
		.catch(function(reason) {alert(reason);});
	}

	//update the information in my card by callling populate
	function dataResponse(text) {
		let content = JSON.parse(text);
		populate("#my-card", content);
		$("start-btn").classList.remove("hidden");
		$("start-btn").onclick = fightView;
	}

	//populate whoseCard(a string that designates a card)
	//with information in content(a JSON object)
	function populate(whoseCard, content) {
		qs(whoseCard + " .name").innerHTML = content.name;
		qs(whoseCard + " .pokepic").src = content.images.photo;
		qs(whoseCard + " .type").src = content.images.typeIcon;
		qs(whoseCard + " .weakness").src = content.images.weaknessIcon;
		if (content.hasOwnProperty("current-hp")) {
			qs(whoseCard + " .hp").innerHTML = content["current-hp"] + "HP";
		} else {
			qs(whoseCard + " .hp").innerHTML = content.hp + "HP";
		}
		qs(whoseCard + " .info").innerHTML = content.info.description;
		for (let i = 0; i < 4; i++) {
			if (i < content.moves.length) {
				if (qsa(whoseCard + " button")[i].classList.contains("hidden")) {
					qsa(whoseCard + " button")[i].classList.remove("hidden");
				}
				let currMove = content.moves[i];
				qsa(whoseCard + " .moves .move")[i].innerHTML = currMove.name;
				if (currMove.hasOwnProperty("dp")) {
					qsa(whoseCard + " .moves .dp")[i].innerHTML = currMove.dp + "DP";
				}
				qsa(whoseCard + " .moves img")[i].src = "icons/" + currMove.type + ".jpg";
				qsa(whoseCard + " button")[i].id = currMove.name.replace(/\s/g, '').toLowerCase();
			} else {
				qsa(whoseCard + " button")[i].classList.add("hidden");
			}		
		}
		if (!$("loading").classList.contains("hidden")) {
			$("loading").classList.add("hidden");
		}
	}

	//makes ajax request that gets information after a move
	//para is an array that contains parameters for POST request
	function retrive(para) {
		let url = "https://webster.cs.washington.edu/pokedex/game.php"; 
		let data = new FormData();
		for(let i = 0; i < para.length; i++) {
			data.append(para[i][0], para[i][1]);
		}
		fetch(url, {method: "POST", body: data})
		.then(checkStatus)
		.then(beforePopulate)
		.catch(function(reason) {alert(reason);});
	}

	//update other information on the web
	//e.g. results container, guid, pid, buffs
	//text ==> what php file returns 
	function beforePopulate(text) {
		let content = JSON.parse(text);
		guid = content.guid;
		pid = content.pid;
		if (content.hasOwnProperty("results")) {
			let r = content.results;
			$("p1-turn-results").innerHTML = "Player 1 played " + r["p1-move"] + " and " + r["p1-result"] + "!";
			$("p2-turn-results").innerHTML = "Player 2 played " + r["p2-move"] + " and " + r["p2-result"] + "!";
		}
		if (content.hasOwnProperty("results") && content.results["p1-result"] == "lost") {
			$("p2-turn-results").innerHTML = "Player 1 fled the game and lost!";
		}
		if (content.p1.hasOwnProperty("buffs")) {
			showBuffs("#my-card", content.p1.buffs);
			showBuffs("#my-card", content.p1.debuffs);
			showBuffs("#their-card", content.p2.buffs);
			showBuffs("#their-card", content.p2.debuffs);
		}
		if (content.p1["current-hp"] == 0) {
			end(false);
		} else if (content.p2["current-hp"] == 0) {
			end(true);
		}
		red("#my-card", content.p1);
		red("#their-card", content.p2);
		populate("#their-card", content.p2);
	}

	//update the buff container
	//whoseCard ==> which card
	//bArray ==> the (de)buffs array
	function showBuffs(whoseCard, bArray) {
		for (let i = 0; i < bArray.length; i++) {
			let currDiv = document.createElement("div");
			currDiv.classList.add("buff");
			currDiv.classList.add(bArray[i]);
			qs(whoseCard + " .buffs").append(currDiv);
		}
	}

	//changes color of health bar
	//under 20% it turns red, over 20% it turns back
	//whoseCard ==> which card
	//content ==> the sub json object(p1 or p2)
	function red(whoseCard, content) {
		for (let i = 0; i < 2; i++) {
			let life = content["current-hp"] / content.hp * 100;
			if (!qs(whoseCard + " .health-bar").classList.contains("low-health") && life <= 20) {
				qs(whoseCard + " .health-bar").classList.add("low-health");
			} else if (qs(whoseCard + " .health-bar").classList.contains("low-health") && life > 20) {
				qs(whoseCard + " .health-bar").classList.remove("low-health");
			}	
			qs(whoseCard + " .health-bar").style.width = life + "%";
			qs(whoseCard + " .hp").innerHTML = content["current-hp"] + "HP";
		}
	}

	//changes the layout of the web to a fight view
	//where two cards are shown
	function fightView() {
		$("pokedex-view").classList.add("hidden");
		$("their-card").classList.remove("hidden");
		qs("#my-card .card-container div").classList.remove("hidden");
		$("results-container").classList.remove("hidden");
		$("p1-turn-results").classList.remove("hidden");
		$("p2-turn-results").classList.remove("hidden");
		qs("#my-card div").classList.remove("hidden");
		$("title").innerText = "Pokemon Battle Mode!";
		$("flee-btn").classList.remove("hidden");
		$("flee-btn").onclick = flee;
		$("start-btn").classList.add("hidden");
		retrive([["startgame", true], ["mypokemon", currPoke]]);
		addAttack(qsa("#my-card .moves button"));
	}

	//executes when flee is called, it ends the game
	function flee() {
		retrive([["move", "flee"], ["guid", guid], ["pid", pid]]);
	}

	//add listener to the buttons to the moves on my card
	//buttons ==> the array that includes the buttons
	function addAttack(buttons) {
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener("click", attackStart);
		}
	}

	//executes when move button is clicked
	//performs an ajax call and updates the information
	function attackStart() {
		$("loading").classList.remove("hidden");
		retrive([["guid", guid], ["pid", pid], ["movename", this.id]]);
	}

	//changes the layout when game is over
	//IWin ==> boolean that determines who won
	function end(IWin) {
		$("endgame").classList.remove("hidden");
		$("flee-btn").classList.add("hidden");
		let list = qsa("#my-card .moves button");
		for (let i = 0; i < list.length; i++) {
			list[i].removeEventListener("click", attackStart);
		}
		if (IWin) {
			$("title").innerHTML = "You won!";
			$("p2-turn-results").innerHTML = "";
			$("p2-turn-results").classList.add("hidden");
			let newPoke = qs("#their-card .name").innerHTML;
			if (!found.includes(newPoke)) {
				found.push(newPoke);
				$(newPoke).classList.remove("unfound");
				$(newPoke).onclick = cardViewb;
			}
		} else {
			$("title").innerHTML = "You lost!";
			$("p1-turn-results").innerHTML = "";
			$("p1-turn-results").classList.add("hidden");
		}
		$("endgame").onclick = hide;
	}

	//changes the layout of web when user goes back to the initial view
	//cleans the content in certain divs
	function hide() {
		$("p1-turn-results").innerHTML = "";
		$("p2-turn-results").innerHTML = "";
		cardView();
		qs("#my-card .buffs").innerHTML = "";
		qs("#their-card .buffs").innerHTML = "";
		$("pokedex-view").classList.remove("hidden");
		$("endgame").classList.add("hidden");
		$("their-card").classList.add("hidden");
		qs("#my-card .buffs").classList.add("hidden");
		$("results-container").classList.add("hidden");
		$("title").innerHTML = "Your Pokedex";
		qs("#my-card .hp-info").classList.add("hidden");
	}
})();