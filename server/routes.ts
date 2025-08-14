import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertWorkshopOrderSchema, insertContactMessageSchema, insertProductSchema } from "@shared/schema";
import { z } from "zod";
import { sendWorkshopInvitation, sendAdminNotification, sendContactNotification, sendOrderNotification, sendCustomerOrderConfirmation, sendCustomerStatusUpdate, sendEmail } from "./gmail";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

const workshopOrderRequestSchema = z.object({
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
  app.post("/api/orders", async (req, res) => {
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

      // Get product details for email
      const product = await storage.getProduct(orderData.productId!);
      
      // Send notification email to admin
      const orderDetails = `
Nieuwe Siroop Bestelling!

Klant: ${order.customerName}
Email: ${order.customerEmail}
Telefoon: ${order.customerPhone || 'Niet opgegeven'}
Product: ${product?.name || 'Onbekend product'}
Aantal: ${order.quantity}
Totaal: €${order.totalAmount}
Bezorging: ${order.deliveryMethod === 'delivery' ? 'Bezorgen' : 'Ophalen'}
${order.deliveryMethod === 'delivery' && order.streetAddress ? `
Bezorgadres:
${order.streetAddress}
${order.postalCode} ${order.city}
${order.country}` : ''}
Opmerkingen: ${order.notes || 'Geen opmerkingen'}
Status: ${order.status}
Besteld op: ${order.createdAt?.toLocaleString('nl-NL')}
      `;
      
      // Send confirmation email to customer
      try {
        await sendCustomerOrderConfirmation({
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone || 'Niet opgegeven',
          productName: product?.name || 'Onbekend product',
          quantity: order.quantity,
          totalAmount: order.totalAmount,
          status: order.status,
          deliveryMethod: order.deliveryMethod,
          streetAddress: order.streetAddress,
          postalCode: order.postalCode,
          city: order.city,
          country: order.country,
          notes: order.notes
        });
        console.log('Customer confirmation email sent for order');
      } catch (emailError) {
        console.error('Failed to send customer confirmation:', emailError);
      }

      // Send notification email to admin
      try {
        await sendOrderNotification({
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone || 'Niet opgegeven',
          productName: product?.name || 'Onbekend product',
          quantity: order.quantity,
          totalAmount: order.totalAmount,
          status: order.status,
          deliveryMethod: order.deliveryMethod === 'delivery' ? 'Bezorgen' : 'Ophalen',
          notes: order.notes || 'Geen opmerkingen'
        });
        console.log('Admin notification sent for new syrup order');
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
        // Continue even if notification fails
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
      const requestData = workshopOrderRequestSchema.parse(req.body);
      
      // Parse and validate date
      const preferredDate = new Date(requestData.preferredDate);
      console.log("Ramen order for date:", preferredDate);

      // Check existing orders for that date
      const existingOrders = await storage.getWorkshopOrdersByDate(preferredDate);
      if (existingOrders.length >= 6) {
        return res.status(400).json({ 
          message: "This date is fully booked. Please choose another Friday." 
        });
      }

      // Create ramen order (per person)
      const workshopOrder = await storage.createWorkshopOrder({
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
Klant: ${workshopOrder.customerName}
Email: ${workshopOrder.customerEmail}
Telefoon: ${workshopOrder.customerPhone || 'Niet opgegeven'}
Gewenste Datum: ${workshopOrder.preferredDate.toLocaleDateString('nl-NL', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Aantal Porties: ${workshopOrder.servings}
Opmerkingen: ${workshopOrder.notes || 'Geen opmerkingen'}
Status: ${workshopOrder.status}
      `;
      
      // Send customer confirmation email
      try {
        const { sendWorkshopOrderConfirmation } = await import('./gmail-ramen');
        await sendWorkshopOrderConfirmation({
          customerName: workshopOrder.customerName,
          customerEmail: workshopOrder.customerEmail,
          customerPhone: workshopOrder.customerPhone || 'Niet opgegeven',
          servings: workshopOrder.servings,
          notes: workshopOrder.notes,
          preferredDate: workshopOrder.preferredDate.toLocaleDateString('nl-NL', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        });
        console.log('Customer confirmation email sent for ramen order');
      } catch (emailError) {
        console.error('Failed to send customer confirmation:', emailError);
      }

      try {
        await sendAdminNotification(orderDetails);
        console.log('Admin notification sent for new ramen order');
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
        // Continue even if notification fails
      }

      // Check if this booking completed the group of 6
      const updatedOrders = await storage.getWorkshopOrdersByDate(preferredDate);
      const isConfirmed = updatedOrders.length >= 6 && updatedOrders.every(o => o.status === "confirmed");

      res.json({ 
        workshopOrder, 
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
      const existingOrders = await storage.getWorkshopOrdersByDate(date);
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
    console.log('=== CONTACT FORM SUBMITTED ===');
    console.log('Request body:', req.body);
    
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      console.log('Parsed message data:', messageData);
      
      const message = await storage.createContactMessage(messageData);
      console.log('Message stored in database');
      
      // Send admin notification email directly using sendEmail
      try {
        console.log('Attempting to send email notification...');
        await sendEmail({
          to: ["dckessler95@gmail.com"],
          subject: `📬 Nieuw Contact Bericht - ${messageData.subject}`,
          textContent: `
Hallo Damian,

Er is een nieuw contact bericht binnengekomen via je website!

Naam: ${messageData.firstName} ${messageData.lastName}
Email: ${messageData.email}
Onderwerp: ${messageData.subject}

Bericht:
${messageData.message}

Verzonden op: ${new Date().toLocaleString('nl-NL')}
          `,
          htmlContent: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #7c3aed;">📬 Nieuw Contact Bericht</h1>
  
  <p>Hallo Damian,</p>
  
  <p>Er is een nieuw contact bericht binnengekomen via je website!</p>
  
  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3 style="color: #374151; margin-top: 0;">Contact Details:</h3>
    <p><strong>Naam:</strong> ${messageData.firstName} ${messageData.lastName}</p>
    <p><strong>Email:</strong> ${messageData.email}</p>
    <p><strong>Onderwerp:</strong> ${messageData.subject}</p>
    
    <h4 style="color: #374151; margin-bottom: 10px;">Bericht:</h4>
    <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #7c3aed;">
      ${messageData.message.replace(/\n/g, '<br>')}
    </div>
  </div>
  
  <p><small>Verzonden op: ${new Date().toLocaleString('nl-NL')}</small></p>
</div>
          `
        });
        console.log('Contact notification email sent successfully!');
      } catch (emailError) {
        console.error('Failed to send contact notification:', emailError);
      }
      
      res.json(message);
    } catch (error) {
      console.error('Contact form error:', error);
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
  app.get("/api/workshop-orders", async (req, res) => {
    try {
      const orders = await storage.getWorkshopOrders();
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

      // Check if password matches the secure admin password
      if (password === "PlukPoot2025!Secure#Admin") {
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
  app.post("/api/workshop-orders/confirm", requireAdmin, async (req, res) => {
    try {
      const { date } = req.body;
      
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }

      const targetDate = new Date(date);
      const confirmedOrders = await storage.confirmWorkshopOrdersForDate(targetDate);
      
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
        await sendWorkshopInvitation(emails, dateStr);
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

  app.patch("/api/workshop-orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(id) || !status) {
        return res.status(400).json({ message: "Invalid order ID or status" });
      }

      const order = await storage.updateWorkshopOrderStatus(id, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Send status update email to customer
      try {
        await sendCustomerStatusUpdate({
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone || 'Niet opgegeven',
          productName: 'Ramen Avond',
          quantity: order.servings,
          totalAmount: '€0 (gratis)',
          status: order.status,
          deliveryMethod: 'Locatie wordt nog bekend gemaakt',
          streetAddress: '',
          postalCode: '',
          city: '',
          country: '',
          notes: order.notes,
          preferredDate: order.preferredDate.toLocaleDateString('nl-NL', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        });
        console.log(`Status update email sent to ${order.customerEmail} for ramen order ${id}`);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Continue even if email fails
      }

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating order status: " + error.message });
    }
  });

  // Send individual confirmation email for a syrup order (admin)
  app.post("/api/orders/:id/send-confirmation", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      // Get the order from storage to get the correct data
      const orders = await storage.getOrders();
      const order = orders.find(o => o.id === id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Get product details
      const product = await storage.getProduct(order.productId!);
      
      try {
        // Send status update email to customer
        await sendCustomerStatusUpdate({
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone || 'Niet opgegeven',
          productName: product?.name || 'Onbekend product',
          quantity: order.quantity,
          totalAmount: order.totalAmount,
          status: order.status,
          deliveryMethod: order.deliveryMethod,
          notes: order.notes
        });
        console.log(`Customer status update email sent to ${order.customerEmail} for order ${id}`);

        // Send notification email to admin
        await sendOrderNotification({
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone || 'Niet opgegeven',
          productName: product?.name || 'Onbekend product',
          quantity: order.quantity,
          totalAmount: order.totalAmount,
          status: order.status,
          deliveryMethod: order.deliveryMethod === 'delivery' ? 'Bezorgen' : 'Ophalen',
          notes: order.notes || 'Geen opmerkingen'
        });
        console.log(`Admin notification sent for order ${id}`);
        
        res.json({ 
          message: `Status email verzonden naar klant en admin`,
          customerEmail: order.customerEmail,
          status: order.status
        });
      } catch (emailError) {
        console.error("Failed to send status emails:", emailError);
        res.status(500).json({ message: "Failed to send status emails" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error sending confirmation: " + error.message });
    }
  });

  // Send individual confirmation email for a ramen order (admin)
  app.post("/api/workshop-orders/:id/send-confirmation", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      // Get the order from storage to get the correct data
      const orders = await storage.getWorkshopOrders();
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
        // Send email ONLY to the specific customer
        await sendWorkshopInvitation([order.customerEmail], dateStr);
        console.log(`Individual confirmation email sent to ${order.customerEmail} for ${dateStr}`);
        
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
      const testEmail = await sendEmail({
        to: ["dckessler95@gmail.com"],
        subject: "Test Email - Pluk & Poot Gmail SMTP",
        textContent: "Dit is een test email via Gmail SMTP. Als je dit ontvangt werkt de email functionaliteit correct!",
        htmlContent: "<h1>Test Email via Gmail SMTP</h1><p>Dit is een test email via Gmail SMTP.</p><p><strong>Als je dit ontvangt werkt de email functionaliteit correct!</strong></p><p>Verzonden op: " + new Date().toLocaleString('nl-NL') + "</p>",
      });
      
      if (testEmail) {
        res.json({ message: "Test email verzonden naar dckessler95@gmail.com via Gmail SMTP" });
      } else {
        res.status(500).json({ message: "Test email kon niet worden verzonden" });
      }
    } catch (error: any) {
      console.error("Test email error:", error);
      res.status(500).json({ message: "Error sending test email: " + error.message });
    }
  });

  // Delete ramen order (admin)
  app.delete("/api/workshop-orders/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const success = await storage.deleteWorkshopOrder(id);
      
      if (!success) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ message: "Ramen order deleted successfully", id });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting order: " + error.message });
    }
  });

  // Siroop orders management (admin)
  app.get("/api/orders", requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  app.patch("/api/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(id) || !status) {
        return res.status(400).json({ message: "Invalid order ID or status" });
      }

      const order = await storage.updateOrderStatus(id, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating order status: " + error.message });
    }
  });

  app.delete("/api/orders/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const success = await storage.deleteOrder(id);
      
      if (!success) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ message: "Order deleted successfully", id });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting order: " + error.message });
    }
  });

  app.post("/api/orders/:id/send-confirmation", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const orders = await storage.getOrders();
      const order = orders.find(o => o.id === id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const products = await storage.getProducts();
      const product = products.find(p => p.id === order.productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      try {
        // Send confirmation email to customer
        await sendOrderNotification({
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          productName: product.name,
          quantity: order.quantity,
          totalAmount: order.totalAmount,
          notes: order.notes,
          deliveryMethod: order.deliveryMethod,
          streetAddress: order.streetAddress,
          city: order.city,
          postalCode: order.postalCode,
          country: order.country
        });
        
        res.json({ 
          message: `Bevestigingsmail verzonden naar ${order.customerEmail}`,
          email: order.customerEmail,
          product: product.name
        });
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
        res.status(500).json({ message: "Failed to send confirmation email" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error sending confirmation: " + error.message });
    }
  });

  // Object storage endpoints for image uploads
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Update product image endpoint
  app.put("/api/products/:id/image", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { imageURL } = req.body;

      if (!imageURL) {
        return res.status(400).json({ error: "imageURL is required" });
      }

      const objectStorageService = new ObjectStorageService();
      const imagePath = objectStorageService.normalizeObjectEntityPath(imageURL);

      const updatedProduct = await storage.updateProduct(productId, { imagePath });
      
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ 
        success: true, 
        imagePath,
        product: updatedProduct 
      });
    } catch (error) {
      console.error("Error updating product image:", error);
      res.status(500).json({ error: "Failed to update product image" });
    }
  });

  // Serve uploaded objects
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Serve public objects
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
