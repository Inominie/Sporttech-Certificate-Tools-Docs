---
sidebar_position: 2
---

# Checking for updates

The desktop app checks for updates at startup. You can also open **Settings → Beta updates → Check for updates**. Installers are available on the [download page](https://inominie.github.io/Sporttech-Certificate-Tools-Docs/download).

The available-update banner also offers a direct download action and opens Settings for progress and installation. You do not need to find the installer manually for a normal supported upgrade.

## Versions with in-app updates

1. Choose **Download update** when a newer version is available. You can continue working during the download and cancel it if needed.
2. The app verifies the downloaded file against signed release information. A failed verification prevents installation.
3. Finish competition work and choose **Restart and install**. Unsaved Studio changes must be saved or discarded, and active operations must finish first. You can cancel the restart.
4. After reopening, check the installed version in Settings.

**Restarting clears the loaded event and manual certificate corrections.** Reload the event afterwards. Saved templates, image/font assets, settings, and saved/printed PDFs remain in their existing locations. Preview PDFs are temporary. An update creates a local backup of templates and settings under `update-backups` in the app's data folder; contact support before restoring it.

Downloads do not install themselves when you normally close the app. Installation always starts with **Restart and install**. An unavailable update service does not prevent competition work.

## First update from an older beta

Older versions only show an update notification. Install the first updater-enabled version manually from the public release page. On Mac, move the app from its DMG into Applications before running it. Subsequent updater-enabled versions use the in-app flow.

## If an update fails

Check your connection and try **Check again**. Keep using the current application if a download or verification fails. Never replace an installer or bypass a signature failure. Windows security policies can still block unsigned Windows installers; ask the club's administrator or contact support. Mac releases supporting this flow are Developer ID signed and notarized.

Include a screenshot of Settings' version/build information and the update error when contacting support. Avoid downgrading: older applications may not support newer template data.
