import { cond } from 'lodash'

const $ = selector => document.querySelector(selector)
const $$ = selector => [].slice.apply(document.querySelectorAll(selector))

const round = (value, exp) => {
	if (typeof exp === 'undefined' || +exp === 0)
		return Math.round(value);

	value = +value;
	exp = +exp;

	if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
		return NaN;

	value = value.toString().split('e');
	value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

	value = value.toString().split('e');
	return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

const numberWithCommas = x => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const wait = ms => new Promise((resolve, reject) => setTimeout(() => resolve(), ms ))

const getDimensions = el => {
	const width = el.clientWidth || el.getBoundingClientRect().width
	const height = el.clientHeight || el.getBoundingClientRect().height
	return [ width, height ]
}

const hashPattern = (patternId, pathClass, rectClass) => {

	return `
		<pattern id='${patternId}' patternUnits='userSpaceOnUse' width='4' height='4'>
			<rect width='4' height='4' class='${rectClass}'></rect>
			<path d='M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2' class='${pathClass}'></path>
		</pattern>
	`
}

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

function prettyVoteName (vote) {
	if (vote === "AyeVote") {return "For"} 
	else if (vote === "NoVote") {return "Against"}
	else {return "Did not vote"} 
}

const shortNameFunc = cond([
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

const sortAyes = (a, b) => {
	// if (a.party === "Conservative" || b.party === "Labour") {
	// 	return -1;
	// }

	// if (a.party === "Labour" || b.party === "Conservative") {
	// 	return 1;
	// }

	if (a.party > b.party) {
		return 1;
	}

	if (a.party < b.party) {
		return -1;
	}

	return 0;
}

const sortNoes = (a, b) => {
	if (a.party === "Con" || b.party === "Lab") {
		return -1;
	}

	if (a.party === "Lab" || b.party === "Con") {
		return 1;
	}

	if (a.party > b.party) {
		return 1;
	}

	if (a.party < b.party) {
		return -1;
	}

	return 0;
}

const generatePositions = (columns, rows, sqWidth, sqHeight) => {
	let positions = [];
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			positions.push([sqWidth * i, sqHeight * j]);
		}
	}
	return positions
}

const sortByOccurrence = (arr, vote) => {
	const cnts = arr.map(d => d.party).reduce(function (obj, val) {
		obj[val] = (obj[val] || 0) + 1;
		return obj;
	}, {});
	
	const sorted = arr.sort((a, b) => {
		if (vote === 'For') {
			if (cnts[b.party] !== cnts[a.party]) {
				return cnts[b.party] - cnts[a.party]
			}
			if (b.party > a.party) {
				return 1
			} else {
				return -1
			}
		} else if (vote === 'Against') {
			if (cnts[b.party] !== cnts[a.party]) {
				return cnts[a.party] - cnts[b.party]
			}
			if (b.party > a.party) {
				return 1
			} else {
				return -1
			}
		}

	});

	return sorted
}

const checkForMainVoteRebels = (member, vote) => {
	var govVote = 'For';

	if (vote.vote == 'Did not vote' || vote.vote == undefined || vote.vote == 'undefined' || member.party == 'Ind') { return '––' }
	else if (member.party == 'Con' && govVote != vote.vote) {
		return 'Yes'
	} else if (member.party != 'Con' && govVote == vote.vote) {
		return 'Yes'
	} else {
		return 'No'
	}
}


const sortTable = (a, b, column, isDesc) => {
	if (column === 'vote' || 'isMainVoteRebel') {
		const frst = column === 'vote' ? a.votes.find(d => d.isMainVote).vote : a[column]
		const scnd = column === 'vote' ? b.votes.find(d => d.isMainVote).vote : b[column]

		if (frst === 'Did not vote' || frst === '––') {
			return 1;
		}
		else if (scnd === 'Did not vote' || scnd === '––') {
			return -1;
		}
		else if (frst === scnd) {
			return 0;
		}
		else if (!isDesc) {
			return frst < scnd ? -1 : 1;
		}
		else if (isDesc) {
			return frst < scnd ? 1 : -1;
		}
	}

	if (a[column] > b[column]) {
		return isDesc ? 1 : -1
	}
	else if (a[column] < b[column]) {
		return isDesc ? -1 : 1
	}
	else {
		return 0
	}
}

export { $, $$, round, numberWithCommas, wait, getDimensions, hashPattern, partyColours, generatePositions, sortByOccurrence, prettyVoteName, shortNameFunc, checkForMainVoteRebels, sortTable }