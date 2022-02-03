var socket = io();

// for debugging
socket.on('connect', function() {
    console.log('socket is open');
});
socket.on('disconnect', function() {
    console.log('socket is closed');
});

socket.on('json', function(data) {
    console.log('received message: ' + data.random_array)
});

function random(w, h) {
    socket.emit('random', w, h);
}

base = 3n
ang = Math.PI/(Number(base)/2)  // base 10
ndigits = 100000n

let x = 3n * (base ** (ndigits+20n));
let pi = x;
{
	let i = 1n;
	while (x > 0) {
	        x = x * i / ((i + 1n) * 4n);
        	pi += x / (i + 2n);
	        i += 2n;
	}
}
pi = pi.toString(Number(base));

points=[[0,0]]
curr = [0,0];
theta = 0;
minX = 0;
minY = 0;
maxX = 0;
maxY = 0;
for (var i=0;i<ndigits;i++) {
	digit = pi[i];
	theta += ang*digit;
	curr[0] += 50*Math.cos(theta);
	curr[1] += 50*Math.sin(theta);
	points.push([curr[0], curr[1]])
	minX = Math.min(curr[0], minX);
	minY = Math.min(curr[1], minY);
	maxX = Math.max(curr[0], maxX);
	maxY = Math.max(curr[1], maxY);
}


function draw(context) {
	context.moveTo(points[0][0], points[0][1]);
	for (var i=1;i<points.length;i++) {
		context.lineTo(points[i][0], points[i][1]);
	}
	return context;
}

d3.select("#field")
	.attr("viewBox", "" + minX + " " + minY + " " + (maxX-minX) + " " + (maxY-minY))
	.append("path")
		.style("stroke", "black")
		.style("fill", "none")
		.attr("d", draw(d3.path()));
