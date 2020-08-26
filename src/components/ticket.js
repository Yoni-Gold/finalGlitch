import React , {useState} from 'react';

function Ticket(params)
{
    const [displayText , setDisplayText] = useState("none");

    const showText = () => {displayText === "none" ? setDisplayText("block") : setDisplayText("none")};

    return (<div className="ticket" onClick={showText} >
            
            <button className="hideTicketButton" onClick={(e) => {e.stopPropagation(); params.hide(params.ticket);}}>hide</button>

            <div className="smallText">{params.ticket.id}</div>

            <div className="smallText"> ticket by {params.ticket.userEmail} at {(new Date(params.ticket.creationTime)).toString().slice(4, 24)}</div>

            <h2>{params.ticket.title}</h2>

            <p style={{display: displayText}}>{params.ticket.content}</p>

            <div className="smallText">{params.ticket.labels && params.ticket.labels.map((element , index) => {
                if (index === 0)
                {
                    return <span className="label" key={index}>{element}</span>
                }

                else
                {
                    return <span className="label"  key={index}> | {element}</span>
                }
            })}</div>

            </div>);
}

export default Ticket;