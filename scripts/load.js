window.onload = start;

function start() {
	run(15);
}

function run(rate) {
	var simRate = rate;
	
	var cn = document.getElementById("main-canvas");
	var ct = cn.getContext("2d");
	var sc = 8;
	var gp = 1;
	
	var w = cn.width / sc;
	var h = cn.height / sc;
	var st = ["#404040", "#00ff00"];
	var nh = [[-1, -1], [ 0, -1], [ 1, -1],
			  [-1,  0],           [ 1,  0],
		      [-1,  1], [ 0,  1], [ 1,  1]];
			  
	var ru = [0, 0, -1, -1, 1, 1, 0, 0, 0];
	//var ru = [0, 0, -1, 1, 0, 0, 0, 0, 0];
	
	var wr = false;
	var nm = "Test Table";
	var li = -1;
	
	/*
	var c = [[0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0],
			 [0,0,1,0,0,0,0,0],
			 [0,0,0,1,0,0,0,0],
			 [0,1,1,1,0,0,0,0],
			 [0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0]];
	*/
	
	var table = new AutomataTable(w, h, st, ru, nh, wr, nm, li, ct, sc, gp);
	
	//table.initPreset(c);
	table.initRandom();
	
	setInterval(function() {
		table.draw();
		table.update();
	}, 1000 / simRate);
}
