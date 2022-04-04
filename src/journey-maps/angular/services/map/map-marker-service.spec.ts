import { Map } from 'maplibre-gl';

import { SbbMarkerCategory } from '../../model/marker-category';

import { SbbMapMarkerService } from './map-marker-service';
import { SbbMapService } from './map-service';

const createMarker = ({ category = SbbMarkerCategory.CUSTOM, icon, iconSelected }: any) => ({
  id: 'some id',
  title: 'some title',
  position: [7.44645, 46.961409],
  category,
  icon,
  iconSelected,
});

describe('MapMarkerService#addMissingImages', () => {
  const icon = 'some/icon/path/train.jpg';
  const similarIcon = 'some/OTHER/path/train.jpg';
  const iconSelected = 'some/icon/path/train_selected.jpg';
  let sut: SbbMapMarkerService;
  let mapSpyObj: Map;
  let mapServiceSpyObj: SbbMapService;

  beforeEach(() => {
    mapSpyObj = jasmine.createSpyObj('mapSpyObj', ['hasImage', 'loadImage']);
    mapServiceSpyObj = jasmine.createSpyObj(['addMissingImage']);
    sut = new SbbMapMarkerService({} as any, mapServiceSpyObj, {} as any);
  });

  it('should add missing images with identical paths only once', () => {
    const markers = [createMarker({ icon, iconSelected }), createMarker({ icon, iconSelected })];
    sut.addMissingImages(mapSpyObj, markers, true);

    expect(mapServiceSpyObj.addMissingImage).toHaveBeenCalledTimes(2);
    expect(mapServiceSpyObj.addMissingImage).toHaveBeenCalledWith(
      mapSpyObj,
      'sbb-marker_dark-inactive-black_train_train_selected_2033534440',
      icon
    );
    expect(mapServiceSpyObj.addMissingImage).toHaveBeenCalledWith(
      mapSpyObj,
      'sbb-marker_dark-active-red_train_train_selected_2033534440',
      iconSelected
    );
  });

  it('should add missing images with similar paths separately', () => {
    const markers = [
      createMarker({ icon, iconSelected }),
      createMarker({ icon: similarIcon, iconSelected }),
    ];
    sut.addMissingImages(mapSpyObj, markers, false);

    expect(mapServiceSpyObj.addMissingImage).toHaveBeenCalledTimes(4);
    expect(mapServiceSpyObj.addMissingImage).toHaveBeenCalledWith(
      mapSpyObj,
      'sbb-marker_bright-inactive-black_train_train_selected_2033534440',
      icon
    );
    expect(mapServiceSpyObj.addMissingImage).toHaveBeenCalledWith(
      mapSpyObj,
      'sbb-marker_bright-active-red_train_train_selected_2033534440',
      iconSelected
    );
  });
});
