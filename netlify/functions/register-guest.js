exports.handler = async (event) => {
    const { firstName, lastName } = JSON.parse(event.body);
    
    const response = await fetch(`https://api.github.com/repos/Waldemar-Foma/happy/issues`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: `Гость: ${firstName} ${lastName}`,
            body: `Дата: ${new Date().toISOString()}`,
            labels: ['guest']
        })
    });
    
    return {
        statusCode: response.status,
        body: JSON.stringify(await response.json())
    };
};
