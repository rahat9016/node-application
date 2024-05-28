const GroupCategory = require("../model/GroupCategory")

exports.createGroupCategory = async (req, res) => {
    const {name, image} = req.body
    if(!name) return res.status(404).json({
        status: 404,
        message: "Please provide your group category name"
    })
    try {
        const groupCategory = new GroupCategory({
            name: name,
            image: image
        })
        const resp = await groupCategory.save()
        if(resp){
            return res.status(201).json({
                status: 201,
                message: "Group category created successfully done."
            })
        }else{
            return res.status(400).json({
                status: 400,
                message: "Group category not created! Something went wrong!"
            })
        }
    } catch (error) {
        if(error.keyPattern.name === 1){
            return res.status(400).json({
                status: 400,
                message: "Group category already created"
            })
        }else{
            return res.status(400).json({
                status: 400,
                message: "Group category not created! Something went wrong!"
            })
        }
    }
}
exports.getGroupCategory = async (req, res) => {
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
        console.log(error)
    }
}
exports.updateGroupCategory = async (req,res) => {
    const {id} = req.params
    console.log(id)
    res.send(id)
}