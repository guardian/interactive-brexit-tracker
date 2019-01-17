import React, { Component } from 'react'


class Bar extends Component {

  constructor(props) {
    super(props)
  }


  render() {

    var percentwidth = `${this.props.width}%`
    console.log(this.props)
    var camelparty = this.props.party.replace(/ /g, "");

    return (<rect className={`gv-bar gv-${(this.props.decision)} gv-${(camelparty)} gv-hatch-${(this.props.hatch)}`} width={this.props.width} x={this.props.x} height="44px" />
    )
  }
}

export default class Snap extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const division = this.props.divisions;

    if (!division || !division.hasData) {
      return ''
    } else


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
        //  x: p.leftstring,
        width: p.widthstring
      }
      ayesBars.push(<Bar key={'aye' + p.party} hatch={false} decision={'for'} party={p.party} count={p.votes} style={p.style} x={p.leftstring} width={p.widthstring} />)
      hatchBars.push(<Bar key={'hatch' + p.party} hatch={true} decision={'for'} party={p.party} count={p.votes} style={p.style} x={p.leftstring} width={p.widthstring} />)
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
      noesBars.push(<Bar key={'aye' + p.party} hatch={false} decision={'for'} party={p.party} count={p.votes} style={p.style} x={p.leftstring} width={p.widthstring} />)
    })

    return (
      <div className="gv-bbv-snap">
        <a className='gv-snap__link' href="https://gu.com/p/af9vp?CMP=snap">How your MP voted on the no-confidence motion</a>

        <div className="gv-snap-title">No-confidence vote result</div>
        <div className="gv-chart-wrapper"> 
          <div className="gv-against-wrapper">

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
              </defs>{noesBars}</svg>

            </div>

            <div className="gv-tranches">
              <div className="gv-snap-noes gv-tranche">
                <div className="gv-count">{division.noesCount - division.noTellersCount}</div>
                <div className="gv-label gv-against">Against</div>
              </div>
            </div>

          </div>

          <div className="gv-for-wrapper">

            <div className="gv-tranches">
              <div className="gv-snap-ayes gv-tranche"><div className="gv-label gv-for">For</div><div className="gv-count">{division.ayesCount - division.ayeTellersCount}</div></div>
            </div>

            <div className="gv-bars">
              <div className="gv-markers">
                <div className="gv-halfway-line"></div>

              </div>
              <svg className="gv-bars-svg">            <defs>
                <pattern id="for-hatch" patternUnits="userSpaceOnUse" width="6" height="6">
                  <rect width="6" height="6" className='gv-for__rect'></rect>
                  <path d="M-1,1 l2,-2 M0,6 l6,-6 M5,7 l2,-2" className='gv-for__path'></path>
                </pattern>
              </defs>{ayesBars}</svg>

            </div>

          </div>

        </div>


        <div className="gv-sell">
          <h3 className='gv-sell-label'>How each MP voted
                        <div className='gv-sell__button'>
              <svg className='mt-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M38.65 25.58L37 27.21 26.79 37.44l-1.1-1.11 8.53-10.19H12.5v-2.28h21.72l-8.53-10.19 1.1-1.1L37 22.79l1.63 1.63v1.16z" /></svg>
            </div>
          </h3>
        </div>


      </div>
    )
  }
}