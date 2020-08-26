const express = require('express');

const app = express();
const path = './data.json';

app.use(express.json());
const fs = require('fs');

function checkHttps(request, response, next) {
  // Check the protocol — if http, redirect to https.
  if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    response.redirect("https://" + request.hostname + request.url);
  }
}

app.all("*", checkHttps)


app.use(express.static(path.join(__dirname, '../src/index.js')));

const dataJSON = JSON.parse(fs.readFileSync(path));

app.get('/api/tickets', (req, res) => { // returns all of the tickets or a selected group based on the query parameters
  if (req.query.searchText) {
    const selectedTickets = dataJSON.filter((element) => element.title.toLowerCase().indexOf(req.query.searchText.toLowerCase()) >= 0);
    res.send(selectedTickets);
  } else {
    res.send(dataJSON);
  }
});

app.post('/api/tickets/:ticketId/done', (req, res) => { // marks a ticket as done
  const index = dataJSON.findIndex((element) => element.id === req.params.ticketId);
  dataJSON[index].done = true;
  fs.writeFile(path, JSON.stringify(dataJSON), () => { console.log('json updated'); });
  res.send('Data Updated');
});

app.post('/api/tickets/:ticketId/undone', (req, res) => { // marks a ticket as undone
  const index = dataJSON.findIndex((element) => element.id === req.params.ticketId);
  dataJSON[index].done = false;
  fs.writeFile(path, JSON.stringify(dataJSON), () => { console.log('json updated'); });
  res.send('Data Updated');
});

let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});


