// LedControlLogic.h

#ifndef LedControlLogic_h
#define LedControlLogic_h

#include <Arduino.h>

void setupLedPins();
int controlLeds(int port, int value, int mode);

#endif
