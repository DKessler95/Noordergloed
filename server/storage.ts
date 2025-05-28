import { 
  Product, 
  InsertProduct, 
  Order, 
  InsertOrder, 
  RamenOrder, 
  InsertRamenOrder,
  ContactMessage,
  InsertContactMessage 
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: number, stock: number): Promise<Product | undefined>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Ramen Orders
  getRamenOrders(): Promise<RamenOrder[]>;
  createRamenOrder(ramenOrder: InsertRamenOrder): Promise<RamenOrder>;
  getRamenOrdersByDate(date: Date): Promise<RamenOrder[]>;
  updateRamenOrderStatus(id: number, status: string): Promise<RamenOrder | undefined>;
  confirmRamenOrdersForDate(date: Date): Promise<RamenOrder[]>;
  
  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Admin Authentication
  getAdminByUsername(username: string): Promise<{ id: number; username: string; password: string; role: string } | undefined>;
  createAdminUser(username: string, hashedPassword: string): Promise<{ id: number; username: string; role: string }>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private ramenOrders: Map<number, RamenOrder>;
  private contactMessages: Map<number, ContactMessage>;
  private adminUsers: Map<string, { id: number; username: string; password: string; role: string }>;
  private currentProductId: number;
  private currentOrderId: number;
  private currentRamenOrderId: number;
  private currentMessageId: number;
  private currentAdminId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.ramenOrders = new Map();
    this.contactMessages = new Map();
    this.adminUsers = new Map();
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentRamenOrderId = 1;
    this.currentMessageId = 1;
    this.currentAdminId = 1;
    
    // Initialize with sample products and admin user
    this.initializeProducts();
    this.initializeAdminUser();
  }

  private initializeProducts() {
    const elderflowerSyrup: Product = {
      id: this.currentProductId++,
      name: "Vlierbloesem Siroop",
      description: "Handgeplukt bij de Hamburgervijver. 30 verse schermen per liter voor die authentieke zomersmaak. Perfect voor limonade of cocktails.",
      price: "6.99",
      stock: 8,
      maxStock: 15,
      category: "syrup",
      imageUrl: "/images/voorkant-siroop.png",
      featured: true,
      limitedStock: false,
      createdAt: new Date(),
    };

    const roseSyrup: Product = {
      id: this.currentProductId++,
      name: "Rozen Siroop",
      description: "Delicate rozenblaadjes uit onze eigen tuin aan de Star Numanstraat. Een subtiele bloemensmaak die perfect past bij thee of prosecco.",
      price: "6.99",
      stock: 5,
      maxStock: 15,
      category: "syrup",
      imageUrl: "/images/achterkant-siroop.png",
      featured: true,
      limitedStock: false,
      createdAt: new Date(),
    };

    const ramenSet: Product = {
      id: this.currentProductId++,
      name: "Chicken Shoyu Ramen",
      description: "Exclusieve Chicken Shoyu Ramen voor 6 personen. Verse lokale ingrediënten, zelfgemaakte noedels en inclusief toppings. €12.50 per persoon.",
      price: "12.50",
      stock: 6,
      maxStock: 6,
      category: "ramen",
      imageUrl: "/images/chicken-shoyu-ramen.jpg",
      featured: true,
      limitedStock: false,
      createdAt: new Date(),
    };

    this.products.set(elderflowerSyrup.id, elderflowerSyrup);
    this.products.set(roseSyrup.id, roseSyrup);
    this.products.set(ramenSet.id, ramenSet);
  }

  private initializeAdminUser() {
    // Create default admin user: admin/admin
    const defaultAdmin = {
      id: this.currentAdminId++,
      username: "admin",
      password: "admin", // In production, this should be hashed
      role: "admin"
    };
    this.adminUsers.set(defaultAdmin.username, defaultAdmin);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProductStock(id: number, stock: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (product) {
      const updatedProduct = { ...product, stock };
      this.products.set(id, updatedProduct);
      return updatedProduct;
    }
    return undefined;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  // Ramen Orders
  async getRamenOrders(): Promise<RamenOrder[]> {
    return Array.from(this.ramenOrders.values());
  }

  async createRamenOrder(insertRamenOrder: InsertRamenOrder): Promise<RamenOrder> {
    const id = this.currentRamenOrderId++;
    const ramenOrder: RamenOrder = { 
      ...insertRamenOrder, 
      id, 
      customerPhone: insertRamenOrder.customerPhone || null,
      status: insertRamenOrder.status || "pending",
      notes: insertRamenOrder.notes || null,
      servings: insertRamenOrder.servings || 1,
      createdAt: new Date()
    };
    this.ramenOrders.set(id, ramenOrder);
    
    // Check if we have 6 people for this date and auto-confirm
    const ordersForDate = await this.getRamenOrdersByDate(new Date(ramenOrder.preferredDate));
    if (ordersForDate.length >= 6) {
      await this.confirmRamenOrdersForDate(new Date(ramenOrder.preferredDate));
    }
    
    return ramenOrder;
  }

  async updateRamenOrderStatus(id: number, status: string): Promise<RamenOrder | undefined> {
    const order = this.ramenOrders.get(id);
    if (order) {
      const updatedOrder = { ...order, status };
      this.ramenOrders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  async confirmRamenOrdersForDate(date: Date): Promise<RamenOrder[]> {
    const ordersForDate = await this.getRamenOrdersByDate(date);
    const confirmedOrders: RamenOrder[] = [];
    
    for (const order of ordersForDate) {
      if (order.status === "pending") {
        const confirmedOrder = await this.updateRamenOrderStatus(order.id, "confirmed");
        if (confirmedOrder) {
          confirmedOrders.push(confirmedOrder);
        }
      }
    }
    
    return confirmedOrders;
  }

  async getRamenOrdersByDate(date: Date): Promise<RamenOrder[]> {
    return Array.from(this.ramenOrders.values()).filter(order => {
      const orderDate = new Date(order.preferredDate);
      return orderDate.toDateString() === date.toDateString();
    });
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentMessageId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      status: "new",
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }

  // Admin Authentication
  async getAdminByUsername(username: string): Promise<{ id: number; username: string; password: string; role: string } | undefined> {
    return this.adminUsers.get(username);
  }

  async createAdminUser(username: string, hashedPassword: string): Promise<{ id: number; username: string; role: string }> {
    const admin = {
      id: this.currentAdminId++,
      username,
      password: hashedPassword,
      role: "admin"
    };
    this.adminUsers.set(username, admin);
    return { id: admin.id, username: admin.username, role: admin.role };
  }
}

export const storage = new MemStorage();
