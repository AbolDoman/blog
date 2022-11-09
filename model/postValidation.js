const yup = require('yup');

const postValidationSchema = yup.object().shape({
    title: yup.string("عنوان پیام باید بصورت استرینگ باشد").required("وارد کردن عنوان پیام الزامی میباشد").min(4, "عنوان پیام حداقل باید دارای 4 کاراکتر باشد").max(255, "عنوان پیام حداکثر باید دارای 255 کاراکتر باشد"),
    text: yup.string("متن اصلی پست باید بصورت استرینگ باشد").required("وارد کردن متن اصلی پست الزامی میباشد"),
    status: yup.mixed().oneOf(["public", "private"], "باید یکی از حالت های عمومی  یا خصوصی را انتخاب کنید"),
    thumbnail: yup.object().shape({
        name: yup.string("نام عکس باید بصورت استرینگ باشد").required("وارد کردن عکس بندانگشتی الزامیست"),
        size: yup.number("اندازه عکس باید بصورت عدی باشد").max(3000000, "سایز عکس نباید بیشتر از سه مگابایت باشد"),
        mimetype: yup.mixed().oneOf(["image/jpeg", "image/png"], "فرمت عکس ارسالی باید jpeg یا png باشد")
    })
})

module.exports = {
    postValidationSchema
}