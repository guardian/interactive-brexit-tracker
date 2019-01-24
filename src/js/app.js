import * as d3 from "d3"

// import data from "./../assets/output.json"

let clicked = false;

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

let selectedMP = "Mrs Theresa May";

fetch("<%= path %>/assets/output.json")
  .then(data => data.json())
  .then(data => {

    const dropdown = d3.select(".interactive")
      .append("select")
      .on("change", function() {
        selectedMP = this.value;
        force.alpha(1).restart();
      });

    dropdown.selectAll("option")
      .data(data.map((d) => d.name))
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d => d);


    const width = 1260
    const height = 800

    const canvas = d3.select(".interactive").append("canvas")
      .attr("width", width)
      .attr("height", height)
      .node();

    const context = canvas.getContext('2d');

    const force = d3.forceSimulation()
      .force("link", d3.forceLink()
        .id(function (d) {
          return d.name;
        })
        .distance(d => (d.strength === 1) ? 10 : 60)
        // .strength(d => {
        //   if(d.strength === 1) {
        //     return 1;
        //   } else {
        //     return 0.5;
        //   }
        // })
      )
      .force("center", d3.forceCenter().x(0).y(0))
      .force("charge", d3.forceManyBody().distanceMax(100)) 
    // .force("x", d3.forceX().x(d => (d.name === "Mrs Theresa May" ? -200 : 200)).strength(0.1))
    // .force("y", d3.forceY().y(d => (d.name === "Mrs Theresa May" ? -200 : 200)).strength(0.1))
    // .force("collisionForce", d3.forceCollide(5).strength(0.5).iterations(100))

    let nodes = data;

    let links = [];

    nodes.forEach(d => {
      d.mostSimilar[0][0].forEach(e => {
        links.push({
          source: d,
          target: nodes.find(v => v.name === e.name),
          "strength": 1
        })

      });

      d.mostSimilar[0][1].forEach(e => {

        links.push({
          source: d,
          target: nodes.find(v => v.name === e.name),
          "strength": 0.5
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
      context.strokeStyle = "#eaeaea";
      context.lineWidth = 0.5;
      context.beginPath();
      links.forEach(function (d) {
        context.moveTo(d.source.x + width / 2, d.source.y + height / 2);
        context.lineTo(d.target.x + width / 2, d.target.y + height / 2);
      });
      context.stroke();

      let radius = 3.5
      // draw nodes
      nodes.forEach(function (d) {
        context.fillStyle = partyColours[d.party];
        context.beginPath();
        let x = Math.max(radius, Math.min(width - radius, d.x + width / 2))
        let y = Math.max(radius, Math.min(height - radius, d.y + height / 2))
        context.moveTo(x, y);
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();

        if (clicked) {
          context.beginPath();
          context.fillStyle = "#000";
          context.font = "8px Arial";
          context.fillText(d.name, x + radius + 1, y + radius / 2);
        }
      });

      const selectedMPNode = nodes.find(d => d.name === selectedMP);

      context.strokeStyle = "#000";
      let x2 = Math.max(radius, Math.min(width - radius, selectedMPNode.x + width / 2))
      let y2 = Math.max(radius, Math.min(height - radius, selectedMPNode.y + height / 2))
      context.moveTo(x2, y2);
      context.beginPath();
      context.arc(x2, y2, radius+2, 0, 2 * Math.PI);
      context.stroke();

      context.beginPath();
      context.fillStyle = "#000";
      context.font = "10px Arial";
      context.fillText(selectedMP, x2 + radius + 4, y2 + radius / 2);
    }

    context.canvas.addEventListener('click', () => {
      // console.log();
      clicked = true;
      return force.alpha(1).restart();
    })

    let i = 0;
    setInterval(() => {
      i++;
      if (i < 6) {
        links = [];

        nodes.forEach(d => {
          d.mostSimilar[i][0].forEach(e => {
            links.push({
              source: d,
              target: nodes.find(v => v.name === e.name),
              "strength": 1
            })
          });

          d.mostSimilar[i][1].forEach(e => {
            links.push({
              source: d,
              target: nodes.find(v => v.name === e.name),
              "strength": 0.5
            })
          });
        });

        force.force('link')
          .links(links)

        force.alpha(1).restart();
      }
    }, 5000);

  });


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
