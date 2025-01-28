set -e

if [ -z "${START_VERSION}" ]; then
  echo "Missing START_VERSION variable"
  exit 1
fi

majorVersion=$START_VERSION
versions=()

while : ; do
  version=$(git tag --sort=v:refname -l "$majorVersion.*.*" | tail -1)
  [[ "$version" != "" ]] || break
  versions+=("$version")
  majorVersion=$((majorVersion+1))
done

printf -v joined '"%s",' "${versions[@]}"
echo "versions=[${joined::-1}]"