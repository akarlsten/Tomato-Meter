# boot.py - - runs on boot-up

from machine import ADC
from machine import Pin
from dth import DTH
import pycom
import time
import ujson

pycom.heartbeat(False)

adc = ADC(bits=12)

soilmoisture_pin = adc.channel(pin='P20', attn=ADC.ATTN_11DB)  # works
temp_and_humidity = DTH(Pin('P22', mode=Pin.OPEN_DRAIN), 0)

i = 0

while i < 3:
    i += 1
    pycom.rgbled(0x101000)  # yellow
    soil_moisture = soilmoisture_pin()
    time.sleep(2)
    result = temp_and_humidity.read()
    time.sleep(3)
    if result.is_valid():
        pycom.rgbled(0x001000)  # green
        results = {
            "timestamp": 0,
            "temperature": result.temperature,
            "humidity": result.humidity,
            "soilMoisture": soil_moisture
        }
        jsonString = ujson.dumps(results)
        print(jsonString)
        time.sleep(1)
    else:
        print("Result invalid!")
        pycom.rgbled(0xFF0000)

    pycom.rgbled(0x000000)
    time.sleep(5)
