const aws = require('aws-sdk');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: 'eu-central-1'
});

exports.sendInviteMail = (to,name,link) => {
    return ses.sendEmail({
        Source: 'LOOM <gameslpf0@gmail.com>', 
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Text: {
                    Data: `Your friend ${name} invited you to a LOOM metting. Click on this link and have a nice chat: ${link}`
                }
            },
            Subject: {
                Data: `LOOM meeting with ${name}`
            }
        }
    }).promise();
};

exports.sendMeInviteMail = (to,name,link) => {
    return ses.sendEmail({
        Source: 'LOOM <gameslpf0@gmail.com>', 
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Text: {
                    Data: `Hello ${name}, you invited some friends to a LOOM metting. Just for your records or if anything goes wrong, here is the link to the chat: ${link}`
                }
            },
            Subject: {
                Data: `LOOM meeting with ${name}`
            }
        }
    }).promise();
};

exports.sendBattleshipMail = (to,name,link) => {
    return ses.sendEmail({
        Source: 'LOOM <gameslpf0@gmail.com>', 
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Text: {
                    Data: `Your friend ${name} invited you to a game of LOOMactica Battleship. Click on this link and have a glorious battle: ${link}`
                }
            },
            Subject: {
                Data: `LOOMactica against ${name}`
            }
        }
    }).promise();
};

exports.sendMeBattleshipMail = (to,name,link) => {
    return ses.sendEmail({
        Source: 'LOOM <gameslpf0@gmail.com>', 
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Text: {
                    Data: `Hello ${name}, you invited a friend to a game of LOOMactica Battleship. Just for your records or if anything goes wrong, here is the link to the game: ${link}`
                }
            },
            Subject: {
                Data: `LOOMactica against ${name}`
            }
        }
    }).promise();
};