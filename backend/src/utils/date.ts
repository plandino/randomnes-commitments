import format from 'time-stamp';

export const timeStampToRound = (genesisTimeStamp: number, period: number) => {
    // Get the current epoch time in milliseconds
    const currentEpochMilliseconds: number = Date.now();
    // Convert the current epoch time to seconds
    const currenTimeStamp = Math.floor(currentEpochMilliseconds / 1000);
    // Calculates current round
    return Math.floor((currenTimeStamp - genesisTimeStamp) / period);
}

// Converts a round to a timestamp 
export const roundToTimeStamp = (round: number, period: number, genesisTimeStamp: number) => {
    return Math.floor(round * period + genesisTimeStamp);
}

export const formatTimeStampToDateString = (timeStamp: number) => {
    const date = new Date(timeStamp * 1000);
    return format('YYYY/MM/DD HH:mm:ss', date);
}