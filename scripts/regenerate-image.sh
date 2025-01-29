set -e

if [ -z "${IMAGE_REPO}" ]; then
  echo "Missing IMAGE_REPO variable"
  exit 1
elif [ -z "${VERSION}" ]; then
  echo "Missing VERSION variable"
  exit 1
fi

image="$IMAGE_REPO:$VERSION"
majorVersion="${VERSION%.*.*}"
target=""
echo ""
echo "Regenerating $image"
echo ""

mkdir -p "$PWD/dist"

docker create --name dummy $image
if [[ $majorVersion > 12 ]]; then
  target=".ngssc"
  docker cp dummy:/usr/sbin/ngssc "$PWD/dist/ngssc"
  docker cp dummy:/docker-entrypoint.d/ngssc.sh "$PWD/dist/ngssc.sh"
fi

docker cp dummy:/etc/nginx/conf.d/default.conf "$PWD/dist/default.conf"
docker cp dummy:/usr/share/nginx/html "$PWD/dist/html/"

docker rm -f dummy

docker build \
  --tag tmp-fat \
  --file ".github/Dockerfile.regenerate$target" \
  "$PWD/dist"

mint slim \
  --target tmp-fat \
  --tag tmp \
  --preserve-path /usr/share/nginx/html

docker tag tmp "$image"
docker push "$image"

echo ""
echo "Finished regenerating $image"
echo ""
