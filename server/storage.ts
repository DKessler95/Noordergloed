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
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(insertProduct: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  updateProductStock(id: number, stock: number): Promise<Product | undefined>;
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
            featured: true,
            badges: ["Seizoenspecialiteit", "Premium"],
            imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
          },
          {
            name: "Bessen Kombucha",
            description: "Zoete kombucha met verse bosbessen. Perfect gebalanceerd en vol antioxidanten voor je gezondheid.",
            price: "9.00",
            category: "kombucha",
            stock: 18,
            featured: true,
            badges: ["Huistuin delicatesse"],
            imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
          },
          {
            name: "Citroen Kombucha",
            description: "Frisse kombucha met biologische citroen. Een verfrissende smaak perfect voor elke dag van het jaar.",
            price: "8.75",
            category: "kombucha",
            stock: 20,
            featured: true,
            badges: ["Klassiek", "Verfrissend"],
            imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
          },
          {
            name: "Hibiscus Kombucha",
            description: "Exotische kombucha met hibiscusbloemen. Een mooie roze kleur en bloemenachtige smaak.",
            price: "9.50",
            category: "kombucha",
            stock: 15,
            featured: true,
            badges: ["Exotisch", "Limited Edition"],
            imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
          },
          {
            name: "Groene Thee Kombucha",
            description: "Traditionele kombucha op basis van groene thee. Pure smaak met alle gezonde eigenschappen.",
            price: "8.25",
            category: "kombucha",
            stock: 30,
            featured: true,
            badges: ["Traditioneel", "Gezond"],
            imageUrl: "https://images.unsplash.com/photo-1556679179-6d946ac01b8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
          },
          {
            name: "Mango Kombucha",
            description: "Tropische kombucha met verse mango. Zoet, fruitig en vol van smaak.",
            price: "9.25",
            category: "kombucha",
            stock: 22,
            featured: true,
            badges: ["Tropisch", "Zoet"],
            imageUrl: "https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
          },
          {
            name: "Kurkuma Kombucha",
            description: "Speciale kombucha met kurkuma en zwarte peper. Anti-inflammatoire eigenschappen en unieke smaak.",
            price: "10.00",
            category: "kombucha",
            stock: 12,
            featured: true,
            badges: ["Gezondheid", "Speciaal"],
            imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
          },
          {
            name: "Rozemarijn Kombucha",
            description: "Kruidenrijke kombucha met verse rozemarijn uit onze eigen tuin. Aromatisch en rustgevend.",
            price: "9.75",
            category: "kombucha",
            stock: 16,
            featured: true,
            badges: ["Kruiden", "Eigen Tuin"],
            imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
          },
          {
            name: "Kombucha Workshop",
            description: "Leer kombucha brouwen in onze workshop! Inclusief materialen, recepten en je eigen kombucha scoby om mee naar huis te nemen.",
            price: "45.00",
            category: "workshop",
            stock: 12,
            featured: false,
            badges: ["Workshop", "Leer & Ervaar"],
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

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return product;
  }

  async updateProductStock(id: number, stock: number): Promise<Product | undefined> {
    const [product] = await db.update(products).set({ stock }).where(eq(products.id, id)).returning();
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

  // Category management
  async getCategories(): Promise<string[]> {
    // Return default categories for now - in a real app this could be stored in DB
    return ['kombucha', 'workshop', 'accessoires', 'ramen', 'andere'];
  }

  async addCategory(name: string): Promise<string> {
    // In a real implementation, this would add to a categories table
    // For now, we'll just return the name as confirmation
    return name;
  }

  async removeCategory(name: string): Promise<void> {
    // In a real implementation, this would remove from a categories table
    // For now, this is a no-op
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