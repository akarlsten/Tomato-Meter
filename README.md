# Tomato-Meter

## Project description

This website will allow you to check up on one of the cherry tomato plants in my windowsill. We keep track of the air temperature, humidity, soil moisture and light levels and present it as graphs.

#### Thing

The thing is a LoPy4 hooked up with 3 sensors:

- DHT11 - Temperature/Humidity Sensor
- TSL2591 - Light Sensor
- VMA303 - Soil Moisture Sensor

The LoPy4 takes measurements every 30 minutes from all sensors, the data is collated into a JSON object which is sent via HTTP POST request over my home WiFi to my API. We've built in solid error-handling to make sure everything is retried on errors, in the worst case the LoPy4 will reset entirely to re-try. This should ensure reliable performance.

Since the device will always be in my windowsill (or at least in my home), I felt there was no need to make use of LoRa/MQTT/Sigfox or other low-powered communication methods, it will always have access to WiFi and it will always have USB power.

#### API

The API is a basic express application hooked up to a Mongo database, we receive post requests from the thing and save these. Post requests are authenticated via a (shitty) token method, the same token is saved as an environment variable on the server and hardcoded on the LoPy, these are compared to ensure we're talking to our device (the API is also on HTTPS).

When queried the API automatically sends back the last 7 days of data, but with the option (query param) to set a custom start date.

Also on the API-side we added the W3C Web Thing Description, this is accessible via the endpoint https://tomato-meter.herokuapp.com/thing - Since the API is the only access point the rest of the world has to the web thing, it made sense to place the thing description there.

#### Client

The client is a Next.js React application using the Nivo library for graphing. Nothing super special here, but we make use of Next.js's Incremental Static Regeneration to make load times fast - the page is statically generated as HTML at build time, and at regular intervals (600 seconds) new visitors will cause the app to re-generate the static information, ensuring an up-to-date page. This is also supplemented by client-side fetching via the SWR library, to ensure everyone both gets super-fast load times as well as the latest data.

### Functionality

- [Client Page](https://tomato.adamkarlsten.com)
- [API root](https://tomato-meter.herokuapp.com)
- [Thing description endpoint](https://tomato-meter.herokuapp.com/thing)
- [Youtube Recording](https://youtu.be/v0gZ23Ho6Tc)

### Group/individual reflection

_Your thoughts on the assignment. What was hard, what have you learned? What could you have done differently?_

A very fun assignment, I've had to learn a lot about the IoT-sphere and working with things "closer to the metal". I even had to solder one of my sensors! Redoing the assignment I probably would've gone for an Arduino instead of a Pycom device - the Pycom documentation is sparse and a bit shitty and their forum is unreadably bad (posts are in reverse chronological order AND they have reply threading for some godforsaken reason). While with Arduino it may be slightly harder to code in C than Micropython, there are also a million examples online for basically anything you might want to do.

### Further improvements

_Further improvements of the assignment. What could you have done but did not have the time to complete?_

The code quality is overall perhaps not great (more of a working first-draft), I would have liked to do a bit of refactoring, especially for the client application. I would also have liked to write a more proper token authentication scheme for the api-thing communication - perhaps have the LoPy send a login request every time it boots and then store a resulting token in memory for subsequent requests. Especially if I would like to expand the system with more units later.

Finally, I would have liked to expand the system with either automatic alerts when the soil moisture is "too low" (easy and probably something I'll do after current deadlines) or automatic watering via pump and reservoir (harder and frankly a bit expensive).

### Extras

_Motivate why your application should be granted a higher grade. Descibe things like how you implement W3C WoT Thing Description Specification._
I think my presentation in terms of the UI is very nice, it's very easy to at a glance see what's up with the tomato. The Thing Description is also accurate and conforms to the specification as far as possible - I imagine it makes more sense as a concept when you're publishing data to something like a public MQTT server, but nonetheless it is available.
