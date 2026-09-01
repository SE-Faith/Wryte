import User from "../models/User.js";

class SearchService {
    async searchPeople(queryParams) {
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const skip = (page - 1) * limit;
        const search = (queryParams.search || queryParams.q || "").trim();

        if (!search) {
            return { page, limit, total: 0, totalPages: 0, people: [] };
        }

        // Only search active, non-banned users
        const baseQuery = { isActive: true, isBanned: { $ne: true } };

        let people = [];
        let total = 0;

        // 1. Try $text query on public profile fields (name, displayName, bio)
        const textQuery = { ...baseQuery, $text: { $search: search } };
        const textCount = await User.countDocuments(textQuery);

        if (textCount > 0) {
            total = textCount;
            people = await User.find(textQuery, { score: { $meta: "textScore" } })
                .select("name displayName avatar bio followers following createdAt") // Exclude email for privacy
                .skip(skip)
                .limit(limit)
                .sort({ score: { $meta: "textScore" }, createdAt: -1 })
                .lean();
        } else {
            // 2. Hybrid Fallback: Partial regex query on name, displayName, bio
            const regexQuery = {
                ...baseQuery,
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { displayName: { $regex: search, $options: "i" } },
                    { bio: { $regex: search, $options: "i" } }
                ]
            };
            total = await User.countDocuments(regexQuery);
            people = await User.find(regexQuery)
                .select("name displayName avatar bio followers following createdAt") // Exclude email for privacy
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();
        }

        return {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            people
        };
    }
}

export default new SearchService();
