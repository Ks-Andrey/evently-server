import { Coordinates } from '@common/types/coordinates';

export interface IGeocoderManager {
    findCoordinatesByLocation(location: string): Promise<Coordinates | null>;
}
