import * as d3 from "d3"
import allMembers from '../assets/allmembers'
import Awesomplete from './awesomeplete'


let clicked = false;


let lastScroll = null;
let lastI = 0;

const scrollInner = d3.select(".scroll-inner");
const scrollText = d3.select(".scroll-text");

const highlighted = [
  { name: "Mrs Theresa May", selected: false, permanent: true },
  { name: "Anna Soubry", selected: false, permanent: true },
  { name: "Kate Hoey", selected: false, permanent: true },
  { name: "Mr Jacob Rees-Mogg", selected: false, permanent: true },
  { name: "Chuka Umunna", selected: false, permanent: true },
  { name: "Mr Jeremy Hunt", selected: false, permanent: true },
  { name: "Jeremy Corbyn", selected: false, permanent: true },
  { name: "Mr Dominic Grieve", selected: false, permanent: true }
]

const ps = [].slice.apply(document.querySelectorAll(".scroll-text__inner"));

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

var lineFn = d3.line() 
    .curve (d3.curveCatmullRomClosed)
    .x (function(d) { return d.p[0]; })
    .y (function(d) { return d.p[1]; });

const groupLabels = [
  [["Labour", "Chuka Umunna"], ["Conservative", "Mrs Theresa May"], ["SNP", "Mhairi Black"], ["DUP", "Nigel Dodds"], ["Lib Dems", "Sir Vince Cable"]], 
  [["No", "Mrs Theresa May"], ["Aye", "Mhairi Black"], ["Abstainers", "Michelle Gildernew"]], 
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Soft Brexiters", "Mhairi Black"], ["Abstainers", "Michelle Gildernew"]], 
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Soft Brexiters", "Mhairi Black"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Soft Brexiters", "Mhairi Black"], ["Hard-Brexiters", "Nigel Dodds"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Soft Brexiters", "Mhairi Black"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Soft Brexiters", "Mhairi Black"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Soft Brexiters", "Mhairi Black"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Soft Brexiters", "Mhairi Black"], ["ERG", "Mr Jacob Rees-Mogg"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Soft Brexiters", "Mhairi Black"], ["ERG", "Mr Jacob Rees-Mogg"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Soft Brexiters", "Mhairi Black"], ["ERG", "Mr Jacob Rees-Mogg"]]
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

let selectedMP = "";
// let selectedMPImg = `http://data.parliament.uk/membersdataplatform/services/images/MemberPhoto/${allMembers.find(d => d.name === selectedMP).id}`


const radiusScale = d3.scaleLinear().domain([300, 1260]).range([1.5, 4]);

// draw canvas
const pixelRatio = window.devicePixelRatio
const scaledWidth = Math.min(d3.select(".scroll-inner").node().clientWidth, d3.select(".scroll-inner").node().clientHeight) * pixelRatio;
const scaledHeight = Math.min(d3.select(".scroll-inner").node().clientWidth, d3.select(".scroll-inner").node().clientHeight) * pixelRatio; 

const width = scaledWidth/pixelRatio;
const height = scaledHeight/pixelRatio;

let radius = radiusScale(width);
let radius2 = radius * 4;
let radius3 = radius * 6;

var hullPadding = radius*4;

const canvas = d3.select(".scroll-inner").append("canvas")
  .attr("width", scaledWidth)
  .attr("height", scaledHeight)
  .style("width", `${width}px`)
  .style("height", `${height}px`)
  .node();

let hull = [];

const context = canvas.getContext('2d');
context.scale(pixelRatio, pixelRatio);


//fetch and run

fetch("<%= path %>/assets/output.json")
  .then(data => data.json())
  .then(data => {


    /*--------------- Searchbox ---------------*/

    const parent = d3.select(".gv-member-search");

    const searchBox = parent.insert("div", ":first-child").classed("search-container", true);
    const input = searchBox.append("input").classed("member-result", true);

    input.attr("placeholder", "Search for an MP by name or constituency").attr('spellcheck', 'false');

    // const buttonsWrapper = searchBox.append("div").classed("buttons", true);

    // const companiesToButton = ["Schoolsworks Academy Trust", "Sussex Learning Trust", 'Asos.com Limited', 'Credit Suisse (UK) Limited'];

    const awesome = new Awesomplete(input.node(), {
      list: allMembers.map(d => [`${d.name} - ${d.constituency}`, d.id]),
      replace: function (text) {
        this.input.value = text.label;
      }
    });

    const close = d3.select('.awesomplete').append("div").style("display", "none").classed("search", true);

    close.html(`<svg class="icon-cancel" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30">
        <path d="m 8.2646211,7.64 -0.985372,0.992 6.8996289,7.5523 7.720992,6.739 0.821373,-0.8267 -6.899628,-7.5524 -7.5569939,-6.9042" fill="#000"></path>
        <path d="m 7.2792491,21.64 0.985372,0.9854 7.5569939,-6.8977 6.899628,-7.5523 -0.985381,-0.992 -7.556984,6.9042 -6.8996289,7.5524" fill="#000"></path>
        </svg>`);

    close.on("click", function () {
      const mp = input.node().value.split("-")[0].trim()

      close.style("display", "none");
      input.node().value = "";
      d3.select(".label-g").remove();

      d3.select(".search-box-date").html(``);

      d3.select(".search-box-gap").html(``);
      const memb = highlighted.find(d => d.name === mp)

      if (memb) {
        highlighted.splice(highlighted.indexOf(memb), 1)
        memb.permanent && highlighted.push({ name: memb.name, selected: false, permanent: true })
      }
    });

    input.on("keyup", function () {
      if (input.node().value.length > 0) {
        close.style("display", "inline-block");
      } else {
        close.style("display", "none");
      }

      if (input.node().value.split("-")[0].trim() !== selectedMP) {
        const memb = highlighted.find(d => d.name === selectedMP)

        if (memb) {
          highlighted.splice(highlighted.indexOf(memb), 1)
          memb.permanent && highlighted.push({ name: memb.name, selected: false, permanent: true })
        }
      }

    });


  /*--------------- Searchbox ---------------*/

    const images = highlighted.map(m => {
      const memberId = allMembers.find(d => d.name === m.name).id
      const imgTag = new Image()
      imgTag.src = `http://data.parliament.uk/membersdataplatform/services/images/MemberPhoto/${memberId}`
      imgTag.id = memberId
      return {
        name: m.name,
        imgTag
      }
    })



    let nodes = data;
    let links = [];


    const force = d3.forceSimulation()
      .force("link", d3.forceLink()
        .id(function (d) {
          return d.name;
        })
        .distance(d => radius*3)
        
        // .strength(d => {
        //   if(d.strength === 1) {
        //     return 1;
        //   } else {
        //     return 0.5;
        //   }
        // })
      )
      // .force("center", d3.forceCenter().x(0).y(0)) 
      .force("radial", d3.forceRadial((((width < 600) ? Math.min(width*1.5, height*1.5)/4 : Math.min(width, height)/4))).strength(0.06))
      .force("chargeAgainst", d3.forceManyBody().strength(-20*radius).distanceMax(radius*35))
        // .force("collisionForce", d3.forceCollide(d => highlighted.indexOf(d.name) > -1 || d.name === selectedMP ? radius2 + 3 : radius*2).strength(1).iterations(1))

      // nodes.forEach(d => {
      //   d.mostSimilar[0][0].forEach(e => {
      //     links.push({
      //       source: d,
      //       target: nodes.find(v => v.name === e.name),
      //       "strength": 1
      //     })

      //   });

      //   // d.mostSimilar[0][1].forEach(e => {

      //   //   links.push({
      //   //     source: d,
      //   //     target: nodes.find(v => v.name === e.name),
      //   //     "strength": 0.5
      //   //   })
      //   //   // }

      //   // });
      // });

      nodes.forEach(d => {
        d3.shuffle(nodes.filter(v => v.party === d.party)).slice(0,4).forEach(n => {
          links.push({
            source: d,
            target: n,
            "strength": 1
          });
        }); 
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
          // console.log(labelMP);

          let all;
          if(lastI === 0) {
            all = nodes.filter(v => v.party === selectedMPNode.party)
          } else {
            // console.log(labelMP, 'label')
            // console.log(selectedMPNode, 'selected')
            all = selectedMPNode.mostSimilar[lastI - 1][0];
          }

          all.forEach(a => {
            doNotLink.push(a);
          });

          doNotLink.push(labelMP);

          doNotLink.filter(onlyUnique)
          
          const arr = (lastI === 0) ? all.map(d => [d.x, d.y]) : nodes.filter(n => all.indexOf(n.name) > -1).map(d => [d.x, d.y]);

          const hull = d3.polygonHull(arr);

          const hullCenter = d3.polygonCentroid(hull);

          context.strokeStyle = "#767676";
          context.lineWidth =  2;
          context.setLineDash([3, 3]);
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
          // context.fillp);
          context.stroke(p);
          context.setLineDash([]);
          context.lineWidth = 0.5;
          // context.stroke();

          let x2 = Math.max(radius + 40, Math.min(width - radius + 40, hullCenter[0] + width / 2))
          let y2 = Math.max(radius + 40, Math.min(height - radius + 40, hullCenter[1] + height / 2)) 
          
          const fontSize = (width < 600) ? 14 : 18;

          context.beginPath();
          context.strokeStyle = "#fff";
          context.textAlign = 'center';
          context.lineWidth = 3;
          context.font = "700 " + fontSize + "px Guardian Egyptian Web";
          context.strokeText(labelName, x2, y2);
          context.closePath();

          context.beginPath();
          context.fillStyle = "#000";
          context.textAlign = 'center';
          context.font = "700 " + fontSize + "px Guardian Egyptian Web";
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
        // nodes.filter(d => highlighted.indexOf(d.name) === -1 && d.name !== selectedMP).forEach(function (d) {

          nodes.filter(d => !highlighted.find(j => d.name === j.name) && d.name !== selectedMP).forEach(function (d) {
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

        function highlightedCircle(mp, image) {
          const name = mp.name
          const isSelected = mp.selected
          const r = isSelected ? radius3 : radius2

          const selectedMPNode = nodes.find(d => d.name === name);
          let x2 = Math.max(radius, Math.min(width - radius, selectedMPNode.x + width / 2))
          let y2 = Math.max(radius, Math.min(height - radius, selectedMPNode.y + height / 2))

          // const memberId = allMembers.find(d => d.name === name).id
          // const img = new Image()
          // img.src = `http://data.parliament.uk/membersdataplatform/services/images/MemberPhoto/${memberId}`

          context.save();
          context.beginPath();

          context.moveTo(x2, y2);
          context.arc(x2, y2, r, 0, 2 * Math.PI)
          context.closePath();
          context.clip();

          context.drawImage(image, x2 - r, y2 - r, r * 2, r * 2);
          context.closePath();
          context.restore();

          context.moveTo(x2, y2);

          context.beginPath();
          context.lineWidth = Math.min(radius, 3);
          context.strokeStyle = partyColours[selectedMPNode.party];
          context.arc(x2, y2, r + 1, 0, 2 * Math.PI);
          context.stroke();
          context.closePath();

          context.beginPath();
          context.strokeStyle = "#161616";
          context.lineWidth = 2;
          context.textAlign = "start"; 
          context.font = "13px Guardian Text Sans Web";
          context.strokeText(name, x2 + r + 4, (y2 + r / 2) - 3);
          context.closePath();

          context.beginPath();
          context.fillStyle = "#fff";
          context.textAlign = "start"; 
          context.font = "13px Guardian Text Sans Web";
          context.fillText(name, x2 + r + 4, (y2 + r / 2) - 3);
          context.closePath();
        }

        highlighted.forEach(mp => {

          const imgTag = images.find(obj => obj.name === mp.name).imgTag
          highlightedCircle(mp, imgTag)
        });

        if((lastI || lastI === 0) && groupLabels[lastI] && groupLabels[lastI] !== null) {
          groupLabels[lastI].forEach(label => addLabel(label));
        }
    
      }

      const selectMember = (memberName, memberId) => {
        selectedMP = memberName

        const imgTag = document.createElement('img');
        imgTag.src = `http://data.parliament.uk/membersdataplatform/services/images/MemberPhoto/${memberId}`
        imgTag.id = memberId
        imgTag.onload = function() {
          images.push({
            name: memberName,
            imgTag: this
          })
          const memberInArr = highlighted.find(d => d.name === memberName)
          const index = highlighted.indexOf(memberInArr)
          
          if (memberInArr) {
            highlighted.splice(index, 1)
          }

          highlighted.push({ name: memberName, selected: true, permanent: memberInArr ? memberInArr.permanent : false })
          force.alpha(0.1).restart();
        }
        // force.force("collisionForce", d3.forceCollide(d => highlighted.indexOf(d.name) > -1 || d.name === selectedMP ? radius2 + 3 : 8).strength(1).iterations(1)).alpha(0.1).restart();


      }

      document.addEventListener("awesomplete-selectcomplete", function (e) {
        const memberId = e.text.value;
        const memberName = e.text.label.split("-")[0].trim();
        selectMember(memberName, memberId, null);
      });


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

      //     select
      //   }
      // }, 5000);

      const doScrollAction = (i) => {
        // return; 
        try {

          ps.forEach((p, j) => {
            if(i >= j) {
              p.style.opacity = 1;
            } else {
              p.style.opacity = 0.2;
            }
          });

          links = []; 

          if(i === 0) {
            nodes.forEach(d => {
              d3.shuffle(nodes.filter(v => v.party === d.party)).slice(0,2).forEach(n => {
                links.push({
                  source: d,
                  target: n,
                  "strength": 1
                });
              }); 
            });
          } else {
            i = i-1;
            nodes.forEach(d => {
              d3.shuffle(d.mostSimilar[i][0]).slice(0,5).forEach(e => {
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
          }
          
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
    
            if(bbox.top - bbox.height < (window.innerHeight*(2/3)) && bbox.bottom > window.innerHeight) { 
                const i = Math.floor(Math.abs(bbox.top - (window.innerHeight*(2/3)))/bbox.height*11);

                if(i !== lastI && i < 11) {
                  // console.log(i)
                  doScrollAction(i); 
                  lastI = i;
                }
            }
    
            lastScroll = window.pageYOffset;
        }
        window.requestAnimationFrame(checkScroll);
      };
    
      window.requestAnimationFrame(checkScroll);
    // }
  })