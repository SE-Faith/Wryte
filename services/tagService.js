import Tag from "../models/Tags.js";

class TagService {
    // create tag
    async createTag(tagData) {
        const tag = new Tag(tagData);
        await tag.save();
        return tag;
    }

    // get all tags
    async getAllTags() {
        const tags = await Tag.find();
        return tags;
    }

    // get tag by id
    async getTagById(tagId) {
        const tag = await Tag.findById(tagId);
        return tag;
    }

    // update tag
    async updateTag(tagId, tagData) {
        const tag = await Tag.findById(tagId);
        if (!tag) {
            throw new Error("Tag not found");
        }
        tag.name = tagData.name || tag.name;
        tag.description = tagData.description || tag.description;
        await tag.save();
        return tag;
    }

    // delete tag
    async deleteTag(tagId) {
        const tag = await Tag.findById(tagId);
        if (!tag) {
            throw new Error("Tag not found");
        }
        await tag.remove();
        return tag;
    }
}

export default new TagService();