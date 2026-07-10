   import { useState } from "react";
import api from "../app/api";

export const useProperty = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Post a new property or update an existing one
     * @param {Object} formData - The raw form data
     * @param {Object} options - Options including edit mode and logic helpers
     * @returns {Promise<Object>} The API response
     */
    const saveProperty = async (formData, { isEditMode, editPropertyId, isRent, isResidential, isCommercial, getSubPropertyTypeName } = {}) => {
        setLoading(true);
        setError(null);
        try {
            const cleanId = (id) => (id && id !== "" ? id : undefined);

            const payload = {
                title: formData.title || formData.name,
                country: cleanId(formData.country),
                state: cleanId(formData.state),
                city: cleanId(formData.city),
                locality: formData.locality,
                pincode: formData.pincode,
                address: formData.address,
                propertyType: cleanId(formData.propertyType),
                lookingFor: cleanId(formData.category) || cleanId(formData.lookingFor),
                subPropertyType: cleanId(formData.subPropertyType),
                price: isRent ? (parseInt(formData.monthlyRent) || 0) : (parseInt(formData.price) || 0),
                securityDeposit: isRent ? (formData.securityDeposit === "None" ? 0 : (parseInt(formData.securityDepositAmount) || 0)) : 0,
                availableFrom: formData.availableFrom || undefined,
                constructionStatus: cleanId(formData.constructionStatus),
                possessionStatus: cleanId(formData.possessionStatus),
                amenities: Array.isArray(formData.amenities) ? formData.amenities : [],
                projectName: formData.projectSociety,
                images: Array.isArray(formData.images) ? formData.images : [],
                description: formData.description,
                area: parseInt(formData.area) || parseInt(formData.carpetArea) || parseInt(formData.builtUpArea) || 0,
                carpetArea: parseInt(formData.carpetArea) || 0,
                builtUpArea: parseInt(formData.builtUpArea) || 0,
                areaUnit: cleanId(formData.areaUnit),
                isActive: typeof formData.isActive === 'boolean' ? formData.isActive : true,
                verificationStatus: formData.verificationStatus || formData.verification || undefined
            };

            if (isResidential) {
                payload.residential = {
                    bedrooms: parseInt(formData.bedrooms) || 0,
                    bathrooms: parseInt(formData.bathrooms) || 0,
                    balconies: parseInt(formData.balconies) || 0,
                    floor: parseInt(formData.floor) || 0,
                    totalFloors: parseInt(formData.totalFloors) || 0,
                    furnishingStatus: cleanId(formData.furnishingStatus),
                    structure: cleanId(formData.structure),
                    carpetArea: parseInt(formData.residential?.carpetArea) || parseInt(formData.carpetArea) || 0,
                    builtUpArea: parseInt(formData.residential?.builtUpArea) || parseInt(formData.builtUpArea) || 0,
                    carpetAreaUnit: cleanId(formData.residential?.carpetAreaUnit) || cleanId(formData.carpetAreaUnit) || cleanId(formData.areaUnit),
                    builtUpAreaUnit: cleanId(formData.residential?.builtUpAreaUnit) || cleanId(formData.builtUpAreaUnit) || cleanId(formData.areaUnit)
                };
            }

            if (isCommercial) {
                payload.commercial = {
                    officeType: getSubPropertyTypeName,
                    meetingRooms: parseInt(formData.noOfMeetingRooms) || 0,
                    zoneType: cleanId(formData.zoneType),
                    locationHub: cleanId(formData.locationHub),
                    propertyCondition: formData.propertyCondition,
                    ownershipType: cleanId(formData.ownershipType)
                };
            }

            const response = isEditMode 
                ? await api.put(`/properties/${editPropertyId}`, payload)
                : await api.post("/properties", payload);

            return response.data;
        } catch (err) {
            const errData = err.response?.data;
            const errorMessage =
                errData?.error ||
                errData?.message ||
                (Array.isArray(errData?.errors)
                    ? errData.errors.map((e) => (typeof e === "string" ? e : e.msg || e.message || JSON.stringify(e))).join(", ")
                    : null) ||
                err.message ||
                "Failed to save property";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        saveProperty,
        loading,
        error
    };
};
