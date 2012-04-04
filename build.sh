#!/usr/bin/env bash

SCRIPT_PATH="$(readlink -f "$0" 2>/dev/null || greadlink -f "$0")"
SCRIPT_DIR="$(dirname "${SCRIPT_PATH}")"

path_output="build/PicView.air"
path_appxml="application.xml"
path_src="src/."
path_cert="cert.p12"
cert_pass="picviewpass"

[ ! -d "$(dirname $path_output)" ] && mkdir -p "$(dirname $path_output)"

adt \
	-package \
	-storetype pkcs12 \
	-keystore "$path_cert" \
	-storepass "$cert_pass" \
	-target air \
	"$path_output" \
	"$path_appxml" \
	"$path_src"
