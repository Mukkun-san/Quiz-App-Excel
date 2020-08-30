const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email, result) {

    console.log(result);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "dalyy.trabelsi@gmail.com",
            pass: "s%3A%2F%2Fme",
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Quiz Result" <dalyy.trabelsi@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Quiz Result", // Subject line
        html: `

        <html lang="en">

<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>

<body>
    <div class="container">
        <h2>Hello {name},</h2>
        <br>
        <h3>This is your result from your quiz on $date} </h3>
        <h4>Correct answers: $A} </h4>
        <h4>Wrong answers: $WA} </h4>
        <br>
        <table class="table">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Question</th>
                    <th scope="col">Your Answer</th>
                    <th scope="col">Correct Answer</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Question}</td>
                    <td>$A}</td>
                    <td>WA}</td>
                </tr>
            </tbody>
        </table>
    </div>

</body>

</html>

        `, // html body
    });

    console.log("Message sent: %s", info);

}

module.exports = sendMail;