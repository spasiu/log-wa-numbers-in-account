const Smooch = require('smooch-core');

const smooch = new Smooch({
    scope: 'account',
    keyId: 'YOUR_KEY_HERE',
    secret: 'YOUR_SECRET_HERE'
});

logAppNumberPairs()
    .then(() => {
        console.warn('DONE see output.txt');
        process.exit();
    })
    .catch(error => {
        console.error(`Unhandled exception: ${error.message}\n`, error);
    });

async function logAppNumberPairs(offset=0) {
    const data = await smooch.apps.list(100, offset);
    const appIds = data.apps.map(app => app._id);
    for (const appId of appIds) {
        smooch.integrations.list(appId)
            .then(data => {
                for (const integration of data.integrations) {
                    if (integration.type == 'whatsapp' && integration.phoneNumber) {
                        console.log(`${appId}\t${integration.phoneNumber}`);
                    }
                }
            })
            .catch(error => console.error(`${appId}\t${error.message}`));
    }

    if (appIds.length == 100) {
        return logAppNumberPairs(offset + 100);
    }
}
