import {
    jest,
    expect,
    describe,
    test,
    beforeEach
} from '@jest/globals';
import { Service } from '../../../server/service.js';
import TestUtil from '../Utils/testUtil.js';
import fs from 'fs';
import fsPromises from 'fs/promises';
import config from '../../../server/config.js';

describe('#Service - test suite for service', () => { 
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test('createFileStream() - should return an stream for the giving file', async () => {
        const service = new Service();

        //const filename = '/index.html';
        const filename = 'file.mp3';
        const mockReadableStream  = TestUtil.generateReadableStream(['data']);

        jest.spyOn(
            fs,
            fs.createReadStream.name
        ).mockResolvedValue({
            mockReadableStream
        })

        const result = service.createFileStream(filename);

        expect(fs.createReadStream).toHaveBeenCalledWith(filename);
        expect(result).toStrictEqual(mockReadableStream);
    })

    test.todo('getFileInfo() - should return an object containing a name and type'); 
    // async () => {
    //     const filename = '/index.html';
    // })

    test.todo('getFileStream - should return an object containing a stream and type');
        // async () => {
        // const filename = '/index.html';

        // const mockReadableStream  = TestUtil.generateReadableStream(['data']);
        // const expectedType = ".html";

        // jest.spyOn(
        //     Service.prototype,
        //     Service.prototype.getFileStream.name
        // ).mockResolvedValue({
        //     stream: mockReadableStream,
        //     type: expectedType
        // });

        // const result = await controller.getFileStream(filename);
        
        // expect(Service.prototype.getFileStream).toHaveBeenCalledWith(filename);
        // expect(result).toEqual({
        //     stream: mockReadableStream,
        //     type: expectedType
        // });
    // });
});
