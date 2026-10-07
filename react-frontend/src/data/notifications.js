export const notificationStorageKeys = {
  farmer: "agstya_farmer_notifications",
  buyer: "agstya_buyer_notifications",
};

export const sampleNotifications = {
  farmer: [
    {
      id: "farmer-accepted-request",
      title: "Buyer Accepted Your Request",
      message:
        "Bangalore Rice Traders accepted your procurement request for Rice.",
      type: "success",
      date: "2026-10-07",
      read: false,
      role: "farmer",
    },
    {
      id: "farmer-new-requirement",
      title: "New Buyer Requirement",
      message: "Fresh Foods Pvt Ltd is looking for 3000 kg of Wheat.",
      type: "info",
      date: "2026-10-06",
      read: false,
      role: "farmer",
    },
    {
      id: "farmer-procurement-update",
      title: "Procurement Update",
      message: "Your Rice procurement has been scheduled for pickup.",
      type: "update",
      date: "2026-10-05",
      read: false,
      role: "farmer",
    },
  ],
  buyer: [
    {
      id: "buyer-farmer-interest",
      title: "New Farmer Interest",
      message: "A farmer has shown interest in your Rice requirement.",
      type: "info",
      date: "2026-10-07",
      read: false,
      role: "buyer",
    },
    {
      id: "buyer-crop-match",
      title: "New Crop Match",
      message: "A farmer-listed crop matches your Wheat requirement.",
      type: "success",
      date: "2026-10-06",
      read: false,
      role: "buyer",
    },
    {
      id: "buyer-new-procurement-request",
      title: "New Procurement Request",
      message: "You received a new procurement request from a farmer.",
      type: "update",
      date: "2026-10-05",
      read: false,
      role: "buyer",
    },
  ],
};
