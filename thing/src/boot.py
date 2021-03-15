from network import WLAN
import machine
import pycom
import time

pycom.heartbeat(False)

wlan = WLAN()
rtc = machine.RTC()

wlan.init(mode=WLAN.STA)

nets = wlan.scan()

for net in nets:
    if net.ssid == 'Adam & Emma':
        print('Network found!')
        wlan.connect(net.ssid, auth=(WLAN.WPA2, 'Diskmaskin1'), timeout=5000)
        while not wlan.isconnected():
            machine.idle()  # save power while waiting
        print('WLAN connection succeeded!')
        rtc.ntp_sync('0.se.pool.ntp.org')
        while not rtc.synced():
            time.sleep(2)
        print('Time synced and set to: %s' % time.time())
        print('Pycom WLAN IP is: %s' % wlan.ifconfig()[0])
        break
