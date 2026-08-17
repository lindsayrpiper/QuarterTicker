/**
 * Entry point for the web build. Installs the localStorage-backed config
 * bridge, then loads the shared renderer — which drives the exact same setup
 * screen and dashboard as the desktop app.
 *
 * Import order matters: web-api must run first so `window.quarterAPI` exists
 * before renderer.ts calls it on startup.
 */
import './web-api';
import './renderer';
