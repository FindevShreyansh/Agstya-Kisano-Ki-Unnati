import { useEffect, useState } from "react";

export const adminStorageKeys = {
  farmers: "agstya_admin_farmers",
  buyers: "agstya_admin_buyers",
  crops: "agstya_admin_crops",
  procurement: "agstya_admin_procurement",
};

export const adminSamples = {
  farmers: [
    { id: "F-101", name: "Ramesh Kumar", mobile: "+91 98765 43210", location: "Mandya, Karnataka", mainCrop: "Rice", status: "Active" },
    { id: "F-102", name: "Anita Devi", mobile: "+91 98765 43211", location: "Raichur, Karnataka", mainCrop: "Rice", status: "Active" },
    { id: "F-103", name: "Suresh Patil", mobile: "+91 98765 43212", location: "Dharwad, Karnataka", mainCrop: "Wheat", status: "Inactive" },
    { id: "F-104", name: "Manoj Reddy", mobile: "+91 98765 43213", location: "Davangere, Karnataka", mainCrop: "Maize", status: "Active" },
  ],
  buyers: [
    { id: "B-201", businessName: "Bangalore Rice Traders", businessType: "Wholesale Trader", location: "Bengaluru, Karnataka", mainRequirement: "Rice", monthlyRequirement: "5,000 kg", status: "Active" },
    { id: "B-202", businessName: "Fresh Foods Pvt Ltd", businessType: "Food Processor", location: "Mysuru, Karnataka", mainRequirement: "Wheat", monthlyRequirement: "3,000 kg", status: "Active" },
    { id: "B-203", businessName: "Bangalore Grain Industries", businessType: "Manufacturer", location: "Bengaluru, Karnataka", mainRequirement: "Maize", monthlyRequirement: "4,000 kg", status: "Inactive" },
  ],
  crops: [
    { id: "CL-301", farmerName: "Ramesh Kumar", crop: "Rice", quantity: 3000, expectedPrice: 42, quality: "Grade A", location: "Mandya, Karnataka", harvestDate: "2026-10-15", status: "Active" },
    { id: "CL-302", farmerName: "Suresh Patil", crop: "Wheat", quantity: 2000, expectedPrice: 30, quality: "Grade A", location: "Dharwad, Karnataka", harvestDate: "2026-11-01", status: "Under Review" },
    { id: "CL-303", farmerName: "Manoj Reddy", crop: "Maize", quantity: 4000, expectedPrice: 22, quality: "Grade A", location: "Davangere, Karnataka", harvestDate: "2026-10-25", status: "Active" },
    { id: "CL-304", farmerName: "Anita Devi", crop: "Rice", quantity: 5000, expectedPrice: 38, quality: "Grade B", location: "Raichur, Karnataka", harvestDate: "2026-10-20", status: "Removed" },
  ],
  procurement: [
    { id: "PR-401", farmer: "Ramesh Kumar", buyer: "Bangalore Rice Traders", crop: "Rice", quantity: 3000, expectedPrice: 42, location: "Mandya, Karnataka", date: "2026-10-02", status: "Pending" },
    { id: "PR-402", farmer: "Anita Devi", buyer: "Bangalore Rice Traders", crop: "Rice", quantity: 5000, expectedPrice: 38, location: "Raichur, Karnataka", date: "2026-10-03", status: "Accepted" },
    { id: "PR-403", farmer: "Manoj Reddy", buyer: "Bangalore Grain Industries", crop: "Maize", quantity: 4000, expectedPrice: 22, location: "Davangere, Karnataka", date: "2026-10-04", status: "Pickup Scheduled" },
    { id: "PR-404", farmer: "Suresh Patil", buyer: "Fresh Foods Pvt Ltd", crop: "Wheat", quantity: 2000, expectedPrice: 30, location: "Dharwad, Karnataka", date: "2026-10-05", status: "In Transit" },
    { id: "PR-405", farmer: "Lakshmi Bai", buyer: "Fresh Potato Foods", crop: "Potato", quantity: 1500, expectedPrice: 18, location: "Hassan, Karnataka", date: "2026-10-06", status: "Delivered" },
    { id: "PR-406", farmer: "Priya Sharma", buyer: "Fresh Foods Pvt Ltd", crop: "Wheat", quantity: 3500, expectedPrice: 28, location: "Bijapur, Karnataka", date: "2026-10-07", status: "Rejected" },
  ],
};

// Keep page state in sync with its own admin collection in localStorage.
export function useAdminCollection(collection) {
  const storageKey = adminStorageKeys[collection];
  const initialData = adminSamples[collection];

  const [records, setRecords] = useState(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData !== null) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) return parsedData;
        console.error(`Saved admin ${collection} data must be an array.`);
      }
    } catch (error) {
      console.error(`Unable to load admin ${collection} data.`, error);
    }

    return initialData.map((record) => ({ ...record }));
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(records));
    } catch (error) {
      console.error(`Unable to save admin ${collection} data.`, error);
    }
  }, [collection, records, storageKey]);

  const updateRecord = (recordId, changes) => {
    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === recordId ? { ...record, ...changes } : record
      )
    );
  };

  return { records, updateRecord };
}
