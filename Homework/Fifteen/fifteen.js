/*Quinn Luo, CSE 154, Section AI
 *Fifteen puzzle： enables user to shuffle, click, change the tiles
 *to solve the puzzle
 */

 "use strict";
(function() {
	//Global variables
	//blank is an array of size two that keeps the position of blank tile
	let blank = [300, 300];

	//function that makes getElementById handy to use
	function $(id) {
		return document.getElementById(id);
	}

	//function that makes querySelectorAll handy to use
	function qsa(className) {
		return document.querySelectorAll(className);
	}

	//main function that sets up all event listener
	window.onload = function() {
		createTiles();
		let list = qsa(".tile");
		for (let i = 0; i < list.length; i++) {
			list[i].onmouseover = checkAndRed;
			list[i].onmouseleave = unred;
			list[i].onclick = changePos;
		}
		$("shufflebutton").onclick = arrange;
	};

	//creates the tiles inside of the containers with image background
	function createTiles() {
		for (let i = 1; i <= 15; i++) {
			let temp = document.createElement("div");
			temp.id = "tile" + i;
			temp.classList.add("tile");
			temp.innerHTML = i;
			$("puzzlearea").append(temp);
		}
	}

	//turns tile red if blank is nearby
	function checkAndRed() {
		let top = this.offsetTop;
		let left = this.offsetLeft;
		if (top != 0 && (top - 100) == blank[0] && left == blank[1] || 
			top != 300 && (top + 100) == blank[0] && left == blank[1] ||
			left != 0 && (left - 100) == blank[1] && top == blank[0] ||
			left != 300 && (left + 100) == blank[1] && top == blank[0]) {
			this.classList.add("tileRed");
		}
	}

	//sets tile properties back to default when mouse leaves
	function unred() {
		this.classList.remove("tileRed");
	}

	//swaps the position of this tile with blank tile
	function changePos() {
		if (this.classList.contains("tileRed")) {
			let tempTop = this.offsetTop;
			let tempLeft = this.offsetLeft;
			this.style.top = blank[0] + "px";
			this.style.left = blank[1] + "px";
			blank[0] = tempTop;
			blank[1] = tempLeft;
		}
	}

	//shuffles the arrangement of tiles
	function arrange() {
		for (let i = 0; i < 1300; i++) {	
			let moveable = [];
			if (blank[0] != 0) {
				moveable.push([(blank[0] - 100), blank[1]]);
			}
			if (blank[0] != 300) {
				moveable.push([(blank[0] + 100), blank[1]]);
			}
			if (blank[1] != 0) {
				moveable.push([blank[0], (blank[1] - 100)]);
			}
			if (blank[1] != 300) {
				moveable.push([blank[0], (blank[1] + 100)]);
			}
			let decision = moveable[Math.floor(Math.random() * moveable.length)];
			let list = qsa(".tile");
			for (let i = 0; i < 15; i++) {
				if (list[i].offsetTop == decision[0] && list[i].offsetLeft == decision[1]) {
					let tempTop = list[i].offsetTop;
					let tempLeft = list[i].offsetLeft;
					list[i].style.top = blank[0] + "px";
					list[i].style.left = blank[1] + "px";
					blank[0] = tempTop;
					blank[1] = tempLeft;
				}
			}
		}
	}
})();