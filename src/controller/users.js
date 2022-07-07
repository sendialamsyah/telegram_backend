const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const { findByEmail, createUser, updateUser, getUsers:modelGetUsers, detailUser } = require('../models/users')
const commonHelper = require('../helper/common')
const authHelper = require('../helper/auth')
const cloudinary = require('../helper/cloudinary')

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const { rowCount } = await findByEmail(email)

    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(password, salt)

    if (rowCount) {
      return next(createError(403, 'user sudah terdaftar'))
    }
    const data = {
      iduser: uuidv4(),
      name,
      email,
      password: passwordHash,
    }
    await createUser(data)
    commonHelper.response(res, null, 201, 'User berhasil register')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const {
      rows: [user]
    } = await findByEmail(email)
    console.log(user)

    if (!user) {
      return commonHelper.response(
        res,
        null,
        403,
        'email atau password anda salah'
      )
    }

    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return commonHelper.response(
        res,
        null,
        403,
        'email atau password anda salah'
      )
    }
    delete user.password

    const payload = {
      iduser: user.iduser,
      name: user.name,
      email: user.email,
    }

    user.token = authHelper.generateToken(payload)
    user.refreshToken = authHelper.generateRefreshToken(payload)
    return commonHelper.response(res, user, 201, 'anda berhasil login')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}

const refreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken
  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT2)
  const payload = {
    email: decoded.email,
    role: decoded.role
  }
  const result = {
    token: authHelper.generateToken(payload),
    refreshToken: authHelper.generateRefreshToken(payload)
  }
  commonHelper.response(res, result, 200)
}

const updateProfile = async (req, res, next) => {
  try {
    const iduser = req.params.iduser
    const { name, email, phonenumber } = req.body
    const images = req.file.path
    const ress = await cloudinary.uploader.upload(images)
    const data = {
      iduser,
      name,
      email,
      phonenumber,
      image: ress.url,
    }
    await updateUser(data)
    commonHelper.response(res, data, 201, 'update user success')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}
const getUsers = async(req, res, next)=>{
  const iduser = req.decoded.iduser
  const {rows} = await modelGetUsers(iduser)
  commonHelper.response(res, rows, 200)
}

const detailUserById = async (req, res, next) => {
  try {
    const iduser = req.params.iduser
    const { rows: [user] } = await detailUser(iduser)

    commonHelper.response(res, user, 200, 'Get data from database')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}
module.exports = {
  register,
  login,
  refreshToken,
  updateProfile,
  getUsers,
  detailUserById
}