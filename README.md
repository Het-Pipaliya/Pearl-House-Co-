# Pearl-House-Co-   # Build a Luxury Jewelry Website — Pearl House & Co

Act as a senior luxury brand website designer, UI/UX expert, and full-stack web developer.

I want you to design and build a complete, beautiful, modern, fully responsive luxury jewelry website for my new business called **Pearl House & Co**.

The website must feel like a premium international jewelry brand, with the elegance, simplicity, and sophistication associated with brands such as Cartier, Tiffany & Co., and Van Cleef & Arpels. However, the design must be original and have its own distinctive identity.

## 1. Business Model — VERY IMPORTANT

Pearl House & Co is an online jewelry business.

We do NOT manufacture jewelry ourselves. We work with independent jewelry manufacturers who produce jewelry based on customer orders.

Our business operates as follows:

1. Customers visit our website.
2. They browse our jewelry collections.
3. They select jewelry they are interested in.
4. They can choose available customization options.
5. They add products to their shopping cart.
6. Instead of paying online, they click **"Submit Order Request."**
7. They complete a form with their contact information and order details.
8. The order request is sent to our business email.
9. The customer receives a confirmation message.
10. Our team contacts the customer to discuss pricing, availability, customization, payment arrangements, and delivery.
11. Once everything is confirmed, we place the order with our manufacturing partner.
12. The completed jewelry is shipped to the customer.

**CRITICAL: DO NOT IMPLEMENT AN ONLINE PAYMENT SYSTEM.**

Do not integrate Stripe, PayPal, Shopify Payments, or credit card processing.

Do not ask customers for credit card information.

This is an inquiry-based jewelry ordering website, not a traditional payment checkout.

## 2. Brand Identity

Business Name: **Pearl House & Co**

Tagline: **Fine Jewelry**

Brand Personality:
- Luxurious
- Timeless
- Elegant
- Sophisticated
- Trustworthy
- Premium
- Minimalist
- International

### Color Palette

Use a beautiful, light luxury rose-gold theme.

Primary Background: Pearl Ivory — #FCF8F6

Primary Accent: Rose Gold — #B76E62

Secondary Background: Soft Blush — #F1DAD5

Text Color: Dark Cocoa — #49302B

Secondary Accent: Champagne — #EDE4D6

Use mostly ivory and white backgrounds, with rose gold for buttons, borders, icons, and decorative elements.

Avoid excessive pink, dark backgrounds, loud colors, and cheap-looking gradients.

The website should feel expensive and elegant.

### Typography

Use elegant luxury serif fonts for headings, such as Cormorant Garamond or Playfair Display.

Use a clean modern font such as Inter or Manrope for body text.

Use generous spacing, refined typography, and subtle animations.

### Logo

I already have a Pearl House & Co rose-gold logo.

Create a dedicated logo area in the website header where I can upload and replace the logo.

Do not redesign my logo.

Ensure the logo looks beautiful on desktop and mobile.

## 3. Website Pages

Build the following pages:

### Homepage

Create a stunning luxury homepage with:

- Elegant announcement bar
- Centered Pearl House & Co logo
- Luxury navigation menu
- Full-width hero image featuring fine jewelry
- Main headline: "Timeless Elegance, Beautifully Crafted"
- Subheading: "Discover exceptional jewelry designed to celebrate life's most precious moments."
- "Explore Collections" button
- Featured jewelry categories
- New Arrivals section
- Best Sellers section
- Featured Products section
- Custom Jewelry section
- Our Story section
- Why Choose Pearl House & Co section
- Customer inquiry call-to-action
- Elegant footer

Use large, professional jewelry photographs.

The homepage should look like a real premium jewelry brand, not a generic website template.

### Shop All

Create a beautiful product catalog with:

- Product images
- Product names
- Product descriptions
- Product categories
- Optional display prices
- Add to Cart buttons
- Wishlist functionality
- Search
- Filters
- Sorting

Product categories:

- Rings
- Engagement Rings
- Necklaces
- Pendants
- Bracelets
- Earrings
- Wedding Bands
- Custom Jewelry

### Product Details Page

Each product should have:

- Large product photographs
- Multiple image gallery
- Zoom functionality
- Product name
- Product description
- Material information
- Gemstone information
- Available sizes
- Available metal colors
- Customization options
- Quantity selector
- Add to Cart button
- Request More Information button
- Related products

Available metal options can include:

- Yellow Gold
- White Gold
- Rose Gold
- Platinum

Show only the options actually configured for each product.

Include a note:

"All orders are subject to availability and final confirmation by our team."

### Custom Jewelry Page

Create a dedicated page for customers who want personalized jewelry.

Headline:

**"Your Vision. Our Craftsmanship."**

Allow customers to submit a custom jewelry inquiry.

The form should include:

- Full Name
- Email Address
- Phone Number
- Jewelry Type
- Preferred Metal
- Gemstone Preference
- Approximate Budget
- Description of Desired Design
- Upload Reference Images
- Preferred Contact Method

Button: **"Submit Custom Design Request"**

After submission, display:

"Thank you for your inquiry. Our team will review your request and contact you to discuss the next steps."

## 4. Shopping Cart — MOST IMPORTANT FEATURE

I want a real, functional shopping cart, but WITHOUT online payments.

Customers should be able to:

- Add multiple products to the cart
- Remove products
- Change quantities
- Select customization options
- Review all selected items
- Continue shopping
- Submit an order request

The shopping cart should look professional and function like a luxury e-commerce shopping cart.

However, replace the traditional "Checkout" button with:

**"Submit Order Request"**

### Order Request Form

When the customer clicks Submit Order Request, display a beautiful form requesting:

- Full Name (required)
- Email Address (required)
- Phone Number (required)
- Shipping City
- Shipping State
- Shipping Country
- Preferred Contact Method
- Additional Instructions
- Order Notes

Automatically attach all cart details to the submission.

The submitted order must include:

- Product names
- Product IDs/SKUs
- Quantities
- Selected sizes
- Metal preferences
- Gemstone options
- Customization requests
- Customer information
- Date and time of submission
- Unique inquiry/order reference number

### Order Submission

When the customer submits their order:

1. Validate the required fields.
2. Generate a unique order inquiry number.
3. Save the inquiry securely in a database.
4. Send an email notification to my business email.
5. Send an acknowledgment email to the customer.
6. Display a successful submission page.
7. Only clear the cart after the server confirms that the request was successfully saved.
8. If submission fails, preserve the cart and show a clear error message.

Do not treat an inquiry as a confirmed purchase.

### Business Email Notification

Send all order inquiries to:

**[YOUR BUSINESS EMAIL ADDRESS]**

Subject:

**New Jewelry Order Request — Pearl House & Co — #[Order Number]**

Email body should include all customer details and products.

Make the email clean, organized, and easy to read.

### Customer Confirmation

After submission, show this message:

"Thank you for choosing Pearl House & Co!

Your order request has been successfully received.

Our team will review your selected jewelry and contact you to confirm availability, customization options, final pricing, and next steps.

Please note that submitting an order request does not confirm a purchase or require payment.

We look forward to helping you find something extraordinary."

Include the customer's inquiry number.

## 5. Contact Us Page

Create a beautiful Contact Us page with:

- Contact form
- Business email
- Business phone number (editable)
- Customer service information
- Social media links
- Frequently Asked Questions

Use placeholder contact information until I provide real business details.

Do not invent a business address.

## 6. About Us Page

Create an elegant brand story for Pearl House & Co.

Emphasize:

- Passion for fine jewelry
- Timeless design
- Personalized service
- Quality and attention to detail
- Relationships with skilled manufacturing partners
- Jewelry created to celebrate meaningful moments

Do not falsely claim that we own a manufacturing facility, have decades of experience, or handcraft every piece ourselves.

## 7. Admin Dashboard

Build a secure, password-protected admin dashboard that only authorized administrators can access.

The dashboard should allow me to:

- Add new jewelry products
- Upload product images
- Edit product descriptions
- Change prices
- Manage categories
- Update product availability
- View all customer order inquiries
- View customer contact information
- View selected jewelry and customization details
- Change inquiry status
- Search and filter inquiries
- Export inquiries to CSV

Inquiry statuses:

- New Inquiry
- Contacted Customer
- Awaiting Customer Confirmation
- Confirmed
- Sent to Manufacturer
- In Production
- Shipped
- Completed
- Cancelled

These statuses must be managed by administrators, not customers.

## 8. Website Features

Include:

- Fully responsive desktop, tablet, and mobile layouts
- Elegant hover effects
- Smooth animations
- Sticky navigation
- Mobile-friendly menu
- Functional product search
- Product filters
- Wishlist
- Functional shopping cart
- Product image zoom
- Secure inquiry forms
- Spam protection
- SEO-friendly pages
- Fast loading
- Accessible navigation
- Privacy Policy
- Terms and Conditions
- Shipping Information
- Custom Order Policy

All forms and buttons must actually work.

Do not create fake functionality.

## 9. Technical Requirements

Use a modern, maintainable technology stack.

Preferred stack:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase or another appropriate database
- Resend or another reliable transactional email service

Use secure server-side API routes for submitting inquiries and sending email.

Never expose database credentials, email API keys, or admin secrets in frontend code.

Implement proper input validation, authentication, access controls, rate limiting, and spam protection.

Customer inquiries must be stored securely.

Do not display customer information publicly.

Create an environment variable example file and explain which credentials I must configure.

If external services are not yet connected, clearly identify what needs setup rather than pretending the email system works.

## 10. Design Quality

I want the website to look like a professional luxury jewelry business.

Design priorities:

1. Beautiful, elegant typography
2. Light ivory backgrounds
3. Refined rose-gold accents
4. High-quality jewelry imagery
5. Spacious layouts
6. Minimal clutter
7. Smooth, subtle animations
8. Excellent mobile experience
9. Simple navigation
10. Easy customer ordering

Avoid generic e-commerce layouts and overly decorative graphics.

Use realistic sample products for demonstration, clearly marked as placeholders until I upload actual products.

Do not invent product certifications, customer reviews, discounts, or business guarantees.

## 11. Build Instructions

Start by creating a complete, visually polished homepage.

Then build the product catalog, product details, cart, order request flow, and admin dashboard.

Organize the project into reusable components.

Provide working code, not just screenshots or mockups.

Make sure all pages are connected through functional navigation.

Include clear instructions for running the website locally and deploying it online.

Before considering the project complete, test:

- Adding products to cart
- Removing products
- Updating quantities
- Preserving customization choices
- Submitting an order inquiry
- Saving the inquiry to the database
- Sending business email notifications
- Sending customer acknowledgments
- Admin login and inquiry management
- Mobile responsiveness

**FINAL GOAL:**

Create a complete luxury jewelry website for Pearl House & Co where customers can browse products, add jewelry to their cart, and submit an order inquiry without paying online.

The experience must feel as polished as a premium jewelry e-commerce website, while allowing our team to personally handle customer orders and manufacturing arrangements.

Begin building the website now.
