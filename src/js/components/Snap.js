import React, { Component } from 'react'


class Bar extends Component {

  constructor(props) {
    super(props)
  }


  render() {

    var percentwidth = `${this.props.width}%`
    var camelparty = this.props.party.replace(/ /g, "");

    return (<rect className={`gv-bar gv-${(this.props.decision)} gv-${(camelparty)} gv-hatch-${(this.props.hatch)}`} style={this.props.style} />
    )
  }
}

export default class Snap extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const division = this.props.divisions;
    var allvotes = division.ayesCount + division.noesCount;

    //var finishlinepercent = `${100 * (division.ayesCount / allvotes)}%`
    var ayesBars = [];
    var noesBars = [];
    var hatchBars = [];

    var ayesLeft = 100 * (division.noesCount / allvotes)

    division.ayesByParty.forEach((p, i) => {
      p.width = 100 * (p.votes / allvotes);
      if (i == 0) {
        p.left = ayesLeft;
      } else {
        p.left = division.ayesByParty[i - 1].left + division.ayesByParty[i - 1].width;
      }
      p.leftstring = `${p.left}%`;
      p.widthstring = `${p.width}%`;
      p.style = {
        x: p.leftstring,
        width: p.widthstring
      }
      ayesBars.push(<Bar key={'aye' + p.party} hatch={false} decision={'for'} party={p.party} count={p.votes} style={p.style} />)
      hatchBars.push(<Bar key={'hatch' + p.party} hatch={true} decision={'for'} party={p.party} count={p.votes} style={p.style}/>)
    })

    division.noesByParty.forEach((p, i) => {
      p.width = 100 * (p.votes / allvotes);
      if (i == 0) {
        p.left = 0;
      } else {
        p.left = division.noesByParty[i - 1].width + division.noesByParty[i - 1].left;
      }
      p.leftstring = `${p.left}%`;
      p.widthstring = `${p.width}%`;
      p.style = {
        x: p.leftstring,
        width: p.widthstring
      }
      noesBars.push(<Bar key={'aye' + p.party} hatch={false} decision={'for'} party={p.party} count={p.votes} style={p.style} />)
    })

    return (
      <div className="gv-bbv-snap">
        <a className='gv-snap__link' href="https://gu.com/p/a5f4a?CMP=snap">How your MP voted on the Brexit withdrawal deal</a>

        <div className="gv-snap-title">MPs defeated May's deal by XX votes</div>
        <div className="gv-tranches">
          <div className="gv-snap-noes gv-tranche"><div className="gv-label gv-against">Against</div><div className="gv-count">{division.noesCount}</div></div>
          <div className="gv-snap-ayes gv-tranche"><div className="gv-label gv-for">For</div><div className="gv-count">{division.ayesCount}</div></div>
        </div>

        <div className="gv-bars">
          <div className="gv-markers">
            <div className="gv-halfway-line"></div>
            <div className="gv-halfway-label">50%</div>

          </div>
          <svg className="gv-bars-svg">            <defs>
            <pattern id="for-hatch" patternUnits="userSpaceOnUse" width="6" height="6">
              <rect width="6" height="6" className='gv-for__rect'></rect>
              <path d="M-1,1 l2,-2 M0,6 l6,-6 M5,7 l2,-2" className='gv-for__path'></path>
            </pattern>
          </defs>{ayesBars}{hatchBars}{noesBars}</svg>

        </div>
        <div className="gv-sell">
          <h3 className='gv-sell-label'>Full voting records for all MPs
                        <div className='gv-sell__button'>
              <svg className='mt-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M38.65 25.58L37 27.21 26.79 37.44l-1.1-1.11 8.53-10.19H12.5v-2.28h21.72l-8.53-10.19 1.1-1.1L37 22.79l1.63 1.63v1.16z" /></svg>
            </div>
          </h3>
        </div>


      </div>
    )
  }
}