export interface PriceTier {
  minQty: number;
  maxQty?: number;
  unitPrice: number; // in INR
}

export interface ProductSpecs {
  wattage: string;
  lumens: string;
  colorTemp: string; // e.g., "6500K Cool Daylight", "3000K Warm White"
  warranty: string; // e.g., "1 Year Replacement", "2 Years Heavy Duty"
  driverType: string; // e.g., "HPF IC Surge Driver (4kV)"
  chipType: string; // e.g., "SMD 2835 High Efficiency"
  pcsPerBox: number; // e.g., 100
  housingMaterial: string; // e.g., "PBT Heat Sink + Aluminum"
  operatingVoltage: string; // e.g., "90V - 300V AC"
}

export interface Product {
  id: string;
  name: string;
  modelCode: string;
  category: 'Finished LED Bulbs' | 'Raw Materials' | 'Inverter AC/DC Bulbs' | 'Drivers & MCPCBs' | 'COB & Panel Lights' | 'Flood & Street Lights';
  image: string;
  basePrice: number;
  moq: number; // Minimum Order Quantity
  tiers: PriceTier[];
  specs: ProductSpecs;
  inStock: boolean;
  stockCount: number;
  isPopular?: boolean;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  calculatedUnitPrice: number;
  totalPrice: number;
}

export interface BusinessInfo {
  companyName: string;
  ownerName: string;
  designation: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  email: string;
  gstin: string;
  udyam: string; // MSME ID
  establishedYear: number;
  warehouseAddress: string;
  city: string;
  state: string;
  pincode: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    upiId: string;
  };
}
