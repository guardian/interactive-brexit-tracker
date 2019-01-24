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

let radius = 3.5
let radius2 = radius * 4;

fetch("<%= path %>/assets/output.json")
  .then(data => data.json())
  .then(data => {

    var thumbImg = document.createElement('img');
    thumbImg.src = 'https://res.cloudinary.com/allamerican/image/fetch/t_face_s270/https://speakerdata2.s3.amazonaws.com/photo/image/889698/1200px-Theresa_May_Official.jpg';

    thumbImg.onload = function () {
      const loadedImg = this;
      const dropdown = d3.select(".interactive")
        .append("select")
        .on("change", function () {
          selectedMP = this.value;
          force.force("collisionForce", d3.forceCollide(d => d.name === selectedMP ? radius2+3 : 5).strength(1).iterations(1)).alpha(0.1).restart();
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

      let hull = [];
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
        // .force("x", d3.forceX().x(0).strength(0.01))
        // .force("y", d3.forceY().y(0).strength(0.01)) 
        .force("collisionForce", d3.forceCollide(d => d.name === selectedMP ? radius2+3 : 5).strength(1).iterations(1))

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
        // draw nodes
        nodes.filter(d => d.name !== selectedMP).forEach(function (d) {
          context.fillStyle = partyColours[d.party];
          context.beginPath();
          let x = Math.max(radius, Math.min(width - radius, d.x + width / 2))
          let y = Math.max(radius, Math.min(height - radius, d.y + height / 2))
          context.moveTo(x, y);
          context.arc(x, y, radius, 0, 2 * Math.PI);
          context.fill();

          // if (clicked) {
          //   context.beginPath();
          //   context.fillStyle = "#000";
          //   context.font = "8px Arial";
          //   context.fillText(d.name, x + radius + 1, y + radius / 2);
          // }
        });

        const selectedMPNode = nodes.find(d => d.name === selectedMP);
        let x2 = Math.max(radius, Math.min(width - radius, selectedMPNode.x + width / 2))
        let y2 = Math.max(radius, Math.min(height - radius, selectedMPNode.y + height / 2))

        context.save();
        context.beginPath();

        context.moveTo(x2, y2);
        context.arc(x2, y2, radius2, 0, 2 * Math.PI)
        context.closePath();
        context.clip();

        context.drawImage(loadedImg, x2 - radius2, y2 - radius2, radius2 * 2, radius2 * 2);
        context.restore();

        context.moveTo(x2, y2);

        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = partyColours[selectedMPNode.party];
        context.arc(x2, y2, radius2 + 1, 0, 2 * Math.PI);
        context.stroke();

        context.beginPath();
        context.fillStyle = "#000";
        context.font = "10px Arial";
        context.fillText(selectedMP, x2 + radius2 + 4, y2 + radius2 / 2);

      }

      context.canvas.addEventListener('click', () => {
        // console.log();
        clicked = true;
        return force.alpha(1).restart();
      })
      

      let i = 0;
      setInterval(() => {
        let yesHull = false;
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
          
          // const nodesToHull = nodes.f

          // var hull = d3.polygonHull(node.data().map(function(d) { return [d.x,d.y]; }) );	

          force.force('link')
            .links(links)

          force.alpha(0.75).restart();
        }
      }, 5000);
    }

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
