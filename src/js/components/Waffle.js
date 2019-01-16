import React, { Component } from 'react'
import { partyColours, shortNameFunc, sortByOccurrence, generatePositions, $ } from '../util'

class Waffle extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { members } = this.props
    const votingMps = members.filter(d => d.vote !== 'Did not vote').length
    const ayes = members.filter(d => d.vote === 'For')
    const ayeTellers = members.filter(d => d.vote === 'For' && d.teller === true)
    const noes = members.filter(d => d.vote === 'Against')
    const noTellers = members.filter(d => d.vote === 'Against' && d.teller === true)
console.log(noTellers)
    const winning = ayes.length > noes.length ? ayes : noes

    const abstained = members.filter(d => d.vote === 'Did not vote').length

    const width = 860

    const rows = 8

    const columns = Math.ceil(winning.length/rows)

    const totalMps = 649

    const sqWidth = width / columns
    const sqHeight = sqWidth

    const needed = Math.ceil(votingMps/2)

    const ayePositions = ayes.map( (_, i) => {

      const x = sqWidth*(Math.floor(i / rows))
      const y = sqHeight*(i % rows)

      return [ x, y ]

    } )

    const noPositions = noes.map( (_, i) => {

      const x = sqWidth*(Math.floor(i / rows))
      const y = sqHeight*(i % rows)

      return [ x, y ]

    } )

    const height = rows*sqHeight

    return (

      <div className='gv-main-vote'>

      <h2 className='gv-main-vote__title'>{ this.props.glossTitle }</h2>

      <p className='gv-main-vote__gloss'>{ this.props.glossText }</p>

      { this.props.hasData ? <div className='gv-waffle-container'>
  
        { noes.length > ayes.length ? <img src='<%= path %>/assets/check.svg' className='gv-checkmark' /> : '' } 
      <h3 className='gv-count__before gv-count__before--noes'>Against</h3>
        <h3 className='gv-count gv-count--noes'>{noes.length - noTellers.length}</h3> 
        <svg className='gv-main-vote__svg' viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">

          {
            sortByOccurrence(members.filter(d => d.vote === 'Against'), 'Against').reverse()
                .map((d, i) => <rect key={d.id} id={'no-' + d.id} height={sqHeight - 1} width={sqWidth - 1} x={noPositions[i][0]} y={noPositions[i][1]} fill={partyColours[d.party]}></rect>)
          }

        </svg>

          {ayes.length > noes.length ? <img src='<%= path %>/assets/check.svg' className='gv-checkmark' /> : ''}

          <h3 className='gv-count__before gv-count__before--ayes'>For</h3>
          <h3 className='gv-count gv-count--ayes'>{ayes.length - ayeTellers.length}</h3>
          <svg className='gv-main-vote__svg' viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">

            {
              sortByOccurrence(members.filter(d => d.vote === 'For'), 'For')
                .map((d, i) => <rect key={d.id} id={'aye-' + d.id} height={sqHeight - 1} width={sqWidth - 1} x={ayePositions[i][0]} y={ayePositions[i][1]} fill={partyColours[d.party]}></rect>)
            }

          </svg>
      
      </div>

      :
      
      <div className='gv-waffle__novote'>
      
      <h2 className='gv-waffle__waiting'>The House is yet to hold the main vote.</h2>
      
      </div> }

      </div>
    )
  }

}

export default Waffle