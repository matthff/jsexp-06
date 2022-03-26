import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const root = join(currentDir, '../');
const audioDirectory = join(root, 'audio');
const publicDirectory = join(root, 'public');
const songsDirectory = join(audioDirectory, 'songs');
const fxDirectory = join(audioDirectory, 'fx');

export default{
    port: process.env.PORT || 3000,
    dir: {
        root,
        publicDirectory,
        audioDirectory,
        songsDirectory,
        fxDirectory
    },
    pages: {
        homeHTML: 'home/index.html',
        controllerHTML: 'controller/index.html',
    },
    location: {
        home: '/home'
    },
    constants: {
        CONTENT_TYPE: {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
        },
        AUDIO_MEDIA_TYPE: 'mp3',
        SONG_VOLUME: '0.99',
        FX_VOLUME: '0.2',
        FALLBACK_BITRATE: '128000',
        BITRATE_DIVISOR: 8,
        ENGLISH_CONVERSATION: join(songsDirectory, 'conversation.mp3')
    }
}
