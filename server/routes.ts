import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertRamenOrderSchema, insertContactMessageSchema, insertProductSchema } from "@shared/schema";
import { z } from "zod";
import { sendRamenInvitation, sendAdminNotification, sendContactNotification, sendOrderNotification } from "./mailjet";

const ramenOrderRequestSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),
  preferredDate: z.string(),
  notes: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Delete product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const success = await storage.deleteProduct(productId);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Update product
  app.patch("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const updatedProduct = await storage.updateProduct(productId, req.body);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create syrup order
  app.post("/api/orders/syrup", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        orderType: "syrup",
        status: "pending",
      });

      const order = await storage.createOrder(orderData);
      
      // Update product stock if productId is provided
      if (order.productId) {
        const product = await storage.getProduct(order.productId);
        if (product && product.stock > 0) {
          await storage.updateProductStock(order.productId, product.stock - order.quantity);
        }
      }

      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Create ramen order (per person)
  app.post("/api/orders/ramen", async (req, res) => {
    try {
      const requestData = ramenOrderRequestSchema.parse(req.body);
      
      // Parse and validate date
      const preferredDate = new Date(requestData.preferredDate);
      console.log("Ramen order for date:", preferredDate);

      // Check existing orders for that date
      const existingOrders = await storage.getRamenOrdersByDate(preferredDate);
      if (existingOrders.length >= 6) {
        return res.status(400).json({ 
          message: "This date is fully booked. Please choose another Friday." 
        });
      }

      // Create ramen order (per person)
      const ramenOrder = await storage.createRamenOrder({
        customerName: requestData.customerName,
        customerEmail: requestData.customerEmail,
        customerPhone: requestData.customerPhone,
        preferredDate,
        servings: 1, // Per person
        status: "pending",
        notes: requestData.notes,
      });

      // Send notification email to admin
      const orderDetails = `
Klant: ${ramenOrder.customerName}
Email: ${ramenOrder.customerEmail}
Telefoon: ${ramenOrder.customerPhone || 'Niet opgegeven'}
Gewenste Datum: ${ramenOrder.preferredDate.toLocaleDateString('nl-NL', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Aantal Porties: ${ramenOrder.servings}
Opmerkingen: ${ramenOrder.notes || 'Geen opmerkingen'}
Status: ${ramenOrder.status}
      `;
      
      try {
        await sendAdminNotification(orderDetails);
        console.log('Admin notification sent for new ramen order');
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
        // Continue even if notification fails
      }

      // Check if this booking completed the group of 6
      const updatedOrders = await storage.getRamenOrdersByDate(preferredDate);
      const isConfirmed = updatedOrders.length >= 6 && updatedOrders.every(o => o.status === "confirmed");

      res.json({ 
        ramenOrder, 
        totalBookings: updatedOrders.length,
        isConfirmed,
        message: isConfirmed 
          ? "Gefeliciteerd! Jullie groep is compleet en de ramen-avond is bevestigd!" 
          : `Bedankt voor je boeking! Nog ${6 - updatedOrders.length} personen nodig voor deze datum.`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ramen order" });
    }
  });

  // Get ramen availability for a specific date
  app.get("/api/ramen/availability/:date", async (req, res) => {
    try {
      const date = new Date(req.params.date);
      const existingOrders = await storage.getRamenOrdersByDate(date);
      const available = 6 - existingOrders.length;
      
      res.json({ 
        date: req.params.date,
        available,
        total: 6,
        isAvailable: available > 0
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to check availability" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Get all orders (admin)
  app.get("/api/orders", async (_req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get all ramen orders
  app.get("/api/ramen-orders", async (req, res) => {
    try {
      const orders = await storage.getRamenOrders();
      console.log("API: Returning ramen orders:", orders.length);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching ramen orders:", error);
      res.status(500).json({ message: "Failed to fetch ramen orders" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // For demo purposes, just check if password matches "admin"
      if (password === "admin") {
        // Set admin session
        (req as any).session.adminId = admin.id;
        (req as any).session.adminUsername = admin.username;
        
        res.json({ message: "Login successful", admin: { id: admin.id, username: admin.username, role: admin.role } });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Login error: " + error.message });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    (req as any).session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout error" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Admin status check route
  app.get("/api/admin/status", (req, res) => {
    const isAdmin = !!(req as any).session?.adminId;
    res.json({ isAdmin });
  });

  // Admin middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session?.adminId) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    next();
  };

  // Admin Product Management Routes
  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating product: " + error.message });
    }
  });

  app.patch("/api/products/:id/stock", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { stock } = req.body;
      
      if (isNaN(id) || typeof stock !== "number") {
        return res.status(400).json({ message: "Invalid product ID or stock value" });
      }

      const product = await storage.updateProductStock(id, stock);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating stock: " + error.message });
    }
  });

  // Confirm all ramen orders for a specific date (admin)
  app.post("/api/ramen-orders/confirm", requireAdmin, async (req, res) => {
    try {
      const { date } = req.body;
      
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }

      const targetDate = new Date(date);
      const confirmedOrders = await storage.confirmRamenOrdersForDate(targetDate);
      
      if (confirmedOrders.length === 0) {
        return res.status(400).json({ message: "No pending orders found for this date" });
      }

      // Send confirmation emails to all confirmed orders
      const emails = confirmedOrders.map(order => order.customerEmail);
      const dateStr = targetDate.toLocaleDateString('nl-NL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      try {
        await sendRamenInvitation(emails, dateStr);
        console.log(`Confirmation emails sent to ${emails.length} customers for ${dateStr}`);
      } catch (emailError) {
        console.error("Failed to send confirmation emails:", emailError);
        // Continue even if email fails
      }

      res.json({ 
        message: `${confirmedOrders.length} orders confirmed for ${dateStr}`,
        confirmedOrders,
        emailsSent: emails.length
      });
    } catch (error: any) {
      console.error("Error confirming ramen orders:", error);
      res.status(500).json({ message: "Error confirming orders: " + error.message });
    }
  });

  app.patch("/api/ramen-orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(id) || !status) {
        return res.status(400).json({ message: "Invalid order ID or status" });
      }

      const order = await storage.updateRamenOrderStatus(id, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating order status: " + error.message });
    }
  });

  // Send individual confirmation email for a ramen order (admin)
  app.post("/api/ramen-orders/:id/send-confirmation", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      // Get the order from storage to get the correct data
      const orders = await storage.getRamenOrders();
      const order = orders.find(o => o.id === id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const dateStr = order.preferredDate.toLocaleDateString('nl-NL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      try {
        // Send email to customer
        await sendRamenInvitation([order.customerEmail], dateStr);
        console.log(`Individual confirmation email sent to ${order.customerEmail} for ${dateStr}`);
        
        // Also send a copy to you for testing
        await sendAdminNotification(`Test: Bevestigingsmail verzonden naar ${order.customerEmail} voor ${dateStr}`);
        console.log(`Copy sent to admin for verification`);
        
        res.json({ 
          message: `Bevestigingsmail verzonden naar ${order.customerEmail}`,
          email: order.customerEmail,
          date: dateStr
        });
      } catch (emailError) {
        console.error("Failed to send individual confirmation email:", emailError);
        res.status(500).json({ message: "Failed to send confirmation email" });
      }
    } catch (error: any) {
      console.error("Error sending individual confirmation:", error);
      res.status(500).json({ message: "Error sending confirmation: " + error.message });
    }
  });

  // Test email functionality (admin)
  app.post("/api/test-email", requireAdmin, async (req, res) => {
    try {
      const testEmail = await sendAdminNotification("Test email: Als je dit ontvangt werkt de email functionaliteit correct!");
      
      if (testEmail) {
        res.json({ message: "Test email verzonden naar dckessler95@gmail.com" });
      } else {
        res.status(500).json({ message: "Test email kon niet worden verzonden" });
      }
    } catch (error: any) {
      console.error("Test email error:", error);
      res.status(500).json({ message: "Error sending test email: " + error.message });
    }
  });

  // Delete ramen order (admin)
  app.delete("/api/ramen-orders/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const success = await storage.deleteRamenOrder(id);
      
      if (!success) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ message: "Ramen order deleted successfully", id });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting order: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
