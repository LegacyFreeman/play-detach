#!/system/bin/sh
# Magisk Zygisk does not load modules into apps on the DenyList, so make sure
# the Play Store is not on it. KernelSU / APatch have no DenyList.
if [ -z "$KSU" ] && [ -z "$APATCH" ] && command -v magisk >/dev/null 2>&1; then
    magisk --denylist rm com.android.vending >/dev/null 2>&1
fi
