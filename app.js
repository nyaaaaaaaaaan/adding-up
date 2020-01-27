'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs, 'output': {}});
const map = new Map();
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if (!value) {
            value  = {
                popu10 : 0,
                popu15 : 0,
                change : null,
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        map.set(prefecture, value);
    }
});

rl.on('close', () => {
    for (let [key , val] of map) {
        val.change = val.popu15 / val.popu10;
        
    }
    const rankingArray = Array.from(map).sort((p1, p2) => {
        console.log("p2:%o, P1:%o", p2, p1);
        return p2[1].change - p1[1].change;
    })
    const rankingStrings = rankingArray.map(([key, val]) => {
        return key + ': ' + val.popu10 + '=>' + val.popu15 + ' 変化率:' + val.change;
    })
    console.log(rankingStrings);
});
