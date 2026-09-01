import searchService from "../services/searchService.js";

export const searchPeople = async (req, res) => {
    try {
        const result = await searchService.searchPeople(req.query);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error("Error in searchController.searchPeople:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
