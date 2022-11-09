const yup = require('yup');

const contactValidationSchema = yup.object().shape({
    name: yup.string("نام کامل باید بصورت استرینگ باشد").required("وارد کردن نام کامل الزامی میباشد"),
    email: yup.string("ایمیل پست باید بصورت استرینگ باشد").required("وارد کردن ایمیل پست الزامی میباشد").email("فرمت ایمیل وارد شده صحیح نمیباشد"),
    message: yup.string("پیام باید بصورت استرینگ باشد").required("وارد کردن پیام الزامی میباشد")
})

module.exports = {
    contactValidationSchema
}