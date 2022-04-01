# Migrate from ROKAS Journey Maps Client to SBB ESTA Journey Maps

## Breaking changes

### Enums

We replaced most of our enums (all except `MarkerCategory` and `MarkerPriority`) with union types. This affects the following enums:

- `StyleMode`
- `SelectionMode`
- `FeatureDataType`
- `MarkerColor`
