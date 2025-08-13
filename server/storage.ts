import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  products,
  orders,
  workshopOrders,
  contactMessages,
  adminUsers,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type WorkshopOrder,
  type InsertWorkshopOrder,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  createProduct(insertProduct: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Orders
  getOrders(): Promise<Order[]>;
  createOrder(insertOrder: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;

  // Workshop Orders
  getWorkshopOrders(): Promise<WorkshopOrder[]>;
  createWorkshopOrder(insertWorkshopOrder: InsertWorkshopOrder): Promise<WorkshopOrder>;
  updateWorkshopOrderStatus(id: number, status: string): Promise<WorkshopOrder | undefined>;
  deleteWorkshopOrder(id: number): Promise<boolean>;
  getWorkshopOrdersByDate(date: Date): Promise<WorkshopOrder[]>;
  confirmWorkshopOrdersForDate(date: Date): Promise<WorkshopOrder[]>;

  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage>;

  // Admin Authentication
  getAdminByUsername(username: string): Promise<{ id: number; username: string; password: string; role: string } | undefined>;
  createAdminUser(username: string, hashedPassword: string): Promise<{ id: number; username: string; role: string }>;
}

// Database Storage Implementation
class DatabaseStorage implements IStorage {
  constructor() {
    this.seedDatabase();
  }

  private async seedDatabase() {
    try {
      // Check if products already exist
      const existingProducts = await db.select().from(products);
      if (existingProducts.length === 0) {
        console.log("STORAGE: Seeding database with kombucha products...");
        
        // Add default kombucha products
        await db.insert(products).values([
          {
            name: "Gember Kombucha",
            description: "Verfrissende kombucha met verse gember uit Groningen. Rijk aan probiotica en met een heerlijke pittige smaak.",
            price: "8.50",
            category: "kombucha",
            stock: 24,
            imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
          },
          {
            name: "Bessen Kombucha",
            description: "Zoete kombucha met verse bosbessen. Perfect gebalanceerd en vol antioxidanten voor je gezondheid.",
            price: "9.00",
            category: "kombucha", 
            stock: 18,
            imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
          },
          {
            name: "Kombucha Workshop",
            description: "Leer kombucha brouwen in onze workshop! Inclusief materialen, recepten en je eigen kombucha scoby om mee naar huis te nemen.",
            price: "45.00",
            category: "workshop",
            stock: 12,
            imageUrl: "/images/chicken-shoyu-ramen.jpg"
          }
        ]);

        console.log("STORAGE: Database seeded with kombucha products");
      }

      // Check if admin user exists
      const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.username, "admin"));
      if (existingAdmin.length === 0) {
        console.log("STORAGE: Creating default admin user...");
        const bcrypt = await import('bcrypt');
        const hashedPassword = await bcrypt.hash("PlukPoot2025!Secure#Admin", 10);
        
        await db.insert(adminUsers).values({
          username: "admin",
          password: hashedPassword,
          role: "admin"
        });
        
        console.log("STORAGE: Default admin user created (username: admin)");
      }
    } catch (error) {
      console.error("STORAGE: Error seeding database:", error);
    }
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return order;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Workshop Orders
  async getWorkshopOrders(): Promise<WorkshopOrder[]> {
    return await db.select().from(workshopOrders);
  }

  async createWorkshopOrder(insertWorkshopOrder: InsertWorkshopOrder): Promise<WorkshopOrder> {
    const [order] = await db.insert(workshopOrders).values(insertWorkshopOrder).returning();
    
    // Check if enough orders for auto-confirmation
    const ordersForDate = await this.getWorkshopOrdersByDate(new Date(order.preferredDate));
    if (ordersForDate.length >= 6) {
      await this.confirmWorkshopOrdersForDate(new Date(order.preferredDate));
    }
    
    return order;
  }

  async updateWorkshopOrderStatus(id: number, status: string): Promise<WorkshopOrder | undefined> {
    const [order] = await db.update(workshopOrders).set({ status }).where(eq(workshopOrders.id, id)).returning();
    return order;
  }

  async deleteWorkshopOrder(id: number): Promise<boolean> {
    const result = await db.delete(workshopOrders).where(eq(workshopOrders.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getWorkshopOrdersByDate(date: Date): Promise<WorkshopOrder[]> {
    const dateString = date.toISOString().split('T')[0];
    return await db.select().from(workshopOrders);
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

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    return message;
  }

  // Admin Authentication
  async getAdminByUsername(username: string): Promise<{ id: number; username: string; password: string; role: string } | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin;
  }

  async createAdminUser(username: string, hashedPassword: string): Promise<{ id: number; username: string; role: string }> {
    const [admin] = await db.insert(adminUsers).values({ 
      username, 
      password: hashedPassword 
    }).returning();
    return { id: admin.id, username: admin.username, role: admin.role };
  }
}

export const storage = new DatabaseStorage();