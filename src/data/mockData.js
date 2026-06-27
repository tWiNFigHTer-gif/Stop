// Initial Mock Data for STOP Dashboard - Chakkittapara Panchayat
// All coordinates are real approximations for the Chakkittapara / Peruvannamuzhi area.

export const initialPlaces = [
  {
    id: "place-1",
    name: "Peruvannamuzhi Dam",
    description: "A scenic reservoir tucked in the Western Ghats, featuring a beautiful artificial lake, lush gardens, speed boating, a children's park, and a crocodile rehabilitation center. It provides water to surrounding villages and is a hub for family picnics.",
    category: "Dam & Ecotourism",
    entryFee: 40,
    openingHours: "09:00 AM - 05:30 PM",
    maxCapacity: 800,
    currentStatus: "Open", // "Open" or "Closed"
    lat: 11.595,
    lng: 75.820,
    images: [
      "/assets/images/dam_1.png",
      "/assets/images/dam_2.png"
    ],
    crowdLevel: "Moderate", // "Low", "Moderate", "High"
    currentOccupancy: 420,
    riskLevel: "Low", // "Low", "Medium", "High", "Critical"
    restrictions: "Single-use plastics prohibited. Stay within fenced walkway zones. Do not feed wildlife.",
    workersCount: 14,
    reachInstructions: "Located 60 km from Kozhikode town. Accessible by direct KSRTC buses or taxi via Balussery-Koothali route.",
    visitorsToday: 680,
    feedback: [
      { id: "f-1", tourist: "Anoop K.", rating: 5, comment: "Beautiful gardens and very peaceful. The speed boating was amazing!" },
      { id: "f-2", tourist: "Meera Nair", rating: 4, comment: "Good facilities, but children's play area needs better maintenance." }
    ],
    maintenanceHistory: [
      { date: "2026-06-15", task: "Re-painted walkway safety railings", status: "Completed" },
      { date: "2026-05-10", task: "Trimming and landscaping garden hedges", status: "Completed" }
    ]
  },
  {
    id: "place-2",
    name: "Janaki Kaad - Jeep Safari",
    description: "A dense, rich patch of tropical forest home to diverse flora, rare butterflies, and medicinal herbs. Named in memory of social reformer Janaki Amma, it offers guided ecological treks and thrilling jeep safaris through designated jungle trails.",
    category: "Wildlife & Safari",
    entryFee: 150,
    openingHours: "08:00 AM - 04:30 PM",
    maxCapacity: 250,
    currentStatus: "Open",
    lat: 11.605,
    lng: 75.765,
    images: [
      "/assets/images/forest_1.png",
      "/assets/images/forest_2.png"
    ],
    crowdLevel: "High",
    currentOccupancy: 210,
    riskLevel: "Medium",
    restrictions: "Loud noise prohibited. Heavy vehicles strictly blocked. Stay inside the safari jeeps at all times.",
    workersCount: 20,
    reachInstructions: "Located 8 km from Chakkittapara town. Take the Kuttiady route, turn off at Janaki Junction. Best reached by hiring a local registered jeep.",
    visitorsToday: 240,
    feedback: [
      { id: "f-3", tourist: "David Miller", rating: 5, comment: "Incredible biodiversity. Spotted hornbills and rare butterflies!" },
      { id: "f-4", tourist: "Sajeesh P.", rating: 3, comment: "Jeep ride is bumpy but worth it. Crowd management was a bit chaotic at the ticket counter." }
    ],
    maintenanceHistory: [
      { date: "2026-06-01", task: "Cleared fallen bamboo along the safari track", status: "Completed" }
    ]
  },
  {
    id: "place-3",
    name: "Chakkittapara Tiger Park",
    description: "A conservation park currently undergoing safety reinforcement, featuring panoramic views, rocky ridges, and an eco-tourism forest zone dedicated to large cat preservation education and local ecology awareness.",
    category: "Eco-Park & Conservation",
    entryFee: 50,
    openingHours: "09:00 AM - 05:00 PM",
    maxCapacity: 400,
    currentStatus: "Closed",
    lat: 11.590,
    lng: 75.790,
    images: [
      "/assets/images/tiger_1.png"
    ],
    crowdLevel: "Low",
    currentOccupancy: 0,
    riskLevel: "High",
    restrictions: "Temporary closure for safety barrier maintenance and fencing upgrades. Strict trespassing fines apply.",
    workersCount: 5,
    reachInstructions: "Located 1.5 km from Chakkittapara central town near the Panchayat block building. Accessible by auto-rickshaw or walking.",
    visitorsToday: 0,
    feedback: [],
    maintenanceHistory: [
      { date: "2026-06-20", task: "Reinforcing perimeter security fences", status: "In Progress" }
    ]
  },
  {
    id: "place-4",
    name: "Meen Thulli Para - Kayaking",
    description: "A pristine river rapid zone surrounded by huge rocky slabs (Meenthulli rocks), famous for adventure water sports, white water kayaking, and natural river pools. Certified safety instructors guide visitors.",
    category: "Adventure Water Sports",
    entryFee: 250,
    openingHours: "07:00 AM - 06:00 PM",
    maxCapacity: 120,
    currentStatus: "Open",
    lat: 11.580,
    lng: 75.810,
    images: [
      "/assets/images/kayaking_1.png",
      "/assets/images/kayaking_2.png"
    ],
    crowdLevel: "Low",
    currentOccupancy: 35,
    riskLevel: "Low",
    restrictions: "Life jackets compulsory. Swimming alone is banned. Underage kids must be accompanied by instructors.",
    workersCount: 10,
    reachInstructions: "Drive 5 km east from Chakkittapara town center. Road leads directly to the river base. Free parking available at the counter.",
    visitorsToday: 110,
    feedback: [
      { id: "f-5", tourist: "Rahul Raj", rating: 5, comment: "Best kayaking experience in North Kerala! Staff is well trained." }
    ],
    maintenanceHistory: [
      { date: "2026-05-28", task: "Inspected and replaced water rescue kits", status: "Completed" }
    ]
  }
];

export const initialBusinesses = [
  {
    id: "biz-1",
    name: "Janaki Forest Eco-Safari (Jeep Operator)",
    owner: "Vipin Das",
    phone: "+91 98451 22340",
    category: "Jeep Operator",
    verificationStatus: "Approved", // "Pending", "Approved", "Rejected"
    licenseStatus: "Active",
    currentAvailability: "Available",
    lat: 11.604,
    lng: 75.764,
    details: {
      driverName: "Vipin Das",
      drivingLicense: "DL-KL56-2015-8892",
      vehicleNumber: "KL-56-F-8890 (Mahindra Thar)",
      vehicleCapacity: 6,
      currentLocation: "Janaki Kaad Entrance Gate",
      documents: {
        businessLicense: "/assets/docs/lic_vipin.pdf",
        driverLicense: "/assets/docs/dl_vipin.pdf",
        vehicleRegistration: "/assets/docs/rc_vipin.pdf",
        tourismPermit: "/assets/docs/permit_vipin.pdf",
        identityVerification: "/assets/docs/id_vipin.pdf"
      }
    }
  },
  {
    id: "biz-2",
    name: "Forest Trails Eco-Stay",
    owner: "Sreedharan Nair",
    phone: "+91 97443 11200",
    category: "Homestay",
    verificationStatus: "Approved",
    licenseStatus: "Active",
    currentAvailability: "Rooms Available",
    lat: 11.602,
    lng: 75.767,
    details: {
      stayName: "Forest Trails Eco-Stay",
      owner: "Sreedharan Nair",
      type: "Eco-Cottage",
      license: "HS-CH-2024-998",
      roomsAvailable: 3,
      totalRooms: 5,
      pricing: "₹2,500 per night",
      amenities: ["Traditional Kerala Meals", "AC", "High-Speed WiFi", "Guided Farm Walk"],
      rules: "No loud music after 10:00 PM. No plastic waste disposal outside bins.",
      stayRegister: [
        { name: "Adarsh Sen & Family", checkIn: "2026-06-26", checkOut: "2026-06-28", room: "Room 102" },
        { name: "John Doe", checkIn: "2026-06-27", checkOut: "2026-06-29", room: "Room 104" }
      ],
      documents: {
        businessLicense: "/assets/docs/lic_sreedharan.pdf",
        tourismPermit: "/assets/docs/permit_sreedharan.pdf",
        identityVerification: "/assets/docs/id_sreedharan.pdf"
      }
    }
  },
  {
    id: "biz-3",
    name: "Dam Side Breeze Boating",
    owner: "Peruvannamuzhi Cooperative",
    phone: "+91 49626 55432",
    category: "Boat Services",
    verificationStatus: "Approved",
    licenseStatus: "Active",
    currentAvailability: "Operating",
    lat: 11.594,
    lng: 75.821,
    details: {
      boatName: "Jalatarangini",
      capacity: 20,
      timings: "09:00 AM - 05:00 PM",
      currentOccupancy: 12,
      safetyCertificate: "SC-GOV-KL-2026/104 (Valid till Dec 2026)",
      documents: {
        businessLicense: "/assets/docs/lic_coop.pdf",
        tourismPermit: "/assets/docs/permit_coop.pdf"
      }
    }
  },
  {
    id: "biz-4",
    name: "RiverRun Adventure Club",
    owner: "Midhun Lal",
    phone: "+91 99954 38821",
    category: "Kayaking",
    verificationStatus: "Approved",
    licenseStatus: "Active",
    currentAvailability: "Available",
    lat: 11.581,
    lng: 75.811,
    details: {
      availableKayaks: 14,
      timings: "07:00 AM - 06:00 PM",
      instructorAvailability: "3 Certified Instructors On-duty",
      safetyEquipment: "Life Jackets, Helmets, River Rescue Rope Kits, First Aid Box",
      documents: {
        businessLicense: "/assets/docs/lic_midhun.pdf",
        tourismPermit: "/assets/docs/permit_midhun.pdf",
        identityVerification: "/assets/docs/id_midhun.pdf"
      }
    }
  },
  {
    id: "biz-5",
    name: "Malabar Flavours Restaurant",
    owner: "Faisal Ahmed",
    phone: "+91 80862 33441",
    category: "Restaurants",
    verificationStatus: "Approved",
    licenseStatus: "Active",
    currentAvailability: "Open Now",
    lat: 11.591,
    lng: 75.792,
    details: {
      cuisine: "Kerala Traditional / Biryani Speciality",
      seatingCapacity: 45,
      pricing: "Budget-Friendly",
      documents: {
        businessLicense: "/assets/docs/lic_faisal.pdf"
      }
    }
  },
  {
    id: "biz-6",
    name: "Chakkittapara Highlands Resort",
    owner: "Antony Kurian",
    phone: "+91 94471 88992",
    category: "Resorts",
    verificationStatus: "Pending", // Needs Panchayat Verification
    licenseStatus: "Pending Audit",
    currentAvailability: "Pre-booking Only",
    lat: 11.587,
    lng: 75.796,
    details: {
      stayName: "Chakkittapara Highlands Resort",
      owner: "Antony Kurian",
      type: "Luxury Resort",
      license: "PENDING-RES-098",
      roomsAvailable: 0,
      totalRooms: 15,
      pricing: "₹6,000 per night",
      amenities: ["Swimming Pool", "Spa", "Trekking Trails", "Multi-cuisine Restaurant"],
      rules: "Valid Govt ID required. Eco-conscious stays (no plastic bottles permitted).",
      stayRegister: [],
      documents: {
        businessLicense: "/assets/docs/lic_antony.pdf",
        tourismPermit: "/assets/docs/permit_antony.pdf",
        identityVerification: "/assets/docs/id_antony.pdf"
      }
    }
  },
  {
    id: "biz-7",
    name: "Eco-Wilderness Camp & Tents",
    owner: "Biju Joseph",
    phone: "+91 94002 88449",
    category: "Camping",
    verificationStatus: "Pending",
    licenseStatus: "Expired",
    currentAvailability: "Closed for Auditing",
    lat: 11.608,
    lng: 75.762,
    details: {
      campName: "Eco-Wilderness Camp",
      tentsAvailable: 0,
      safetyEquipment: "Forest Guard Liaison, Solar Fence, Fire Extinguisher",
      documents: {
        businessLicense: "/assets/docs/lic_biju.pdf",
        tourismPermit: "/assets/docs/permit_biju.pdf",
        identityVerification: "/assets/docs/id_biju.pdf"
      }
    }
  }
];

export const initialAlerts = [
  {
    id: "alert-1",
    type: "Heavy Rain Alert",
    message: "Heavy monsoon showers expected over Peruvannamuzhi Dam area. Boating activities are temporarily suspended for safety.",
    destinationId: "place-1",
    riskLevel: "High", // "Low", "Medium", "High", "Critical"
    publishedAt: "2026-06-27T08:30:00Z",
    isActive: true
  },
  {
    id: "alert-2",
    type: "Road Closure Notice",
    message: "Fallen tree blocking the jungle road to Janaki Kaad. Public works department is working on clearing it. Use diversion path.",
    destinationId: "place-2",
    riskLevel: "Medium",
    publishedAt: "2026-06-27T14:15:00Z",
    isActive: true
  },
  {
    id: "alert-3",
    type: "Tiger Park Fencing Repairs",
    message: "Restricted entry inside Tiger Park boundary due to ongoing mesh repair. Security personnel are deployed.",
    destinationId: "place-3",
    riskLevel: "Critical",
    publishedAt: "2026-06-26T09:00:00Z",
    isActive: true
  }
];

export const initialComplaints = [
  {
    id: "comp-1",
    category: "Garbage",
    reporter: "Sandeep Krishna (Tourist)",
    phone: "+91 95442 88711",
    description: "Huge pile of plastic wraps and bottles dumped near the crocodile pool garden in Peruvannamuzhi Dam.",
    destinationId: "place-1",
    department: "Waste Management",
    status: "Pending", // "Pending", "In Progress", "Resolved"
    reportedAt: "2026-06-27T10:10:00Z"
  },
  {
    id: "comp-2",
    category: "Broken Infrastructure",
    reporter: "Amrita Sen (Tourist)",
    phone: "+91 88443 00223",
    description: "The handrail at Meen Thulli Para viewing deck is loose and posing a risk to children during photoshoots.",
    destinationId: "place-4",
    department: "Public Works (PWD)",
    status: "In Progress",
    reportedAt: "2026-06-27T11:45:00Z"
  },
  {
    id: "comp-3",
    category: "Overpricing",
    reporter: "George Thomas (Tourist)",
    phone: "+91 99441 55990",
    description: "An unregistered local shop near Janaki Kaad ticketing counter is charging double the printed price for water and juice.",
    destinationId: "place-2",
    department: "Revenue & Licensing",
    status: "Pending",
    reportedAt: "2026-06-27T15:20:00Z"
  },
  {
    id: "comp-4",
    category: "Parking",
    reporter: "Haris P. (Local)",
    phone: "+91 97463 88121",
    description: "Tourists parking on both sides of the narrow lane near Meenthullipara blocking bus transit routes.",
    destinationId: "place-4",
    department: "Traffic Police Liaison",
    status: "Resolved",
    reportedAt: "2026-06-26T14:00:00Z",
    resolutionNotes: "Traffic police deployed barricades to restrict roadside parking. Temporary parking lot signage installed."
  }
];

export const initialMaintenance = [
  {
    id: "maint-1",
    item: "Walkway Railing repair",
    description: "Weld the loose steel bars on the walkway bordering the Peruvannamuzhi canal.",
    destinationId: "place-1",
    status: "Pending", // "Pending", "In Progress", "Completed"
    assignedTo: "PWD Welder Team",
    reportedDate: "2026-06-25"
  },
  {
    id: "maint-2",
    item: "Solar Street lights replacement",
    description: "Replace 3 battery cells and panels on the street poles leading to Janaki Kaad safari gate.",
    destinationId: "place-2",
    status: "In Progress",
    assignedTo: "KSEB Solar Contractor",
    reportedDate: "2026-06-26"
  },
  {
    id: "maint-3",
    item: "Tiger Park security fence mesh",
    description: "Install heavy link galvanized fencing mesh around the 2km rocky perimeter.",
    destinationId: "place-3",
    status: "In Progress",
    assignedTo: "Eco-Forestry Contractor",
    reportedDate: "2026-06-20"
  },
  {
    id: "maint-4",
    item: "Toilet Block Cleaning & Flush Repairs",
    description: "Fix flushing valves and install soap dispensers in the public restrooms at Meen Thulli Para.",
    destinationId: "place-4",
    status: "Completed",
    assignedTo: "Panchayat Sanitation Unit",
    reportedDate: "2026-06-24",
    completedDate: "2026-06-26"
  }
];

// Hospital, Emergency, Police, and Parking static markers
export const staticMapLocations = [
  {
    id: "hosp-1",
    name: "Chakkittapara Family Health Centre (FHC)",
    category: "Hospitals",
    lat: 11.592,
    lng: 75.787,
    description: "Primary government health facility, open 24/7 for emergency stabilization."
  },
  {
    id: "emerg-1",
    name: "Forest Range Fire Station & Rescue Point",
    category: "Emergency locations",
    lat: 11.598,
    lng: 75.795,
    description: "Forest rescue team equipped for wildlife and deep canopy emergencies."
  },
  {
    id: "park-1",
    name: "Peruvannamuzhi Public Parking Ground",
    category: "Parking",
    lat: 11.596,
    lng: 75.818,
    description: "Spacious pay-and-park for light and heavy vehicles."
  },
  {
    id: "cafe-1",
    name: "Panchayat Café & Rest Stop",
    category: "Cafes",
    lat: 11.591,
    lng: 75.790,
    description: "Local tea and snacks run by Kudumbashree self-help groups."
  }
];
