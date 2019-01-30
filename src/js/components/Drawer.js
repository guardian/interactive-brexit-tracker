import React from 'react'

const Drawer = ({ member, isOpen, votes }) => 
  <div className="gv-drawer" >
    <div className="gv-vote-history-wrapper">
    {/*<div>Brexit voting record</div>
    <div className="gv-vote-history-labels"><div className="gv-vote-history-label gv-pro-may">With Gvt.</div>
    <div className="gv-vote-history-label gv-against-may">Against Gvt.</div>
    </div>
    */}
    <div className='gv-vote-history-title'>Brexit voting record</div>
    <div className="gv-vote-history">
    {
      votes.map((d,i) => {
        function getMayCategory(vote) {
          if (vote.vote !== 'For' && vote.vote !== 'Against') {
            return "gv-did-not-vote"
          }
          else if (vote.vote == vote.ayeWithGvt) {
            return "gv-pro-may"
          } else {return "gv-anti-may"}
        }
        return <div className={`gv-vote-blob ${getMayCategory(d)}`}>{i + 1}</div> 
      })
    }
    
    </div>
    </div>
  </div> 

export default Drawer