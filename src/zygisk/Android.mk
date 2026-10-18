LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)
LOCAL_MODULE    := play-detach
LOCAL_SRC_FILES := main.cpp
LOCAL_CPPFLAGS  := -std=c++20 -fno-exceptions -fno-rtti -fno-threadsafe-statics \
                   -Wall -Wextra -Werror
LOCAL_LDLIBS    := -llog
LOCAL_LDFLAGS   := -Wl,--gc-sections -Wl,--exclude-libs,ALL
include $(BUILD_SHARED_LIBRARY)
