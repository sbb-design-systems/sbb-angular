import { Feature } from 'geojson';

export const needsFloorChange = (features: Feature[], level: number | undefined) => {
  return features.some((f: { [name: string]: any }) => +f.properties.additionalFloor === level);
};

export function updateWalkFloor(features: Feature[], level: number | undefined) {
  return features
    .filter((f: { [name: string]: any }) => +f.properties.additionalFloor === level)
    .map(({ properties, ...rest }) => {
      return {
        ...rest,
        properties: {
          ...properties,
          floor: properties!.additionalFloor,
          additionalFloor: properties!.floor,
        },
      };
    });
}
