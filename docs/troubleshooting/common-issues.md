---
sidebar_position: 1
---

# Common issues

## The app opens empty

This is normal on a clean install. Import event data in **Event** and choose or create a template in **Certificate Studio**.

## macOS blocks the app

The beta is unsigned. Open **System Settings > Privacy & Security** and allow the app to run if the build came from a trusted project source.

## Windows SmartScreen appears

The beta installer is unsigned. Choose **More info > Run anyway** only if the installer came from a trusted project source.

## Offline OVS discovery finds nothing

Check that:

- The computer is on the same local network as the OVS server.
- The OVS server is running.
- Port `9002` is reachable.
- Local firewall rules allow the connection.

If discovery still fails, enter the OVS base URL manually.

## Preview PDF is unavailable

Check that:

- Event data is imported.
- A certificate template is active, for certificate output.
- The selected scope contains printable rows.
- The Typst renderer is healthy.

## Printed content is shifted

Use print calibration and confirm that the printer is not scaling the PDF unexpectedly.

## A saved PDF already exists

When a naming conflict occurs, choose **Save copy** to keep the existing file or **Overwrite** to replace it.
