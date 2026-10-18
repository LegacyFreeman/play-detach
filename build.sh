#!/usr/bin/env bash
# Builds the Play Detach module zip (arm64 only).
#
# Requirements: Android NDK (r29 tested), zip
#   ANDROID_NDK_HOME  path to the NDK (default: ~/android-ndk-r29)
#   OUT_DIR           where the zip is copied (default: ./out)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
NDK="${ANDROID_NDK_HOME:-$HOME/android-ndk-r29}"
OUT_DIR="${OUT_DIR:-$ROOT/out}"
BUILD="$ROOT/out/build"
STAGE="$ROOT/out/stage"

[ -x "$NDK/ndk-build" ] || { echo "NDK not found at $NDK (set ANDROID_NDK_HOME)" >&2; exit 1; }
command -v zip >/dev/null || { echo "zip is not installed (sudo apt install zip)" >&2; exit 1; }

VERSION="$(sed -n 's/^version=//p' "$ROOT/module/module.prop")"
ZIP_NAME="play-detach-${VERSION}.zip"

echo "==> Building Zygisk library ($VERSION)"
rm -rf "$BUILD" "$STAGE"
"$NDK/ndk-build" -C "$ROOT/src/zygisk" \
    NDK_PROJECT_PATH=. \
    APP_BUILD_SCRIPT=Android.mk \
    NDK_APPLICATION_MK=Application.mk \
    NDK_OUT="$BUILD/obj" \
    NDK_LIBS_OUT="$BUILD/libs" \
    -j"$(nproc)"

echo "==> Staging module"
mkdir -p "$STAGE/zygisk"
cp -r "$ROOT/module/." "$STAGE/"
cp "$BUILD/libs/arm64-v8a/libplay-detach.so" "$STAGE/zygisk/arm64-v8a.so"
cp "$ROOT/LICENSE" "$STAGE/"
[ -f "$ROOT/NOTICE" ] && cp "$ROOT/NOTICE" "$STAGE/"

echo "==> Packing $ZIP_NAME"
mkdir -p "$OUT_DIR"
rm -f "$OUT_DIR/$ZIP_NAME"
(cd "$STAGE" && zip -qr9 "$OUT_DIR/$ZIP_NAME" .)

echo "==> Done: $OUT_DIR/$ZIP_NAME"
