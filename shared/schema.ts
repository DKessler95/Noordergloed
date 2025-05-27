import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  maxStock: integer("max_stock").notNull().default(20),
  category: text("category").notNull(), // "syrup" | "ramen"
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  orderType: text("order_type").notNull(), // "syrup" | "ramen"
  status: text("status").notNull().default("pending"), // "pending" | "confirmed" | "completed" | "cancelled"
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ramenOrders = pgTable("ramen_orders", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  preferredDate: timestamp("preferred_date").notNull(),
  servings: integer("servings").notNull().default(6),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // "new" | "read" | "replied"
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertRamenOrderSchema = createInsertSchema(ramenOrders).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type RamenOrder = typeof ramenOrders.$inferSelect;
export type InsertRamenOrder = z.infer<typeof insertRamenOrderSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
