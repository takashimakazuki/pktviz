import json
import random


def get_node():
    src = random.randint(1, 4)
    dst = src
    while dst == src:
        dst = random.randint(1, 4)
    return f's{src}', f's{dst}'


base_time = 1670170000
logs = []
for i in range(100):
    s, d = get_node()
    logs.append({
        'src': s,
        'dst': d,
        'timestamp': base_time + random.randint(0, 50) + i*50
    })

print(logs)
res = json.dumps(logs)

with open("sample_packet_log.json", 'w') as f:
    f.write(res)
