import React, { Component } from 'react'
import { partyColours, shortNameFunc, sortAyes, sortNoes, generatePositions } from '../util'

class Waffle extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const columns = 50;
    const rows = 13;
    const width = 860;
    const totalMps = 649
    const sqWidth = Math.round(width / columns);
    const sqHeight = Math.round(sqWidth);
    const height = sqHeight * rows;
    const addedWidth = width - (50 * sqWidth)
    const positions = generatePositions(columns, rows, sqWidth, sqHeight)
    const { members } = this.props

    return (
      <div>
        <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
          {
            members
              .filter(d => d.vote === 'AyeVote')
              .sort((a, b) => sortAyes(a, b))
              .map((d, i) => <rect key={d.id} height={sqHeight - 1} width={sqWidth - 1} x={positions[i][0]} y={positions[i][1]} fill={partyColours[d.party]}></rect>)
          }
          {
            members
              .filter(d => d.vote === 'NoVote')
              .sort((a, b) => sortNoes(a, b))
              .map((d, i) => <rect key={d.id} height={sqHeight - 1} width={sqWidth - 1} x={addedWidth + positions[totalMps - i][0]} y={positions[totalMps - i][1]} fill={partyColours[d.party]}></rect>)
          }
        </svg>
      </div>
    )
  }
}

export default Waffle