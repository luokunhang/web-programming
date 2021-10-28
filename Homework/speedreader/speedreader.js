/*
 *	Quinn Luo, CSE 154, Section AI, University of Washington
 *	This js file interacts with speedreader.html
 *	it displays words in the same place
 */
"use strict";
(function() {
	//global
	function $(id) {
		return document.getElementById(id);
	}
	let words = [];
	let num = 0;
	let timer;

	//main method: runs when page loaded
	window.onload = function() {
		$("stop").disabled = true;
		$("start").onclick = read;
		$("stop").onclick = wordsStop;
		let bbb = document.getElementsByTagName("label");
		$("sltd").onchange = checkSpeed;
	};

	/*runs when start button is clicked
	 *replaces word in the big div
	 */
	function read() {
		this.disabled = true;
		$("stop").disabled = false;
		words=$("ta").value.split(/[ \t\n]+/);
		checkSpeed();
	}

	function checkSpeed() {
		clearInterval(timer);
		timer = setInterval(display, $("sltd").value);
	}

	/*runs when size button is clicked
	 *intervene the current display
	 */
	function changeSize() {
		if ($("undertitle") !== null) {
			display();
		}
	}

	/*a string passed
	 *replaces word in div when called
	 */
	function display() {
		$("undertitle").style.fontSize=document.querySelector("[name=size]:checked").value;
		let l = words[num];
		let ll = l.substring(l.length - 1, l.length);
		if (ll == "." || ll == "," || ll == "!" || ll == "?" || ll == ";" || l == ":") {
			words[num] = l.substring(0, l.length - 1);
			words.splice(num + 1, 0, words[num]);
		}
		$("undertitle").innerHTML = words[num];
		num+=1;
		if (num >= words.length) {
			wordsStop();
		}
	}

	/*stop the display
	 *reset the buttons and clear the div
	 */
	function wordsStop() {
		clearInterval(timer);
		num = 0;
		words = [];
		$("start").disabled = false;
		$("stop").disabled = true;
		$("undertitle").innerHTML = "";
	}
})();