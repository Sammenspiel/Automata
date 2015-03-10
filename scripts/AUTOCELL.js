function AutomataTable(w, h, st, ru, nh, wr, nm, li, ct, sc, gp) {
	this.gen = 0;
	this.width = w;
	this.height = h;
	this.states = st;
	this.rules = ru;
	this.nbrhd = nh;
	this.wrap = wr;
	this.name = nm;
	this.limit = li;
	this.context = ct;
	this.scale = sc;
	this.gap = gp;
	this.cells = new Array();
	this.buffer = new Array();
	
	this.initBlank = function() {
		this.gen = 0;
		
		for(var j = 0; j < this.height; j++) {
			this.cells.push([]);
			this.buffer.push([]);
		
			for(var i = 0; i <  this.width; i++) {
				this.cells[j].push(0);
				this.buffer[j].push(0);
			}
		}
	}
	
	this.initRandom = function() {
		this.gen = 0;
		
		for(var j = 0; j < this.height; j++) {
			this.cells.push([]);
			this.buffer.push([]);
		
			for(var i = 0; i < this.width; i++) {
				this.cells[j].push(Math.round(Math.random() * this.states.length));
				this.buffer[j].push(0);
			}
		}
	}
	
	this.initPreset = function(c) {
		this.gen = 0;
		
		this.cells = c;
		this.width = c[0].length;
		this.height = c.length;
		
		for(var j = 0; j < this.height; j++) {
			this.buffer.push([]);
		
			for(var i = 0; i <  this.width; i++) {
				this.buffer[j].push(0);
			}
		}
	}
	
	this.neighborWrap = function(x, y, n) {
		var nx = x + this.nbrhd[n][0];
		var ny = y + this.nbrhd[n][1];
		
		if(nx < 0) {
			nx = this.width + nx;
		}
		else if(nx >= this.width) {
			nx = nx - this.width;
		}
		
		if(ny < 0) {
			ny = this.height + ny;
		}
		else if(ny >= this.height) {
			ny = ny - this.height;
		}
		
		return this.cells[ny][nx];
	}
	
	this.neighborWall = function(x, y, n) {
		var nx = x + this.nbrhd[n][0];
		var ny = y + this.nbrhd[n][1];
		
		if(nx < 0 || ny < 0 || nx >= this.width || ny >= this.height) {
			return 0;
		}
		
		return this.cells[ny][nx];
	}
	
	this.calcState = function(x, y) {
		var nSum = 0;
		
		for(var n = 0; n < this.nbrhd.length; n++) {
			if(this.wrap) {
				nSum += this.neighborWrap(x, y, n);
			} else {
				nSum += this.neighborWall(x, y, n);
			}
			
			var nextState = this.rules[nSum];
			
			if(nextState >= 0) {
				this.buffer[y][x] = nextState;
			} else {
				this.buffer[y][x] = this.cells[y][x];
			}
		}
	}
	
	this.update = function() {
		if(this.gen === this.limit) {
			console.log(this.name + " reached limit of " + this.limit + " generations");
			return;
		}
		
		for(var j = 0; j < this.height; j++) {
			for(var i = 0; i <  this.width; i++) {
				this.calcState(i, j);
			}
		}
		
		var tempTable = this.cells;
		this.cells = this.buffer;
		this.buffer = tempTable;
		
		this.gen++;
	}
	
	this.step = function() {
		this.update();
		this.draw();
	}
	
	this.toEnd = function() {
		if(this.limit < 0) {
			console.log(this.name + " has no generation limit");
			return
		}
		
		for(var g = this.gen; g < this.limit; g++) {
			this.update();
		}
		
		console.log("Skipped to generation limit for " + this.name);
		this.draw();
	}
	
	this.drawCell = function(x, y) {
		this.context.fillStyle = this.states[this.cells[y][x]];
		this.context.fillRect(x * this.scale,
							  y * this.scale,
							  this.scale - this.gap,
							  this.scale - this.gap);
	}
	
	this.draw = function() {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		
		this.context.fillStyle = "#000000";
		this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		
		for(var j = 0; j < this.height; j++) {
			for(var i = 0; i <  this.width; i++) {
				this.drawCell(i, j);
			}
		}
	}
}
