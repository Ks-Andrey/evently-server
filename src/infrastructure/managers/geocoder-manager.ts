import axios, { AxiosError } from 'axios';

import { GeocoderApiErrorException, GeocoderNetworkErrorException } from '@application/services/geocoder';
import { IGeocoderManager } from '@application/services/geocoder';
import { YANDEX_API_KEY } from '@common/config/geocoder';
import { Coordinates } from '@common/types/coordinates';
import { log } from '@common/utils/logger';

import { YandexGeocoderResponse } from '../utils/geocoder/types';

export class GeocoderManager implements IGeocoderManager {
    async findCoordinatesByLocation(location: string): Promise<Coordinates | null> {
        try {
            const response = await axios.get<YandexGeocoderResponse>('https://geocode-maps.yandex.ru/v1/', {
                params: {
                    apikey: YANDEX_API_KEY,
                    geocode: location,
                    format: 'json',
                },
                timeout: 10000,
            });

            const coordinates = this.extractCoordinates(response.data);

            return coordinates;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                log.error('Yandex Geocoder API error', {
                    message: axiosError.message,
                    status: axiosError.response?.status,
                    data: axiosError.response?.data,
                });

                if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
                    throw new GeocoderNetworkErrorException({
                        code: axiosError.code,
                        message: axiosError.message,
                    });
                }

                throw new GeocoderApiErrorException({
                    status: axiosError.response?.status,
                    message: axiosError.message,
                });
            }

            log.error('Unexpected error in GeocoderManager', {
                error: log.formatError(error),
                location,
            });

            throw error;
        }
    }

    private extractCoordinates(data: YandexGeocoderResponse): Coordinates | null {
        const featureMembers = data.response.GeoObjectCollection.featureMember;

        if (!featureMembers || featureMembers.length === 0) {
            return null;
        }

        const firstGeoObject = featureMembers[0].GeoObject;
        const point = firstGeoObject.Point;

        if (!point || !point.pos) {
            return null;
        }

        const [longitudeStr, latitudeStr] = point.pos.split(' ');

        if (!longitudeStr || !latitudeStr) {
            log.warn('Invalid coordinates format in Yandex Geocoder response', {
                pos: point.pos,
            });
            return null;
        }

        const longitude = parseFloat(longitudeStr);
        const latitude = parseFloat(latitudeStr);

        if (isNaN(longitude) || isNaN(latitude)) {
            log.warn('Invalid coordinates values in Yandex Geocoder response', {
                longitude: longitudeStr,
                latitude: latitudeStr,
            });
            return null;
        }

        return {
            longitude,
            latitude,
        };
    }
}
