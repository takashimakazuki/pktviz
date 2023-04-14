export type PcapLog = {
    "_index": string, // packets-2023-01-13
    "_type": string,
    "_score": any,
    "_source": {
      "layers": {
        "frame.time_epoch": string[], // ["1673536533.195863000"]
        "ip.src": string[],
        "ip.dst": string[],
        "tcp.srcport": string[],
        "tcp.dstport": string[]
      }
    }
};

export type PacketLog = { src: string, dst: string, timestamp: number };


export const convertPktLog = (pcaplogs: PcapLog[]): PacketLog[] => {
    return pcaplogs.map(pcaplog => {
        return {
            src: pcaplog._source.layers["ip.src"][0],
            dst: pcaplog._source.layers["ip.dst"][0],
            timestamp: parseFloat(pcaplog._source.layers["frame.time_epoch"][0])
        }
    })
    
}