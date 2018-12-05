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
	"Labour": "#c70000",
	"Labour (Co-op)": "#c70000",
	"Conservative": "#056da1",
	"Liberal Democrat": "#ff7f0f",
	"Scottish National Party": "#fae051",
	"Green Party": "#33A22B",
	"Sinn Féin": "#7fac58",
	"Democratic Unionist Party": "#9a1b33",
	"Plaid Cymru": "#9bb4be",
	"Independent": "#767676"
}

function prettyVoteName (vote) {
	if (vote == "AyeVote") {return "For"} 
	else if (vote == "NoVote") {return "Against"}
	else {return "Did not vote"} 
}

const shortNameFunc = cond([
	[mp => (mp.party === "Labour" || mp.party === "Labour (Co-op)"), () => ({ shortParty: "Lab" })],
	[mp => mp.party === "Conservative", () => ({ shortParty: "Con" })],
	[mp => mp.party === "Scottish National Party", () => ({ shortParty: "SNP" })],
	[mp => mp.party === "Sinn Féin", () => ({ shortParty: "SF" })],
	[mp => mp.party === "Liberal Democrat", () => ({ shortParty: "LD" })],
	[mp => mp.party === "Plaid Cymru", () => ({ shortParty: "PC" })],
	[mp => mp.party === "Independent", () => ({ shortParty: "Ind" })],
	[mp => mp.party === "Democratic Unionist Party", () => ({ shortParty: "DUP" })],
	[mp => mp.party === "Green Party", () => ({ shortParty: "Grn" })],
	[() => true, () => "Oth"]
]);

export { $, $$, round, numberWithCommas, wait, getDimensions, hashPattern, partyColours }