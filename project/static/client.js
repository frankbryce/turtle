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

base = 4n
ang = Math.PI/(Number(base)/2)  // base 10
ndigits = 10000n

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
	curr[0] += Math.cos(theta);
	curr[1] += Math.sin(theta);
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

function redraw() {
	return container.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
}

var container = d3.select("#container")
	.attr("viewBox", "" + minX + " " + minY + " " + (maxX-minX) + " " + (maxY-minY))

const stroke_width = 0.1;

var path = container.append("path")
	.style("stroke", "black")
	.style("stroke-width", stroke_width)
	.style("fill", "none")
	.attr("d", draw(d3.path()));

const zoom = d3.zoom().on("zoom", e => {
	path.attr("transform", (transform = e.transform));
	path.style("stroke-width", stroke_width / Math.sqrt(transform.k));
});

container.call(zoom).call(zoom.transform, d3.zoomIdentity);

