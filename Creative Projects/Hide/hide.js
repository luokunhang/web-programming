/*Quinn Luo, CSE 154, Section AI*/

(function() {

	function $(id) {
		return document.getElementById(id);
	}

	window.onload = function() {
		$("ttt").onclick = changeDis;
		$("fff").onclick = changeBack;
	}

	function changeDis() {
		$("left").classList.add("hidden");
		$("right").classList.remove("hidden");
		$("ttt").classList.add("hidden");
		$("fff").classList.remove("hidden");
		let new1 = document.createElement("h2");
		new1.innerHTML = "When you really know who you are ";
		new1.id = "new1";
		let new2 = document.createElement("h2");
		new2.innerHTML = "and what you like about yourself,";
		new2.id = "new2";
		let new3 = document.createElement("h2");
		new3.innerHTML = " changing for other people isn't such a big deal.";
		new3.id = "new3";
		$("main").append(new1);
		$("main").append(new2);
		$("main").append(new3);
	}

	function changeBack() {
		$("left").classList.remove("hidden");
		$("ttt").classList.remove("hidden");
		$("right").classList.add("hidden");
		$("fff").classList.add("hidden");
		$("new1").remove();
		$("new2").remove();
		$("new3").remove();
	}

})();