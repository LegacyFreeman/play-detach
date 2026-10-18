#!/system/bin/sh
rm -rf /data/adb/play-detach
TERMUX_CMD=/data/data/com.termux/files/usr/bin/play-detach
grep -q '/data/adb/modules/play-detach/' "$TERMUX_CMD" 2>/dev/null && rm -f "$TERMUX_CMD"
