#!/system/bin/sh
# Play Detach - installer
# Copyright 2026 Tears Burn (nikakvo). Licensed under the Apache License 2.0.

DATA_DIR=/data/adb/play-detach
TERMUX_BIN=/data/data/com.termux/files/usr/bin

ui_print " "
ui_print "  Play Detach"
ui_print "  Stops Play Store updates for the apps you choose"
ui_print " "

[ "$ARCH" = "arm64" ] || abort "! Only arm64 devices are supported (this device: $ARCH)"
[ "$API" -ge 29 ] || abort "! Android 10 or newer is required"

set_perm "$MODPATH/play-detach" 0 0 0755
set_perm_recursive "$MODPATH/zygisk" 0 0 0755 0644

mkdir -p "$DATA_DIR"
chmod 700 "$DATA_DIR"
[ -f "$DATA_DIR/detach.list" ] || touch "$DATA_DIR/detach.list"
chmod 600 "$DATA_DIR/detach.list"

if [ -d /data/adb/modules/zygisk-detach ]; then
    ui_print "! zygisk-detach is installed. Remove it, both modules"
    ui_print "  hook the Play Store and must not run together."
fi

# Optional: packages to detach on install, one per line in detach.txt
if [ -f "$MODPATH/detach.txt" ]; then
    ui_print "- Importing detach.txt"
    "$MODPATH/play-detach" import "$MODPATH/detach.txt" 2>&1 | while read -r l; do ui_print "  $l"; done
    rm -f "$MODPATH/detach.txt"
fi

if [ -n "$KSU" ] || [ -n "$APATCH" ]; then
    ui_print "- A Zygisk implementation (e.g. ReZygisk) is required"
else
    ui_print "- Make sure Zygisk is enabled in Magisk"
fi

if [ -d "$TERMUX_BIN" ]; then
    owner=$(stat -c %u:%g "$TERMUX_BIN")
    cat >"$TERMUX_BIN/play-detach" <<'EOF'
#!/data/data/com.termux/files/usr/bin/sh
exec su -c /data/adb/modules/play-detach/play-detach "$@"
EOF
    chown "$owner" "$TERMUX_BIN/play-detach"
    chmod 755 "$TERMUX_BIN/play-detach"
    ui_print "- Termux command installed: play-detach"
fi

ui_print "- Manage apps from the module WebUI or the play-detach command"
ui_print " "
