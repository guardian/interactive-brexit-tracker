import React, { Component } from 'react'
import { partyColours, shortNameFunc, sortByOccurrence, generatePositions, $ } from '../util'

class Waffle extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    console.log(this.props.hasData)
    const { members } = this.props
    const votingMps = members.filter(d => d.vote !== 'A').length
    const ayes = members.filter(d => d.vote === 'AyeVote')
    const noes = members.filter(d => d.vote === 'NoVote')

    const winning = ayes.length > noes.length ? ayes : noes

    const abstained = members.filter(d => d.vote === 'A').length

    const width = 1260

    const rows = 8

    const columns = Math.ceil(winning.length/rows)

    console.log(rows, columns)

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

    console.log(ayePositions, noPositions)

    return (

      <div className='gv-main-vote'>

      <h2 className='gv-main-vote__title'>{ this.props.glossTitle }</h2>

      <p className='gv-main-vote__gloss'>{ this.props.glossText }</p>

        <div className={`${this.props.hasData ? 'gv-waffle-container' : 'gv-waffle-container-nodata'}`}>

        { ayes.length > noes.length ? <img src='<%= path %>/assets/check.svg' className='gv-checkmark' /> : '' } 

        <h3 className='gv-count__before gv-count__before--ayes'>For</h3>
        <h2 className='gv-count gv-count--ayes'>{ayes.length}</h2>
        <svg className='gv-main-vote__svg' viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">

          {
            sortByOccurrence(members.filter(d => d.vote === 'AyeVote'), 'AyeVote')
              .map((d, i) => <rect key={d.id} id={'aye-' + d.id} height={sqHeight - 1} width={sqWidth - 1} x={ayePositions[i][0]} y={ayePositions[i][1]} fill={partyColours[d.party]}></rect>)
          }

        </svg>

        { noes.length > ayes.length ? <img src='<%= path %>/assets/check.svg' className='gv-checkmark' /> : '' } 
      <h3 className='gv-count__before gv-count__before--noes'>Against</h3>
        <h2 className='gv-count gv-count--noes'>{noes.length}</h2> 
        <svg className='gv-main-vote__svg' viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">

          {
            sortByOccurrence(members.filter(d => d.vote === 'NoVote'), 'NoVote').reverse()
                .map((d, i) => <rect key={d.id} id={'no-' + d.id} height={sqHeight - 1} width={sqWidth - 1} x={noPositions[i][0]} y={noPositions[i][1]} fill={partyColours[d.party]}></rect>)
          }

        </svg>
      
      </div>

      </div>
    )
  }

  componentDidMount() {

    const svg = $('.gv-main-vote__svg')
    const sf = 1260/svg.getBoundingClientRect().width



  }

}

export default Waffle