const messageModel = require('../models/messages')
const commonHelper = require('../helper/common')

const getMessage = async (req, res, next) => {
    const receiverId = req.params.receiverId
    const senderId = req.decoded.iduser
    const {rows} = await messageModel.getMessage(senderId, receiverId)
    commonHelper.response(res, rows, 200)
}

module.exports = {
    getMessage
}