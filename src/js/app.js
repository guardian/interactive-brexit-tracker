import * as d3 from "d3"
import allMembers from '../assets/allmembers'
import Awesomplete from './awesomeplete'


let clicked = false;


let lastScroll = null;
let lastI = null;

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

const groupLabels = [
  [],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"], ["Speakers/Sinn Féin", "Michelle Gildernew"]], 
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"]],
  [["Conservative whip", "Mr Philip Hammond"], ["Labour whip", "Emily Thornberry"], ["Remainers", "Mhairi Black"], ["ERG/DUP", "Mr Jacob Rees-Mogg"]]
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


//fetch and run

fetch("<%= path %>/assets/output.json")
  .then(data => data.json())
  .then(data => {


    /*--------------- Searchbox ---------------*/

    const parent = d3.select(".gv-member-search");

    const searchBox = parent.insert("div", ":first-child").classed("search-container", true);
    const input = searchBox.append("input").classed("member-result", true);

    input.attr("placeholder", "Select an mp …");

    // const buttonsWrapper = searchBox.append("div").classed("buttons", true);

    // const companiesToButton = ["Schoolsworks Academy Trust", "Sussex Learning Trust", 'Asos.com Limited', 'Credit Suisse (UK) Limited'];

    const awesome = new Awesomplete(input.node(), {
      list: allMembers.map(d => [d.name, d.id]),
      replace: function (text) {
        this.input.value = text.label;
      }
    });

    const close = d3.select('.awesomplete').append("div").style("display", "none").classed("search", true);

    close.html(`<svg class="icon-cancel" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30">
        <path d="m 8.2646211,7.64 -0.985372,0.992 6.8996289,7.5523 7.720992,6.739 0.821373,-0.8267 -6.899628,-7.5524 -7.5569939,-6.9042" fill="#000"></path>
        <path d="m 7.2792491,21.64 0.985372,0.9854 7.5569939,-6.8977 6.899628,-7.5523 -0.985381,-0.992 -7.556984,6.9042 -6.8996289,7.5524" fill="#000"></path>
        </svg>`);

    close.on("click", function (e) {
      const mp = input.node().value

      close.style("display", "none");
      input.node().value = "";
      d3.select(".label-g").remove();

      d3.select(".search-box-date").html(``);

      d3.select(".search-box-gap").html(``);
      const index = highlighted.indexOf(mp)
      index > -1 && highlighted.splice(index, 1)
    });

    input.on("keyup", function (e) {
      const mp = input.node().value
      console.log(mp)
      if (input.node().value.length > 0) {
        close.style("display", "inline-block");
      } else {
        close.style("display", "none");
      }

      console.log(input.node().value.length === 0)
      if (input.node().value.length === 0) {
        const index = highlighted.indexOf(mp)
        index > -1 && highlighted.splice(index, 1)
      }

    });


  /*--------------- Searchbox ---------------*/

    const images = highlighted.map(m => {
      const memberId = allMembers.find(d => d.name === m).id
      const imgTag = new Image()
      imgTag.src = `http://data.parliament.uk/membersdataplatform/services/images/MemberPhoto/${memberId}`
      imgTag.id = memberId
      return {
        name: m,
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
          .distance(d => (d.strength === 1) ? radius*3 : radius*20)
          // .strength(d => {
          //   if(d.strength === 1) {
          //     return 1;
          //   } else {
          //     return 0.5;
          //   }
          // })
        )
        .force("center", d3.forceCenter().x(0).y(0))
        .force("charge", d3.forceManyBody().distanceMax(radius*30))
        // .force("x", d3.forceX().x(0).strength(0.01))
        // .force("y", d3.forceY().y(0).strength(0.01)) 
        .force("collisionForce", d3.forceCollide(d => highlighted.indexOf(d.name) > -1 || d.name === selectedMP ? radius2 + 3 : radius*2).strength(1).iterations(1))

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

        function highlightedCircle(name, image) {
          const selectedMPNode = nodes.find(d => d.name === name);
          let x2 = Math.max(radius, Math.min(width - radius, selectedMPNode.x + width / 2))
          let y2 = Math.max(radius, Math.min(height - radius, selectedMPNode.y + height / 2))

          // const memberId = allMembers.find(d => d.name === name).id
          // const img = new Image()
          // img.src = `http://data.parliament.uk/membersdataplatform/services/images/MemberPhoto/${memberId}`

          context.save();
          context.beginPath();

          context.moveTo(x2, y2);
          context.arc(x2, y2, radius2, 0, 2 * Math.PI)
          context.closePath();
          context.clip();

          context.drawImage(image, x2 - radius2, y2 - radius2, radius2 * 2, radius2 * 2);
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
          context.strokeStyle = "#fff";
          context.lineWidth = 2;
          context.textAlign = "start"; 
          context.font = "13px Guardian Text Sans Web";
          context.strokeText(name, x2 + radius2 + 4, y2 + radius2 / 2);
          context.closePath();

          context.beginPath();
          context.fillStyle = "#000";
          context.textAlign = "start"; 
          context.font = "13px Guardian Text Sans Web";
          context.fillText(name, x2 + radius2 + 4, y2 + radius2 / 2);
          context.closePath();
        }

        highlighted.forEach(name => {

          const imgTag = images.find(obj => obj.name === name).imgTag
          highlightedCircle(name, imgTag)
        });

        function addLabel(label) {
          const labelName = label[0];
          const labelMP = label[1];

          const selectedMPNode = nodes.find(d => d.name === labelMP);

          let x2 = Math.max(radius, Math.min(width - radius, selectedMPNode.x + width / 2))
          let y2 = Math.max(radius, Math.min(height - radius, selectedMPNode.y + height / 2))
          
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
        if(groupLabels[lastI]) {
          groupLabels[lastI].forEach(label => addLabel(label));
        }
      }

      const selectMember = (memberName, memberId, force) => {
        // selectedMP = memberName

        const imgTag = document.createElement('img');
        imgTag.src = `http://data.parliament.uk/membersdataplatform/services/images/MemberPhoto/${memberId}`
        imgTag.id = memberId
        imgTag.onload = function() {
          // return highlightedCircle(selectedMP, this)
          images.push({
            name: memberName,
            imgTag: this
          })
          highlighted.push(memberName)
        }
        // force.force("collisionForce", d3.forceCollide(d => highlighted.indexOf(d.name) > -1 || d.name === selectedMP ? radius2 + 3 : 8).strength(1).iterations(1)).alpha(0.1).restart();


      }

      document.addEventListener("awesomplete-selectcomplete", function (e) {
        const memberId = e.text.value;
        const memberName = e.text.label;
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

      //     force.alpha(0.75).restart();
      //   }
      // }, 5000);

      const doScrollAction = (i) => {
        try {
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
        } catch(err) {
          console.log(err);
        }
      }

      const checkScroll = () => {
        if(lastScroll !== window.pageYOffset) {
            const bbox = scrollText.node().getBoundingClientRect();
    
            if(bbox.top < (window.innerHeight*(1/3)) && bbox.bottom > window.innerHeight) { 
                const i = Math.floor(Math.abs(bbox.top - (window.innerHeight*(1/3)))/bbox.height*6);

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
    // }
  });