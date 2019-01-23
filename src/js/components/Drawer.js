import React from 'react'


const Drawer = ({ isOpen, votes }) => isOpen ?
  <div className="gv-drawer" >
    <div className='gv-bold'>Amendments</div>
    {
      votes.map((d, i) => <div className='drawer-vote' key={'drawer-vote-' + i}><span className="gv-vote-number">{i+1}</span> {d.glossText} - {d.gloss} <div className='gv-bold'>{d.vote}{d.teller ? '*' : ''}</div></div>)
    }
    <div className="gv-vote-history-wrapper">
    <div className="gv-vote-history-labels"><div className="gv-vote-history-label gv-pro-may">With May</div>
    <div className="gv-vote-history-label gv-against-may">Against May</div>
    </div>
    <div className="gv-vote-history">
    {
      votes.map((d,i) => {
        console.log(d);
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
    <div className="gv-constituency-data">CONSTITUENCY DATA GOES HERE</div>

  </div> : null

export default Drawer