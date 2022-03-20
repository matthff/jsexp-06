import {
    jest,
    expect,
    describe,
    test,
    beforeEach
} from '@jest/globals';
import { Controller } from "../../../server/controller.js";
import { Service } from '../../../server/service.js';
import TestUtil from '../Utils/testUtil.js';

describe('#Controller - test suite for controller', () => { 
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    const controller = new Controller();
    
    test('GetFileStream - should return an object containing a stream and type', async () => {
        const filename = '/index.html';

        const mockReadableStream  = TestUtil.generateReadableStream(['data']);
        const expectedType = ".html";

        jest.spyOn(
            Service.prototype,
            Service.prototype.getFileStream.name
        ).mockResolvedValue({
            stream: mockReadableStream,
            type: expectedType
        });

        const result = await controller.getFileStream(filename);
        
        expect(Service.prototype.getFileStream).toHaveBeenCalledWith(filename);
        expect(result).toEqual({
            stream: mockReadableStream,
            type: expectedType
        });
    });
});
