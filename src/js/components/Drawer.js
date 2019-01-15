import React from 'react'

const Drawer = ({ isOpen, votes }) => isOpen ?
  <div className="gv-drawer" >
    <div className='gv-bold'>Amendments</div>
    {
      votes.map((d, i) => <div className='drawer-vote' key={'drawer-vote-' + i}>{d.glossTitle} - <div className='gv-bold'>{d.vote}{d.teller ? '*' : ''}</div></div>)
    }
  </div> : null

export default Drawer