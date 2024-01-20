#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include "LedControlLogic.h"

const char *ssid = "Airtel_raja_1008";
const char *password = "air52023";
const String apiEndpoint = "http://192.168.1.13:8000/api/v1/data";  // Update the endpoint accordingly

float temperature = 15.5;
float humidity = 20.0;

int mode = 0; // Initialize mode to 0 (not set)

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize LED pins
  setupLedPins();
}

void loop() {
  // Check if the mode is not set or the user requested a mode change
  if (mode == 0 || Serial.find("select")) {
    // Ask the user to select the mode via Serial Monitor
    Serial.println("Select mode: 1 (SEND_DATA) or 2 (RECEIVE_DATA)");
    while (!Serial.available()) {
      // Wait for user input
    }

    int selectedMode = Serial.parseInt();

    if (selectedMode == 1 || selectedMode == 2) {
      // Set the mode only if it's a valid mode (1 or 2)
      mode = selectedMode;
    } else {
      Serial.println("Invalid mode selected");
      return; // Skip the rest of the loop if an invalid mode is selected
    }
  }

  // Execute the corresponding logic based on the selected mode
  if (mode == 1) {
    // SEND_DATA mode
    // Simulate temperature and humidity data
    temperature++;
    humidity++;

    // Create JSON payload matching the specified format
    String payload = "{"
                     "\"boardId\":\"esp32_123\","
                     "\"serialId\":\"abc123\","
                     "\"apikey\":\"secretapikey\","
                     "\"dataParams\":\"temperature:humidity\","
                     "\"action\":\"SEND_DATA\","
                     "\"deviceSpecificData\":{"
                     "\"temperature\":" + String(temperature) + ","
                     "\"humidity\":" + String(humidity) +
                     "}"
                     "}";
    // Send POST request to the API endpoint
    sendData(payload);
  } else if (mode == 2) {
    // RECEIVE_DATA mode
    // Fetch the latest RECEIVE_DATA from the server
    String receivedPayload = getLatestReceiveData();
    // Process received data
    processReceivedData(receivedPayload);
  }

  delay(1000);  // Adjust delay as needed
}

void sendData(String payload) {
  // Create a WiFi client
  WiFiClient client;

  // Send POST request to the API endpoint
  HTTPClient http;
  http.begin(client, apiEndpoint + "/send/65a430160213ac4dea3ef405"); // Update the endpoint accordingly
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("HTTP Request failed: ");
    Serial.println(http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}

void processReceivedData(String receivedPayload) {
  // Parse and process received JSON payload
  // Extract data from receivedPayload using JSON parsing libraries

  // Example: Extracting port, value, and mode
  int port = 0;
  int value = 0;
  int mode = 0;

  // Parse receivedPayload and populate port, value, and mode variables
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, receivedPayload);

  if (error) {
    Serial.print("JSON parsing failed: ");
    Serial.println(error.c_str());
    return;
  }

  // Extract data from JSON document
  port = doc["data"]["deviceSpecificData"]["port"].as<int>();
  value = doc["data"]["deviceSpecificData"]["value"].as<int>();
  mode = doc["data"]["deviceSpecificData"]["mode"].as<int>();

  int result = controlLeds(port, value, mode);
  if(result == 1){
    Serial.println("Red LED is ON");
  }else if(result == 2){
    Serial.println("Yellow LED is ON");
  }
  else if(result == 3){
    Serial.println("Green LED is ON");
  }
  else{
    Serial.println("Invalid");
  }



  // Example: Manipulate NodeMCU I/O pins based on received data
  // if (mode == 0) {
  //   Serial.println("Setting NodeMCU pin to INPUT mode with specific port and value");
  //   // Implement your logic to set the NodeMCU pin to INPUT mode
  //   Serial.print("Port:Value:Mode = ");
  //   Serial.print(port);
  //   Serial.print(":");
  //   Serial.print(value);
  //   Serial.print(":");
  //   Serial.println(mode);
  // } else {
  //   Serial.println("mode");
  //   Serial.print(mode);
  //   Serial.println("");
  //   Serial.println("Handling other modes accordingly");
  //   // Implement logic for other modes
  // }
}

String getLatestReceiveData() {
  // Create a WiFi client
  WiFiClient client;

  // Send GET request to the API endpoint
  HTTPClient http;
  http.begin(client, apiEndpoint + "/receive/65a430160213ac4dea3ef405/secretapikey"); // Update the endpoint accordingly

  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    // Read the response
    String response = http.getString();
    return response;
  } else {
    Serial.print("HTTP Request failed: ");
    Serial.println(http.errorToString(httpResponseCode).c_str());
    // Return an empty string in case of failure
    return "";
  }
}
