const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmailCreateOrder = (email, orderSelected, fullName, shippingPrice, itemsPrice, totalPrice) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Đặt `false` cho cổng 587 (STARTTLS)
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false, // Cho phép kết nối không tin cậy (optional, chỉ dùng để thử nghiệm)
        }
    });

    // Async function to send the email
    async function main() {
        try {
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: process.env.EMAIL_ACCOUNT, // sender address
                to: process.env.EMAIL_ACCOUNT, // list of receivers
                subject: `Bạn đã đặt hàng thành công tại shop TheClassic`, // Subject line
                text: "Bạn đã đặt hàng thành công!", // plain text body
                html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <h2 style="color: #333;">Cảm ơn bạn đã đặt hàng tại TheClassic!</h2>
        <p style="font-size: 16px;">Xin chào <b>${fullName}</b>,</p>
        <p style="font-size: 16px;">
            Chúng tôi rất vui thông báo rằng đơn hàng của bạn đã được đặt thành công.
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr style="background-color: #f8f8f8;">
                    <th style="padding: 10px; border: 1px solid #ddd;">Sản phẩm</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Số lượng</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Giá sản phẩm</th>
                </tr>
            </thead>
            <tbody>
                ${orderSelected.map(item => `
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.amount}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.price.toLocaleString()} VND</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p style="font-size: 16px; color: #ccc;">Tạm tính: <b>${itemsPrice.toLocaleString()} VND</b></p>
        <p style="font-size: 16px; color: #ccc;">Giá vận chuyển: <b>${shippingPrice.toLocaleString()} VND</b></p>
        <p style="font-size: 16px; color: #FF5722;">Tổng tiền: <b>${totalPrice.toLocaleString()} VND</b></p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://theclassic.com" style="display: inline-block; background-color: rgba(244, 186, 186, 1); color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Xem chi tiết đơn hàng
            </a>
        </div>
        
        <p style="font-size: 14px; color: #777; margin-top: 20px;">Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email: ${process.env.EMAIL_ACCOUNT} hoặc số điện thoại: 0362464361 .</p>
        <p style="font-size: 14px; color: #777;">Trân trọng, <br /> Đội ngũ TheClassic</p>
    </div>
    `,
            });



            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (error) {
            console.error("Error sending email: ", error);
        }
    }

    // Call the async function to send the email
    main();
};

module.exports = {
    sendEmailCreateOrder,
}
