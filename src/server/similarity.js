import data from '../assets/votesNew'
import fs from "fs"
import * as d3 from "d3"
// const MPs = data.membersInfo.map(mp => {
//   return {
//     "name": mp.name,
//     "votes": mp.votes.map(d => {
//       return Object.assign({}, d, {
//         "similarity": data.membersInfo.map(mp2 => ({
//           "MP" : mp2.name,
//           "sameVote" : mp2.votes.find(v => v.divisionId === d.divisionId).vote === d.vote
//         }))
//       });
//     })
//   }
// }); 

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// function shuffler(array, mpName) {
//   return array.sort((a,b) => {
//     return ((Math.abs(mpName.length % a.name.length) - Math.abs(mpName.length % b.name.length)) * array.length)/(mpName.length)
//   });
// }

function removeAbstain(vote) {
  // if(vote === "Did not vote")  {
  // return "Against"
  // }

  return vote
}

const MPs = data.membersInfo;

const MPsWithScores = MPs.map(mp => {
  return Object.assign({}, mp, {
    "scores": MPs.map(d => ({
        "name": d.name,
        "party": d.party,
        "votesMatch": data.divisionsInfo.map(v => {
          const divisionId = v.id;

          return {
            "vote": v.title,
            "divisionId": v.id,
            "sameVote": removeAbstain((d.votes.find(e => e.divisionId === divisionId)).vote) === removeAbstain((mp.votes.find(e => e.divisionId === divisionId)).vote)
          }
        })
      }))
      .map(d => {
        const voteLength = d.votesMatch.length;
        let scores = [];
        for (let i = 1; i < voteLength + 1; i++) {
          const slicedVotes = d.votesMatch.slice(0, i);
          const score = slicedVotes.filter(k => k.sameVote).length / slicedVotes.length;
          scores.push(score);
        }
        return Object.assign({}, d, {
          scores
        })
      })
  })
});

const cleanedMPsWithScores = MPsWithScores.map(mp => ({
  "name": mp.name,
  "party": mp.party,
  "scores": mp.scores.map(e => ({
    "name": e.name,
    "scores": e.scores
  }))
}))

// let count = 0;

let prevArray = [
  [],
  []
]

const shuffler = (arr, c) => {
  const prevArrayToUse = prevArray[c];

  return arr.sort((a, b) => {
    if (prevArrayToUse.find(n => n.name === a.name)) {
      // console.log("!")
      return -1;
    }

    return Math.random() > 0.5
  });
}

const mostSimilarMPs = cleanedMPsWithScores.map(mp => {
  // prevArray = [[],[]]
  return {
    "name": mp.name,
    "party": mp.party,
    "mostSimilar": new Array(data.divisionsInfo.length).fill(null).map((b, i) => i).map((i) => {
      const thisVoteScores = mp.scores.filter(x => x.name !== mp.name).map(v => v.scores[i]);
      const maxValue = d3.max(thisVoteScores);
      const nextValue = d3.max(thisVoteScores.filter(d => d !== maxValue));

      const otherMPsWithScores = mp.scores
        .filter(x => x.name !== mp.name)
        .map(x => ({
          "name": x.name,
          "score": x.scores[i]
        }))
        .sort((a, b) => b.score - a.score)
        .filter(x => x.score === maxValue)
        .map(d => d.name)

      const otherMPsWithScores2 = (maxValue - nextValue < 0.1 && nextValue > 0.25) ? mp.scores
        .filter(x => x.name !== mp.name)
        .map(x => ({
          "name": x.name,
          "score": x.scores[i]
        }))
        .sort((a, b) => b.score - a.score)
        .filter(x => x.score === nextValue)
        .map(d => d.name) : []

      // if(count + 5 >= otherMPsWithScores.length) {
      //   count = 0;
      // }  

      const toReturn = [otherMPsWithScores, []];

      prevArray = toReturn;
      // count = count+5;

      return toReturn;
    })
  }
});

fs.writeFileSync("./src/assets/output.json", JSON.stringify(mostSimilarMPs));