# Migrate from ROKAS Journey Maps Client to SBB ESTA Journey Maps

If you previously used the standalone version of this component provided by ROKAS then the migration should work pretty easy.

This package is based on version 3.0.0 of `journey-maps-client`.

## Breaking changes

### Component selectors

The selector of the main component changed from `rokas-journey-maps-client` to `sbb-journey-maps`.

### Enums

We replaced most of our enums (all except `MarkerCategory` and `MarkerPriority`) with union types. This affects the following enums:

- `StyleMode`
- `SelectionMode`
- `FeatureDataType`
- `MarkerColor`
