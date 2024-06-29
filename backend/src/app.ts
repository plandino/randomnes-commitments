import { fetchBeacon, HttpCachingChain, HttpChainClient } from 'drand-client';
import express from 'express';


const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const chain = new HttpCachingChain('https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971');
  const client = new HttpChainClient(chain);
  const latestBeacon = await fetchBeacon(client);
  res.send(`The latest beacon is ${latestBeacon.randomness}`);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});