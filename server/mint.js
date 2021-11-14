const p5 = require('node-p5');
const randomColor = require('randomcolor');

// name canvas with minimal chance of collision
const canvasName = "BigEye" + Math.floor(Math.random() * 1000000);

// traits
var colors;
var bgCol;
var step;
var direction;
var albino

// create image
function sketch(p) {
    p.setup = () => {
        const canvas = p.createCanvas(540, 540);
        colors = randomColor({
            seed: Math.floor(Math.random() * 100000),
            count: 5
        });
        bgCol = colors[0];
        colors.shift();
        p.background(bgCol);
        step = Math.random();
        if (step < .1) {
            step = 30;
        }
        else if (step < .5) {
            step = 50;
        }
        else {
            step = 80;
        }
        direction = Math.random();
        albino  = Math.random();
        albino = albino < .1 ? true : false;
        setTimeout(() => {
            p.saveCanvas(canvas, canvasName, 'jpg').then((filePath) => {
                const destFileName = canvasName + '.jpg';
                console.log(destFileName);
            });
        }, 100);
    };

    p.draw = () => {
        InCircle(540 / 2, 540 / 2, 540 - 24, 1);
    };

    const InCircle = (x, y, dia, count) => {
        const col = colors[count % colors.length];	
        p.noStroke();
        p.fill(col);
        p.push();
        if (count === 1) {
            p.translate(x, y);
        }
        else if (direction > .5) {
            p.translate(x + (step / 5), y);
        }
        else {
            p.translate(x - (step / 5), y);
        }

        p.circle(0, 0, dia);
        if(dia > step * 2)
        {
            if (direction > .5) {
                InCircle(- step * .5, 0, dia - step, count + 1);
            }
            else {
                InCircle( step * .5, 0, dia - step, count + 1);
            }
        }
        else {
            p.fill("#ffffff");
            p.ellipse(0, 0, dia, dia / 1.8);

            if (albino) {
                p.fill("red");
            }
            else {
                 p.fill("black");
            }
            p.circle(0, 0, dia / 2);
            p.fill("black");
            p.circle(0, 0, dia / 4);
        }
        p.pop();
    }
}

// generate a new image and return its attributes
exports.mintNew = () => {
    p5.createSketch(sketch);

    var rings;
    if (step === 80) {
        rings = 5;
    }
    else if (step === 50) {
        rings = 9;
    }
    else {
        rings = 13;
    }

    return {
        'backgroundColor': bgCol,
        'colors': colors,
        'rings': rings,
        'direction': direction,
        'albino': albino
    }
}