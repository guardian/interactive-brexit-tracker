import React from 'react'
import App from './components/App'
import divisions from './../assets/votesNew.json'
import 'core-js/es6/number';
import * as d3 from "d3"


import data from "./../assets/output.json"

const partyColours = {
  "Lab": "#c70000",
  "Con": "#056da1",
  "LD": "#ff7f0f",
  "SNP": "#fae051",
  "Grn": "#33A22B",
  "SF": "#7fac58",
  "DUP": "#9a1b33",
  "PC": "#9bb4be",
  "Ind": "#767676"
}

const width = 1000
const height = 800

const canvas = d3.select(".interactive").append("canvas")
  .attr("width", width)
  .attr("height", height)
  .node();

const context = canvas.getContext('2d');

const force = d3.forceSimulation()
  .force("link", d3.forceLink()
    .id(function (d) { return d.name; })
    .distance(30))
  .force("charge", d3.forceManyBody().distanceMax(150))

let nodes = data;

let links = [];

nodes.forEach(d => {
  d.mostSimilar[1].forEach(e => {
    // if(!links.find(b => b.source.name === e)) {
      links.push({
        source: d,
        target: nodes.find(v => v.name === e)
      })
    // }
  });
});



force
  .nodes(nodes)
  .on('tick', tick)

force.force('link') 
  .links(links)

function tick() {
  context.clearRect(0, 0, width, height);

  // draw links 
  context.strokeStyle = "#f6f6f6"; 
  context.beginPath();
  links.forEach(function (d) {
    context.moveTo(d.source.x + width / 2, d.source.y + height / 2);
    context.lineTo(d.target.x + width / 2, d.target.y + height / 2);
  });
  context.stroke();

  // draw nodes
  nodes.forEach(function (d) {
    context.fillStyle = partyColours[d.party];
    context.beginPath();
    let radius = 4.5
    let x = Math.max(radius, Math.min(width - radius, d.x + width / 2))
    let y = Math.max(radius, Math.min(height - radius, d.y + height / 2))
    context.moveTo(x, y);
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
  });
}

context.canvas.addEventListener('click', () => force.alpha(1).restart()) 


// let isAndroidApp = (window.location.origin === "file://" && /(android)/i.test(navigator.userAgent)) ? true : false;
// if (!Array.prototype.find) {
//   Object.defineProperty(Array.prototype, 'find', {
//     value: function (predicate) {
//       // 1. Let O be ? ToObject(this value).
//       if (this == null) {
//         throw new TypeError('"this" is null or not defined');
//       }

//       var o = Object(this);

//       // 2. Let len be ? ToLength(? Get(O, "length"))
//       var len = o.length >>> 0;

//       // 3. If IsCallable(predicate) is false, throw a TypeError exception.
//       if (typeof predicate !== 'function') {
//         throw new TypeError('predicate must be a function');
//       }

//       // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
//       var thisArg = arguments[1];

//       // 5. Let k be 0.
//       var k = 0;

//       // 6. Repeat, while k < len
//       while (k < len) {
//         // a. Let Pk be ! ToString(k).
//         // b. Let kValue be ? Get(O, Pk).
//         // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
//         // d. If testResult is true, return kValue.
//         var kValue = o[k];
//         if (predicate.call(thisArg, kValue, k, o)) {
//           return kValue;
//         }
//         // e. Increase k by 1.
//         k++;
//       }

//       // 7. Return undefined.
//       return undefined;
//     }
//   });
// }

// React.render(<App isAndroidApp={isAndroidApp} divisions={divisions} />, document.getElementById("interactive-wrapper"))





