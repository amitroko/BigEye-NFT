require('dotenv').config();
const p5 = require('node-p5');
const randomColor = require('randomcolor');
const fs = require('fs');
const { NFTStorage, File } = require('nft.storage');

const token = process.env.TOKEN;

// name canvas with minimal chance of collision
const canvasName = "BigEye" + Math.floor(Math.random() * 1000000);

// traits
var _colors;
var _bgCol;
var _step;
var _rings;
var _direction;
var _albino

// create image
function sketch(p) {
    p.setup = () => {
        const canvas = p.createCanvas(540, 540);
        _colors = randomColor({
            seed: Math.floor(Math.random() * 100000),
            count: 5
        });
        _bgCol = _colors[0];
        _colors.shift();
        p.background(_bgCol);
        _step = Math.random();
        if (_step < .1) {
            _step = 30;
            _rings = 13;
        }
        else if (_step < .5) {
            _step = 50;
            _rings = 9;
        }
        else {
            _step = 80;
            _rings = 5;
        }
        _direction = Math.random();
        _albino  = Math.random();
        _albino = _albino < .1 ? true : false;
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
        const col = _colors[count % _colors.length];	
        p.noStroke();
        p.fill(col);
        p.push();
        if (count === 1) {
            p.translate(x, y);
        }
        else if (_direction > .5) {
            p.translate(x + (_step / 5), y);
        }
        else {
            p.translate(x - (_step / 5), y);
        }

        p.circle(0, 0, dia);
        if(dia > _step * 2)
        {
            if (_direction > .5) {
                InCircle(- _step * .5, 0, dia - _step, count + 1);
            }
            else {
                InCircle( _step * .5, 0, dia - _step, count + 1);
            }
        }
        else {
            p.fill("#ffffff");
            p.ellipse(0, 0, dia, dia / 1.8);

            if (_albino) {
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
    const nfts = new NFTStorage({ token });
    const data = await fs.promises.readFile(canvasName + '.jpg');
    const metadata = await nfts.store({
        name: 'Test',
        description: 'Randomly generated using p5.js',
        backgroundColor: _bgCol,
        colors: _colors,
        rings: _rings,
        direction: _direction > .5 ? "left" : "right",
        albino: _albino,
        image: new File(
            [data],
            canvasName + '.jpg',
            { type: 'image/jpg' }
        )
    });
    fs.unlink('./' + canvasName + '.jpg', err => {
        if (err) {
            console.error("Error occurred while trying to remove file");
        }
    });
    return metadata.url;
}

// generate a new image and return its attributes
exports.mintNew = async() => {
    p5.createSketch(sketch);

    return await store();
}