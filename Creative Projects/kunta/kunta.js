/*
Quinn Luo, CSE 154, Section AI, Universiy of Washington
javascript file that utilizes getElement and event
*/

window.onload = function () {
	let iD = document.getElementById("click");

	iD.onclick = changeColor;

	function changeColor() {
		document.querySelector(".clr").style.color = "blue";
	}
}
