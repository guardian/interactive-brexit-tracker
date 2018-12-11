import React from 'react'

const Drawer = ({ isOpen, votes }) => isOpen ?
  <div className="gv-drawer" >
    <strong>Previous amendments</strong>
    {
      votes.map((d, i) => <div className='drawer-vote' key={'drawer-vote-' + i}>{d.glossTitle} - <strong>{d.vote}{d.teller ? '*' : ''}</strong></div>)
    }
  </div> : null

export default Drawer