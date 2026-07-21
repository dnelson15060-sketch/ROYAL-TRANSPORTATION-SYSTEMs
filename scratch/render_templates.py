import os
import shutil
import pystache
import datetime

FLUTTER_ROOT = "/home/runner/flutter"
TEMPLATES = f"{FLUTTER_ROOT}/packages/flutter_tools/templates/app"
DEST_ROOT = "/home/runner/work/ROYAL-TRANSPORTATION-SYSTEMs/ROYAL-TRANSPORTATION-SYSTEMs/mobile_app"

context = {
    "organization": "com.royaltransportation",
    "projectName": "royal_transportation",
    "titleCaseProjectName": "RoyalTransportation",
    "androidIdentifier": "com.royaltransportation.royal_transportation",
    "iosIdentifier": "com.royaltransportation.royalTransportation",
    "macosIdentifier": "com.royaltransportation.royalTransportation",
    "darwinIdentifier": "com.royaltransportation.royalTransportation",
    "linuxIdentifier": "com.royaltransportation.royal_transportation",
    "windowsIdentifier": "com.royaltransportation.royal_transportation",  # not a real GUID but fine, unused
    "description": "Royal Transportation System - Parent & Driver Mobile App",
    "androidMinApiLevel": 24,
    "androidSdkVersion": 24,
    "pluginClass": "RoyalTransportationPlugin",
    "androidLanguage": "kotlin",
    "hasIosDevelopmentTeam": False,
    "iosDevelopmentTeam": "",
    "flutterRevision": "84fc5cbb223bc12f83d65b647ff8a56caf779ffd",
    "flutterChannel": "stable",
    "ios": True,
    "android": True,
    "web": False,
    "linux": False,
    "macos": False,
    "windows": False,
    "darwin": True,
    "sharedDarwinSource": False,
    "year": datetime.datetime.now().year,
    "dartSdkVersionBounds": ">=3.0.0 <4.0.0",
    "implementationTests": False,
    "agpVersion": "9.0.1",
    "agpVersionForModule": "9.0.1",
    "kotlinVersion": "2.3.20",
    "gradleVersion": "9.1.0",
    "compileSdkVersion": "36",
    "minSdkVersion": "24",
    "ndkVersion": "28.2.13676358",
    "targetSdkVersion": "36",
    "withPlatformChannelPluginHook": False,
    "withSwiftPackageManager": False,
    "withFfiPluginHook": False,
    "withFfiPackage": False,
    "withEmptyMain": False,
    "withFfi": False,
    "withPluginHook": False,
}

def render_string(s):
    return pystache.render(s, context)

def should_skip(relpath):
    # skip .iml files (IDE-specific, not needed) and DS_Store
    if relpath.endswith(".iml") or relpath.endswith(".iml.tmpl"):
        return True
    return False

def process_dir(src_dir, dest_dir, skip_img=True):
    for root, dirs, files in os.walk(src_dir):
        rel_root = os.path.relpath(root, src_dir)
        for fname in files:
            src_path = os.path.join(root, fname)
            rel_path = os.path.join(rel_root, fname) if rel_root != "." else fname

            # render mustache in the path itself (e.g. directory named androidIdentifier)
            path_parts = rel_path.replace(os.sep, "/").split("/")
            new_parts = []
            for part in path_parts:
                if part == "androidIdentifier":
                    new_parts.extend(context["androidIdentifier"].split("."))
                else:
                    new_parts.append(part)
            rel_path_rendered = render_string("/".join(new_parts)).replace("/", os.sep)

            if should_skip(rel_path_rendered):
                continue

            if fname.endswith(".img.tmpl"):
                if skip_img:
                    continue
                dest_rel = rel_path_rendered[: -len(".img.tmpl")]
                dest_path = os.path.join(dest_dir, dest_rel)
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                shutil.copyfile(src_path, dest_path)
                print("IMG COPY", dest_path)
                continue

            if fname.endswith(".copy.tmpl"):
                dest_rel = rel_path_rendered[: -len(".copy.tmpl")]
                dest_path = os.path.join(dest_dir, dest_rel)
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                shutil.copyfile(src_path, dest_path)
                print("COPY", dest_path)
                continue

            if fname.endswith(".tmpl"):
                dest_rel = rel_path_rendered[: -len(".tmpl")]
                dest_path = os.path.join(dest_dir, dest_rel)
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                with open(src_path, "r", encoding="utf-8") as f:
                    content = f.read()
                rendered = render_string(content)
                with open(dest_path, "w", encoding="utf-8") as f:
                    f.write(rendered)
                print("RENDER", dest_path)
                continue

            # plain file, copy as-is (still may need path render, e.g. no mustache in name)
            dest_path = os.path.join(dest_dir, rel_path_rendered)
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.copyfile(src_path, dest_path)
            print("PLAIN", dest_path)

# Render iOS template
process_dir(f"{TEMPLATES}/ios.tmpl", f"{DEST_ROOT}/ios_generated")

# Render Android templates (base + kotlin-specific overlay)
process_dir(f"{TEMPLATES}/android.tmpl", f"{DEST_ROOT}/android_generated")
process_dir(f"{TEMPLATES}/android-kotlin.tmpl", f"{DEST_ROOT}/android_generated")

print("DONE")
