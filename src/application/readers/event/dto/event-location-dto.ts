type CoordinatesDTO = {
    latitude: number;
    longitude: number;
};

export class EventLocationDTO {
    private constructor(
        readonly location: string,
        readonly coordinates: CoordinatesDTO,
    ) {}

    static create(location: string, latitude: number, longitude: number): EventLocationDTO {
        return new EventLocationDTO(location, { latitude, longitude });
    }
}
