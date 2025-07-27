import { 
  Product, 
  InsertProduct, 
  Order, 
  InsertOrder, 
  WorkshopOrder, 
  InsertWorkshopOrder,
  ContactMessage,
  InsertContactMessage 
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: number, stock: number): Promise<Product | undefined>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Workshop Orders
  getWorkshopOrders(): Promise<WorkshopOrder[]>;
  createWorkshopOrder(workshopOrder: InsertWorkshopOrder): Promise<WorkshopOrder>;
  getWorkshopOrdersByDate(date: Date): Promise<WorkshopOrder[]>;
  updateWorkshopOrderStatus(id: number, status: string): Promise<WorkshopOrder | undefined>;
  deleteWorkshopOrder(id: number): Promise<boolean>;
  confirmWorkshopOrdersForDate(date: Date): Promise<WorkshopOrder[]>;
  
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
  private workshopOrders: Map<number, WorkshopOrder>;
  private contactMessages: Map<number, ContactMessage>;
  private adminUsers: Map<string, { id: number; username: string; password: string; role: string }>;
  private currentProductId: number;
  private currentOrderId: number;
  private currentWorkshopOrderId: number;
  private currentMessageId: number;
  private currentAdminId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.workshopOrders = new Map();
    this.contactMessages = new Map();
    this.adminUsers = new Map();
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentWorkshopOrderId = 1;
    this.currentMessageId = 1;
    this.currentAdminId = 1;
    
    this.initializeProducts();
    this.initializeAdminUser();
    this.initializeWorkshopOrders();
  }

  private initializeWorkshopOrders() {
    // Start with clean slate - no sample orders
    this.workshopOrders.clear();
    this.currentWorkshopOrderId = 1;
    console.log("STORAGE: Initialized clean workshop orders, total:", this.workshopOrders.size);
  }

  private initializeProducts() {
    const gingerKombucha: Product = {
      id: this.currentProductId++,
      name: "Gember Kombucha",
      description: "Handgebrouwen kombucha met verse gember uit Groningen. Gerijpt gedurende 2 weken voor die perfecte smaakbalans. Probiotisch en verfrissend.",
      price: "4.99",
      stock: 12,
      maxStock: 20,
      category: "kombucha",
      imageUrl: "/images/gember_kombucha.png",
      featured: true,
      limitedStock: false,
      badges: ["Probiotisch"],
      createdAt: new Date(),
    };

    const berryKombucha: Product = {
      id: this.currentProductId++,
      name: "Bosbes Kombucha",
      description: "Heerlijke kombucha met verse bosbessen uit de Groningse natuur. Vol antioxidanten en natuurlijke probiotica voor een gezonde levensstijl.",
      price: "5.49",
      stock: 8,
      maxStock: 18,
      category: "kombucha",
      imageUrl: "/images/bosbes_kombucha.png",
      featured: true,
      limitedStock: false,
      badges: ["Antioxidant Rijk"],
      createdAt: new Date(),
    };

    const kombuchaWorkshop: Product = {
      id: this.currentProductId++,
      name: "Kombucha Brouw Workshop",
      description: "Leer kombucha brouwen in onze workshop! Inclusief SCOBY, ingrediënten en je eigen eerste batch. Perfect voor beginners. €25 per persoon.",
      price: "25.00",
      stock: 8,
      maxStock: 8,
      category: "workshop",
      imageUrl: "/images/kombucha-workshop.jpg",
      featured: true,
      limitedStock: false,
      badges: ["Educatief"],
      createdAt: new Date(),
    };

    this.products.set(gingerKombucha.id, gingerKombucha);
    this.products.set(berryKombucha.id, berryKombucha);
    this.products.set(kombuchaWorkshop.id, kombuchaWorkshop);
  }

  private initializeAdminUser() {
    // Create default admin user with secure password
    const defaultAdmin = {
      id: this.currentAdminId++,
      username: "admin",
      password: "PlukPoot2025!Secure#Admin", // Strong password for production
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

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (product) {
      // Ensure required fields are present
      const updatedProduct = { 
        ...product, 
        ...updates,
        stock: updates.stock ?? product.stock,
        maxStock: updates.maxStock ?? product.maxStock,
        badges: updates.badges ?? product.badges ?? []
      };
      this.products.set(id, updatedProduct);
      return updatedProduct;
    }
    return undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
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

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  // Ramen Orders
  async getWorkshopOrders(): Promise<WorkshopOrder[]> {
    const orders = Array.from(this.workshopOrders.values());
    console.log("Storage: workshopOrders Map size:", this.workshopOrders.size);
    console.log("Storage: getWorkshopOrders returning", orders.length, "orders");
    console.log("Storage: First few orders:", orders.slice(0, 2));
    console.log("Storage: All workshop order IDs:", Array.from(this.workshopOrders.keys()));
    return orders;
  }

  async createWorkshopOrder(insertWorkshopOrder: InsertWorkshopOrder): Promise<WorkshopOrder> {
    const id = this.currentWorkshopOrderId++;
    const workshopOrder: WorkshopOrder = { 
      ...insertWorkshopOrder, 
      id, 
      customerPhone: insertWorkshopOrder.customerPhone || null,
      status: insertWorkshopOrder.status || "pending",
      notes: insertWorkshopOrder.notes || null,
      servings: insertWorkshopOrder.servings || 1,
      createdAt: new Date()
    };
    this.workshopOrders.set(id, workshopOrder);
    
    // Check if we have 6 people for this date and auto-confirm
    const ordersForDate = await this.getWorkshopOrdersByDate(new Date(workshopOrder.preferredDate));
    if (ordersForDate.length >= 6) {
      await this.confirmWorkshopOrdersForDate(new Date(workshopOrder.preferredDate));
    }
    
    return workshopOrder;
  }

  async updateWorkshopOrderStatus(id: number, status: string): Promise<WorkshopOrder | undefined> {
    const order = this.workshopOrders.get(id);
    if (order) {
      const updatedOrder = { ...order, status };
      this.workshopOrders.set(id, updatedOrder);
      
      // If order is confirmed, check if we should send emails
      if (status === 'confirmed') {
        const ordersForDate = await this.getWorkshopOrdersByDate(new Date(order.preferredDate));
        const confirmedOrdersForDate = ordersForDate.filter(o => o.status === 'confirmed');
        
        if (confirmedOrdersForDate.length >= 6) {
          console.log(`6+ confirmed orders for ${order.preferredDate}, ready to send emails`);
        }
      }
      
      return updatedOrder;
    }
    return undefined;
  }

  async confirmWorkshopOrdersForDate(date: Date): Promise<WorkshopOrder[]> {
    const ordersForDate = await this.getWorkshopOrdersByDate(date);
    const confirmedOrders: WorkshopOrder[] = [];
    
    for (const order of ordersForDate) {
      if (order.status === "pending") {
        const confirmedOrder = await this.updateWorkshopOrderStatus(order.id, "confirmed");
        if (confirmedOrder) {
          confirmedOrders.push(confirmedOrder);
        }
      }
    }
    
    return confirmedOrders;
  }

  async deleteWorkshopOrder(id: number): Promise<boolean> {
    return this.workshopOrders.delete(id);
  }

  async getWorkshopOrdersByDate(date: Date): Promise<WorkshopOrder[]> {
    return Array.from(this.workshopOrders.values()).filter(order => {
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
