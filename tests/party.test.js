const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Party = require('../models/parties'); 

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "testdb" });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Party.deleteMany();
});

describe('Party Model Test', () => {
    it('should delete a party by id', async () => {
        const party = await Party.create({
            game: new mongoose.Types.ObjectId(),
            name: 'Test Party',
            join_id: 'hulu#12345',
            party_socket_id: 'socket123',
            participants: []
        });


        let foundParty = await Party.findById(party._id);
        expect(foundParty).not.toBeNull();

       
        await Party.findByIdAndDelete(party._id);

       
        foundParty = await Party.findById(party._id);
        expect(foundParty).toBeNull();
    });
});
