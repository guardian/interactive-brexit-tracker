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
      for(let i = 1; i < voteLength + 1; i++) {
        const slicedVotes = d.votesMatch.slice(0,i);
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
  "scores": mp.scores.map(e => ({"name": e.name, "scores": e.scores}))
}))

// const mostSimiliarMPs = cleanedMPsWithScores.map(mp => ({
//   "name": mp.name,
//   "party": mp.party,
//   "mostSimilar": mp.scores[0].scores.map((d, i) => {
//     const thisVoteScores = mp.scores.map(v => v.scores[i]);
//     const maxValue = d3.max(thisVoteScores);

//     // if(mp.scores.filter(x => x.scores[i] === maxValue && x.name !== mp.name).map(x => x.name).length > 25) {
//       // return mp.scores.filter(x => x.scores[i] === maxValue && x.name !== mp.name).map(x => x.name)
//     // } else {
//       // console.log(mp.scores.filter(x => x.name !== mp.name).map(x => x.name).sort().reverse().slice(0,25));
//       // return mp.scores.filter(x => x.name !== mp.name).map(x => x.name).sort().reverse().slice(0,25);
//     // }
//     // console.log(mp.scores[0])
//     // return mp.scores.filter(x => x.name !== mp.name).map(x => {
//     //   console.log(x)
//     //   return { "name": x.name, "score": x.score }
//     // })
//     const toReturn = mp.scores.filter(x => x.name !== mp.name).map(x => ({
//       "name": x.name,
//       "score": x.scores[i]
//     }))
//     .filter(x => x.score !== 0)
//     // .filter((x,b) => x.score === maxValue))
//     .sort((a,b) => b.score - a.score)
//     .filter((x,b) => (x.score === maxValue) ? true : (b < 25))
//     // .map(x => x.name)
//     // .slice(0, 10)
    
//     if(toReturn.length > 25) {
//       return shuffle(toReturn).slice(0, 25)
//     }

//     return toReturn;
//   })
// }))

const mostSimilarMPs = cleanedMPsWithScores.map(mp => ({
    "name": mp.name,
    "party": mp.party,
    "mostSimilar": new Array(data.divisionsInfo.length).fill(null).map((b, i) => i).map((i) => {
      const thisVoteScores = mp.scores.filter(x => x.name !== mp.name).map(v => v.scores[i]);
      const maxValue = d3.max(thisVoteScores);

      const otherMPsWithScores = mp.scores
            .filter(x => x.name !== mp.name)
            .map(x => ({
              "name": x.name,
              "score": x.scores[i]
            }))
            .sort((a,b) => b.score - a.score)
            .filter(x => x.score === maxValue)
  
      return otherMPsWithScores
    })
}));

fs.writeFileSync("./src/assets/output.json", JSON.stringify(mostSimilarMPs));