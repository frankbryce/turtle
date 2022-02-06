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


// DRAW = "PI";
DRAW = "1/7";
ndigits = 100n
base = 10n
ang = Math.PI/(Number(base)/2)  // base 10
const stroke_width = 0.01;

if (DRAW === "PI") {
    let x = 3n * (base ** (ndigits+20n));
    let digits = x;
    {
        let i = 1n;
        while (x > 0) {
            x = x * i / ((i + 1n) * 4n);
            digits += x / (i + 2n);
            i += 2n;
        }
    }
    digits = digits.toString(Number(base));
}
else if (DRAW = "1/7") {
    raw_repeat = [1,4,2,8,5,7];
    digits = [];
    for (var i=0;i<Number(ndigits);i++) {
	    digits.push(raw_repeat[i % raw_repeat.length]);
    }
}
points=[[[0,0]]]
curr = [0,0];
theta = 0;
minX = 0;
minY = 0;
maxX = 0;
maxY = 0;
for (var i=0;i<ndigits;i++) {
    digit = digits[i];
    theta += ang*digit;
    curr[0] += Math.cos(theta);
    curr[1] += Math.sin(theta);
    points[0].push([curr[0], curr[1]])
    minX = Math.min(curr[0], minX);
    minY = Math.min(curr[1], minY);
    maxX = Math.max(curr[0], maxX);
    maxY = Math.max(curr[1], maxY);
}

function draw(context, pts) {
    context.moveTo(pts[0][0], pts[0][1]);
    for (var i=1;i<pts.length;i++) {
        context.lineTo(pts[i][0], pts[i][1]);
    }
    return context;
}

function redraw() {
    return container.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
}

var container = d3.select("#container")
    .attr("viewBox", "" + minX + " " + minY + " " + (maxX-minX) + " " + (maxY-minY))

var path = container.append("path")
    .style("stroke", "black")
    .style("stroke-width", stroke_width)
    .style("fill", "none")
    .attr("d", draw(d3.path(), points[0]));

const zoom = d3.zoom().on("zoom", e => {
    path.attr("transform", (transform = e.transform));
    path.style("stroke-width", stroke_width / Math.sqrt(transform.k));
});

container.call(zoom).call(zoom.transform, d3.zoomIdentity);

