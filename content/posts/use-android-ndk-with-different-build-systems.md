---
title: Use Android NDK with Different Build Systems
date: "2019-04-03T01:34:00.000-08:00"
description: I have been working on an Android app with which I wanted to integrate my previously written C library. It uses GNU autotools to generate Makefiles and build from them. Later on, I also needed a library which uses CMake. This post talks about the way I implement the two C library of different build systems with Android NDK to use them in my app.
---

For those who want to jump into implementation, please check out [the Android repo](https://github.com/robertying/CampusNet-Android).

- For autotools integration, see [jni](https://github.com/robertying/CampusNet-Android/tree/master/app/src/main/cpp/jni). The autotools project is [tunet-c](https://github.com/robertying/tunet-c).

- For CMake and Android-side configurations, see [module gradle](https://github.com/robertying/CampusNet-Android/blob/master/htmltidy/build.gradle) and [app gradle](https://github.com/robertying/CampusNet-Android/blob/master/app/build.gradle). The CMake project is [htmltidy](https://github.com/htacg/tidy-html5).

## Autotools integration

For autotools project, it's _usually_ easy to set up a small-scale project. Find a `Makefile.am` template and add your source and header files. Even if you need some external libraries, you can just add `-llibname` to the compiler, while installing these libraries are as simple as some package manager commands.

One `lib/Makefile.am` for my project `tunet-c` (simplified):

```makefile
libportal_la_CPPFLAGS = -I$(srcdir)/../openssl/include -I$(srcdir)/../openssl/include/openssl
noinst_LTLIBRARIES = libportal.la
libportal_la_SOURCES = portal.c portal.h list.c list.h utf.c utf.h parser.c parser.h utf8proc.c utf8proc.h sds.c sds.h cJSON.c cJSON.h
```

Here I used relative paths for include paths, but it's also fine if you have `openssl` installed and make sure they are in include search paths.

So what's the problem? It seems I have all the files under the directory. Well, this is only the `lib` directory and I need to compile against `openssl` and `curl` ultimately.

See `src/Makefile.am` (only shows the part for exported C library, not the whole CLI):

```makefile
lib_LTLIBRARIES = libtunet.la
libtunet_la_CPPFLAGS = -I$(srcdir)/../lib
libtunet_la_SOURCES = tunet.c tunet.h
libtunet_la_LIBADD = ../lib/libportal.la $(CRYPTOLIB) $(CURLLIB)
```

`$(CRYPTOLIB)` and `$(CURLLIB)` are defined by `configure.ac` where you check whether some necessary libs exist in your system. For a well set up build environment, they will be equal to `-lcrypto` (part of `openssl` lib) and `-lcurl` after running `./configure`.

Yes, this is easy for almost every Unix-like system. However, Android do not have `openssl` and `curl` built in and we do not have an `apm (Android Package Manager)` to install them :p. We must build `openssl` and `curl` from source. I will talk about how to achieve this in [the following post](/posts/compile-openssl-and-curl-for-android). Let's just assume we have already had three static libraries -- `libssl.a`, `libcrypto.a` (those two are `openssl` libs) and `libcurl.a` built for all Android targets (x86, arm, arm64, etc.).

Now we want to add them to our existing Android project so we can use `libtunet`.

### Android.mk

First, create a file named `Android.mk` inside directory `jni`. `JNI` stands for `Java Native Interface` which allows you to use C functions in Java code and the other way around. It seems a convention to put those configuration files inside `jni` so I will do the same (some also put `jni` inside `cpp` directory just beside `java`).

```makefile
include $(CLEAR_VARS)
LOCAL_MODULE := ssl
LOCAL_SRC_FILES := ../openssl-curl-android/build/openssl/$(TARGET_ARCH_ABI)/lib/libssl.a
LOCAL_EXPORT_CFLAGS := -I$(LOCAL_PATH)/../openssl-curl-android/build/openssl/$(TARGET_ARCH_ABI)/include
include $(PREBUILT_STATIC_LIBRARY)

include $(CLEAR_VARS)
LOCAL_MODULE := crypto
LOCAL_SRC_FILES := ../openssl-curl-android/build/openssl/$(TARGET_ARCH_ABI)/lib/libcrypto.a
LOCAL_EXPORT_CFLAGS := -I$(LOCAL_PATH)/../openssl-curl-android/build/openssl/$(TARGET_ARCH_ABI)/include
include $(PREBUILT_STATIC_LIBRARY)

include $(CLEAR_VARS)
LOCAL_MODULE := curl
LOCAL_SRC_FILES := ../openssl-curl-android/build/curl/$(TARGET_ARCH_ABI)/lib/libcurl.a
LOCAL_EXPORT_CFLAGS := -I$(LOCAL_PATH)/../openssl-curl-android/build/curl/$(TARGET_ARCH_ABI)/include
include $(PREBUILT_STATIC_LIBRARY)
```

The above three blocks are all the same.

1. First, we do `include $(CLEAR_VARS)` which is necessary for `Android.mk`.
2. Then, we name the library we are including into the Android project. Here for example, we have `curl` for `LOCAL_MODULE`, then later we can use `libcurl` to point to this static library.
3. Since we are including a static library, `LOCAL_SRC_FILES` refers to the prebuilt `.a` file. I cross-compiled these libraries ahead of time and put them in the path shown above ([next post](/posts/compile-openssl-and-curl-for-android) will be on this topic).
4. `LOCAL_EXPORT_CFLAGS` is usually for making the library's include files to be seen in the rest of the Makefile.
5. `include $(PREBUILT_STATIC_LIBRARY)` says this block is about a prebuilt static library. We can also use _shared_ one. Visit [NDK docs](https://developer.android.com/ndk/guides/android_mk) for more information.
6. Just to mention, `$(TARGET_ARCH_ABI)` is a helpful macro to be equal to the ABI you are building for. So I can always link the right architecture of the libraries.

With three blocks, we have told NDK to include these three prebuilt libraries. Now let's check out the part for our final lib -- `libtunet` for Android.

```makefile
include $(CLEAR_VARS)
LOCAL_C_INCLUDES := $(LOCAL_PATH)/../openssl/include $(LOCAL_PATH)/../curl/include $(LOCAL_PATH)/../tunet-c/cJSON $(LOCAL_PATH)/../tunet-c/sds $(LOCAL_PATH)/../tunet-c/utf8proc
LOCAL_MODULE := tunet
LOCAL_SRC_FILES := tunet-jni.c ../tunet-c/src/tunet.c ../tunet-c/lib/portal.c ../tunet-c/lib/parser.c ../tunet-c/lib/list.c ../tunet-c/lib/utf.c ../tunet-c/utf8proc/utf8proc.c ../tunet-c/sds/sds.c ../tunet-c/cJSON/cJSON.c
LOCAL_STATIC_LIBRARIES := libcurl libssl libcrypto
include $(BUILD_SHARED_LIBRARY)
```

Most of the lines are similar. I just need to point out the following:

1. `LOCAL_C_INCLUDES` is for what its name implies. I haven't tested if its redundant and `LOCAL_EXPORT_CFLAGS` is sufficient.
2. Here `LOCAL_SRC_FILES` refers to all source files. Luckily we do not need to include header files as we do in regular `Makefile.am`.
3. `LOCAL_STATIC_LIBRARIES` are libraries we need to compile against. We use the three declared earlier here.
4. Finally `include $(BUILD_SHARED_LIBRARY)` build the whole `libtunet` library so we can use it in Java using `System.loadLibrary("tunet");`.

> Notice:
>
> In `LOCAL_SRC_FILES`, it seems ok to use relative paths, but not for `LOCAL_C_INCLUDES`. Use macro `$(LOCAL_PATH)` instead.

Now we've completed the setup. Now we need to add this `Android.mk` to our Android project. You can do this in `Android Studio` but either way you will get the following result in your `app/build.gradle`:

```groovy
android {

    ...

    externalNativeBuild {
        ndkBuild {
            path file('src/main/cpp/jni/Android.mk')
        }
    }
}
```

### Android.mk

This file is for general configuration. I just added one line to it:

```makefile
APP_ABI := all
```

to build for all ABI variants. Nothing fancy.

Hooray! 🎉 Now if you build the project and generate an APK, you can see `libtunet.so` in it.

### JNI bridge file

Although you can load the native library now, you cannot use it in Java yet. We need a bridge file to convert C functions and types to Java's.

Wait! I forgot to explain one file in `Android.mk` above. In `LOCAL_SRC_FILES`, there is one `tunet-jni.c` and this is our bridge file.

Let's take a look:

```c
#include <jni.h>

#include "../tunet-c/src/tunet.h"

JNIEXPORT void JNICALL Java_io_robertying_campusnet_helper_TunetHelper_tunetInit(JNIEnv *env,
                                                                                 jobject this,
                                                                                 jstring path) {
    tunet_init();
    CA_BUNDLE_PATH = (char *) (*env)->GetStringUTFChars(env, path, NULL);
}
```

The Java types in C are defined in `jni.h` so we need to include it in the first place. `JNIEXPORT <return-type> JNICALL` is necessary if this function needs to be used in Java.

One that needs mentioning is the function name and arguments.

- `Java_io_robertying_campusnet_helper_TunetHelper_tunetInit` is named because my package name is `io.robertying.campusnet` and `tunetInit` is a member function in class `TunetHelper`. `TunetHelper` is in a subpackage in `io.robertying.campusnet` package.
- `JNIEnv *env` and `jobject this` are Java stuff that we can get in C functions so that we might do some conversion from C data to Java objects. The rest of the arguments are passed in the order of Java arguments getting passed.
- In this function, I use `GetStringUTFChars` in the `env` to convert a Java String named path to C char\* type data.

Now for this simple JNI function, we have completed C side setup. Java side work is much easier:

```java
package io.robertying.campusnet.helper;

...

public class TunetHelper {

    private native static void tunetInit(String caBundlePath);

    ...

}
```

In short, just add `native` for declaration and make sure:

1. Arguments are consistent: `String caBundlePath` with `jstring path`.
2. `Java`, package name, class name and function name concatenated to be C side function name.

> Notice:
>
> The rest of the `tunet-jni.c` file may contain some conversions between Java class defined enum and C int defined enum. Check out Stack Overflow if you find yourself confused.

Okay! Now we can finally use C functions in our Android project. 😋

## How about CMake?

To be honest, Google recommends using `CMake` for NDK now. But for libraries like `openssl` and `curl`, they do not have `CMakeLists.txt` out of the box. So I think using `ndk-build` (i.e. `Android.mk`) is easier.

`htmltidy` is a `CMake` project. And it's _so_ easy to use it with `NDK`.

**Add it to your gradle configuration and you are done.**

Well my problem is Android cannot have different build systems on the same module! The module I am talking about refers to `app` now. Every project should have that one by default.

We have used our `Android.mk` on module `app`. 😅 So let's make a new module. You can add a new module to the same project using `Android Studio`. It's called `Android Library` if I remember it right.

After that, we can see another `build.gradle` for this module. I named it `htmltidy` so it's in `htmltidy/build.gradle`:

```groovy
apply plugin: 'com.android.library'

android {
    compileSdkVersion 28

    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 28
        versionCode 1
        versionName "1.0.0"

        externalNativeBuild {
            cmake {
                arguments "-DBUILD_SHARED_LIB:BOOL=OFF"
            }
        }
    }

    externalNativeBuild {
        cmake {
            path file('../app/src/main/cpp/tunet-c/tidy-html5/CMakeLists.txt')
        }
    }
}
```

`externalNativeBuild` links the CMake project to your project using its `CMakeLists.txt`. And that's it! Now `libtidys` gets built every time we build module `htmltidy`. `arguments "-DBUILD_SHARED_LIB:BOOL=OFF"` is to only build a static library.

### Integrate CMake module to existing NDK

Let's say my `libtunet` later requires some functions from `libtidya` (htmltidy) so I added the same block to my `Android.mk`:

```makefile
include $(CLEAR_VARS)
LOCAL_MODULE := tidy
LOCAL_SRC_FILES := ../../../../../htmltidy/.externalNativeBuild/cmake/$(APP_OPTIM)/$(TARGET_ARCH_ABI)/libtidys.a
LOCAL_EXPORT_CFLAGS := -I$(LOCAL_PATH)/../tunet-c/tidy-html5/include
include $(PREBUILT_STATIC_LIBRARY)
```

Just a slight difference: we need point `LOCAL_SRC_FILES` to module `htmltidy`'s build dir. Here `$(APP_OPTIM)` is either `debug` or `release`, so we can keep `libtidya` in sync with the whole app.

And in the final `libtunet` setup:

```makefile
include $(CLEAR_VARS)
LOCAL_C_INCLUDES := $(LOCAL_PATH)/../openssl/include $(LOCAL_PATH)/../curl/include $(LOCAL_PATH)/../tunet-c/cJSON $(LOCAL_PATH)/../tunet-c/sds $(LOCAL_PATH)/../tunet-c/utf8proc -I$(LOCAL_PATH)/../tunet-c/tidy-html5/include
LOCAL_MODULE := tunet
LOCAL_SRC_FILES := tunet-jni.c ../tunet-c/src/tunet.c ../tunet-c/lib/portal.c ../tunet-c/lib/parser.c ../tunet-c/lib/list.c ../tunet-c/lib/utf.c ../tunet-c/utf8proc/utf8proc.c ../tunet-c/sds/sds.c ../tunet-c/cJSON/cJSON.c
LOCAL_STATIC_LIBRARIES := libcurl libssl libcrypto libtidy
include $(BUILD_SHARED_LIBRARY)
```

Add `libtidy` to `LOCAL_STATIC_LIBRARIES` because we name it `tidy` earlier in `LOCAL_MODULE`.

### App build sequence

Everything seems perfect now. However, you will sometimes find out when compiling `libtunet`, `libtidys.a` is missing.

It is because module `htmltidy` is built before module `app`.

In `app/build.gradle`:

```groovy
dependencies {
    implementation project(':htmltidy')

    ...
}
```

Declare `htmltidy` as an implementation so it gets built before `app`.

You also need to change the setting here in `settings.gradle`:

```groovy
include ':htmltidy', ':app'
```

So it will compile module `htmltidy`. _This addition or the module order seem somehow unnecessary. I don't know..._

Alright, now you are free to use a CMake C project with an autotools C project, integrated into your awesome Android Java using the magic of NDK!

_Two build systems in one harmony..._ 😊
