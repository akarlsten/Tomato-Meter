import tsl2591
from machine import ADC, Pin
from dth import DTH
import pycom
import time
import ujson
import urequests

pycom.heartbeat(False)

adc = ADC(bits=12)

INTEGRATIONTIME_200MS = 0x01
GAIN_MED = 0x10

light_sensor = tsl2591.Tsl2591(1, INTEGRATIONTIME_200MS, GAIN_MED)
soil_moisture_sensor = adc.channel(pin='P20', attn=ADC.ATTN_11DB)
temp_and_humidity_sensor = DTH(Pin('P22', mode=Pin.OPEN_DRAIN), 0)

while True:
    resultValid = False

    while not resultValid:
        pycom.rgbled(0x101000)  # yellow

        soil_moisture = soil_moisture_sensor()
        time.sleep(2)

        full, ir = light_sensor.get_full_luminosity()
        lux = light_sensor.calculate_lux(full, ir)
        time.sleep(1)

        result = temp_and_humidity_sensor.read()
        time.sleep(3)

        if result.is_valid():
            resultValid = True
            pycom.rgbled(0x001000)  # green

            results = {
                "timestamp": time.time(),
                "lux": lux,
                "temperature": result.temperature,
                "humidity": result.humidity,
                "soilMoisture": soil_moisture
            }

            jsonString = ujson.dumps(results)
            print(jsonString)

            pycom.rgbled(0x000000)
        else:
            print("Result invalid!")
            pycom.rgbled(0xFF0000)

    time.sleep(2)  # 30 minutes
