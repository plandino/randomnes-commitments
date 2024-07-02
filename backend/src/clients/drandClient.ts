import { fetchBeacon, HttpCachingChain, HttpChainClient } from 'drand-client';

export const DrandChain = new HttpCachingChain('https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971');

export const readRandomBeacon = async () => {
    console.log("Reading random beacon from quicknet")
    const client = new HttpChainClient(DrandChain);
    const latestBeacon = await fetchBeacon(client);
    console.log("Retrieved latest random beacon");
    console.log({ latestBeacon });
    return latestBeacon;
  };