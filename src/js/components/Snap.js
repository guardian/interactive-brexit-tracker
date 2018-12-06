import React, { Component } from 'react'


class Bar extends Component {

  constructor(props) {
    super(props)
  }


  render() {

    var percentwidth = `${this.props.width}%`

    return (<div className={`gv-bar gv-${(this.props.decision)} gv-${(this.props.party)}`} style={{width: percentwidth}}></div>)
  }
}

export default class Snap extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const division = this.props.divisions;  
    var allvotes = division.ayesCount + division.noesCount;
    

    var ayesBars = [];
    var noesBars = [];
    for (var prop in division.ayesByParty) {
      ayesBars.push(<Bar key={'aye' + prop} decision={'for'} party={prop} count={division.ayesByParty[prop]} width={100 * (division.ayesByParty[prop] / allvotes)}/>)
    } 
    for (var prop in division.noesByParty) {
      noesBars.push(<Bar key={'no' + prop} decision={'against'} party={prop} count={division.noesByParty[prop]} width={100 * (division.ayesByParty[prop] / allvotes)}/>)
    } 



    return (
<div className="gv-bbv-snap">
<div className="gv-snap-title">How they voted</div>
<div className="gv-snap-ayes">Ayes: {division.ayesCount}</div>
<div className="gv-snap-noes">Noes: {division.noesCount}</div> 
<div className="gv-bars">

<div className="gv-ayesBars">{ayesBars}</div>



<div></div>

</div>
</div>
)
  }
}