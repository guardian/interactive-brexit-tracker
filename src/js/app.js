import * as d3 from "d3"

// import data from "./../assets/output.json"

let clicked = false;


let lastScroll = null;
let lastI = 1;

const scrollInner = d3.select(".scroll-inner");
const scrollText = d3.select(".scroll-text");

const highlighted = [
  "Mrs Theresa May",
  "Anna Soubry",
  "Kate Hoey",
  "Mr Jacob Rees-Mogg",
  "Chuka Umunna",
  "Mr Jeremy Hunt",
  "Jeremy Corbyn",
  "Mr Dominic Grieve"
]


var smoothHull1 = function (polyPoints) {
  // Returns the path for a circular hull around a single point.

  var p1 = [polyPoints[0][0], polyPoints[0][1] - hullPadding];
  var p2 = [polyPoints[0][0], polyPoints[0][1] + hullPadding];

  return 'M ' + p1
      + ' A ' + [hullPadding, hullPadding, '0,0,0', p2].join(',')
      + ' A ' + [hullPadding, hullPadding, '0,0,0', p1].join(',');
};


var smoothHull2 = function (polyPoints) {
  // Returns the path for a rounded hull around two points.

  var v = vecFrom (polyPoints[0], polyPoints[1]);
  var extensionVec = vecScaleTo(v, hullPadding);

  var extension0 = vecSum (polyPoints[0], vecScale(extensionVec, -1));
  var extension1 = vecSum (polyPoints[1], extensionVec);

  var tangentHalfLength = 1.2 * hullPadding;
  var controlDelta    = vecScaleTo (unitNormal(v), tangentHalfLength);
  var invControlDelta = vecScale (controlDelta, -1);

  var control0 = vecSum (extension0, invControlDelta);
  var control1 = vecSum (extension1, invControlDelta);
  var control3 = vecSum (extension0, controlDelta);

  return 'M ' + extension0
      + ' C ' + [control0, control1, extension1].join(',')
      + ' S ' + [          control3, extension0].join(',')
      + ' Z';
};

var vecFrom = function (p0, p1) {               // Vector from p0 to p1
  return [ p1[0] - p0[0], p1[1] - p0[1] ];
}

var vecScale = function (v, scale) {            // Vector v scaled by 'scale'
  return [ scale * v[0], scale * v[1] ];
}

var vecSum = function (pv1, pv2) {              // The sum of two points/vectors
  return [ pv1[0] + pv2[0], pv1[1] + pv2[1] ];
}

var vecUnit = function (v) {                    // Vector with direction of v and length 1
  var norm = Math.sqrt (v[0]*v[0] + v[1]*v[1]);
  return vecScale (v, 1/norm);
}

var vecScaleTo = function (v, length) {         // Vector with direction of v with specified length
  return vecScale (vecUnit(v), length);
}

var unitNormal = function (pv0, p1) {           // Unit normal to vector pv0, or line segment from p0 to p1
  if (p1 != null) pv0 = vecFrom (pv0, p1);
  var normalVec = [ -pv0[1], pv0[0] ];
  return vecUnit (normalVec);
};

var hullPadding = 10;

var lineFn = d3.line()
    .curve (d3.curveCatmullRomClosed)
    .x (function(d) { return d.p[0]; })
    .y (function(d) { return d.p[1]; });

const groupLabels = [
  [["Aye", "Mrs Theresa May"], ["No", "Mhairi Black"], ["Abstainers", "Michelle Gildernew"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"], ["Speakers/Sinn Féin", "Michelle Gildernew"]], 
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"], ["DUP", "Nigel Dodds"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"] ],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"], ["ERG/DUP", "Mr Jacob Rees-Mogg"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"], ["ERG/DUP", "Mr Jacob Rees-Mogg"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"], ["ERG/DUP", "Mr Jacob Rees-Mogg"]],
];

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

let selectedMP = "Ms Diane Abbott";

const radiusScale = d3.scaleLinear().domain([300, 1260]).range([1.5, 4]);


fetch("<%= path %>/assets/output.json")
  .then(data => data.json())
  .then(data => {

    var thumbImg = document.createElement('img');
    thumbImg.src = 'https://res.cloudinary.com/allamerican/image/fetch/t_face_s270/https://speakerdata2.s3.amazonaws.com/photo/image/889698/1200px-Theresa_May_Official.jpg';

    thumbImg.onload = function () {
      const loadedImg = this;
      const dropdown = d3.select(".scroll-inner")
        .append("select")
        .on("change", function () {
          selectedMP = this.value;
          force.force("collisionForce", d3.forceCollide(d => highlighted.indexOf(d.name) > -1 || d.name === selectedMP ? radius2+3 : 8).strength(1).iterations(1)).alpha(0.1).restart();
        });

      dropdown.selectAll("option")
        .data(data.map((d) => d.name))
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);


      const width = d3.select(".scroll-inner").node().clientWidth;
      const height = d3.select(".scroll-inner").node().clientHeight;

      let radius = radiusScale(width);
      let radius2 = radius * 4;

      const canvas = d3.select(".scroll-inner").append("canvas")
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
          .distance(d => (d.strength === 1) ? radius*2 : radius*90)
          
          // .strength(d => {
          //   if(d.strength === 1) {
          //     return 1;
          //   } else {
          //     return 0.5;
          //   }
          // })
        )
        // .force("center", d3.forceCenter().x(0).y(0)) 
        .force("radial", d3.forceRadial(radius*100).strength(0.06))

        // .force("x", d3.forceX(0))
        // .force("y", d3.forceY(0)) 
        // .force("x",d3.forceX(d => (d.party === "Con" || d.party === "DUP") ? -width/3 : width/3).strength(0.04))
        // .force("y",d3.forceY(d => (d.party === "Con" || d.party === "DUP") ? -height/3 : height/3).strength(0.04))

      //   .force("x", d3.forceX(d => {
      //       if(d.party === "Con" && d.name !== "Mr Jacob Rees-Mogg") {
      //         return width/3;
      //       }

      //       if(d.party === "DUP" || d.name === "Mr Jacob Rees-Mogg") {
      //         return 0;
      //       }

      //       if(d.party === "Lab") {
      //         return -width/3;
      //       }

      //       if(d.party === "SNP" || d.party === "LD" || d.party === "Grn") {
      //         return 0;
      //       }

      //       return 0;
      //   }).strength(0.01))
      //   .force("y", d3.forceY(d => {
      //     console.log(height)
      //     if(d.party === "Con" && d.name !== "Mr Jacob Rees-Mogg") {
      //       return 0;
      //     }

      //     if(d.party === "DUP" || d.name === "Mr Jacob Rees-Mogg") {
      //       return -height/2;
      //     }

      //     if(d.party === "Lab") {
      //       return 0;
      //     }

      //     if(d.party === "SNP" || d.party === "LD" || d.party === "Grn") {
      //       return -height/2;
      //     }

      //     return 0;
      // }).strength(0.1))
        // .force("y",d3.forceY(0).strength(0.06))
        .force("chargeAgainst", d3.forceManyBody().strength(-60).distanceMax(150))
        // .force("collisionForce", d3.forceCollide(d => highlighted.indexOf(d.name) > -1 || d.name === selectedMP ? radius2 + 3 : radius*2).strength(1).iterations(1))

      let nodes = data;

      let links = [];

      nodes.forEach(d => {
        d3.shuffle(d.mostSimilar[0][0]).slice(0,2).forEach(e => {
          links.push({
            source: d,
            target: nodes.find(v => v.name === e),
            "strength": 1
          })

        });

        // d.mostSimilar[0][1].forEach(e => {

        //   links.push({
        //     source: d,
        //     target: nodes.find(v => v.name === e.name),
        //     "strength": 0.5
        //   })
        //   // }

        // });
      });




      force
        .nodes(nodes)
        .on('tick',tick)

      force.force('link')
        .links(links)

      function tick() {
        const doNotLink = [];

        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }

        function addLabel(label) {
          const labelName = label[0];
          const labelMP = label[1];

          const selectedMPNode = nodes.find(d => d.name === labelMP);
          const all = selectedMPNode.mostSimilar[lastI][0];

          all.forEach(a => {
            doNotLink.push(a);
          });

          doNotLink.push(labelMP);

          doNotLink.filter(onlyUnique)
          
          const arr = nodes.filter(n => all.indexOf(n.name) > -1).map(d => [d.x, d.y]);

          const hull = d3.polygonHull(arr);

          const hullCenter = d3.polygonCentroid(hull);

          context.strokeStyle = "#767676";
          context.lineWidth = 1.5;
          context.beginPath();
          context.moveTo(Math.max(radius, Math.min(width - radius, hull[0][0] + width / 2)), Math.max(radius, Math.min(height - radius, hull[0][1] + height / 2)));

          // smoothHull(hull).forEach(h => {
          //   let x3 = Math.max(radius, Math.min(width - radius, h[0] + width / 2))
          //   let y3 = Math.max(radius, Math.min(height - radius, h[1] + height / 2))

          //   context.lineTo(x3,y3);
          // });


          var smoothHull = function (polyPoints) {
            // Returns the SVG path data string representing the polygon, expanded and smoothed.

            var pointCount = polyPoints.length;

            // Handle special cases
            if (!polyPoints || pointCount < 1) return "";
            if (pointCount === 1) return smoothHull1 (polyPoints);
            if (pointCount === 2) return smoothHull2 (polyPoints);

            var hullPoints = polyPoints.map (function (point, index) {
                var pNext = polyPoints [(index + 1) % pointCount];
                return {
                    p: [Math.max(radius, Math.min(width - radius, point[0] + width / 2)), Math.max(radius, Math.min(height - radius, point[1] + height / 2))],
                    v: vecUnit (vecFrom (point, pNext))
                };
            });

            // Compute the expanded hull points, and the nearest prior control point for each.
            for (var i = 0;  i < hullPoints.length;  ++i) {
                var priorIndex = (i > 0) ? (i-1) : (pointCount - 1);
                var extensionVec = vecUnit (vecSum (hullPoints[priorIndex].v, vecScale (hullPoints[i].v, -1)));
                hullPoints[i].p = vecSum (hullPoints[i].p, vecScale (extensionVec, hullPadding));
            }

            return lineFn (hullPoints);
          }

          var p = new Path2D(smoothHull(hull));

          // console.log(smoothHull(hull))

          context.stroke(p);
          // context.stroke();

          let x2 = Math.max(radius, Math.min(width - radius, hullCenter[0] + width / 2))
          let y2 = Math.max(radius, Math.min(height - radius, hullCenter[1] + height / 2))
          
          context.beginPath();
          context.strokeStyle = "#fff";
          context.textAlign = 'center';
          context.lineWidth = 3;
          context.font = "700 18px Guardian Egyptian Web";
          context.strokeText(labelName, x2, y2);
          context.closePath();

          context.beginPath();
          context.fillStyle = "#000";
          context.textAlign = 'center';
          context.font = "700 18px Guardian Egyptian Web";
          context.fillText(labelName, x2, y2);
          context.closePath();
        }
        
        context.clearRect(0, 0, width, height);


        // d3.shuffle(nodes).slice(0,10).forEach((d) => {
        //   if(d.mostSimilar[lastI][0].length > 30) {
        //     addLabel(["", d.name])
        //   }
        // });
 
        // draw links 
        context.strokeStyle = "#333";
        context.lineWidth = 0.5; 
        context.beginPath(); 

        const filteredLinks = links.filter(d => (doNotLink.indexOf(d.source.name) === -1 && doNotLink.indexOf(d.target.name) === -1));
        filteredLinks.forEach(function (d) {
          context.moveTo(d.source.x + width / 2, d.source.y + height / 2); 
          context.lineTo(d.target.x + width / 2, d.target.y + height / 2);
        });

        context.stroke();
        context.closePath();  

        // draw nodes
        nodes.filter(d => highlighted.indexOf(d.name) === -1 && d.name !== selectedMP).forEach(function (d) {
          context.fillStyle = partyColours[d.party];
          context.beginPath();
          let x = Math.max(radius, Math.min(width - radius, d.x + width / 2))
          let y = Math.max(radius, Math.min(height - radius, d.y + height / 2))
          context.moveTo(x, y);
          context.arc(x, y, radius, 0, 2 * Math.PI);
          context.fill();
          context.closePath();

          // if (clicked) {
          //   context.beginPath();
          //   context.fillStyle = "#000";
          //   context.font = "8px Arial";
          //   context.fillText(d.name, x + radius + 1, y + radius / 2);
          // }
        });

        function highlightedCircle(name) {
          const selectedMPNode = nodes.find(d => d.name === name);
          let x2 = Math.max(radius, Math.min(width - radius, selectedMPNode.x + width / 2))
          let y2 = Math.max(radius, Math.min(height - radius, selectedMPNode.y + height / 2))

          context.save();
          context.beginPath();

          context.moveTo(x2, y2);
          context.arc(x2, y2, radius2, 0, 2 * Math.PI)
          context.closePath();
          context.clip();

          context.drawImage(loadedImg, x2 - radius2, y2 - radius2, radius2 * 2, radius2 * 2);
          context.closePath();
          context.restore();

          context.moveTo(x2, y2);

          context.beginPath();
          context.lineWidth = 3;
          context.strokeStyle = partyColours[selectedMPNode.party];
          context.arc(x2, y2, radius2 + 1, 0, 2 * Math.PI);
          context.stroke();
          context.closePath();

          context.beginPath();
          context.strokeStyle = "#161616";
          context.lineWidth = 2;
          context.textAlign = "start"; 
          context.font = "13px Guardian Text Sans Web";
          context.strokeText(name, x2 + radius2 + 4, y2 + radius2 / 2);
          context.closePath();

          context.beginPath();
          context.fillStyle = "#fff";
          context.textAlign = "start"; 
          context.font = "13px Guardian Text Sans Web";
          context.fillText(name, x2 + radius2 + 4, y2 + radius2 / 2);
          context.closePath();
        }

        highlighted.forEach(d => highlightedCircle(d));

        highlightedCircle(selectedMP);

        if(lastI && groupLabels[lastI] && groupLabels[lastI] !== null) {
          groupLabels[lastI].forEach(label => addLabel(label));
        }
    
      }

      context.canvas.addEventListener('click', () => {
        // console.log();
        clicked = true;
        return force.alpha(1).restart();
      })
      

      // let i = 0;
      // setInterval(() => {
      //   let yesHull = false;
      //   i++;
      //   if (i < 6) {
      //     links = [];

      //     nodes.forEach(d => {
      //       d.mostSimilar[i][0].forEach(e => {
      //         links.push({
      //           source: d,
      //           target: nodes.find(v => v.name === e.name),
      //           "strength": 1
      //         })
      //       });

      //       d.mostSimilar[i][1].forEach(e => {
      //         links.push({
      //           source: d,
      //           target: nodes.find(v => v.name === e.name),
      //           "strength": 0.5
      //         })
      //       });
      //     });
          
      //     // const nodesToHull = nodes.f

      //     // var hull = d3.polygonHull(node.data().map(function(d) { return [d.x,d.y]; }) );	

      //     force.force('link')
      //       .links(links)

      //     force.alpha(0.75).restart();
      //   }
      // }, 5000);

      const doScrollAction = (i) => {
        try {
          links = []; 

          nodes.forEach(d => {
            d3.shuffle(d.mostSimilar[i][0]).slice(0,3).forEach(e => {
              const t = nodes.find(v => v.name === e);

              links.push({
                source: d,
                target: t,
                "strength": 1
              })
            }); 

            // d.mostSimilar[i][1].slice(0,10).forEach(e => {
            //   const t = nodes.find(v => v.name === e.name);
            //   links.push({
            //     source: d,
            //     target: t, 
            //     "strength": 0.5
            //   }) 
            // });
          });
          
          // const nodesToHull = nodes.f 

          // var hull = d3.polygonHull(node.data().map(function(d) { return [d.x,d.y]; }) );	

          force.force('link')
            .links(links) 

          force.alpha(0.75).restart(); 
        } catch(err) {
          console.log(err);
        }
      }

      const checkScroll = () => {
        if(lastScroll !== window.pageYOffset) {
            const bbox = scrollText.node().getBoundingClientRect();
    
            if(bbox.top < (window.innerHeight*(1/3)) && bbox.bottom > window.innerHeight) { 
                const i = Math.floor(Math.abs(bbox.top - (window.innerHeight*(1/3)))/bbox.height*10);

                if(i !== lastI) {
                  doScrollAction(i)
                  lastI = i;
                }
            }
    
            lastScroll = window.pageYOffset;
        }
    
        window.requestAnimationFrame(checkScroll);
    };
    
    window.requestAnimationFrame(checkScroll);
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
