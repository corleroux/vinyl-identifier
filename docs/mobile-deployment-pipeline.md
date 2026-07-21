# Mobile App Deployment Pipeline — Configuration Breakdown

> Snapshot of the mobile build/distribution pipeline as currently configured in the Vinyl Identifier repo. Covers Capacitor config, native Android/iOS targets, EAS Build profiles, and the GitHub Actions CI workflow.

---

## 1. Overall Architecture

The app is a **local-first React PWA wrapped with Capacitor v8** for native iOS/Android shells. Two build pathways exist side-by-side:

| Pathway                 | Trigger                                         | Tool                      | Outputs                                      | Store-ready?                        |
| ----------------------- | ----------------------------------------------- | ------------------------- | -------------------------------------------- | ----------------------------------- |
| **CI / GitHub Actions** | Push of `v*` tags or manual `workflow_dispatch` | `xcodebuild` + `gradlew`  | Unsigned `app-debug.apk`, unsigned `App.ipa` | No (debug/unsigned, artifacts only) |
| **EAS Build** (local)   | Manual `npm run eas:build:*`                    | Expo Application Services | Signed production builds on EAS cloud        | Yes (designed for store submission) |

The two are **not wired together** — EAS is configured but never invoked by CI. Currently CI is the only automated path, and it produces development artifacts.

---

## 2. Capacitor Configuration (`capacitor.config.ts:1`)

Source of truth; a JSON copy is regenerated into each native project at `android/app/src/main/assets/capacitor.config.json` and `ios/App/App/capacitor.config.json` via `cap sync`.

- `appId`: `com.vinylidentifier.app` (reverse-DNS, used as Android `applicationId` and iOS `PRODUCT_BUNDLE_IDENTIFIER`)
- `appName`: `VinylIdentifier`
- `webDir`: `dist` — this is the Vite build output that gets copied into native assets. **`npm run build` must run before `cap sync`.**
- `server.androidScheme: 'https'` — WebView loads assets over a synthetic HTTPS origin
- Registered plugins and their native config:
  - **Camera**: `permissions: ['camera', 'photos']`
  - **Share**: `{}` (default)
  - **SplashScreen**: 2-second auto-hide, `#1f2937` (gray-800) background, `CENTER_CROP` Android scale, fullscreen immersive, no spinner
- The iOS `capacitor.config.json` carries an extra `packageClassList` enumerating the 5 registered native plugin classes (BarcodeScanner, Camera, Filesystem, Share, SplashScreen) — this is auto-maintained by Capacitor.

Installed Cap plugins (`package.json:26-32`): `@capacitor/android`, `@capacitor/ios`, `@capacitor/core` (all `^8.4.0`), `camera ^8.2.0`, `barcode-scanner ^3.0.2`, `filesystem ^8.1.2`, `share ^8.0.1`, `splash-screen ^8.0.1`. CLI is `@capacitor/cli ^8.4.0`.

---

## 3. Android Native Target

### Versions (`android/variables.gradle:1`)

- `minSdkVersion = 26` (Android 8.0)
- `compileSdkVersion = targetSdkVersion = 36` (Android 16 — very current)
- androidx stack pinned (e.g. `appcompat 1.7.1`, `core-splashscreen 1.2.0`)

### `android/app/build.gradle:1`

- `applicationId "com.vinylidentifier.app"` matches the Cap `appId`
- `versionCode 1`, `versionName "1.0"` — hardcoded, not auto-incremented from EAS in CI builds (EAS's `autoIncrement: true` only applies to EAS builds)
- `release` build type has `minifyEnabled false` and references a `proguard-rules.pro` file (likely empty/default — no asset shrinkwrap)
- Pulls in `capacitor-android` and `capacitor-cordova-android-plugins` as Gradle projects
- Optional `google-services.json` hook present at `build.gradle:48-53` for Firebase — only applies if the file exists; currently it does NOT, so push notifications are effectively disabled with a logged info message

### Manifest (`android/app/src/main/AndroidManifest.xml:1`)

- Single launcher `MainActivity` with `singleTask` launch mode
- `FileProvider` registered at `${applicationId}.fileprovider` (Camera/Filesystem support)
- Permissions declared: `INTERNET`, `CAMERA`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`
  - Note: `READ/WRITE_EXTERNAL_STORAGE` are deprecated on API 33+; newer storage scoped perms aren't requested. The minSdk=26 / targetSdk=36 span means this needs updating for compliance.

---

## 4. iOS Native Target

### `ios/App/App/Info.plist:1`

- `CFBundleDisplayName`: `VinylIdentifier`
- Versions are injected via Xcode build settings: `$(MARKETING_VERSION)` / `$(CURRENT_PROJECT_VERSION)` — these are set in the `.pbxproj` and EAS auto-increments them via the `autoIncrement: true` in `eas.json:31`
- `CAPACITOR_DEBUG` flag is parameterised
- Orientations: portrait + 2 landscape on iPhone; all four on iPad
- `UIRequiredDeviceCapabilities: armv7` — stale flag (`armv7` is not a real arm64 capability) — typically leftover from a template, harmless but worth removing
- Required permission strings (App Store requirement):
  - `NSCameraUsageDescription`: "VinylIdentifier needs camera access to scan and identify vinyl records"
  - `NSPhotoLibraryUsageDescription`: "VinylIdentifier needs photo library access to upload album cover images for identification"

---

## 5. EAS Build Configuration (`eas.json:1`)

This is the **store-grade** pipeline but is invoked manually. Three profiles:

| Profile                          | Distribution    | iOS             | Android                             | Auto-increment      |
| -------------------------------- | --------------- | --------------- | ----------------------------------- | ------------------- |
| `development`                    | internal        | simulator build | APK                                 | No                  |
| `preview` (extends `production`) | internal        | (inherits prod) | APK                                 | inherits prod       |
| `production`                     | store (default) | IPA             | **AAB** (app-bundle for Play Store) | Yes, both platforms |

- `cli.version: ">= 20.1.0"`, `appVersionSource: "remote"` — version numbers live on EAS servers, not in `package.json`. This is the modern EAS Update-style flow.
- `npm run eas:build:all` runs `eas build --platform all` — builds both platforms in one invocation
- Note: there is **no `submit` profile** in `eas.json`, and no `eas:submit` script in `package.json` — store submission (TestFlight / Play Console upload) is not yet automated via EAS Submit.

The `preview` profile is notable: it inherits production config (including autoIncrement) but distributes `internal` so you can ship release-quality builds to registered test devices without a store.

---

## 6. CI / GitHub Actions (`.github/workflows/ci.yml:1`)

### Triggers

- `push` on tags matching `v*` (semver convention)
- `workflow_dispatch` (manual button)

This means a release event is **`git tag v1.0.0 && git push --tags`** — and `npm version` is the typical workflow to produce such tags. Note `npm version` would also bump `package.json:4` (`"version": "0.0.0"`) but that bump is independent of native versionCode/CFBundleVersion which CI does not touch.

The pipeline runs the two platforms **in parallel** (`android` + `ios` jobs).

### Web build stage (shared by both)

```
npm ci → npm run build (vite build → dist/) → npx cap sync <platform>
```

`cap sync` copies the `dist/` web bundle into the native project's assets and updates native plugin references. This happens **before** any Java/ObjC build.

### Android job (`ubuntu-latest`)

1. Node 22 + npm cache via `actions/setup-node@v4`
2. JDK 21 (Zulu) via `actions/setup-java@v4`
3. Gradle setup via `gradle/actions/setup-gradle@v4`
4. `cd android && ./gradlew assembleDebug` — **debug** build, unsigned
5. Artifact uploaded: `android/app/build/outputs/apk/debug/app-debug.apk`

### iOS job (`macos-15`)

1. Node 22
2. No explicit Xcode selection — uses the runner's default on macOS-15 (likely Xcode 16)
3. `xcodebuild -resolvePackageDependencies` for Swift Package Manager dependencies (Capacitor uses SPM)
4. `xcodebuild archive` with:
   - `-configuration Release`
   - `-destination "generic/platform=iOS"` (no specific device)
   - `CODE_SIGNING_ALLOWED=NO` / `CODE_SIGNING_REQUIRED=NO` — **unsigned archive**
5. Manual `Payload/` directory + `zip` to produce `App.ipa` (no `xcodebuild -exportArchive` / no provisioning profile)
6. Artifact uploaded: `ios/App/build/App.ipa`

---

## 7. Pipeline Gaps & Observations

Things to be aware of:

1. **No signing in CI.** Both APKs and IPAs are unsigned or debug-signed, and the iOS job explicitly disables code signing. CI artifacts are not installable on devices without re-signing. For distribution, EAS Build is the intended path (`npm run eas:build:all`) since it provides proper signing on EAS cloud.
2. **CI and EAS are disconnected.** The `eas.json` is not referenced by `.github/workflows/ci.yml`. Either trigger model works, but they duplicate effort. You may want one to delegate to the other (commonly: GitHub Action that invokes `eas build --non-interactive` with secrets).
3. **No `eas submit` profile or script.** TestFlight and Play Console uploads are not automated.
4. **Version sync gap.** CI builds use hardcoded `versionCode 1 / versionName 1.0` and Xcode-set `MARKETING_VERSION` — they won't reflect the pushed `v*` tag. EAS profiles handle this via `autoIncrement` + `appVersionSource: remote`, but only when run through EAS.
5. **No fastlane, no `Fastfile`/`Appfile`.** None found.
6. **No `.easignore`** — EAS will upload the entire repo (including `serverless/`, `node_modules`, native dirs). This is mainly relevant for monorepo / build-time-only codepaths.
7. **CI skips the quality gates.** `AGENTS.md` references a CI sequence (lint→typecheck→test→build) but the actual `ci.yml` skips lint/typecheck/test and **only builds**. The "CI runs the same sequence" statement in the docs is not currently accurate for the mobile pipeline.
8. **Android perms are stale** (`READ/WRITE_EXTERNAL_STORAGE` for targetSdk 36). On Android 13+ these should be `READ_MEDIA_IMAGES` etc.
9. **iOS `armv7` capability** in `Info.plist` is vestigial and should be removed for arm64-only targets.
10. **`google-services.json` optional hook** present but the file isn't there — so any FCM/push work added later would silently no-op without that file.

---

## 8. Total End-to-End Deployment Lifecycle (as configured)

```
Developer
  |
  |-- npm run dev                  local web dev (Vite HMR)
  |-- npm run cap:sync             copy dist -> native projects
  |-- npm run cap:open:android     open Android Studio
  |-- npm run cap:open:ios         open Xcode
  |
  |-- Local release build ----------------------> EAS cloud
  |   npm run eas:build:android                       (signed AAB -> Play)
  |   npm run eas:build:ios                            (signed IPA -> App Store Connect)
  |   npm run eas:build:all                           (both)
  |
  +-- Tag-triggered CI (git push --tags v*) --> GitHub Actions
        |-- android job (ubuntu) --> assembleDebug --> app-debug.apk (artifact, unsigned)
        +-- ios job     (macos-15) --> xcodebuild archive (unsigned) --> App.ipa (artifact, unsigned)
```
