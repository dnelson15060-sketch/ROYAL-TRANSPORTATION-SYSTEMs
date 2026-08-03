import java.util.Base64
import java.util.Properties

plugins {
    id("com.android.application")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("key.properties")

if (keystorePropertiesFile.exists()) {
    keystorePropertiesFile.inputStream().use { keystoreProperties.load(it) }
}

fun envOrProperty(name: String): String? {
    val propertyValue = keystoreProperties.getProperty(name)?.takeIf { it.isNotBlank() }
    return propertyValue ?: System.getenv(name)?.takeIf { it.isNotBlank() }
}

val googleMapsApiKey = System.getenv("GOOGLE_MAPS_API_KEY")
    ?.takeIf { it.isNotBlank() }
    ?: "MISSING_GOOGLE_MAPS_API_KEY"

val keystoreBase64 = System.getenv("ANDROID_KEYSTORE_BASE64")?.takeIf { it.isNotBlank() }
val storeFilePath = envOrProperty("ANDROID_STORE_FILE")
val storePasswordValue = envOrProperty("ANDROID_KEYSTORE_PASSWORD")
val keyAliasValue = envOrProperty("ANDROID_KEY_ALIAS")
val keyPasswordValue = envOrProperty("ANDROID_KEY_PASSWORD")
val releaseKeystoreFile =
    storeFilePath?.let { rootProject.file("../$it") } ?: rootProject.file("../app-release.keystore")

if (!releaseKeystoreFile.exists() && keystoreBase64 != null) {
    releaseKeystoreFile.writeBytes(Base64.getDecoder().decode(keystoreBase64))
}

val hasReleaseSigning =
    releaseKeystoreFile.exists() &&
        !storePasswordValue.isNullOrBlank() &&
        !keyAliasValue.isNullOrBlank() &&
        !keyPasswordValue.isNullOrBlank()

android {
    namespace = "com.royaltransportation.royal_transportation"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "com.royaltransportation.royal_transportation"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
        manifestPlaceholders["googleMapsApiKey"] = googleMapsApiKey
    }

    signingConfigs {
        create("release") {
            if (hasReleaseSigning) {
                storeFile = releaseKeystoreFile
                storePassword = storePasswordValue
                keyAlias = keyAliasValue
                keyPassword = keyPasswordValue
            }
        }
    }

    buildTypes {
        release {
            signingConfig =
                if (hasReleaseSigning) {
                    signingConfigs.getByName("release")
                } else {
                    signingConfigs.getByName("debug")
                }
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}
