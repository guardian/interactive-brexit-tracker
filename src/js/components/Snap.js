import React, { Component } from 'react'


class Bar extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    return (<div className="gv-bar"></div>)
  }
}

export default class Snap extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const division = this.props.divisions;  

    var ayesBars = []
    for (var prop in ayesByParty) {
      ayesBars.push(<Bar party={prop} count={ayesByParty[prop]}/>)
    } 

    return (
<div className="gv-bbv-snap">
<div className="gv-snap-title">How they voted</div>
<div className="gv-snap-ayes">Ayes: {division.ayesCount}</div>
<div className="gv-snap-noes">Noes: {division.noesCount}</div> 
<div className="gv-bars">{}



<div></div>

</div>
</div>
)
  }
}