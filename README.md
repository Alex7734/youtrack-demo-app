# YouTrack Demo App

A YouTrack app that displays a list of all available projects and includes a toggle switch to enable/disable a boolean flag. Build using references to the [youtrack-dev-portal](https://www.jetbrains.com/help/youtrack/devportal/youtrack-dev-portal.html).

## How to Run the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the app:
   ```bash
   npm run build
   ```

3. The built app will be in the `dist/` directory, ready to be uploaded to YouTrack.

## Using the ZIP

The `app-zip.zip` file contains the bundled YouTrack app with all necessary files (manifest, backend script, widgets, and assets) ready for installation. This ZIP can be uploaded directly to a YouTrack instance via the admin panel.

**Note:** This app was tested using a local YouTrack instance to verify the build and functionality. 