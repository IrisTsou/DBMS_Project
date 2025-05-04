import {
    getPropertiesByLandlord,
    getPropertyById,
    addProperty,
    updateProperty,
    deleteProperty,
    getAvailableRooms
  } from '../models/propertyModel.js';
  
  // 獲取房東的所有物業
  export const getProperties = async (req, res) => {
    try {
      const landlordId = req.body.landlord_ID; // 假設房東 ID 從請求體獲取
      const properties = await getPropertiesByLandlord(landlordId);
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // 獲取單個物業
  export const getProperty = async (req, res) => {
    try {
      const { propertyId } = req.params;
      const landlordId = req.body.landlord_ID;
      const property = await getPropertyById(propertyId, landlordId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      res.status(200).json(property);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // 新增物業
  export const createProperty = async (req, res) => {
    try {
      const landlordId = req.body.landlord_ID;
      const propertyData = req.body;
      const newProperty = await addProperty(propertyData, landlordId);
      res.status(201).json(newProperty);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // 更新物業
  export const updatePropertyData = async (req, res) => {
    try {
      const { propertyId } = req.params;
      const landlordId = req.body.landlord_ID;
      const propertyData = req.body;
      const updatedProperty = await updateProperty(propertyId, propertyData, landlordId);
      res.status(200).json(updatedProperty);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // 刪除物業
  export const deletePropertyData = async (req, res) => {
    try {
      const { propertyId } = req.params;
      const landlordId = req.body.landlord_ID;
      const result = await deleteProperty(propertyId, landlordId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // 獲取可用房間
  export const getAvailableRoomsData = async (req, res) => {
    try {
      const { propertyId } = req.params;
      const landlordId = req.body.landlord_ID;
      const rooms = await getAvailableRooms(propertyId, landlordId);
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };