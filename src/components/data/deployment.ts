import { server$ } from "@builder.io/qwik-city";

interface StartupState {
  timestamp: null | number;
}

const STARTUP_STATE: StartupState = {
  timestamp: null,
};

export const getDeploymentTimestamp = server$(function (): number {
  if (STARTUP_STATE.timestamp === null) {
    STARTUP_STATE.timestamp = new Date().getTime();
  }
  return STARTUP_STATE.timestamp;
});
