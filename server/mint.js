require('dotenv').config();
const p5 = require('node-p5');
const randomColor = require('randomcolor');
const nftstorage =  require('nft.storage');
const fs = require('fs');

const endpoint = process.env.ENDPOINT;
const token = process.env.TOKEN;

// name canvas with minimal chance of collision
const canvasName = "BigEye" + Math.floor(Math.random() * 1000000);

var cid;
// traits
var colors;
var bgCol;
var step;
var rings;
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
            rings = 13;
        }
        else if (step < .5) {
            step = 50;
            rings = 9;
        }
        else {
            step = 80;
            rings = 5;
        }
        direction = Math.random();
        albino  = Math.random();
        albino = albino < .1 ? true : false;
        setTimeout(() => {
            p.saveCanvas(canvas, canvasName, 'jpg').then((filePath) => {
                const destFileName = canvasName + '.jpg';
                console.log(destFileName);
            });
            //store();
        }, 100);    //wait briefly so draw() can iterate and create the full image
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

const store =  async() => {
    await new Promise(r => setTimeout(r, 200));
    const storage = new nftstorage.NFTStorage({ endpoint, token });
    const data = await fs.promises.readFile(canvasName + '.jpg');
    cid = await storage.storeBlob(new nftstorage.Blob([data]));
    //const status = await storage.status(cid);
    console.log(cid);

    return {
        'backgroundColor': bgCol,
        'colors': colors,
        'rings': rings,
        'direction': direction,
        'albino': albino,
        'cid': cid
    }
}

// generate a new image and return its attributes
exports.mintNew = async() => {
    p5.createSketch(sketch);

    return await store();
}