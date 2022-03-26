import fs from 'fs';
import fsPromises from 'fs/promises';
import { once } from 'events';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { PassThrough, Writable } from 'stream';
import streamsPromises from 'stream/promises';
import Throttle from 'throttle';
import childProcess from 'child_process';

import config from './config.js';
import { logger } from './util.js';

const {
    dir: {
        publicDirectory,
        
    },
    constants: {
        FALLBACK_BITRATE,
        ENGLISH_CONVERSATION,
        BITRATE_DIVISOR
    }
} = config;

export class Service {
    constructor(){
        this.clientStreams = new Map();
        this.currentSong = ENGLISH_CONVERSATION;
        this.currentBitrate = 0;
        this.throttleTransform = {  };
        this.currentReadable = {  };
    }
    
    createClientStream() {
        const id = randomUUID();
        const clientStream = new PassThrough();
        this.clientStreams.set(id, clientStream);

        return {
            id,
            clientStream
        };
    }

    removeClientStream(id) {
        this.clientStreams.delete(id);
    }

    _executeSoxCommand(args) {
        return childProcess.spawn('sox', args);
    }

    async getBitRate(song) {
        try {
            const args = ['--i', '-B', song];
            const {
                stderr, // Errors
                stdout, // Logs
                stdin // Send Data
            } = this._executeSoxCommand(args);

            await Promise.all([once(stderr, 'readable'), once(stdout, 'readable')]);
            
            const [success, error] = [stdout, stderr].map(stream => stream.read());

            if(error) return await Promise.reject(error);

            return success.toString().trim().replace(/k/, '000');
        } catch (error) {
            logger.error(`There was an error with the bitrate defined in the file: ${error}`)
            return FALLBACK_BITRATE;
        }
    }

    broadcast() {
        return new Writable({
            write: (chunk, enc, cb) => {
                for(const [id, stream] of this.clientStreams) {
                    // If client shut off, don't send data
                    if(stream.writableEnded) {
                        this.removeClientStream(id);
                        continue;
                    }
                    stream.write(chunk);
                }

                cb();
            }
        });
    }

    async startStreaming() {
        logger.info(`Starting with ${this.currentSong}`);
        const bitRate = this.currentBitrate = await this.getBitRate(this.currentSong) / BITRATE_DIVISOR;

        const throttleTransform = this.throttleTransform = new Throttle(bitRate);
        const songReadable = this.currentReadable = this.createFileStream(this.currentSong);
        return streamsPromises.pipeline(
            songReadable,
            throttleTransform, //Backpressure
            this.broadcast()
        );
    }

    stopStreamming(){
        this.throttleTransform?.end?.();
    }

    createFileStream(fileName) {
        return fs.createReadStream(fileName);
    }

    async getFileInfo(file) {
        // file = home/index.html
        const fullFilePath = join(publicDirectory, file);
        // valida se existe, caso não, dispara um erro
        await fsPromises.access(fullFilePath);
        const fileType = extname(fullFilePath);

        return {
            type: fileType,
            name: fullFilePath
        };
    }

    async getFileStream(file) {
        const {
            name,
            type
        } = await this.getFileInfo(file);
        return {
            stream: this.createFileStream(name),
            type
        };
    }
}
