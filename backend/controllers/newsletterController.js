import newsletterService from "../services/newsletterService.js";

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        const subscriber = await newsletterService.subscribe(email);

        res.status(201).json({
            success: true,
            message: "Thanks for subscribing to Wryte updates.",
            subscriber,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Unable to subscribe right now.",
        });
    }
};
export const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await newsletterService.getAllSubscribers();
        res.status(200).json({
            success: true,
            count: subscribers.length,
            subscribers,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Unable to fetch subscribers.",
        });
    }
};

export const deleteSubscriber = async (req, res) => {
    try {
        const { subscriberId } = req.params;
        await newsletterService.deleteSubscriber(subscriberId);

        res.status(200).json({
            success: true,
            message: "Subscriber removed successfully.",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Unable to remove subscriber.",
        });
    }
};