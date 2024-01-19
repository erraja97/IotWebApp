#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char *ssid = "YourWiFiSSID";
const char *password = "YourWiFiPassword";
const char *apiEndpoint = "http://192.168.1.13:8000/api/v1/data"; // Update the endpoint accordingly

float temperature = 15.5;
float humidity = 20.0;

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  // Ask the user to select the mode via Serial Monitor
  Serial.println("Select mode: 1 (SEND_DATA) or 2 (RECEIVE_DATA)");
  while (!Serial.available()) {
    // Wait for user input
  }

  int selectedMode = Serial.parseInt();

  if (selectedMode == 1) {
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
  } else if (selectedMode == 2) {
    // RECEIVE_DATA mode

    // Simulate received JSON payload (replace with actual received data)
    String receivedPayload = "{"
                            "\"deviceId\":\"65a3f18fb4916ad393c07e99\","
                            "\"boardId\":\"esp32_123\","
                            "\"serialId\":\"abc123\","
                            "\"apikey\":\"secretapikey\","
                            "\"dataParams\":\"port:value:mode\","
                            "\"action\":\"RECEIVE_DATA\","
                            "\"deviceSpecificData\":{"
                            "\"port\":1,"
                            "\"value\":20,"
                            "\"mode\":\"INPUT\""
                            "}"
                            "}";

    // Process received data
    processReceivedData(receivedPayload);
  } else {
    Serial.println("Invalid mode selected");
  }

  delay(10000);  // Adjust delay as needed
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
  // Adjust this part based on the actual JSON parsing library you're using

  // Example: Extracting port, value, and mode
  int port = 0;
  int value = 0;
  String mode = "";

  // Parse receivedPayload and populate port, value, and mode variables
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, receivedPayload);

  if (error) {
    Serial.print("JSON parsing failed: ");
    Serial.println(error.c_str());
    return;
  }

  // Extract data from JSON document
  port = doc["deviceSpecificData"]["port"];
  value = doc["deviceSpecificData"]["value"];
  mode = doc["deviceSpecificData"]["mode"];

  // Example: Manipulate NodeMCU I/O pins based on received data
  if (mode == "INPUT") {
    Serial.println("Setting NodeMCU pin to INPUT mode with specific port and value");
    // Implement your logic to set the NodeMCU pin to INPUT mode
  } else {
    Serial.println("Handling other modes accordingly");
    // Implement logic for other modes
  }
}

