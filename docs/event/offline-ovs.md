---
sidebar_position: 3
---

# Offline OVS servers

Use **Offline OVS** when Sporttech OVS is running on a local event network and exposes HTTP data on port `9002`.

## Discover a local server

1. Connect the computer to the same local network as the OVS server.
2. Open **Event**.
3. Select **Offline OVS**.
4. Click **Discover OVS Server**.
5. Choose a detected candidate.

Detected candidates show the event title, base URL, and counts for performances, competitions, stages, and frames.

## Enter a known URL

If discovery does not find the server, enter the OVS base URL manually, for example:

```text
http://192.168.1.20:9002/
```

Then click **Import Offline OVS**.

## Refresh offline data

Click **Refresh Offline Data** to reload the latest data from the selected local server.

Direct `event.j3` import is not currently available. Use the running OVS server or a Sporttech Excel export instead.
