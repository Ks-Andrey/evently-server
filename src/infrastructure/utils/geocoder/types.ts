/**
 * Типы для ответа Yandex Geocoder API
 */

export interface YandexGeocoderResponse {
    response: {
        GeoObjectCollection: {
            metaDataProperty: {
                GeocoderResponseMetaData: {
                    request: string;
                    results: string;
                    found: string;
                };
            };
            featureMember: Array<{
                GeoObject: {
                    metaDataProperty: {
                        GeocoderMetaData: {
                            precision: string;
                            text: string;
                            kind: string;
                            Address: {
                                country_code: string;
                                formatted: string;
                                Components: Array<{
                                    kind: string;
                                    name: string;
                                }>;
                            };
                            AddressDetails: {
                                Country: {
                                    AddressLine: string;
                                    CountryNameCode: string;
                                    CountryName: string;
                                    AdministrativeArea?: {
                                        AdministrativeAreaName: string;
                                        Locality?: {
                                            LocalityName: string;
                                            Thoroughfare?: {
                                                ThoroughfareName: string;
                                                Premise?: {
                                                    PremiseNumber: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    name: string;
                    description: string;
                    boundedBy: {
                        Envelope: {
                            lowerCorner: string;
                            upperCorner: string;
                        };
                    };
                    uri: string;
                    Point: {
                        pos: string;
                    };
                };
            }>;
        };
    };
}
