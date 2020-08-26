import React, {useEffect, useState} from 'react';
import Ticket from './components/ticket';
import axios from 'axios';
import './App.css';

function App() {

  const [tickets , setTickets] = useState([]);

  const [hiddenTickets , setHidden] = useState([]);

  const loadTickets = async () => { // loads the tickets from the server

    let loadedTickets = [];
    let {data} = await axios.get(`/api/tickets`);
    data.forEach((element , index) => {element.column = index % 3; element.hide = false; loadedTickets.push(element)});
    setHidden([]);

    return loadedTickets;
  };

  const searchTask = async (e) => { // the search function
    let {data} = await axios.get(`/api/tickets?searchText=${e.target.value}`);
    let searchedTickets = [];
    data.forEach(element => {      // this forEach checks which of the results are in the hiddenTickets array and hides them
      if (hiddenTickets.map(e => e.id).includes(element.id))
      {element.hide = true}
    });
    data.forEach((element , index) => {element.column = index % 3; searchedTickets.push(element)}); // asigns a column to each reasult (its for the page layout)
    setTickets(searchedTickets);
  };

  const restoreHidden = () => {
    let arr = tickets.slice();
    arr.forEach(element => {element.hide = false}); //sets all the hide valus to false then empties the hiddenTickets array
    setHidden([]);
    setTickets(arr);
  };

  const hideTicket = (ticket) => {
    let arr = tickets.slice();
    arr.forEach(element => {
      if (element.id === ticket.id) // finds the right ticket and hides it
      {
        element.hide = true;
        hiddenTickets.push(element);
      }
    });
    setHidden(hiddenTickets);
    setTickets(arr);
  };
  
  const filteredList = tickets.filter(e => !e.hide); // a filtered list that ignores the hiden tickets
  
  useEffect(() => { // runs the load function on start
    (async () => {
      setTickets(await loadTickets());
    })()
    } , []);

  return (
    <main id="main" hideTicket={hideTicket}>

      <h1>Ticket - Handler</h1>
      
      <div id="subMain">
      <h4>Showing {filteredList.reduce(((counter, element) => {return ++counter}), 0)} tickets ( <span id="hideTicketsCounter">{hiddenTickets.length}</span> are hidden ) </h4>
      <button id="restoreHideTickets" onClick={restoreHidden} className={hiddenTickets.length > 0 ? "restoreAnimation" : ""} style={{display: hiddenTickets.length > 0 ? "block" : "none"}}>restore all hidden</button>
      </div>

      <input placeholder="search a task" id="searchInput" autoComplete="off" onChange={searchTask}></input>

      <div className="ticketFlex">
      <div className="ticketList">{filteredList.map(ticket => { if (ticket.column === 0 && !ticket.hide) {return <Ticket key={ticket.id} hide={hideTicket} ticket={ticket}/>}})}</div>
      <div className="ticketList">{filteredList.map(ticket => { if (ticket.column === 1 && !ticket.hide) {return <Ticket key={ticket.id} hide={hideTicket} ticket={ticket}/>}})}</div>
      <div className="ticketList">{filteredList.map(ticket => { if (ticket.column === 2 && !ticket.hide) {return <Ticket key={ticket.id} hide={hideTicket} ticket={ticket}/>}})}</div>
      </div>
    </main>
  );


}

export default App;
