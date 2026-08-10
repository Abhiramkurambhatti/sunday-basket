/**
 * Sunday Basket Modular Notification System
 * Architected to dispatch order events to WhatsApp, Webhooks, Console, and Email.
 */

export class NotificationService {
  constructor(settingsGetter) {
    this.getSettings = settingsGetter;
  }

  formatOrderWhatsAppMessage(order) {
    const itemsList = order.items.map((item, idx) => {
      return `${idx + 1}. *${item.name}* (${item.unit || 'unit'}) x ${item.quantity}\n   ↳ Price: ₹${item.price} x ${item.quantity} = *₹${item.price * item.quantity}*`;
    }).join('\n');

    const address = [
      order.customer.fullName,
      `Phone: ${order.customer.mobileNumber}`,
      `Flat/House: ${order.customer.flatNo}`,
      `Building/Society: ${order.customer.societyName}`,
      `Address: ${order.customer.address}`,
      order.customer.landmark ? `Landmark: ${order.customer.landmark}` : null,
      `City: Pune`
    ].filter(Boolean).join('\n');

    const instructions = order.customer.instructions 
      ? `\n📌 *Special Instructions:* ${order.customer.instructions}`
      : '';

    const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const message = 
`🛒 *NEW ORDER RECEIVED - SUNDAY BASKET*
----------------------------------------
📋 *Order ID:* ${order.id}
📅 *Date & Time:* ${formattedDate}

👤 *CUSTOMER DETAILS:*
${address}

🧺 *ORDERED ITEMS:*
${itemsList}

----------------------------------------
💰 *TOTAL AMOUNT:* ₹${order.totalAmount}
💳 *Payment:* Cash / UPI on Delivery${instructions}
----------------------------------------
🌿 *Sunday Basket - Farm to Home Fresh Delivery*`;

    return message;
  }

  generateWhatsAppLink(order, targetPhoneNumber = "8087506237") {
    const rawMsg = this.formatOrderWhatsAppMessage(order);
    const encodedMsg = encodeURIComponent(rawMsg);
    // Sanitize phone number to international format without + or spaces
    const cleanPhone = targetPhoneNumber.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    return `https://wa.me/${phoneWithCountry}?text=${encodedMsg}`;
  }

  async notifyNewOrder(order) {
    const settings = this.getSettings();
    const results = {
      orderId: order.id,
      timestamp: new Date().toISOString(),
      channels: {}
    };

    // 1. Console / System Log Notification
    console.log(`\n================ ONLINE ORDER NOTIFICATION ================`);
    console.log(this.formatOrderWhatsAppMessage(order));
    console.log(`===========================================================\n`);
    results.channels.console = { success: true };

    // 2. WhatsApp Direct Link Generation
    const waPhone = settings.sellerPhone || "8087506237";
    const waLink = this.generateWhatsAppLink(order, waPhone);
    results.channels.whatsapp = { 
      success: true, 
      targetPhone: waPhone, 
      waLink: waLink 
    };

    // 3. Custom Webhook Notification (If enabled)
    if (settings.notificationsEnabled?.webhook && settings.notificationsEnabled?.webhookUrl) {
      try {
        const response = await fetch(settings.notificationsEnabled.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'order.created',
            data: order,
            formattedMessage: this.formatOrderWhatsAppMessage(order)
          })
        });
        results.channels.webhook = { success: response.ok, status: response.status };
      } catch (err) {
        console.error("Webhook notification failed:", err.message);
        results.channels.webhook = { success: false, error: err.message };
      }
    }

    return results;
  }
}
