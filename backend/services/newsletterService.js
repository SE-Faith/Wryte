import Newsletter from "../models/Newsletter.js";

class NewsletterService {
    async subscribe(email) {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Please enter a valid email address");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingSubscriber = await Newsletter.findOne({ email: normalizedEmail });

        if (existingSubscriber) {
            if (!existingSubscriber.isActive) {
                existingSubscriber.isActive = true;
                await existingSubscriber.save();
                return existingSubscriber;
            }

            throw new Error("This email is already subscribed");
        }

        return await Newsletter.create({
            email: normalizedEmail,
            source: "footer",
        });
    }

    async getAllSubscribers() {
        return await Newsletter.find().sort({ createdAt: -1 });
    }

    async unsubscribe(email) {
        const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });
        if (!subscriber) {
            throw new Error("Subscriber not found");
        }
        subscriber.isActive = false;
        await subscriber.save();
        return subscriber;
    }

    async deleteSubscriber(subscriberId) {
        return await Newsletter.findByIdAndDelete(subscriberId);
    }
