const fs = require('fs');
const fetch = require('node-fetch');
const _ = require('lodash');
const readline = require('readline');
const leaveVote = require('./leaveVote.json')

const shortNameFunc = _.cond([
  [party => (party === "Labour" || party === "Labour (Co-op)"), () => "Lab"],
  [party => party === "Conservative", () => "Con"],
  [party => party === "Scottish National Party", () => "SNP"],
  [party => party === "Sinn Féin", () => "SF"],
  [party => party === "Liberal Democrat", () => "LD"],
  [party => party === "Plaid Cymru", () => "PC"],
  [party => party === "Independent", () => "Ind"],
  [party => party === "Democratic Unionist Party", () => "DUP"],
  [party => party === "Green Party", () => "Grn"],
  [() => true, () => "Oth"]
]);

function getLeaveVote(constituency) {
  var matchingconst = leaveVote.find(c => c.Constituency == constituency);
  if (matchingconst && matchingconst != undefined && matchingconst != 'undefined') {
    return matchingconst.LeaveVote;
  } else {return "N/A"}
}

async function fetchAll(config) {
  const glossesUrl = config.googleSheetUrl
  const membersUrl = "http://data.parliament.uk/membersdataplatform/services/mnis/members/query/House=Commons%7CIsEligible=true/"

  const glosRes = await fetch(glossesUrl)
  const glossesJson = await glosRes.json()
  const glosses = glossesJson['sheets']['Sheet1']
  const membersRes = await fetch(membersUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
  const membersText = await membersRes.text()
  const members = await JSON.parse(membersText.trim())
  const divisionIds = glosses.filter(d => d.divisionId !== "").map(d => Number(d.divisionId))

  console.log("our ids", divisionIds)

  // Manual data section  

  const manualData = glosses.map(g => ({
    glossText: g.amendmentGloss,
    glossTitle: g.amendmentTitle,
    isMainVote: Number(g.isFinalVote) === 1 ? true : false,
    ayesCount: g.ayes === "" ? null : Number(g.ayes),
    noesCount: g.noes === "" ? null : Number(g.noes)
  }))


  // Everything else

  const allMembers = members['Members']['Member'].map(member => {
    return {
      id: member['@Member_Id'],
      name: member['DisplayAs'].replace(/Mr /g, "").replace(/Mrs /g, "").replace(/Ms /g, "").replace(/Dr /g, ""),
      listAs: member['ListAs'],
      party: member['Party']['#text'].startsWith('Labour') ? shortNameFunc('Labour') : shortNameFunc(member['Party']['#text']),
      partyId: member['Party']['@Id'],
      constituency: member['MemberFrom'],
      leaveVote: getLeaveVote(member['MemberFrom']),
      gender: member.Gender,
      votes: []
    }
  })

//extra bit start

const mpsRef = allMembers.map(d => ({
  id: d.id,
  name: d.name,
  constituency: d.constituency
}))

//extra bit end

  console.log(allMembers);

  const divisionUrls = divisionIds.map((id, i) => `https://commonsvotes-services.digiminster.com/data/division/${id}.json?${new Date().getTime()+i}`) //new api
  const allDivisions = await Promise.all(divisionUrls.map(url => fetch(url, { timeout: 0 }).then(res => res.json())))
  

  const divisionsInfo = glosses.map(d => {

    console.log("gloss id", d.divisionId)
    console.log(allDivisions.filter(d => d).map(j => j.DivisionId))


    const glossText = d.amendmentGloss;
    const glossTitle = d.amendmentTitle;
    const isMainVote = Number(d.isFinalVote) === 1 ? true : false;
    const ayeWithGvt = Number(d.ayeWithGvt) === 1 ? true : false;
    const didProceed = Number(d.didProceed) === 1 ? true : false


    const matchingDivision = allDivisions.find(div => Number(div['DivisionId']) === Number(d.divisionId))


    if (!matchingDivision) {
      console.log('nomatch')
      return ({
        glossText,
        glossTitle,
        isMainVote,
        ayeWithGvt,
        hasData: false,
        didProceed
      })
    } else {
      const ayeVoters = matchingDivision['Ayes'];
      const noVoters = matchingDivision['Noes'];
      const ayeTellers = matchingDivision['AyeTellers'];
      const noTellers = matchingDivision['NoTellers'];
      const voteTitle = matchingDivision['Title'];
      const divisionNumber = matchingDivision['Number'];
      const divisionId = matchingDivision['DivisionId'];
      let gvtVote

      const mayHasVoted = matchingDivision['NoVoteRecorded'].find(d => d['MemberId'] === 8) !== undefined
      const hammondHasVoted = matchingDivision['NoVoteRecorded'].find(d => d['MemberId'] === 105) !== undefined
      const smithHasVoted = matchingDivision['NoVoteRecorded'].find(d => d['MemberId'] === 4118) !== undefined

      if (mayHasVoted) {
        gvtVote = ayeVoters.find(d => d['MemberId'] === 8) ? 'For' : 'Against'
      } else if (mayHasVoted === false && hammondHasVoted) {
        gvtVote = ayeVoters.find(d => d['MemberId'] === 105) ? 'For' : 'Against'
      } else if (mayHasVoted === false && hammondHasVoted === false) {
        gvtVote = ayeVoters.find(d => d['MemberId'] === 4118) ? 'For' : 'Against'
      } else if (mayHasVoted === false && hammondHasVoted === false && smithHasVoted === false) {
        gvtVote = null
      }



      return ({
        glossText,
        glossTitle,
        isMainVote,
        ayeWithGvt,
        hasData: true,
        title: voteTitle,
        number: divisionNumber,
        id: divisionId,
        date: matchingDivision['Date'],
        government: gvtVote,
        ayesCount: matchingDivision['AyeCount'] + ayeTellers.length,
        noesCount: matchingDivision['NoCount'] + noTellers.length,
        ayeTellersCount: ayeTellers.length,
        noTellersCount: noTellers.length,
        abstainCount: allMembers.length - ayeVoters.length - noVoters.length - ayeTellers.length - noTellers.length,
        ayesByParty: [
          { party: shortNameFunc('Labour'), votes: ayeVoters.filter(d => d['Party'] === 'Labour' || d['Party'] === 'Labour (Co-op)').length + ayeTellers.filter(d => d['Party'] === 'Labour').length },
          { party: shortNameFunc('Conservative'), votes: ayeVoters.filter(d => d['Party'] === 'Conservative').length + ayeTellers.filter(d => d['Party'] === 'Conservative').length },
          { party: shortNameFunc('Scottish National Party'), votes: ayeVoters.filter(d => d['Party'] === 'Scottish National Party').length + ayeTellers.filter(d => d['Party'] === 'Scottish National Party').length },
          { party: shortNameFunc('Liberal Democrat'), votes: ayeVoters.filter(d => d['Party'] === 'Liberal Democrat').length + ayeTellers.filter(d => d['Party'] === 'Liberal Democrat').length },
          { party: shortNameFunc('Sinn Féin'), votes: ayeVoters.filter(d => d['Party'] === 'Sinn Féin').length + ayeTellers.filter(d => d['Party'] === 'Sinn Féin').length },
          { party: shortNameFunc('Plaid Cymru'), votes: ayeVoters.filter(d => d['Party'] === 'Plaid Cymru').length + ayeTellers.filter(d => d['Party'] === 'Plaid Cymru').length },
          { party: shortNameFunc('Democratic Unionist Party'), votes: ayeVoters.filter(d => d['Party'] === 'Democratic Unionist Party').length + ayeTellers.filter(d => d['Party'] === 'Democratic Unionist Party').length },
          { party: shortNameFunc('Green Party'), votes: ayeVoters.filter(d => d['Party'] === 'Green Party').length + ayeTellers.filter(d => d['Party'] === 'Green Party').length },
          { party: shortNameFunc('Independent'), votes: ayeVoters.filter(d => d['Party'] === 'Independent').length + ayeTellers.filter(d => d['Party'] === 'Independent').length }
        ].sort((a, b) => {
          if (a.votes !== b.votes) {
            return b.votes - a.votes
          } else {
            if (b.party > a.party) {
              return -1
            } else {
              return 1
            }
          }
        }),
        noesByParty: [
          { party: shortNameFunc('Labour'), votes: noVoters.filter(d => d['Party'] === 'Labour' || d['Party'] === 'Labour (Co-op)').length + noTellers.filter(d => d['Party'] === 'Labour').length },
          { party: shortNameFunc('Conservative'), votes: noVoters.filter(d => d['Party'] === 'Conservative').length + noTellers.filter(d => d['Party'] === 'Conservative').length },
          { party: shortNameFunc('Scottish National Party'), votes: noVoters.filter(d => d['Party'] === 'Scottish National Party').length + noTellers.filter(d => d['Party'] === 'Scottish National Party').length },
          { party: shortNameFunc('Liberal Democrat'), votes: noVoters.filter(d => d['Party'] === 'Liberal Democrat').length + noTellers.filter(d => d['Party'] === 'Liberal Democrat').length },
          { party: shortNameFunc('Sinn Féin'), votes: noVoters.filter(d => d['Party'] === 'Sinn Féin').length + noTellers.filter(d => d['Party'] === 'Sinn Féin').length },
          { party: shortNameFunc('Plaid Cymru'), votes: noVoters.filter(d => d['Party'] === 'Plaid Cymru').length + noTellers.filter(d => d['Party'] === 'Plaid Cymru').length },
          { party: shortNameFunc('Democratic Unionist Party'), votes: noVoters.filter(d => d['Party'] === 'Democratic Unionist Party').length + noTellers.filter(d => d['Party'] === 'Democratic Unionist Party').length },
          { party: shortNameFunc('Green Party'), votes: noVoters.filter(d => d['Party'] === 'Green Party').length + noTellers.filter(d => d['Party'] === 'Green Party').length },
          { party: shortNameFunc('Independent'), votes: noVoters.filter(d => d['Party'] === 'Independent').length + noTellers.filter(d => d['Party'] === 'Independent').length }
        ].sort((a, b) => {
          if (a.votes !== b.votes) {
            return b.votes - a.votes
          } else {
            if (b.party > a.party) {
              return -1
            } else {
              return 1
            }
          }
        })
      })
    }
  })

  allDivisions.filter(d => d['DivisionId']).forEach(d => {
    const ayeVoters = d['Ayes'];
    const noVoters = d['Noes'];
    const ayeTellers = d['AyeTellers'];
    const noTellers = d['NoTellers'];
    const voteTitle = d['Title'];
    const divisionNumber = d['Number'];
    const divisionId = d['DivisionId'];

    allMembers.forEach(member => {
      let vote
      let isTeller

      if (ayeVoters.find(voter => Number(member.id) === voter['MemberId'])) {
        vote = 'For'
        isTeller = false
      } else if (noVoters.find(voter => Number(member.id) === voter['MemberId'])) {
        vote = 'Against'
        isTeller = false
      } else if (ayeTellers.find(voter => Number(member.id) === voter['MemberId'])) {
        vote = 'For'
        isTeller = true
      } else if (noTellers.find(voter => Number(member.id) === voter['MemberId'])) {
        vote = 'Against'
        isTeller = true
      } else {
        vote = 'Did not vote'
        isTeller = false
      }

      const matchingGloss = glosses.find(g => Number(g.divisionId) === Number(divisionId));

      member.votes.push({
        voteTitle,
        divisionNumber,
        divisionId,
        vote,
        teller: isTeller,
        glossText: matchingGloss.amendmentGloss,
        glossTitle: matchingGloss.amendmentTitle,
        isMainVote: matchingGloss.isFinalVote == 1 ? true : false,
        ayeWithGvt : matchingGloss.ayeWithGvt
      })
    })

  
  })

  const final = {
    manualData,
    hasAmendments: config.hasAmendments,
    divisionsInfo,
    membersInfo: allMembers
  }

  console.log('data for ' + divisionsInfo.filter(d => d.hasData === true).length + ' divisions added')
  console.log(allMembers.length, 'members fetched')

  fs.writeFileSync(`./src/assets/votesNew.json`, JSON.stringify(final))
  fs.writeFileSync(`./src/assets/allMembers.json`, JSON.stringify(mpsRef))

}


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter script config name: \n', (answer) => {
  const path = `./${answer.toLowerCase()}.json`
  if (fs.existsSync(path)) {
    const config = JSON.parse(fs.readFileSync(path))

    if (config.hasOwnProperty('hasAmendments') && config.hasOwnProperty('googleSheetUrl')) {
      console.log('Fetching division(s) info...');
      fetchAll(config).then(() => rl.close())
    } else {
      console.log("Config file is missing required properties. It needs a 'hasAmendments' property (boolean) and a 'googleSheetUrl' (url)")
      rl.close();
    }
  } else {
    console.log(`No config file named ${answer} found`)
    rl.close();
  }
})