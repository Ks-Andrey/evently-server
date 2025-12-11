import { BASE_URL } from '../config/app';

export function getImageUrl(fileName: string, directory: string): string {
    return `${BASE_URL}/${directory}/${fileName}`;
}
