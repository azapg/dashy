import React, {useEffect} from "react";
import {TemperatureDataPoint} from "@/experiments/temperature/columns";

// TODO: When getting last minute time series data, this should use a circular buffer
// TODO: There should be an option to get aggregated data to show historical data
export const useWebSocketData = () => {
  const [data, setData] = React.useState<TemperatureDataPoint[]>([])
  const DASHY_SERVER_URL = process.env.NEXT_PUBLIC_DASHY_SERVER_URL;

  if(!DASHY_SERVER_URL) {
    throw new Error("No DASHY_SERVER_URL provided");
  }

  useEffect(() => {
    const ws = new WebSocket(DASHY_SERVER_URL);
    ws.onopen = () => { console.log('Connected to Dashy server') }
    ws.onclose = () => { console.log('Disconnected from Dashy server') }

    ws.onmessage = (event: MessageEvent) => {
      setData(data => [...data, JSON.parse(event.data)])
    }

    return () => { ws.close() }
  }, [DASHY_SERVER_URL])

  return data;
}