#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export ANDROID_HOME="${ANDROID_HOME:-/opt/homebrew/share/android-commandlinetools}"
export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home}"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

npm run copy:www
npx cap sync android
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
(cd android && chmod +x gradlew && ./gradlew assembleDebug)

mkdir -p release
cp android/app/build/outputs/apk/debug/app-debug.apk release/교실-자리배치-1.0.0-debug.apk
echo "APK: release/교실-자리배치-1.0.0-debug.apk"
