const Category = require("../model/Category")
const GroupCategory = require("../model/GroupCategory")

exports.createGroupCategory = async (req, res) => {
    const { name, image, is_active } = req.body
    if (!name) return res.status(404).json({
        status: 404,
        message: "Please provide your group category name"
    })
    try {
        const groupCategory = new GroupCategory({
            name: name,
            image: image,
            is_active: is_active
        })
        const resp = await groupCategory.save()
        if (resp) {
            return res.status(201).json({
                status: 201,
                message: "Group category created."
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Group category not created! Something went wrong!"
            })
        }
    } catch (error) {
        if (error.keyPattern.name === 1) {
            return res.status(400).json({
                status: 400,
                message: "This group category already exist."
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Group category not created! Something went wrong!"
            })
        }
    }
}
exports.getGroupCategory = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const search = req.query.search || ''
    const sort = req.query.sort || '-createdAt'
    const isActive = req.query.is_active;

    try {
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { image: { $regex: search, $options: 'i' } }
            ];
        }

        if (isActive !== undefined) {
            query.is_active = isActive === 'true';
        }
        const total = await GroupCategory.countDocuments(query)
        const groupCategories = await GroupCategory.find(query).sort(sort).skip(skip).limit(limit)

        const nextPage = page * limit < total ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
        res.status(200).json({
            status: 200,
            meta_data: {
                total,
                page_size: limit,
                next: nextPage,
                previous: prevPage
            },
            data: groupCategories
        })

    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error,
        })
    }
}
exports.updateGroupCategory = async (req, res) => {
    const { id } = req.params
    const { name, image } = req.body

    try {
        const groupCategory = await GroupCategory.findById(id)
        if (!groupCategory) {
            return res.status(404).json({ message: 'Group category not found' });
        }
        groupCategory.name = name || groupCategory.name
        groupCategory.image = image || groupCategory.image

        await groupCategory.save()
        return res.status(200).json({
            status: 200,
            message: "Group category updated."
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Something went wrong! Group Category not updated.",
            errors: error
        })
    }
}


exports.createCategory = async (req, res) => {
    const { name, image, groupCategory } = req.body

    if (!name ) return res.status(404).json({
        status: 404,
        message: "Please provide category name"
    })
    if (!groupCategory) return res.status(404).json({
        status: 404,
        message: "Please provide Group category ID"
    })
    try {
        const category = new Category({
            name: name,
            image: image,
            groupCategory: groupCategory
        })
        const resp = await category.save()
        if (resp) {
            return res.status(201).json({
                status: 201,
                message: "Category created successfully done."
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Category not created! Something went wrong!"
            })
        }
    } catch (error) {
        if (error.keyPattern && error.keyPattern.name === 1) {
            return res.status(400).json({
                status: 400,
                message: "Category already created"
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Category not created! Something went wrong!"
            })
        }
    }
}
exports.getCategory = async (req, res) => {
    // console.log(req.query)
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const search = req.query.search || ''
    const sort = req.query.sort || '-createdAt'

    try {
        const query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { image: { $regex: search, $options: 'i' } }
            ]
        } : {}
        const total = await Category.countDocuments(query)
        const categories = await Category.find(query).sort(sort).skip(skip).limit(limit)

        const nextPage = page * limit < total ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
        res.status(200).json({
            status: 200,
            meta_data: {
                total,
                page_size: limit,
                next: nextPage,
                previous: prevPage
            },
            data: categories
        })

    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Something went wrong!",
            errors: error
        })
    }
}
exports.updateCategory = async (req, res) => {
    const { id } = req.params
    const { name, image, groupCategory } = req.body

    try {
        const category = await Category.findById(id)
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.name = name || category.name
        category.image = image || category.image
        category.groupCategory = groupCategory || category.groupCategory
        await category.save()
        return res.status(200).json({
            status: 200,
            message: "Category updated."
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Something went wrong! Category not updated.",
            errors: error
        })
    }
}