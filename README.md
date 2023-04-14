# pktviz

Packet visualizer for analyzing interconnect network traffic.


```bash
tshark -r  <PCAP_FILE> -Y "tcp"  -T json -e frame.time_epoch -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport 
```