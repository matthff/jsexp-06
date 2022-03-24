import {
    jest,
    expect,
    describe,
    test,
    beforeEach
} from '@jest/globals';
import { Service } from '../../../server/service.js';
import TestUtil from '../Utils/testUtil.js';
import fs, {promises as fsPromises} from 'fs'
import path from 'path';
import config from '../../../server/config.js';

const {
    dir: {
        publicDirectory
    }
} = config;

describe('#Service - test suite for service', () => { 
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    const service = new Service();

    test('createFileStream() - should return an stream for the giving file', async () => {
        

        const filename = 'index.html';
        const mockReadableStream  = TestUtil.generateReadableStream(['data']);

        jest.spyOn(
            fs,
            fs.createReadStream.name
        ).mockReturnValue(mockReadableStream);

        const result = service.createFileStream(filename);

        expect(fs.createReadStream).toHaveBeenCalledWith(filename);
        expect(result).toStrictEqual(mockReadableStream);
    });

    test('getFileInfo() - should return an object containing a name and type', async () => {
        const filename = 'index.html';
        const mockReadableStream  = TestUtil.generateReadableStream(['data']);
        const expectedName = path.join(publicDirectory, filename)
        const expectedType = '.html';

        jest.spyOn(
            fsPromises,
            fs.access.name
        ).mockResolvedValue()

        expect(await service.getFileInfo(filename)).toStrictEqual({
            type: expectedType,
            name: expectedName
        });
    });

    test('getFileStream - should return an object containing a stream and type', async () => {
        const filename = 'index.html';
        const path = `${publicDirectory}/${filename}`
        const expectedType = '.html';
        const mockReadableStream = TestUtil.generateReadableStream(['data']);

        jest.spyOn(
            Service.prototype,
            Service.prototype.getFileInfo.name
        ).mockResolvedValue({
            type: expectedType,
            name: path
        });

        jest.spyOn(
            Service.prototype,
            Service.prototype.createFileStream.name
        ).mockReturnValue(mockReadableStream);

        const result = await service.getFileStream(filename);
        const expectedResult = {
            type: expectedType,
            stream: mockReadableStream
        };

        
        
        
        expect(result).toStrictEqual(expectedResult);
        expect(service.createFileStream).toHaveBeenCalledWith(path);
        expect(await service.getFileInfo).toHaveBeenCalledWith(filename);
    });
});
