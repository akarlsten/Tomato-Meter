""" # boot.py - - runs on boot-up
import pycom
import time
from machine import enable_irq, disable_irq, Pin, ADC


class DTHResult:
    'DHT sensor result returned by DHT.read() method'

    ERR_NO_ERROR = 0
    ERR_MISSING_DATA = 1
    ERR_CRC = 2

    error_code = ERR_NO_ERROR
    temperature = -1
    humidity = -1

    def __init__(self, error_code, temperature, humidity):
        self.error_code = error_code
        self.temperature = temperature
        self.humidity = humidity

    def is_valid(self):
        return self.error_code == DTHResult.ERR_NO_ERROR


class DTH:
    'DHT sensor (dht11, dht21,dht22) reader class for Pycom'

    # __pin = Pin('P3', mode=Pin.OPEN_DRAIN)
    __dhttype = 0

    def __init__(self, pin, sensor=0):
        self.__pin = pin
        self.__dhttype = sensor
        self.__pin(1)
        time.sleep(1.0)

    def read(self):
        # time.sleep(1)

        # send initial high
        # self.__send_and_sleep(1, 0.025)

        # pull down to low
        self.__send_and_sleep(0, 0.019)

        # collect data into an array
        data = self.__collect_input()
        # print(data)
        # parse lengths of all data pull up periods
        pull_up_lengths = self.__parse_data_pull_up_lengths(data)
        # if bit count mismatch, return error (4 byte data + 1 byte checksum)
        # print(pull_up_lengths)
        # print(len(pull_up_lengths))
        if len(pull_up_lengths) != 40:
            return DTHResult(DTHResult.ERR_MISSING_DATA, 0, 0)

        # calculate bits from lengths of the pull up periods
        bits = self.__calculate_bits(pull_up_lengths)

        # we have the bits, calculate bytes
        the_bytes = self.__bits_to_bytes(bits)
        # print(the_bytes)
        # calculate checksum and check
        checksum = self.__calculate_checksum(the_bytes)
        if the_bytes[4] != checksum:
            return DTHResult(DTHResult.ERR_CRC, 0, 0)

        # ok, we have valid data, return it
        [int_rh, dec_rh, int_t, dec_t, csum] = the_bytes
        if self.__dhttype == 0:  # dht11
            rh = int_rh  # dht11 20% ~ 90%
            t = int_t  # dht11 0..50°C
        else:
            rh = ((int_rh * 256) + dec_rh)/10
            t = (((int_t & 0x7F) * 256) + dec_t)/10
        if (int_t & 0x80) > 0:
            t *= -1
        return DTHResult(DTHResult.ERR_NO_ERROR, t, rh)

    def __send_and_sleep(self, output, mysleep):
        self.__pin(output)
        time.sleep(mysleep)

    def __collect_input(self):
        # collect the data while unchanged found
        unchanged_count = 0
        # this is used to determine where is the end of the data
        max_unchanged_count = 100
        last = -1
        data = []
        # needs long sample size to grab all the bits from the DHT
        m = bytearray(800)
        irqf = disable_irq()
        self.__pin(1)
        for i in range(len(m)):
            m[i] = self.__pin()  # sample input and store value
        enable_irq(irqf)
        for i in range(len(m)):
            current = m[i]
            data.append(current)
            if last != current:
                unchanged_count = 0
                last = current
            else:
                unchanged_count += 1
                if unchanged_count > max_unchanged_count:
                    break
        # print(data)
        return data

    def __parse_data_pull_up_lengths(self, data):
        STATE_INIT_PULL_DOWN = 1
        STATE_INIT_PULL_UP = 2
        STATE_DATA_FIRST_PULL_DOWN = 3
        STATE_DATA_PULL_UP = 4
        STATE_DATA_PULL_DOWN = 5

        state = STATE_INIT_PULL_UP

        lengths = []  # will contain the lengths of data pull up periods
        current_length = 0  # will contain the length of the previous period

        for i in range(len(data)):

            current = data[i]
            current_length += 1

            if state == STATE_INIT_PULL_DOWN:
                if current == 0:
                    # ok, we got the initial pull down
                    state = STATE_INIT_PULL_UP
                    continue
                else:
                    continue
            if state == STATE_INIT_PULL_UP:
                if current == 1:
                    # ok, we got the initial pull up
                    state = STATE_DATA_FIRST_PULL_DOWN
                    continue
                else:
                    continue
            if state == STATE_DATA_FIRST_PULL_DOWN:
                if current == 0:
                    # we have the initial pull down, the next will be the data pull up
                    state = STATE_DATA_PULL_UP
                    continue
                else:
                    continue
            if state == STATE_DATA_PULL_UP:
                if current == 1:
                    # data pulled up, the length of this pull up will determine whether it is 0 or 1
                    current_length = 0
                    state = STATE_DATA_PULL_DOWN
                    continue
                else:
                    continue
            if state == STATE_DATA_PULL_DOWN:
                if current == 0:
                    # pulled down, we store the length of the previous pull up period
                    lengths.append(current_length)
                    state = STATE_DATA_PULL_UP
                    continue
                else:
                    continue

        return lengths

    def __calculate_bits(self, pull_up_lengths):
        # find shortest and longest period
        shortest_pull_up = 1000
        longest_pull_up = 0

        for i in range(0, len(pull_up_lengths)):
            length = pull_up_lengths[i]
            if length < shortest_pull_up:
                shortest_pull_up = length
            if length > longest_pull_up:
                longest_pull_up = length

        # use the halfway to determine whether the period it is long or short
        halfway = shortest_pull_up + (longest_pull_up - shortest_pull_up) / 2
        bits = []

        for i in range(0, len(pull_up_lengths)):
            bit = False
            if pull_up_lengths[i] > halfway:
                bit = True
            bits.append(bit)

        return bits

    def __bits_to_bytes(self, bits):
        the_bytes = []
        byte = 0

        for i in range(0, len(bits)):
            byte = byte << 1
            if (bits[i]):
                byte = byte | 1
            else:
                byte = byte | 0
            if ((i + 1) % 8 == 0):
                the_bytes.append(byte)
                byte = 0
        # print(the_bytes)
        return the_bytes

    def __calculate_checksum(self, the_bytes):
        return the_bytes[0] + the_bytes[1] + the_bytes[2] + the_bytes[3] & 255


pycom.heartbeat(False)
pycom.rgbled(0x000008)  # blue
th = DTH(Pin('P23', mode=Pin.OPEN_DRAIN), 0)

button = Pin('P22', mode=Pin.IN)
throttle = False

while True:
    if(button() == 0 & throttle == False):
        pycom.rgbled(0x7f7f00)
        throttle = True
        time.sleep(2)
        result = th.read()

        if result.is_valid():
            pycom.rgbled(0x001000)  # green
            print("Temperature: %d C" % result.temperature)
            print("Humidity: %d %%" % result.humidity)
        else:
            pycom.rgbled(0x7f0000)

    throttle = False
 """
# BEGIN HUMIDITY SENSOR
# END LIGHT SENSOR

""" from machine import ADC

adc = ADC(bits=12)

apin = adc.channel(pin='P20', attn=ADC.ATTN_11DB)  # works

while True:
    print(apin())
 """
# END HUMIDITY
# BEGIN LIGHT

""" # tsl2591 lux sensor interface

from machine import I2C, Pin
VISIBLE = 2
INFRARED = 1
FULLSPECTRUM = 0

ADDR = 0x29
READBIT = 0x01
COMMAND_BIT = 0xA0
CLEAR_BIT = 0x40
WORD_BIT = 0x20
BLOCK_BIT = 0x10
ENABLE_POWERON = 0x01
ENABLE_POWEROFF = 0x00
ENABLE_AEN = 0x02
ENABLE_AIEN = 0x10
CONTROL_RESET = 0x80
LUX_DF = 408.0
LUX_COEFB = 1.64
LUX_COEFC = 0.59
LUX_COEFD = 0.86

REGISTER_ENABLE = 0x00
REGISTER_CONTROL = 0x01
REGISTER_THRESHHOLDL_LOW = 0x02
REGISTER_THRESHHOLDL_HIGH = 0x03
REGISTER_THRESHHOLDH_LOW = 0x04
REGISTER_THRESHHOLDH_HIGH = 0x05
REGISTER_INTERRUPT = 0x06
REGISTER_CRC = 0x08
REGISTER_ID = 0x0A
REGISTER_CHAN0_LOW = 0x14
REGISTER_CHAN0_HIGH = 0x15
REGISTER_CHAN1_LOW = 0x16
REGISTER_CHAN1_HIGH = 0x17
INTEGRATIONTIME_100MS = 0x00
INTEGRATIONTIME_200MS = 0x01
INTEGRATIONTIME_300MS = 0x02
INTEGRATIONTIME_400MS = 0x03
INTEGRATIONTIME_500MS = 0x04
INTEGRATIONTIME_600MS = 0x05

GAIN_LOW = 0x00
GAIN_MED = 0x10
GAIN_HIGH = 0x20
GAIN_MAX = 0x30


def _bytes_to_int(data):
    return data[0] + (data[1] << 8)


class SMBusEmulator:
    __slots__ = ('i2c',)

    def __init__(self, scl_pinno=10, sda_pinno=9):
        self.i2c = I2C()

    def write_byte_data(self, addr, cmd, val):
        buf = bytes([cmd, val])
        self.i2c.writeto(addr, buf)

    def read_word_data(self, addr, cmd):
        assert cmd < 256
        buf = bytes([cmd])
        self.i2c.writeto(addr, buf)
        data = self.i2c.readfrom(addr, 4)
        return _bytes_to_int(data)


SENSOR_ADDRESS = 0x29


class Tsl2591:
    def __init__(
        self,
        sensor_id,
        integration=INTEGRATIONTIME_100MS,
        gain=GAIN_LOW
    ):
        self.sensor_id = sensor_id
        self.bus = SMBusEmulator()
        self.integration_time = integration
        self.gain = gain
        self.set_timing(self.integration_time)
        self.set_gain(self.gain)
        self.disable()

    def set_timing(self, integration):
        self.enable()
        self.integration_time = integration
        self.bus.write_byte_data(
            SENSOR_ADDRESS,
            COMMAND_BIT | REGISTER_CONTROL,
            self.integration_time | self.gain
        )
        self.disable()

    def set_gain(self, gain):
        self.enable()
        self.gain = gain
        self.bus.write_byte_data(
            SENSOR_ADDRESS,
            COMMAND_BIT | REGISTER_CONTROL,
            self.integration_time | self.gain
        )
        self.disable()

    def calculate_lux(self, full, ir):
        if (full == 0xFFFF) | (ir == 0xFFFF):
            return 0

        case_integ = {
            INTEGRATIONTIME_100MS: 100.,
            INTEGRATIONTIME_200MS: 200.,
            INTEGRATIONTIME_300MS: 300.,
            INTEGRATIONTIME_400MS: 400.,
            INTEGRATIONTIME_500MS: 500.,
            INTEGRATIONTIME_600MS: 600.,
        }
        if self.integration_time in case_integ.keys():
            atime = case_integ[self.integration_time]
        else:
            atime = 100.

        case_gain = {
            GAIN_LOW: 1.,
            GAIN_MED: 25.,
            GAIN_HIGH: 428.,
            GAIN_MAX: 9876.,
        }

        if self.gain in case_gain.keys():
            again = case_gain[self.gain]
        else:
            again = 1.

        cpl = (atime * again) / LUX_DF
        lux1 = (full - (LUX_COEFB * ir)) / cpl

        lux2 = ((LUX_COEFC * full) - (LUX_COEFD * ir)) / cpl

        return max([lux1, lux2])

    def enable(self):
        self.bus.write_byte_data(
            SENSOR_ADDRESS,
            COMMAND_BIT | REGISTER_ENABLE,
            ENABLE_POWERON | ENABLE_AEN | ENABLE_AIEN
        )

    def disable(self):
        self.bus.write_byte_data(
            SENSOR_ADDRESS,
            COMMAND_BIT | REGISTER_ENABLE,
            ENABLE_POWEROFF
        )

    def get_full_luminosity(self):
        self.enable()
        time.sleep(0.120*self.integration_time+1)
        full = self.bus.read_word_data(
            SENSOR_ADDRESS, COMMAND_BIT | REGISTER_CHAN0_LOW
        )
        ir = self.bus.read_word_data(
            SENSOR_ADDRESS, COMMAND_BIT | REGISTER_CHAN1_LOW
        )
        self.disable()
        return full, ir

    def get_luminosity(self, channel):
        full, ir = self.get_full_luminosity()
        if channel == FULLSPECTRUM:
            return full
        elif channel == INFRARED:
            return ir
        elif channel == VISIBLE:
            return full - ir
        else:
            return 0

    def sample(self):
        full, ir = self.get_full_luminosity()
        return self.calculate_lux(full, ir)


tsl = Tsl2591(1, 0x00, 0x20) """


from machine import I2C
i2c = I2C(0, pins=('P9', 'P10'))
i2c.init(I2C.MASTER, baudrate=100000)
data = i2c.scan()
print(str(data))
