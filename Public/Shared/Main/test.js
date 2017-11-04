var mic;
var c;
var ai = 0;
var A = [
    { //Squares
        past: [],
        step: 10,
        wave: [0,0,0,0,0],
        fft:undefined,
        c: undefined,
        draw: function() {
            if(A[0].fft) {
                A[0].fft.analyze();
                A[0].wave = [
                    A[0].fft.getEnergy("bass"),
                    A[0].fft.getEnergy("mid"),
                    A[0].fft.getEnergy("treble")
                ];
            }
            A[0].c = buildColorFromWave(0,0,0);

            for(var i = A[0].past.length-1; i >= 0; i--) {
                A[0].past[i] = A[0].updateSpot(A[0].past[i]);
                if(A[0].past[i] === undefined) {
                    A[0].past.splice(i,1);
                }
            }
            for(var i = 0; i < A[0].past.length-1; i++) {
                A[0].drawSpot(A[0].past[i]);
            }
            A[0].step = map(mic.getLevel(),0,1,10,100);
            if(A[0].past.length <= 0) {
                A[0].reset(true);
            } else if (A[0].past.length < 300) {
                for(var i = 0; i < map(mic.getLevel(),0,1,1,12); i++) {
                    A[0].past.push(A[0].newSpot(A[0].past[A[0].past.length - 1]));
                }
            }
        },
        updateSpot: function(spot) {
            spot.c.levels[3] -= map(mic.getLevel(),0,1,1,8);
            spot.c.levels[0] = Math.max(0,spot.c.levels[0]-1);
            spot.c.levels[1] = Math.max(0,spot.c.levels[1]-1);
            spot.c.levels[2] = Math.max(0,spot.c.levels[2]-1);
            if(spot.c.levels[3] <=0 ) { return undefined;}
            return spot;
        },
        drawSpot: function(spot) {
            fill(spot.c);
            stroke(A[0].c);
            strokeWeight(1);
            rectMode(CENTER);
            rect(spot.x,spot.y,A[0].step,A[0].step,spot.r);
            rect(windowWidth - spot.x,spot.y,A[0].step,A[0].step,spot.r);
            rect(windowWidth - spot.x,windowHeight - spot.y,A[0].step,A[0].step,spot.r);
            rect(windowWidth - spot.x,spot.y,A[0].step,A[0].step,spot.r);
            rect( spot.x,windowHeight - spot.y,A[0].step,A[0].step,spot.r);
        },
        reset: function(resize) {
            if(mic === undefined) {
                mic = new p5.AudioIn();
                mic.start();
            }
            var s = {
                x:windowWidth/2,
                y:windowHeight/2,
                r:0,
                c:color(128)};
            A[0].past = [];
            A[0].past.push(s);

            A[0].fft = new p5.FFT();
            A[0].fft.setInput(mic);

            if(resize) {resizeCanvas(windowWidth, windowHeight);}
        },
        newSpot: function(lastSpot) {
            var m = mic.getLevel();
            m = map(m, 0, 1, 0, A[0].step);
            var newSpot = {
                x: (windowWidth + lastSpot.x + getRandomInt(-1, 1) * A[0].step) % windowWidth,
                y: (windowHeight + lastSpot.y + getRandomInt(-1, 1) * A[0].step) % windowHeight,
                c: buildColorFromWave(0,0,0),
                r: m
            };
            return newSpot;
        }
    }
];
function preload() {

}

function setup() {
    createCanvas(windowWidth,windowHeight);
    colorMode(RGB);
    c = color(0);
    A[ai].reset(false);
}

function draw() {
    clear();
    background(c);
    A[ai].draw();
}
function windowResized() {
    A[ai].reset(true);

}
function mouseReleased() {
    A[ai].reset(true);
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function buildColorFromWave(r,g,b) {
    return  color(
        Math.abs(r-A[0].wave[0]),
        Math.abs(g-A[0].wave[1]),
        Math.abs(b-A[0].wave[2]));
}

