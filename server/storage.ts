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
  
  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private ramenOrders: Map<number, RamenOrder>;
  private contactMessages: Map<number, ContactMessage>;
  private currentProductId: number;
  private currentOrderId: number;
  private currentRamenOrderId: number;
  private currentMessageId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.ramenOrders = new Map();
    this.contactMessages = new Map();
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentRamenOrderId = 1;
    this.currentMessageId = 1;
    
    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const elderflowerSyrup: Product = {
      id: this.currentProductId++,
      name: "Vlierbloesem Siroop",
      description: "Handgeplukt bij de Hamburgervijver. 30 verse schermen per liter voor die authentieke zomersmaak. Perfect voor limonade of cocktails.",
      price: "6.99",
      stock: 16,
      maxStock: 20,
      category: "syrup",
      imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      featured: true,
      createdAt: new Date(),
    };

    const roseSyrup: Product = {
      id: this.currentProductId++,
      name: "Rozen Siroop",
      description: "Delicate rozenblaadjes uit onze eigen tuin aan de Star Numanstraat. Een subtiele bloemensmaak die perfect past bij thee of prosecco.",
      price: "7.99",
      stock: 4,
      maxStock: 15,
      category: "syrup",
      imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      featured: true,
      createdAt: new Date(),
    };

    const ramenSet: Product = {
      id: this.currentProductId++,
      name: "Chicken Shoyu Ramen",
      description: "Exclusieve Chicken Shoyu Ramen voor 6 personen. Verse lokale ingrediënten, zelfgemaakte noedels en inclusief toppings.",
      price: "45.00",
      stock: 6,
      maxStock: 6,
      category: "ramen",
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      featured: true,
      createdAt: new Date(),
    };

    this.products.set(elderflowerSyrup.id, elderflowerSyrup);
    this.products.set(roseSyrup.id, roseSyrup);
    this.products.set(ramenSet.id, ramenSet);
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
      createdAt: new Date()
    };
    this.ramenOrders.set(id, ramenOrder);
    return ramenOrder;
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
}

export const storage = new MemStorage();
