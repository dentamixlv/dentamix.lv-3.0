import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: {
    email: v.string(),
    locale: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    // Standard email validation regex on the server side
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Check if email already exists
    const existing = await ctx.db
      .query("newsletterSubscriptions")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      if (existing.status === "active") {
        return { success: true, status: "already_subscribed" };
      }
      
      // If it was unsubscribed, reactivate it and update the preferred locale
      await ctx.db.patch("newsletterSubscriptions", existing._id, {
        status: "active",
        locale: args.locale,
      });
      return { success: true, status: "reactivated" };
    }

    // Insert new subscriber record
    await ctx.db.insert("newsletterSubscriptions", {
      email,
      locale: args.locale,
      status: "active",
    });

    return { success: true, status: "subscribed" };
  },
});
