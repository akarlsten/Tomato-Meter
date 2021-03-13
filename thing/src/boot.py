from network import WLAN
import machine
import pycom
pycom.heartbeat(False)

wlan = WLAN()

wlan.init(mode=WLAN.STA)

nets = wlan.scan()

for net in nets:
    if net.ssid == 'Adam & Emma':
        print('Network found!')
        wlan.connect(net.ssid, auth=(WLAN.WPA2, 'Diskmaskin1'), timeout=5000)
        while not wlan.isconnected():
            machine.idle()  # save power while waiting
        print('WLAN connection succeeded!')
        break
