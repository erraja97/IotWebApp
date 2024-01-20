// LedLogic.c

#include "LedControlLogic.h"

// Define your LED pins
const int ledPin1 = D1;
const int ledPin2 = D2;
const int ledPin3 = D3;

void setupLedPins() {
  // Initialize LED pins
  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(ledPin3, OUTPUT);
}

int controlLeds(int port, int value, int mode) {
  int selectLed = 0;

  if(port == 1 && mode == 0){
    selectLed = 1;
  }else if(port == 2 && mode == 0){
    selectLed = 2;
  }else if(port == 3  && mode == 0){
    selectLed = 3;
  }


  // Implement your LED control logic based on the received mode
  switch (selectLed) {
    case 1:
      // Turn on LED 1
      digitalWrite(ledPin1, value);
      digitalWrite(ledPin2, !value);
      digitalWrite(ledPin3, !value);
     
      return 1;
    case 2:
      // Turn on LED 2
      digitalWrite(ledPin1, !value);
      digitalWrite(ledPin2, value);
      digitalWrite(ledPin3, !value);
     
      return 2;
    case 3:
      // Turn on LED 3
      digitalWrite(ledPin1, !value);
      digitalWrite(ledPin2, !value);
      digitalWrite(ledPin3, value);
     
      return 3;
    default:
      // Turn off all LEDs if an invalid mode is received
      digitalWrite(ledPin1, LOW);
      digitalWrite(ledPin2, LOW);
      digitalWrite(ledPin3, LOW);
      return 0;
  }
}
