const Category = require('../models/Category')
const Payment = require('../models/Payment')
const Property = require('../models/Property')
const Image = require('../models/Image')

const fs = require('fs-extra')
const path = require('path')

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard', { title: "Dashboard" })
    },


    // Category Method
    viewCategory: async (req, res) => {
        try {
            const category = await Category.find()
            const alertStatusMessage = req.flash('alertStatusMessage')
            const alertName = req.flash('alertName')
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { statusMessage: alertStatusMessage, name: alertName, message: alertMessage, status: alertStatus }
            res.render('admin/category/view_category', { category, alert, title: "Category" })
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    },

    addCategory: async (req, res) => {
        try {
            const { name } = req.body
            await Category.create({ name })
            req.flash('alertStatusMessage', 'Success!')
            req.flash('alertName', ` ${name}`)
            req.flash('alertMessage', ' has been added to the Category.')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    },

    editCategory: async (req, res) => {
        try {
            const { id, name } = req.body
            const category = await Category.findOne({ _id: id })
            const oldCategoryName = category.name // retrieve the old name of the category
            category.name = name
            await category.save()
            req.flash('alertStatusMessage', 'Success!')
            req.flash('alertName', ` ${oldCategoryName}`)
            req.flash('alertMessage', ` has been updated to "${name}".`)
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params
            const category = await Category.findOne({ _id: id })
            const categoryName = category.name // retrieve the name of the deleted category
            await category.remove()
            req.flash('alertStatusMessage', 'Success!')
            req.flash('alertName', ` ${categoryName}`)
            req.flash('alertMessage', ' has been deleted from the Category.')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    },
    // End Category Method


    // Property Method
    viewProperty: async (req, res) => {
        try {
            const property = await Property.find()
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' })
            const category = await Category.find()
            const alertStatusMessage = req.flash('alertStatusMessage')
            const alertName = req.flash('alertName')
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { statusMessage: alertStatusMessage, name: alertName, message: alertMessage, status: alertStatus }
            res.render('admin/property/view_property', {
                property,
                category,
                action: 'view',
                alert,
                title: "Property"
            })
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/property')
        }
    },

    addProperty: async (req, res) => {
        try {
            const { categoryId, title, price, city, about } = req.body
            if (req.files.length > 0) {
                const category = await Category.findOne({ _id: categoryId })
                const newProperty = {
                    categoryId: category._id,
                    title,
                    description: about,
                    price,
                    city,
                }
                const property = await Property.create(newProperty)
                category.propertyId.push({ _id: property._id })
                await category.save()
                for (let i = 0; i < req.files.length; i++) {
                    const imageSave = await Image.create({ imageUrl: `images/property/${req.files[i].filename}` })
                    property.imageId.push({ _id: imageSave._id })
                    await property.save()
                }
                req.flash('alertStatusMessage', 'Success!')
                req.flash('alertName', ` ${title}`)
                req.flash('alertMessage', ' has been added to the Property.')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/property')
            }
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/property')
        }
    },

    showImageProperty: async (req, res) => {
        try {
            const { id } = req.params
            const property = await Property.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' })
            const alertStatusMessage = req.flash('alertStatusMessage')
            const alertName = req.flash('alertName')
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { statusMessage: alertStatusMessage, name: alertName, message: alertMessage, status: alertStatus }
            res.render('admin/property/view_property', {
                property,
                alert,
                action: 'show image',
                title: "Image Property"
            })
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/property')
        }
    },

    showEditProperty: async (req, res) => {
        try {
            const { id } = req.params
            const property = await Property.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' })
            const category = await Category.find()
            const alertStatusMessage = req.flash('alertStatusMessage')
            const alertName = req.flash('alertName')
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { statusMessage: alertStatusMessage, name: alertName, message: alertMessage, status: alertStatus }
            res.render('admin/property/view_property', {
                property,
                category,
                alert,
                action: 'edit',
                title: "Edit Property"
            })
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/property')
        }
    },

    editProperty: async (req, res) => {
        try {
            const { id } = req.params
            const { categoryId, title, price, city, about } = req.body
            const property = await Property.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' })

            if (req.files.length > 0) {
                for (let i = 0; i < property.imageId.length; i++) {
                    const imageUpdate = await Image.findOne({ _id: property.imageId[i]._id })
                    await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`))
                    imageUpdate.imageUrl = `images/property/${req.files[i].filename}`
                    await imageUpdate.save()
                }
                property.title = title
                property.price = price
                property.city = city
                property.description = about
                property.categoryId = categoryId
                await property.save()
                req.flash('alertStatusMessage', 'Success! Property ')
                req.flash('alertName', ` ${property.title}`)
                req.flash('alertMessage', ' has been updated.')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/property')
            } else {
                property.title = title
                property.price = price
                property.city = city
                property.description = about
                property.categoryId = categoryId
                await property.save()
                req.flash('alertStatusMessage', 'Success! Property ')
                req.flash('alertName', ` ${property.title}`)
                req.flash('alertMessage', ' has been updated.')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/property')
            }
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/property')
        }
    },

    // End Property Method

    // Payment Method
    viewPayment: async (req, res) => {
        try {
            const payment = await Payment.find()
            const alertStatusMessage = req.flash('alertStatusMessage')
            const alertName = req.flash('alertName')
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { statusMessage: alertStatusMessage, name: alertName, message: alertMessage, status: alertStatus }
            res.render('admin/payment/view_payment', { payment, alert, title: "Payment" })
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/payment')
        }
    },

    addPayment: async (req, res) => {
        try {
            const { bankName, accountNumber, accountName } = req.body
            await Payment.create({ bankName, accountNumber, accountName, imageUrl: `images/payment/${req.file.filename}` })
            req.flash('alertStatusMessage', 'Success!')
            req.flash('alertName', ` ${bankName}`)
            req.flash('alertMessage', ' has been added to the Payment Method.')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/payment')
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/payment')
        }
    },

    editPayment: async (req, res) => {
        try {
            const { id, bankName, accountNumber, accountName } = req.body
            const payment = await Payment.findOne({ _id: id })
            if (req.file == undefined) {
                payment.bankName = bankName
                payment.accountNumber = accountNumber
                payment.accountName = accountName
                await payment.save()
                req.flash('alertStatusMessage', 'Success! Payment method ')
                req.flash('alertName', ` ${payment.bankName}`)
                req.flash('alertMessage', ' has been updated.')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/payment')
            } else {
                await fs.unlink(path.join(`public/${payment.imageUrl}`))
                payment.bankName = bankName
                payment.accountNumber = accountNumber
                payment.accountName = accountName
                payment.imageUrl = `images/payment/${req.file.filename}`
                await payment.save()
                req.flash('alertStatusMessage', 'Success! Payment method ')
                req.flash('alertName', ` ${payment.bankName}`)
                req.flash('alertMessage', ' has been updated.')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/payment')
            }
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/payment')
        }
    },

    deletePayment: async (req, res) => {
        try {
            const { id } = req.params
            const payment = await Payment.findOne({ _id: id })
            const paymentBankName = payment.bankName // retrieve the name of the deleted payment
            await fs.unlink(path.join(`public/${payment.imageUrl}`))
            await payment.remove()
            req.flash('alertStatusMessage', 'Success!')
            req.flash('alertName', ` ${paymentBankName}`)
            req.flash('alertMessage', ' has been deleted from the Payment Method.')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/payment')
        } catch (error) {
            req.flash('alertStatusMessage', 'Failed!')
            req.flash('alertMessage', ` ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/payment')
        }
    },
    // End Payment Method


    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking', { title: "Booking" })
    }
}