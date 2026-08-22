// Comprehensive Mock Database for Siddharth School Bus & Travels (Nashik)

export const INITIAL_SCHOOLS = [
  {
    id: "SCH01",
    name: "Fravashi International Academy",
    code: "FIA",
    location: "Gangapur Road, Nashik",
    contact: "+91 253 234 1122",
    activeStudents: 48,
    busAssigned: ["MH-15-RN-4501", "MH-15-RN-4504"]
  },
  {
    id: "SCH02",
    name: "Wisdom High International School",
    code: "WHIS",
    location: "Rameshwar Nagar, Nashik",
    contact: "+91 253 410 8899",
    activeStudents: 42,
    busAssigned: ["MH-15-RN-4502", "MH-15-RN-4505"]
  },
  {
    id: "SCH03",
    name: "Ashoka Universal School",
    code: "AUS",
    location: "Wadala / Ashoka Marg, Nashik",
    contact: "+91 253 679 3344",
    activeStudents: 56,
    busAssigned: ["MH-15-RN-4503"]
  },
  {
    id: "SCH04",
    name: "Delhi Public School Nashik",
    code: "DPSN",
    location: "Manur, Nashik",
    contact: "+91 253 268 4455",
    activeStudents: 35,
    busAssigned: ["MH-15-RN-4506"]
  }
];

export const INITIAL_FLEET = [
  {
    busNo: "Bus #1",
    plate: "MH-15-RN-4501",
    model: "Tata Winger Executive (22 Seater)",
    driverName: "Suresh Patil",
    driverPhone: "9823145678",
    routeId: "R1",
    routeName: "Route 1: Gangapur Road - College Road - Jehan Circle",
    status: "On Route",
    speed: "32 km/h",
    currentLocation: "Near Jehan Circle Stop",
    etaNextStop: "4 mins"
  },
  {
    busNo: "Bus #2",
    plate: "MH-15-RN-4502",
    model: "Tata Winger Deluxe (20 Seater)",
    driverName: "Ramesh Shinde",
    driverPhone: "9823567890",
    routeId: "R2",
    routeName: "Route 2: Indira Nagar - Mumbai Naka - Govind Nagar",
    status: "On Route",
    speed: "28 km/h",
    currentLocation: "Near Mumbai Naka Flyover",
    etaNextStop: "6 mins"
  },
  {
    busNo: "Bus #3",
    plate: "MH-15-RN-4503",
    model: "Eicher Starline (32 Seater)",
    driverName: "Dnyaneshwar Shinde",
    driverPhone: "9823876543",
    routeId: "R3",
    routeName: "Route 3: Mahatma Nagar - Canada Corner - Panchavati",
    status: "On Route",
    speed: "24 km/h",
    currentLocation: "Canada Corner Signal",
    etaNextStop: "8 mins"
  },
  {
    busNo: "Bus #4",
    plate: "MH-15-RN-4504",
    model: "Force Traveller Royale (26 Seater)",
    driverName: "Vijay Jadhav",
    driverPhone: "9823987123",
    routeId: "R4",
    routeName: "Route 4: Dwarka - Nashik Road - Upnagar",
    status: "School Bay",
    speed: "0 km/h",
    currentLocation: "Fravashi Academy Bus Bay",
    etaNextStop: "Next Trip 01:45 PM"
  }
];

export const INITIAL_STUDENTS = [
  {
    id: "STU-1001",
    rollNo: "FIA-7A-14",
    studentName: "Aarav Sharma",
    parentName: "Rajesh Sharma",
    parentPhone: "9876543210", // Multi-child parent demo
    alternatePhone: "9876543211",
    email: "rajesh.sharma@example.com",
    schoolName: "Fravashi International Academy",
    schoolId: "SCH01",
    grade: "Grade 7-A",
    busNo: "Bus #1",
    busPlate: "MH-15-RN-4501",
    routeId: "R1",
    routeName: "Route 1: Gangapur Road - College Road - Jehan Circle",
    stopName: "College Road Big Bazaar Corner",
    pickupTime: "07:15 AM",
    dropTime: "02:45 PM",
    liveStatus: {
      morningStatus: "Boarded (07:18 AM)",
      eveningStatus: "Expected Boarding (02:30 PM)",
      isLiveOnBus: true
    },
    feeDetails: {
      totalAnnualFee: 32000,
      paidAmount: 32000,
      dueAmount: 0,
      status: "PAID",
      phase1Amount: 16000,
      phase1Paid: 16000,
      phase1Status: "PAID",
      phase2Amount: 16000,
      phase2Paid: 16000,
      phase2Status: "PAID",
      lastPaymentDate: "2026-06-15",
      lastReceiptNo: "REC-2026-0891",
      nextDueDate: "Fully Settled for 2026-27",
      paymentMode: "UPI / PhonePe",
      paymentsHistory: [
        { receiptNo: "REC-2026-0891", amount: 16000, date: "2026-06-15", mode: "UPI", term: "Phase 2 (Term 2) Transport Fee" },
        { receiptNo: "REC-2026-0122", amount: 16000, date: "2026-04-10", mode: "Bank Transfer", term: "Phase 1 (Term 1) Transport Fee" }
      ]
    }
  },
  {
    id: "STU-1002",
    rollNo: "FIA-3B-08",
    studentName: "Ananya Sharma",
    parentName: "Rajesh Sharma",
    parentPhone: "9876543210", // Sibling of Aarav
    alternatePhone: "9876543211",
    email: "rajesh.sharma@example.com",
    schoolName: "Fravashi International Academy",
    schoolId: "SCH01",
    grade: "Grade 3-B",
    busNo: "Bus #1",
    busPlate: "MH-15-RN-4501",
    routeId: "R1",
    routeName: "Route 1: Gangapur Road - College Road - Jehan Circle",
    stopName: "College Road Big Bazaar Corner",
    pickupTime: "07:15 AM",
    dropTime: "02:45 PM",
    liveStatus: {
      morningStatus: "Boarded (07:18 AM)",
      eveningStatus: "Expected Boarding (02:30 PM)",
      isLiveOnBus: true
    },
    feeDetails: {
      totalAnnualFee: 28000,
      paidAmount: 14000,
      dueAmount: 14000,
      status: "DUE",
      phase1Amount: 14000,
      phase1Paid: 14000,
      phase1Status: "PAID",
      phase2Amount: 14000,
      phase2Paid: 0,
      phase2Status: "DUE",
      lastPaymentDate: "2026-04-10",
      lastReceiptNo: "REC-2026-0123",
      nextDueDate: "2026-10-15 (Phase 2 Due)",
      paymentMode: "Net Banking",
      paymentsHistory: [
        { receiptNo: "REC-2026-0123", amount: 14000, date: "2026-04-10", mode: "Net Banking", term: "Phase 1 (Term 1) Transport Fee" }
      ]
    }
  },
  {
    id: "STU-1003",
    rollNo: "WHIS-9C-22",
    studentName: "Vihaan Deshmukh",
    parentName: "Makarand Deshmukh",
    parentPhone: "9823012345",
    alternatePhone: "9823012346",
    email: "m.deshmukh@tcs.com",
    schoolName: "Wisdom High International School",
    schoolId: "SCH02",
    grade: "Grade 9-C",
    busNo: "Bus #2",
    busPlate: "MH-15-RN-4502",
    routeId: "R2",
    routeName: "Route 2: Indira Nagar - Mumbai Naka - Govind Nagar",
    stopName: "Indira Nagar Jogging Track",
    pickupTime: "06:50 AM",
    dropTime: "03:15 PM",
    liveStatus: {
      morningStatus: "Dropped at School (07:42 AM)",
      eveningStatus: "Waiting at School",
      isLiveOnBus: false
    },
    feeDetails: {
      totalAnnualFee: 36000,
      paidAmount: 36000,
      dueAmount: 0,
      status: "PAID",
      phase1Amount: 18000,
      phase1Paid: 18000,
      phase1Status: "PAID",
      phase2Amount: 18000,
      phase2Paid: 18000,
      phase2Status: "PAID",
      lastPaymentDate: "2026-07-02",
      lastReceiptNo: "REC-2026-1104",
      nextDueDate: "Fully Paid for 2026-27",
      paymentMode: "Google Pay",
      paymentsHistory: [
        { receiptNo: "REC-2026-1104", amount: 36000, date: "2026-07-02", mode: "Google Pay", term: "Full Academic Year (Phase 1 & 2)" }
      ]
    }
  },
  {
    id: "STU-1004",
    rollNo: "AUS-5A-11",
    studentName: "Aditi Kulkarni",
    parentName: "Sunil Kulkarni",
    parentPhone: "9988776655",
    alternatePhone: "9988776656",
    email: "sunil.kulkarni@infosys.com",
    schoolName: "Ashoka Universal School",
    schoolId: "SCH03",
    grade: "Grade 5-A",
    busNo: "Bus #3",
    busPlate: "MH-15-RN-4503",
    routeId: "R3",
    routeName: "Route 3: Mahatma Nagar - Canada Corner - Panchavati",
    stopName: "Mahatma Nagar Cricket Ground",
    pickupTime: "07:30 AM",
    dropTime: "02:15 PM",
    liveStatus: {
      morningStatus: "Boarded (07:32 AM)",
      eveningStatus: "In Transit",
      isLiveOnBus: true
    },
    feeDetails: {
      totalAnnualFee: 30000,
      paidAmount: 10000,
      dueAmount: 20000,
      status: "DUE",
      phase1Amount: 15000,
      phase1Paid: 10000,
      phase1Status: "PARTIAL",
      phase2Amount: 15000,
      phase2Paid: 0,
      phase2Status: "DUE",
      lastPaymentDate: "2026-04-05",
      lastReceiptNo: "REC-2026-0044",
      nextDueDate: "2026-10-15 (Phase 1 & 2 Dues)",
      paymentMode: "Cash Receipt",
      paymentsHistory: [
        { receiptNo: "REC-2026-0044", amount: 10000, date: "2026-04-05", mode: "Cash", term: "Phase 1 Partial Installment" }
      ]
    }
  },
  {
    id: "STU-1008",
    rollNo: "FIA-10A-02",
    studentName: "Tanvi More",
    parentName: "Prashant More",
    parentPhone: "8767948553",
    alternatePhone: "9890123456",
    email: "prashant.more@siddharth.com",
    schoolName: "Fravashi International Academy",
    schoolId: "SCH01",
    grade: "Grade 10-A",
    busNo: "Bus #1",
    busPlate: "MH-15-RN-4501",
    routeId: "R1",
    routeName: "Route 1: Gangapur Road - College Road - Jehan Circle",
    stopName: "Gangapur Road Navshya Ganpati",
    pickupTime: "07:30 AM",
    dropTime: "02:30 PM",
    liveStatus: {
      morningStatus: "Dropped at School (07:50 AM)",
      eveningStatus: "En Route to Stop",
      isLiveOnBus: true
    },
    feeDetails: {
      totalAnnualFee: 32000,
      paidAmount: 32000,
      dueAmount: 0,
      status: "PAID",
      phase1Amount: 16000,
      phase1Paid: 16000,
      phase1Status: "PAID",
      phase2Amount: 16000,
      phase2Paid: 16000,
      phase2Status: "PAID",
      lastPaymentDate: "2026-05-10",
      lastReceiptNo: "REC-2026-0399",
      nextDueDate: "Fully Paid for 2026-27",
      paymentMode: "UPI / PhonePe",
      paymentsHistory: [
        { receiptNo: "REC-2026-0399", amount: 32000, date: "2026-05-10", mode: "UPI", term: "Annual Full (Phase 1 & 2)" }
      ]
    }
  }
];

export const INITIAL_NOTICES = [
  {
    id: "NOT-101",
    title: "Bus #3 Running on Time - Gangapur Road Cleared",
    content: "All morning school bus routes in Nashik are operating normally on schedule. Drivers and attendants are actively monitoring stop halts.",
    target: "All Parents",
    type: "INFO",
    date: "2026-08-20",
    time: "07:30 AM",
    urgent: false
  },
  {
    id: "NOT-102",
    title: "Phase 2 (Term 2) Bus Transport Fees Notice",
    content: "Phase 2 (Term 2) transportation fee cycle (Nov 2026 – Mar 2027) is now active. Parents with pending Phase 2 balances can clear fees online via UPI (8767948553@upi) or offline cash to instantly download approved paper receipts.",
    target: "Parents with Due Fees",
    type: "FEE_REMINDER",
    date: "2026-08-18",
    time: "10:30 AM",
    urgent: false
  }
];

export const INITIAL_PENDING_LINKS = [
  {
    id: "REQ-501",
    parentName: "Vikram Malhotra",
    phone: "9822998877",
    requestedStudentName: "Devansh Malhotra",
    schoolName: "Fravashi International Academy",
    grade: "Grade 6-B",
    routeInterested: "Route 1: Gangapur Road",
    stopName: "Jehan Circle",
    requestDate: "2026-08-19 18:30",
    status: "PENDING"
  }
];

export const OWNER_CONFIG = {
  name: "Siddharth Shardul",
  businessName: "Siddharth School Bus & Travels",
  primaryPhone: "8767948553",
  whatsappNumber: "918767948553",
  email: "siddharth.travels.nashik@gmail.com",
  officeAddress: "Shop No. 4, Shree Samarth Plaza, Near College Road, Nashik - 422005",
  estYear: "2017",
  city: "Nashik"
};
