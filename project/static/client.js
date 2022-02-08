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


DRAWS = [
    // "PI",
    // [1146408, 3649130],

    // [1, 17],
    // [1, 19],
];
for (var i=1;i<11;i++) {
    DRAWS.push([i,11]);
}
ndigits = 50n;
base = 10n;
ang = Math.PI/(Number(base)/2);
const stroke_width = 0.05;

points=[]
minX = 0;
minY = 0;
maxX = 0;
maxY = 0;
for (var j=0;j<DRAWS.length;j++) {
    DRAW = DRAWS[j];
    points.push([]);
    points[j].push([0,0]);
    if (DRAW === "PI") {
        let x = 3n * (base ** (ndigits+20n));
        digits = x;
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
    else {
        digits = [];
	numerator = DRAW[0];
	denominator = DRAW[1];
        mult = 10;
        for (var i=0;i<ndigits;i++) {
            numerator = mult * (numerator % denominator);
            digits.push(Math.floor(numerator/denominator));
        }
    }
    curr = [0,0];
    theta = 0;
    for (var i=0;i<ndigits;i++) {
        theta += ang*digits[i];
        curr[0] += Math.cos(theta);
        curr[1] += Math.sin(theta);
        points[j].push([curr[0], curr[1]])
        minX = Math.min(curr[0], minX);
        minY = Math.min(curr[1], minY);
        maxX = Math.max(curr[0], maxX);
        maxY = Math.max(curr[1], maxY);
    }
}

function draw(context, pt) {
    context.lineTo(pt[0], pt[1]);
    return context;
}

var container = d3.select("#container")
    .attr("viewBox", "" + minX + " " + minY + " " + (maxX-minX) + " " + (maxY-minY))

var paths = [];
for (var j=0;j<points.length;j++) {
    paths.push(container.append("path")
        .style("stroke", "black")
        .style("stroke-width", stroke_width)
        .style("fill", "none"));
    const zoom = d3.zoom().on("zoom", e => {
        paths[j].attr("transform", (transform = e.transform));
        paths[j].style("stroke-width", stroke_width / Math.sqrt(transform.k));
    });
    container.call(zoom).call(zoom.transform, d3.zoomIdentity);
}

var idx = 0;
var jidx = 0;
var delay = 100;
var pathCtxs = [];
for (var j=0;j<points.length;j++) {
    pathCtxs.push(d3.path());
    pathCtxs[j].moveTo(points[j][0][0], points[j][0][1]);
    for (var i=1;i<points[j].length;i++) {
        setTimeout(() => {
    	    idx++;
    	    paths[jidx].attr("d", draw(pathCtxs[jidx], points[jidx][idx]));
        }, delay*(j*points[j].length+i));
    }
    setTimeout(() => { jidx++; idx=0; }, delay*(j+1)*points[j].length);
}
