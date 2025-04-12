const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.util");
exports.getAllstores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllstores();
        baseResponse(res, true, 200, "stores retrieved successfully", stores);
    } catch (error) {
        baseResponse(res, false, 500,"error retrieving stores", error);
    }   
};

exports.createStore = async (req, res) => { 
    if(!req.body.name ||!req.body.address) {
        return baseResponse (res, false, 400, "name and address are required",null);
    }
    try {
        const store = await storeRepository.createStore(req.body);
        baseResponse(res, true, 201, "store created successfully", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "server error", null);
    }
}

exports.getStoreById = async (req, res) => {
    const { id } = req.params; 

    try {
        const store = await storeRepository.getStoreById(id);

        if (store) {
            baseResponse(res, true, 200, "Store found", store);
        } else {
            baseResponse(res, false, 404, "Store not found", null);
        }
    } catch (error) {
        baseResponse(res, false, 500, "Server error", null);
    }
};

exports.updateStore = async (req, res) => { 
    const { id, name, address } = req.body;

    if (!id || !name || !address) {
        return baseResponse(res, false, 400, "Missing store ID, name, or address", null);
    }

    try {
        const updatedStore = await storeRepository.updateStore(id, name, address);

        if (!updatedStore) {
            return baseResponse(res, false, 404, "Store not found", null);
        }

        baseResponse(res, true, 200, "Store updated", updatedStore);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", null);
    }
};


exports.deleteStore = async (req, res) => {
    const { id } = req.params;

    try {
        const store = await storeRepository.deleteStore(id)
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }

        await storeRepository.deleteStore(id);
        baseResponse(res, true, 200, "Store deleted", store);
    } catch (error) {
        baseResponse(res, false, 500, "Server error", null);
    }
}; 


