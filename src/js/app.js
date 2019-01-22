// import React from 'react'
// import App from './components/App'
// import divisions from './../assets/votesNew.json'
// import 'core-js/es6/number';
import * as d3 from "d3"

const cluster = function (alpha) {
  // https://bl.ocks.org/mbostock/7881887
  return function (d) {
    const cluster = clusters[d.cluster];
    if (cluster === d || d.cluster == 0) return;
    let x = d.x - cluster.x,
      y = d.y - cluster.y,
      l = Math.sqrt(x * x + y * y),
      r = d.radius + cluster.radius + 3;
    if (l != r) {
      l = (l - r) / l * alpha;
      d.x -= x *= l;
      d.y -= y *= l;
      cluster.x += x;
      cluster.y += y;
    }
  };
}

const clusterPadding = 20

fetch("<%= path %>/assets/output.json")
  .then(data => data.json())
  .then(data => {

    const width = 1000
    const height = 800

    const svg = d3.select(".interactive").append("svg")
      .attr("width", width)
      .attr("height", height)
      // .node();

    // const context = canvas.getContext('2d');

    const force = d3.forceSimulation()
      .alpha(1)
      .force("link", d3.forceLink()
        .id(function (d) { return d.name; })
        .distance(60))
      .force("charge", d3.forceManyBody().distanceMax(150))
      // .force("charge", d3.forceCenter().x(width/2).y(height/2))
      

    let nodes = data;

    let links = [];

    nodes.forEach(d => {
      d.mostSimilar[4].forEach(e => {
        // if(!links.find(b => b.source.name === e)) {
        links.push({
          source: d,
          target: nodes.find(v => v.name === e)
        })
        // }
      });
    });

    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .style("stroke", "#dcdcdc")
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .attr('transform', `translate(${width/2},${height/2})`)
      // .style("stroke", "#fff")
      // .style("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("data-name", function (d) { return d.name })
      .attr("r", "3")
      // .attr("cx", width/2)
      // .attr("cy", height/2)
      .attr("stroke-width", 1)
      .style("stroke", "#dcdcdc")
      .attr("fill", d => partyColours[d.party]) 

    force
      .nodes(nodes)
      .on('tick', tick)

    force.force('link')
      .links(links)
      // .call(d3.drag()
      //   .on("start", dragstarted)
      //   .on("drag", dragged)
      //   .on("end", dragended));
  
    function tick() {
      // context.clearRect(0, 0, width, height);

      // // draw links 
      // context.strokeStyle = "#f6f6f6";
      // context.beginPath();
      // links.forEach(function (d) {
      //   context.moveTo(d.source.x + width / 2, d.source.y + height / 2);
      //   context.lineTo(d.target.x + width / 2, d.target.y + height / 2);
      // });
      // context.stroke();

      // // draw nodes
      // nodes.forEach(function (d) {
      //   context.fillStyle = partyColours[d.party];
      //   context.beginPath();
      //   let radius = 4.5
      //   let x = Math.max(radius, Math.min(width - radius, d.x + width / 2))
      //   let y = Math.max(radius, Math.min(height - radius, d.y + height / 2))
      //   context.moveTo(x, y);
      //   context.arc(x, y, radius, 0, 2 * Math.PI);
      //   context.fill();
      // });

      // link 
      //   .attr("x1", function (d) { return d.source.x })
      //   .attr("y1", function (d) { return d.source.y })
      //   .attr("x2", d => d.target.x)
      //   .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }

    // context.canvas.addEventListener('click', () => force.alpha(1).restart()) 
  });
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





