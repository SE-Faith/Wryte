import historyService from "../services/historyService.js";

export const logView = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;

        const historyRecord = await historyService.logPostView(userId, postId);
        res.status(201).json({
            success: true,
            message: "View logged successfully",
            data: historyRecord
        });
    } catch (error) {
        console.error("Error in historyController.logView:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getViewHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await historyService.getViewHistory(userId);
        res.status(200).json({
            success: true,
            message: "View history retrieved successfully",
            history
        });
    } catch (error) {
        console.error("Error in historyController.getViewHistory:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getLikedHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await historyService.getLikedHistory(userId);
        res.status(200).json({
            success: true,
            message: "Liked history retrieved successfully",
            history
        });
    } catch (error) {
        console.error("Error in historyController.getLikedHistory:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
