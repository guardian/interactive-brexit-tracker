import React, { Component } from 'react'
import { partyColours, shortNameFunc, sortByOccurrence, generatePositions } from '../util'

class Waffle extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { members } = this.props
    const votingMps = members.filter(d => d.vote !== 'A').length
    const ayes = members.filter(d => d.vote === 'AyeVote').length
    const noes = members.filter(d => d.vote === 'NoVote').length
    const abstained = members.filter(d => d.vote === 'A').length
    const rows = 13;
    
    const absOdd = rows - (abstained % 13)
    const ayesOdd = ayes % 13
    const noesOdd = noes % 13
    const absModulo = abstained % 13
    const absDiv = absModulo === 0 ? Math.ceil(abstained / 13) + 1  : Math.ceil(abstained / 13)

    const columns = 50;
    const width = 860;
    const totalMps = 649
    const sqWidth = Math.round(width / columns);
    const sqHeight = Math.round(sqWidth);
    const height = sqHeight * rows;
    const addedWidth = width - (50 * sqWidth)
    const positions = generatePositions(columns, rows, sqWidth, sqHeight)

    const needed = Math.ceil(votingMps/2)

    console.log(votingMps, 'voting')
    console.log(ayes, 'ayes')
    console.log(noes, 'noes')
    console.log(abstained, 'abstained')
    console.log(needed, 'needed')
    console.log(abstained % 13, 'abs modulo')
    console.log(ayesOdd, 'ayes modulo')

    const noPath = ayesOdd !== 0 ?
      `M ${positions[ayes][0] - 2} ${sqWidth * ayesOdd - 2} L${positions[ayes][0] + sqWidth -2 } ${sqWidth * ayesOdd - 2} L${positions[ayes][0] + sqWidth -2 } -2 L${8 + width - absDiv * sqWidth} -2 L${8 + width - absDiv * sqWidth} ${ absOdd !== 0 ? 1 + absOdd * sqWidth : height + 1} L${absOdd !== 0 ? width - 9 -absDiv * sqWidth : width + 2} ${absOdd * sqWidth + 1} L${absOdd !== 0 ? width - 9 -absDiv * sqWidth : width + 2} ${height + 1} L${positions[ayes][0] - 2} ${height + 1} L${positions[ayes][0] - 2} ${sqWidth * ayesOdd - 2}`:
      `M ${positions[ayes][0] - 2} ${height + 1.5} L${positions[ayes][0] - 2} ${sqWidth * ayesOdd - 2} L${8+width - absDiv * sqWidth} -2 L${8+width - absDiv * sqWidth} ${absOdd !== 0 ? absOdd * sqWidth + 1 : height + 1} L${absOdd !== 0 ? width - 9 - absDiv * sqWidth : width + 2} ${absOdd !== 0 ? 1+ absOdd * sqWidth : height + 1} L${absOdd !== 0 ? width - 9 - absDiv * sqWidth : width + 2} ${height + 1} L${positions[ayes][0] - 2} ${height +1} `

    const ayePath = ayesOdd !== 0 ?
      `M -2 -2 L${positions[ayes][0] + sqWidth + 1} -2 L${positions[ayes][0] + sqWidth + 1} ${sqWidth * ayesOdd + 1} L${positions[ayes][0] + 1} ${sqWidth * ayesOdd + 1} L${positions[ayes][0] + 1} ${height +1} L -2 ${height +1} L -2 -2.7` :
      `M -2 -2 L${positions[ayes][0] + 1} -2 L${positions[ayes][0] +1} ${height + 1} L -2 ${height + 1} L -2 -2.7`

    const winnerPath = absModulo === 0 ? `M ${positions[Math.floor(votingMps * 0.5)][0] + sqWidth} -20 L ${positions[Math.floor(votingMps * 0.5)][0] + sqWidth} ${height + 20}` :
      // `M ${positions[Math.floor(votingMps * 0.5)][0] + sqWidth} -20 L${positions[Math.floor(votingMps * 0.5)][0] + sqWidth} ${Math.floor(absModulo * 0.5) * sqWidth} L${positions[Math.floor(votingMps * 0.5)][0]} ${Math.floor(absModulo * 0.5) * sqWidth} L${positions[Math.floor(votingMps * 0.5)][0]} ${height + 20}`
        `M ${positions[Math.floor(votingMps * 0.5)][0] + sqWidth} -20 L${positions[Math.floor(votingMps * 0.5)][0] + sqWidth} ${(13 - Math.ceil(absModulo * 0.5)) * sqWidth} L${positions[Math.floor(votingMps * 0.5)][0]} ${(13 - Math.ceil(absModulo * 0.5)) * sqWidth} L${positions[Math.floor(votingMps * 0.5)][0]} ${height + 20}`
    
    
    const neededCols = Math.floor(needed/13)
    const rest = needed % 13

    const neededPoints = [
      [ (neededCols + (rest ? 1 : 0))*sqWidth, 0 ],
      [ ( neededCols + (rest ? 1 : 0))*sqWidth, rest*sqHeight ],
      [ neededCols*sqWidth, rest*sqHeight ],
      [ neededCols*sqWidth, 13*sqHeight ]
    ]
    
    const neededPath = `M ${neededPoints[0].join(',')} ` + ' L' + neededPoints.slice(1).map( p => p.join(',') ).join(' L')
    
    console.log(neededPath)

    return (
      <div>
        <svg style={{overflow: 'visible'}} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
          <g>
          {
            sortByOccurrence(members.filter(d => d.vote === 'AyeVote'), 'aye')
              .map((d, i) => <rect key={d.id} id={'aye-' + d.id} height={sqHeight - 1} width={sqWidth - 1} x={positions[i][0]} y={positions[i][1]} fill={partyColours[d.party]}></rect>)
          }
          </g>
          <g>
          {
            sortByOccurrence(members.filter(d => d.vote === 'NoVote'), 'no')
                .map((d, i) => <rect key={d.id} id={'no-' + d.id} height={sqHeight - 1} width={sqWidth - 1} x={positions[ayes + i][0]} y={positions[ayes + i][1]} fill={partyColours[d.party]}></rect>)
          }
          </g>
          {/*<line x1={positions[votingMps * 0.5 - 1][0]} x2={positions[votingMps * 0.5 - 1][0]} y1="-20" y2={height + 20} stroke="#999999" fill="none" strokeWidth="2px"></line>*/}
          <path stroke="#999999" fill='none' strokeWidth="3px" d={neededPath} />
          {ayes > noes && <path d={ayePath} stroke="#000" strokeWidth="3px" fill="none" />}
          {noes > ayes && <path d={noPath} stroke="#000" strokeWidth="3px" fill="none" />}
          </svg>
      </div>
    )
  }
}

export default Waffle